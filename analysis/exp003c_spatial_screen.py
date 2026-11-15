#!/usr/bin/env python3
"""EXP-003C: blind MOD13Q1 spatial site screening (no trend or p calculation).

Coordinates were proposed in a team-forwarded Gemini audit. Place labels,
landcover, exact MERRA-2 cell equivalence, and ecological status are UNVERIFIED
until checked against independent metadata. Save original NASA responses.
"""
import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
from pathlib import Path
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from audit_mod13q1_methodology import reject_reasons, scaled

BASE="https://modis.ornl.gov/rst/api/v1"
DATE="A2023001"
SITES={
    "limon_original":(9.9900,-83.0300),
    "rio_banano_candidate":(9.8850,-83.1350),
    "beverley_candidate":(9.9650,-83.1150),
    "hitoy_cerere_candidate":(9.6710,-83.0240),
    "liberia_reference":(10.6300,-85.4400),
}
BANDS=("250m_16_days_pixel_reliability","250m_16_days_VI_Quality",
       "250m_16_days_NDVI","250m_16_days_EVI")
GRID_CENTER=(10.,-83.125)
GRID_HALF=(.25,.3125)


def nominal_grid(lat,lon):
    """Only tests a proposed nominal cell BOX, not NASA POWER response identity."""
    clat,clon=GRID_CENTER
    return (clat-GRID_HALF[0] <= lat < clat+GRID_HALF[0] and
            clon-GRID_HALF[1] <= lon < clon+GRID_HALF[1])


def request(path,params=None,tries=2):
    url=BASE+path+("?" + urlencode(params) if params else "")
    last=None
    for i in range(tries):
        try:
            with urlopen(Request(url,headers={"Accept":"application/json",
                "User-Agent":"TELLURIS-EXP003C-spatial-screen/0.1"}),timeout=90) as response:
                if response.status!=200:raise ValueError("Non-200 source")
                original=response.read()
            obj=json.loads(original)
            if not isinstance(obj,dict):raise ValueError("Unexpected NASA response")
            return url,original,obj
        except Exception as exc:
            last=exc
            time.sleep(2*(i+1))
    raise RuntimeError("NASA retrieval failed: "+str(last))


def center_and_neighbors(nrows,ncols):
    if (not isinstance(nrows,int) or not isinstance(ncols,int) or
            nrows<3 or ncols<3 or nrows%2!=1 or ncols%2!=1):
        raise ValueError("Need odd NASA raster at least 3 by 3")
    cy,cx=nrows//2,ncols//2
    ids=[(cy+dy)*ncols+(cx+dx) for dy in (-1,0,1) for dx in (-1,0,1)]
    return cy*ncols+cx,ids


def extract_spatial(payload,modis_date):
    nrows,ncols=payload.get("nrows"),payload.get("ncols")
    center,neighbors=center_and_neighbors(nrows,ncols)
    entries=payload.get("subset")
    if not isinstance(entries,list):raise ValueError("Missing NASA subset array")
    bands={}
    for item in entries:
        if item.get("modis_date")!=modis_date:continue
        band=item.get("band")
        if band not in BANDS:continue
        values=item.get("data")
        if (band in bands or not isinstance(values,list) or len(values)!=nrows*ncols):
            raise ValueError("Missing or duplicate pixel source band")
        bands[band]=values
    if set(bands)!=set(BANDS):
        raise ValueError("Required NASA original science or QA bands absent")
    def cell(i):
        qa=bands["250m_16_days_VI_Quality"][i]
        rank=bands["250m_16_days_pixel_reliability"][i]
        reasons=reject_reasons(rank,qa)
        if isinstance(qa,bool) or not isinstance(qa,(int,float)) or not float(qa).is_integer():
            raise ValueError("Malformed NASA detailed QA")
        land=(int(qa)>>11)&7 if 0<=int(qa)<=65534 else None
        vals={name:scaled(bands["250m_16_days_"+name][i]) for name in ("NDVI","EVI")}
        usable=not reasons and all(v is not None for v in vals.values())
        return {"land_water_class":land,"reliability":rank,"qa_reasons":reasons,
                "both_indices_usable":usable}
    cells=[cell(i) for i in neighbors]
    mid=cell(center)
    counts=dict(Counter(str(x["land_water_class"]) for x in cells))
    eligible=sum(x["both_indices_usable"] for x in cells)
    land=sum(x["land_water_class"]==1 for x in cells)
    # These are single-date diagnostics only. Do NOT approve a site for 26-year trends.
    return {"source_date":modis_date,"returned_shape":[nrows,ncols],
            "central_3x3_indices":neighbors,"central_pixel":mid,
            "center_3x3_land_water_counts":counts,
            "center_3x3_land_cells":land,
            "center_3x3_strict_qa_and_valid_indices":eligible,
            "center_3x3_pixels":cells,
            "single_date_spatial_median_eligible_proposal":land>=7 and eligible>=6,
            "interpretation":"Single date ONLY. Does not establish historic QA, stable natural land cover, or a climate trend."}


def inspect(site,coordinates,dest,modis_date=DATE):
    lat,lon=coordinates
    params={"latitude":lat,"longitude":lon,"startDate":modis_date,
            "endDate":modis_date,"kmAboveBelow":1,"kmLeftRight":1}
    url,raw,payload=request("/MOD13Q1/subset",params)
    out=extract_spatial(payload,modis_date)
    folder=dest/"original_nasa"
    folder.mkdir(parents=True,exist_ok=True)
    (folder/(site+".json")).write_bytes(raw)
    out.update({"site_id":site,"coordinates":[lat,lon],
                "declared_nominal_grid_box_match":nominal_grid(lat,lon),
                "nasa_source_url":url,"nasa_response_sha256":hashlib.sha256(raw).hexdigest(),
                "geographic_and_landcover_identity":"NOT VERIFIED BY INDEPENDENT GEOSPATIAL DATA"})
    print("SITE",site,"land",out["center_3x3_land_cells"],
          "strict",out["center_3x3_strict_qa_and_valid_indices"],
          "central_class",out["central_pixel"]["land_water_class"],flush=True)
    return out


def landcover_product_probe():
    """A failed MCD12Q1 API call is reported; never invent an IGBP classification."""
    try:
        url,raw,result=request("/MCD12Q1/bands",tries=1)
        names=[x.get("band") for x in result.get("bands",[]) if isinstance(x,dict)]
        return {"status":"metadata_accessible","url":url,"bands":names,
                "LC_Type1_available":"LC_Type1" in names,
                "note":"Band listing is not a verified per-coordinate IGBP classification."}
    except Exception as exc:
        return {"status":"not_verified","error":str(exc)[:320],
                "note":"MCD12Q1 still requires a separate supported extraction route. Do not claim forest type."}


def run(dest,modis_date=DATE,workers=2):
    dest.mkdir(parents=True,exist_ok=True)
    result={"schema":"telluris.exp003c.spatial_prescreen.v1","modis_date":modis_date,
            "source":"NASA ORNL DAAC TESViS MOD13Q1",
            "site_selection_basis":"Team/Gemini predeclared coordinates; no slope, p-value, EVI, NDVI used to rank candidates",
            "nominal_grid_note":"Box check NOT sufficient proof of identical POWER output or climatic forcing",
            "source_sample":"Single MODIS 16-day composite; 9x9 returned for 1km radius if API behavior matches documentation; 3x3 central subset",
            "landcover_api_check":landcover_product_probe(),
            "sites":{}}
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures={pool.submit(inspect,name,location,dest,modis_date):name
                 for name,location in SITES.items()}
        for future in as_completed(futures):
            name=futures[future]
            try:result["sites"][name]=future.result()
            except Exception as exc:
                result["sites"][name]={"status":"source_request_failed","error":str(exc)[:400]}
                print("FAILED",name,str(exc)[:200],flush=True)
    result["sites"]={name:result["sites"][name] for name in SITES}
    (dest/"site_prescreen.json").write_text(
        json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    if any("source_request_failed" in val.get("status","") for val in result["sites"].values()):
        raise RuntimeError("Some NASA source calls failed. Results retained for inspection.")
    print("PRESCREEN_COMPLETE_ONLY_NO_TREND",flush=True)


if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--out",type=Path,default=Path("data/raw/exp003c"))
    p.add_argument("--modis-date",default=DATE)
    p.add_argument("--workers",type=int,default=2)
    args=p.parse_args()
    if not args.modis_date.startswith("A2023") or len(args.modis_date)!=8:
        p.error("Use a predeclared 2023 composite date for this pilot.")
    run(args.out,args.modis_date,args.workers)
