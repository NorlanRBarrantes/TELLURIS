#!/usr/bin/env python3
"""EXP-003B: test NASA MOD13Q1 detailed quality and seasonal coverage.

Read-only analysis of authentic raw JSON from EXP-003 acquisition run 43738048688.
No automatic orbital correction, statistical significance or causal claims.
"""
import argparse
from collections import Counter, defaultdict
import json
from pathlib import Path
from statistics import median

QA="250m_16_days_pixel_reliability"
DETAILED="250m_16_days_VI_Quality"
SOLAR="250m_16_days_sun_zenith_angle"
MEASURES={"NDVI":"250m_16_days_NDVI","EVI":"250m_16_days_EVI"}
BANDS={QA,DETAILED,SOLAR,*MEASURES.values()}


def integral(value):
    if isinstance(value,bool) or not isinstance(value,(int,float)) or not float(value).is_integer():
        raise ValueError("Invalid QA integer")
    return int(value)


def flags(value):
    v=integral(value)
    if not 0<=v<=65534:
        raise ValueError("QA fill or invalid bitfield")
    return {"modland":v&3,"usefulness":(v>>2)&15,"aerosol":(v>>6)&3,
            "adjacent_cloud":bool(v&(1<<8)),"brdf_correction":bool(v&(1<<9)),
            "mixed_cloud":bool(v&(1<<10)),"land_water":(v>>11)&7,
            "snow_ice":bool(v&(1<<14)),"shadow":bool(v&(1<<15))}


def reject_reasons(reliability, detailed):
    """Project Uriel experimental strict policy (not NASA-mandated)."""
    rank=integral(reliability)
    if rank not in (-1,0,1,2,3):raise ValueError("Bad summary QA rank")
    reasons=[]
    if rank not in (0,1):reasons.append("unreliable_summary")
    try:
        q=flags(detailed)
    except ValueError:
        return reasons+["invalid_detail"]
    if q["modland"] not in (0,1):reasons.append("modland_cloud_or_missing")
    if q["aerosol"]==3:reasons.append("high_aerosol")
    for name in ("adjacent_cloud","mixed_cloud","snow_ice","shadow"):
        if q[name]:reasons.append(name)
    if q["land_water"]!=1:reasons.append("not_unambiguously_land")
    # Do not automatically use the problematic VI Usefulness field as a cutoff.
    return reasons


def scaled(raw):
    if isinstance(raw,bool) or not isinstance(raw,(int,float)) or not -2000<=raw<=10000:
        return None
    return round(raw*.0001,6)


def solar_angle(raw):
    if isinstance(raw,bool) or not isinstance(raw,(int,float)) or not -9000<=raw<=9000:
        return None
    return round(raw*.01,4)


def load_originals(folder):
    records=defaultdict(dict)
    paths=sorted(folder.glob("batch_*.json"))
    if not paths:raise ValueError("No NASA original batches: "+str(folder))
    for path in paths:
        obj=json.loads(path.read_text(encoding="utf-8"))
        if obj.get("nrows")!=1 or obj.get("ncols")!=1:
            raise ValueError("Expected 1x1 MODIS cell")
        for part in obj["subset"]:
            band=part.get("band")
            if band not in BANDS:continue
            date=part["modis_date"]
            data=part["data"]
            if not isinstance(data,list) or len(data)!=1 or band in records[date]:
                raise ValueError("Malformed or duplicate original observation")
            records[date][band]=data[0]
    for date,parts in records.items():
        if set(parts)!=BANDS:raise ValueError("Missing NASA QA/solar bands: "+date)
    return dict(records)


def observations(original,record):
    all_obs=[]
    for baseline in original["observations"]:
        date=baseline["modis_date"]
        if date not in record:raise ValueError("Missing raw date "+date)
        v=record[date]
        reasons=reject_reasons(v[QA],v[DETAILED])
        rank=integral(v[QA])
        row={"year":int(date[1:5]),"quarter":(int(baseline["calendar_date"][5:7])-1)//3,
             "cycle":(int(date[5:])-1)//16,"date":date,"rank":rank,
             "detailed":integral(v[DETAILED]),"sza_degrees":solar_angle(v[SOLAR]),
             "rejections":reasons}
        for measure,band in MEASURES.items():
            value=scaled(v[band])
            row[measure+"_simple"]=value if rank in (0,1) else None
            row[measure+"_strict"]=value if not reasons else None
            if baseline[measure]!=row[measure+"_simple"]:
                raise ValueError("Baseline parsed NASA data inconsistent "+date)
        all_obs.append(row)
    if len(all_obs)!=len(record):raise ValueError("Unaccounted raw observations")
    return sorted(all_obs,key=lambda x:x["date"])


def summarize_coverage(rows,measure,count,per_quarter=0,quarters=None):
    valid=[r for r in rows if r[measure] is not None]
    q=[sum(1 for r in valid if r["quarter"]==i) for i in range(4)]
    eligible=(len(valid)>=count and
              (all(n>=per_quarter for n in q) if quarters is None
               else sum(n>0 for n in q)>=quarters))
    return {"eligible":eligible,"valid":len(valid),"by_quarter":q,
            "median":round(median(r[measure] for r in valid),6) if eligible else None}


def seasonal_anomaly(rows,measure,reference_years=5):
    """Descriptive cycle anomalies; minimum five distinct years per cycle."""
    samples=defaultdict(list)
    for r in rows:
        if r[measure] is not None:samples[r["cycle"]].append((r["year"],r[measure]))
    reference={c:median(v for y,v in vals) for c,vals in samples.items()
               if len({y for y,v in vals})>=reference_years}
    years=[]
    for y in sorted({r["year"] for r in rows}):
        a=[(r["quarter"],r[measure]-reference[r["cycle"]]) for r in rows
           if r["year"]==y and r[measure] is not None and r["cycle"] in reference]
        q={item[0] for item in a}
        eligible=len(a)>=8 and len(q)>=3
        years.append({"year":y,"valid":len(a),"quarters":len(q),
                      "anomaly_mean":round(sum(v for _,v in a)/len(a),6) if eligible else None})
    return {"reference_cycles":len(reference),
            "min_reference_distinct_years":reference_years,"years":years}


def audit(root):
    base=json.loads((root/"exp003_result.json").read_text(encoding="utf-8"))
    report={"schema":"telluris.exp003.qa-sensitivity.v1",
            "method":"NASA MOD13Q1 detail QA; Project Uriel proposed strict flag policy",
            "source_run":"https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738048688",
            "caution":"No climate significance, orbit correction, or causal attribution established",
            "locations":{}}
    for loc,item in base["locations"].items():
        rows=observations(item,load_originals(root/loc))
        byyear=defaultdict(list)
        for r in rows:byyear[r["year"]].append(r)
        total=Counter(reason for r in rows for reason in r["rejections"])
        land_classes=Counter(str((r["detailed"]>>11)&7) for r in rows)
        results={}
        for measure in MEASURES:
            year_comparisons=[]
            for year,rr in sorted(byyear.items()):
                strict_angles=[r["sza_degrees"] for r in rr if r[measure+"_strict"] is not None
                               and r["sza_degrees"] is not None]
                year_comparisons.append({
                    "year":year,
                    "summary_12_2":summarize_coverage(rr,measure+"_simple",12,per_quarter=2),
                    "strict_12_2":summarize_coverage(rr,measure+"_strict",12,per_quarter=2),
                    "strict_8_3":summarize_coverage(rr,measure+"_strict",8,quarters=3),
                    "strict_sza_median_degrees":round(median(strict_angles),4) if strict_angles else None})
            results[measure]={"comparison":year_comparisons,
                              "seasonally_centered":seasonal_anomaly(rows,measure+"_strict")}
        report["locations"][loc]={
            "records":len(rows),"summary_qa_accepted":sum(r["rank"] in (0,1) for r in rows),
            "strict_qa_accepted":sum(not r["rejections"] for r in rows),
            "rejection_reason_counts":dict(total),
            "land_water_qa_class_counts":dict(land_classes),"indicators":results}
    return report


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--source-dir",type=Path,default=Path("data/raw/exp003"))
    p.add_argument("--output",type=Path,default=Path("data/derived/exp003_modis_method_audit.json"))
    opts=p.parse_args()
    result=audit(opts.source_dir)
    opts.output.parent.mkdir(parents=True,exist_ok=True)
    opts.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    for site,entry in result["locations"].items():
        print("QUALITY",site,"records",entry["records"],"summary",entry["summary_qa_accepted"],
              "strict",entry["strict_qa_accepted"],"land_water_classes",entry["land_water_qa_class_counts"],
              "reasons",entry["rejection_reason_counts"])
        for metric,details in entry["indicators"].items():
            years=details["comparison"]
            print("YEARS",site,metric,
                  "baseline",sum(x["summary_12_2"]["eligible"] for x in years),
                  "strict",sum(x["strict_12_2"]["eligible"] for x in years),
                  "relaxed",sum(x["strict_8_3"]["eligible"] for x in years),
                  "climatology_reference_cycles",details["seasonally_centered"]["reference_cycles"])
    print("INFERENCE_NOT_EVALUATED")


if __name__=="__main__":
    main()
