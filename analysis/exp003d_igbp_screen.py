#!/usr/bin/env python3
"""EXP-003D: independent NASA MCD12Q1 IGBP 500 m land-cover site screening.

Predeclared coordinates only. One annual slice, not evidence of stable land use.
No satellite vegetation trend, slope, significance or causal inference.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import hashlib
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from exp003c_spatial_screen import SITES

ROOT="https://modis.ornl.gov/rst/api/v1/MCD12Q1"
YEAR="A2023001"
IGBP={
 1:"Evergreen needleleaf forest",2:"Evergreen broadleaf forest",
 3:"Deciduous needleleaf forest",4:"Deciduous broadleaf forest",5:"Mixed forests",
 6:"Closed shrublands",7:"Open shrublands",8:"Woody savannas",
 9:"Savannas",10:"Grasslands",11:"Permanent wetlands",
 12:"Croplands",13:"Urban/built-up",14:"Cropland/natural vegetation mosaic",
 15:"Permanent snow and ice",16:"Barren",17:"Water bodies",
}
CATEGORY={x:"natural_vegetation_candidate" for x in range(1,11)}
CATEGORY.update({11:"wetland",12:"cultivated",13:"urban",14:"mixed_cultivation",
                 15:"snow_ice",16:"bare",17:"water"})


def request(url,timeout=90):
    req=Request(url,headers={"Accept":"application/json",
                            "User-Agent":"TELLURIS-EXP003D-landcover-screen/0.1"})
    with urlopen(req,timeout=timeout) as response:
        if response.status != 200:raise ValueError("Source returned unexpected HTTP status")
        raw=response.read()
    return raw,json.loads(raw)


def parse_class(data,date=YEAR):
    if data.get("nrows")!=1 or data.get("ncols")!=1:
        raise ValueError("Expected one 500m IGBP classification cell")
    matching=[item for item in data.get("subset",[])
              if item.get("band")=="LC_Type1" and item.get("modis_date")==date]
    if len(matching)!=1 or not isinstance(matching[0].get("data"),list) or len(matching[0]["data"])!=1:
        raise ValueError("MCD12Q1 LC_Type1 band/date missing or ambiguous")
    value=matching[0]["data"][0]
    if isinstance(value,bool) or not isinstance(value,(int,float)) or int(value)!=value:
        raise ValueError("Malformed IGBP class")
    val=int(value)
    return {"code":val,"label":IGBP.get(val,"No valid IGBP class"),
            "cover_kind":CATEGORY.get(val,"unknown_or_fill"),
            "is_natural_vegetation_candidate":val in range(1,11),
            "source_version":matching[0].get("version"),
            "source_filename":matching[0].get("filename"),
            "native_cellsize_m":data.get("cellsize")}


def fetch_site(name,point,outdir):
    lat,lon=point
    params={"latitude":lat,"longitude":lon,"band":"LC_Type1","startDate":YEAR,
            "endDate":YEAR,"kmAboveBelow":0,"kmLeftRight":0}
    url=ROOT+"/subset?"+urlencode(params)
    raw,response=request(url)
    result=parse_class(response)
    archive=outdir/"original_nasa"
    archive.mkdir(exist_ok=True,parents=True)
    (archive/(name+".json")).write_bytes(raw)
    result.update({"site":name,"coordinates":[lat,lon],
                   "url":url,"sha256":hashlib.sha256(raw).hexdigest(),
                   "limitations":"One 500m cell and ONE annual label only. Not a land-cover history or proof of reserve boundaries."})
    print("IGBP",name,result["code"],result["label"],
          "category",result["cover_kind"],flush=True)
    return result


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--out",type=Path,default=Path("data/raw/exp003d"))
    opts=p.parse_args()
    opts.out.mkdir(parents=True,exist_ok=True)
    output={"schema":"telluris.exp003d.igbp-one-year.v1",
            "product":"NASA MODIS MCD12Q1 annual IGBP 500m LC_Type1",
            "year":2023,"sites":{},
            "caution":"Not geospatial proof of a protected reserve, mature forest or unchanged canopy. No time-series or statistical trend computed."}
    with ThreadPoolExecutor(max_workers=2) as ex:
        futures={ex.submit(fetch_site,name,point,opts.out):name for name,point in SITES.items()}
        for f in as_completed(futures):
            name=futures[f]
            try:output["sites"][name]=f.result()
            except Exception as exc:
                output["sites"][name]={"status":"source_request_failed","error":str(exc)[:350]}
                print("FAILED_IGBP",name,str(exc)[:250],flush=True)
    (opts.out/"igbp_prescreen.json").write_text(json.dumps(output,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    if any("status" in x for x in output["sites"].values()):
        raise RuntimeError("At least one NASA MCD12Q1 source request failed; see retained source responses.")
    print("IGBP_ONE_YEAR_SCREEN_SUCCESS_NO_TRENDS",flush=True)


if __name__=="__main__":
    main()
