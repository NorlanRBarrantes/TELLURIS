#!/usr/bin/env python3
"""EXP-006: derive a point-time-series from authentic, locally downloaded
NASA GPM_3IMERGM_07 monthly HDF5 granules. Never generates artificial values.
Requires pip install h5py numpy. Download via NASA Earthdata authorization.
"""
import argparse
import hashlib
import json
import math
import re
from pathlib import Path

PATTERN=re.compile(r"^3B-MO\.MS\.MRG\.3IMERG\.(20\d{2})(0[1-9]|1[0-2])01-.*\.(V07[A-Z]?)\.(?:HDF5|H5|nc4)$",re.I)

def normalized_unit(value):
    if isinstance(value,bytes):value=value.decode("utf-8","replace")
    return str(value).strip().lower().replace(" ","")

def source_cell(path,lat,lon):
    import h5py
    import numpy as np
    match=PATTERN.match(path.name)
    if not match:raise ValueError("Not an original NASA IMERG Final monthly V07 filename: "+path.name)
    year,month,version=match.groups()
    with h5py.File(path,"r") as file:
        grid=file["Grid"] if "Grid" in file else file
        required=["lat","lon","precipitation"]
        if any(key not in grid for key in required):
            raise ValueError("Expected NASA HDF5 Grid/lat, Grid/lon and Grid/precipitation")
        lats=np.asarray(grid["lat"][:]).squeeze()
        lons=np.asarray(grid["lon"][:]).squeeze()
        if lats.ndim!=1 or lons.ndim!=1:raise ValueError("Expected one-dimensional NASA grid coordinates")
        li=int(np.argmin(abs(lats-lat)));lo=int(np.argmin(abs(lons-lon)))
        center=[float(lats[li]),float(lons[lo])]
        if abs(center[0]-lat)>.11 or abs(center[1]-lon)>.11:
            raise ValueError("Nearest NASA source pixel is not near requested location")
        ds=grid["precipitation"]
        units=normalized_unit(ds.attrs.get("units",ds.attrs.get("Units","")))
        if units not in ("mm/hr","mm/h","mmhr-1","mmhour-1"):
            raise ValueError("Unknown native precipitation units: "+repr(units))
        shape=ds.shape
        # Handle one monthly time level; identify unambiguous (lat,lon) or (lon,lat) axes.
        if len(shape)==3 and shape[0]==1:prefix=(0,);shape=shape[1:]
        elif len(shape)==2:prefix=()
        else:raise ValueError("Unexpected IMERG precipitation dimensions "+str(ds.shape))
        if shape==(len(lats),len(lons)):idx=prefix+(li,lo)
        elif shape==(len(lons),len(lats)):idx=prefix+(lo,li)
        else:raise ValueError("IMERG dimensions not matched to latitude/longitude")
        raw=float(ds[idx])
        fill=ds.attrs.get("_FillValue",ds.attrs.get("missing_value",None))
        if fill is not None and raw==float(fill):raise ValueError("NASA source fill pixel")
        scale=ds.attrs.get("scale_factor",1.0)
        offset=ds.attrs.get("add_offset",0.0)
        value=raw*float(scale)+float(offset)
        if not math.isfinite(value) or not (0<=value<=250):
            raise ValueError("Invalid NASA source precipitation rate")
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    return {"month":f"{year}-{month}","precipitationMmHr":value,
      "sourceFilename":path.name,"sha256":digest},center,version.upper()

def convert(files,lat,lon):
    if not files:raise ValueError("Provide actual downloaded NASA monthly granule paths")
    records=[];center=None;version=None
    for path in sorted(files):
        r,cell,v=source_cell(path,lat,lon)
        if center is not None and any(abs(a-b)>1e-5 for a,b in zip(center,cell)):
            raise ValueError("NASA pixel centers differ between granules")
        if version is not None and version!=v:
            raise ValueError("Mixed NASA algorithm versions; compare separately")
        center=cell;version=v;records.append(r)
    months=[r["month"] for r in records]
    if len(set(months))!=len(months):raise ValueError("Duplicate original monthly granule")
    return {"schema":"telluris.exp006.imerg_final_monthly.v1",
      "dataset":"GPM_3IMERGM_07","run":"Final","version":version,
      "units":"mm/hr","temporalResolution":"monthly",
      "requestedCoordinates":[lat,lon],"gridCellCenter":center,
      "sourceNote":"User-downloaded NASA original HDF5 granules; raw hashes provided, independent authenticity requires archive verification",
      "records":records}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--latitude",type=float,required=True)
    p.add_argument("--longitude",type=float,required=True)
    p.add_argument("--out",type=Path,required=True)
    p.add_argument("granules",type=Path,nargs="+")
    a=p.parse_args()
    result=convert(a.granules,a.latitude,a.longitude)
    a.out.parent.mkdir(parents=True,exist_ok=True)
    a.out.write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("SOURCE_EXTRACTED",len(result["records"]),"months",result["gridCellCenter"],
          "NASA original hashes preserved",flush=True)

if __name__=="__main__":main()
