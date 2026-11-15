#!/usr/bin/env python3
"""EXP-003: ORNL MODIS Terra MOD13Q1 NDVI/EVI QA-aware retrieval.

Outputs 16-day observations and annual descriptive medians. No claims of
statistical significance, drought causality, or vegetation area trends.
"""
from __future__ import annotations
import argparse
from collections import defaultdict
from datetime import datetime, timezone
import hashlib
import json
import re
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE = 'https://modis.ornl.gov/rst/api/v1/MOD13Q1'
SITES = {'liberia': (10.63, -85.44), 'limon': (9.99, -83.03)}
BANDS = {'NDVI': '250m_16_days_NDVI', 'EVI': '250m_16_days_EVI'}
QA_BAND = '250m_16_days_pixel_reliability'
MIN_VALID_PER_YEAR = 12
MIN_VALID_PER_QUARTER = 2


def request_json(path, params=None, tries=3):
    url = BASE + path + (('?' + urlencode(params)) if params else '')
    request = Request(url, headers={
        'Accept': 'application/json',
        'User-Agent': 'TELLURIS-EXP003-scientific-research/0.1'
    })
    for attempt in range(tries):
        try:
            with urlopen(request, timeout=45) as response:
                if response.status != 200:
                    raise RuntimeError(f'HTTP {response.status}')
                body = response.read()
            result = json.loads(body)
            if not isinstance(result, dict):
                raise ValueError('Expected ORNL JSON object')
            return url, result, body
        except Exception:
            if attempt == tries-1:
                raise
            time.sleep(1.5*(attempt+1))
    raise RuntimeError('Unreachable')


def find_metadata(response):
    items = response.get('bands')
    if not isinstance(items, list):
        raise ValueError('ORNL band metadata is not a list')
    found = {x['band']: x for x in items if isinstance(x,dict) and 'band' in x}
    for name in (*BANDS.values(), QA_BAND):
        if name not in found:
            raise ValueError('Missing required band '+name)
    for name in BANDS.values():
        item = found[name]
        if float(item.get('scale_factor',0)) != .0001 or float(item.get('fill_value',0)) != -3000:
            raise ValueError('Unrecognized band scaling/fill for '+name)
        numbers = re.findall(r'-?\d+', item.get('valid_range',''))
        if numbers != ['-2000','10000']:
            raise ValueError('Unexpected band range '+repr(numbers))
    qa = found[QA_BAND]
    if qa.get('valid_range') != '0 to 3' or float(qa.get('fill_value',0)) != -1:
        raise ValueError('Unexpected QA metadata')
    return found


def unpack_dates(response, first, last):
    dates = response.get('dates')
    if not isinstance(dates,list):
        raise ValueError('ORNL response missing dates array')
    result = []
    for item in dates:
        date,modis = item.get('calendar_date'),item.get('modis_date')
        if not isinstance(date,str) or not re.fullmatch(r'\d{4}-\d\d-\d\d',date):
            raise ValueError('Malformed calendar date')
        if not isinstance(modis,str) or not re.fullmatch(r'A\d{7}',modis):
            raise ValueError('Malformed composite id')
        if first <= int(date[:4]) <= last:
            result.append({'modis_date':modis,'calendar_date':date})
    if len(set(x['modis_date'] for x in result)) != len(result):
        raise ValueError('Duplicate composite dates')
    return sorted(result,key=lambda x:x['calendar_date'])


def subset_samples(response, expected_dates, metadata):
    if response.get('nrows') != 1 or response.get('ncols') != 1:
        raise ValueError('Not a 1x1 center-pixel subset')
    entries=response.get('subset')
    if not isinstance(entries,list):
        raise ValueError('Missing ORNL subset entries')
    rows=defaultdict(dict)
    for item in entries:
        band,date,data=item.get('band'),item.get('modis_date'),item.get('data')
        if band not in (*BANDS.values(),QA_BAND):
            continue
        if date not in expected_dates or not isinstance(data,list) or len(data)!=1:
            raise ValueError('Unexpected date or size')
        if band in rows[date]:
            raise ValueError('Duplicate band/date')
        rows[date][band]=data[0]
    result={}
    for date in expected_dates:
        if set(rows[date]) != set((*BANDS.values(),QA_BAND)):
            raise ValueError('Missing requested QA/science band for '+date)
        qa=rows[date][QA_BAND]
        if isinstance(qa,bool) or not isinstance(qa,(int,float)) or int(qa)!=qa:
            raise ValueError('Invalid reliability rank')
        item={'qa':int(qa)}
        for short,band in BANDS.items():
            m=metadata[band]
            low,high=[float(x) for x in re.findall(r'-?\d+',m['valid_range'])]
            raw=rows[date][band]
            if (isinstance(raw,bool) or not isinstance(raw,(int,float))
                    or not low<=raw<=high or raw==float(m['fill_value'])
                    or qa not in (0,1)):
                item[short]=None
            else:
                item[short]=round((raw+float(m.get('add_offset',0)))*float(m['scale_factor']),6)
        result[date]=item
    return result


def median(values):
    ordered=sorted(values)
    if not ordered:return None
    n=len(ordered)
    return ordered[n//2] if n%2 else (ordered[n//2-1]+ordered[n//2])/2


def annual_summary(rows,first,last,min_year=MIN_VALID_PER_YEAR,min_quarter=MIN_VALID_PER_QUARTER):
    result={measure:[] for measure in BANDS}
    for year in range(first,last+1):
        all_rows=[r for r in rows if int(r['calendar_date'][:4])==year]
        for measure in BANDS:
            valid=[r for r in all_rows if r[measure] is not None]
            q=[sum(1 for r in valid if (int(r['calendar_date'][5:7])-1)//3==i) for i in range(4)]
            passed=len(valid)>=min_year and all(n>=min_quarter for n in q)
            result[measure].append({
                'year':year, 'n_total_composites':len(all_rows),
                'n_valid_composites':len(valid), 'quarter_valid_counts':q,
                'annual_median':round(median([x[measure] for x in valid]),6) if passed else None,
                'status':'accepted' if passed else 'insufficient_seasonal_coverage'
            })
    return result


def run(first,last,dest):
    dest.mkdir(parents=True,exist_ok=True)
    meta_url,meta,raw=request_json('/bands')
    metadata=find_metadata(meta)
    (dest/'bands.json').write_bytes(raw)
    output={
        'schema':'telluris.exp003.mod13q1.v1',
        'source':'NASA ORNL DAAC TESViS, MODIS Terra, MOD13Q1',
        'version_note':'Actual subset collection version must be checked independently before advertising .061',
        'temporal_resolution':'16-day composite',
        'sample':'1x1 central MODIS pixel, not city/county aggregate',
        'years_requested':[first,last],
        'retrieved_utc':datetime.now(timezone.utc).isoformat(),
        'quality_policy':'reliability 0/1 (good/marginal); inclusive raw [-2000,10000]; 0.0001 scale; annual median if >=12 valid composites and >=2 per quarter',
        'metadata_source':meta_url,'locations':{}
    }
    for name,(lat,lon) in SITES.items():
        folder=dest/name
        folder.mkdir(exist_ok=True)
        _,date_payload,date_bytes=request_json('/dates',{'latitude':lat,'longitude':lon})
        (folder/'dates.json').write_bytes(date_bytes)
        dates=unpack_dates(date_payload,first,last)
        if not dates:
            raise RuntimeError('No available MODIS dates for '+name)
        samples={}
        source=[]
        pixel_size=None
        for i in range(0,len(dates),10):
            batch=dates[i:i+10]
            params={'latitude':lat,'longitude':lon,'startDate':batch[0]['modis_date'],
                'endDate':batch[-1]['modis_date'],'kmAboveBelow':0,'kmLeftRight':0}
            link,subset,raw=request_json('/subset',params)
            rows=subset_samples(subset,{x['modis_date'] for x in batch},metadata)
            if set(rows)&set(samples):
                raise ValueError('Duplicated NASA composite in consecutive batches')
            samples.update(rows)
            digest=hashlib.sha256(raw).hexdigest()
            (folder/f'batch_{i//10+1:03d}.json').write_bytes(raw)
            source.append({'url':link,'sha256':digest,'records':len(rows)})
            pixel_size=float(subset['cellsize'])
            print('FETCH',name,i//10+1,'/',(len(dates)+9)//10,'records',len(rows),flush=True)
            time.sleep(.12)
        observations=[
            {'modis_date':x['modis_date'],'calendar_date':x['calendar_date'],
             **samples[x['modis_date']]} for x in dates
        ]
        annual=annual_summary(observations,first,last)
        qa={str(k):sum(1 for x in observations if x['qa']==k) for k in (-1,0,1,2,3)}
        output['locations'][name]={
            'name':name,'requested_coordinates':[lat,lon],
            'cellsize_m':pixel_size,'n_composites':len(observations),
            'qa_counts':qa,'observations':observations,'annual':annual,'raw_sources':source
        }
        for measure,records in annual.items():
            print('SUMMARY',name,measure,'accepted_annual_values',
                sum(v['annual_median'] is not None for v in records),'/',len(records),
                'qa',qa,flush=True)
    (dest/'exp003_result.json').write_text(
        json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('SOURCE_RETRIEVAL_COMPLETED; climate inference not yet validated',flush=True)


if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--start',type=int,default=2023)
    p.add_argument('--end',type=int,default=2025)
    p.add_argument('--dest',type=Path,default=Path('data/raw/exp003'))
    a=p.parse_args()
    if not (2000<=a.start<=a.end<=2025):
        p.error('Select completed calendar years 2000–2025')
    run(a.start,a.end,a.dest)
