import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {powerUrl, fromPower, fromSnapshot, analyze, mannKendall, senSlope} from "../public/assets/science.js";

const snapshot = JSON.parse(readFileSync(new URL("../public/telluris/explore/data/exp001-annual.json", import.meta.url),"utf8"));
function fixture(fill=-999) {
  const param={T2M:{},PRECTOTCORR:{}};
  for (const y of [2023,2024]) for(let m=1;m<=12;m++){
    const key=String(y)+String(m).padStart(2,"0");
    param.T2M[key]=20;
    param.PRECTOTCORR[key]=2;
  }
  for(const y of [2023,2024]){
    param.T2M[y+"13"]=999;
    param.PRECTOTCORR[y+"13"]=999;
  }
  return {header:{fill_value:fill,sources:["MERRA2"],api:{version:"test"}},
    parameters:{T2M:{units:"C"},PRECTOTCORR:{units:"mm/day"}},
    geometry:{coordinates:[-85.44,10.63,94.64]},properties:{parameter:param}};
}
test("Annual precipitation: 365/366 days and YYYY13 excluded",()=>{
  const x=fromPower(fixture(),"PRECTOTCORR",2023,2024);
  assert.deepEqual(x.points.map(p=>p.value),[730,732]);
  assert.equal(x.meta.ignoredAnnualKeys,2);
});
test("T2M uses day-weighted average, not 12-month simple mean",()=>{
  const f=fixture();
  f.properties.parameter.T2M["202302"]=40;
  const x=fromPower(f,"T2M",2023,2023);
  assert.ok(Math.abs(x.points[0].value-(20+20*28/365))<1e-10);
});
test("Missing one precipitation month does not remove full T2M year",()=>{
  const f=fixture();
  f.properties.parameter.PRECTOTCORR["202312"]=-999;
  assert.deepEqual(fromPower(f,"PRECTOTCORR",2023,2024).points.map(p=>p.year),[2024]);
  assert.deepEqual(fromPower(f,"T2M",2023,2024).points.map(p=>p.year),[2023,2024]);
});
test("Alternate fill metadata read exactly",()=>{
  const f=fixture(-99);
  f.properties.parameter.PRECTOTCORR["202312"]=-99;
  assert.deepEqual(fromPower(f,"PRECTOTCORR",2023,2024).points.map(p=>p.year),[2024]);
});
test("Unexpected scientific units reject rather than silently convert",()=>{
  const f=fixture();f.parameters.PRECTOTCORR.units="mm/hr";
  assert.throws(()=>fromPower(f,"PRECTOTCORR",2023,2024),/Unexpected precipitation unit/);
});
test("Sen uses elapsed years across calendar gaps",()=>{
  const x=[{year:2000,value:10},{year:2001,value:12},{year:2003,value:16},{year:2007,value:24}];
  assert.ok(Math.abs(senSlope(x)-2)<1e-10);
});
test("Mann-Kendall continuity and ties",()=>{
  const y=[10,10,10,11.5,12,12,12,12,14.2,15,15,18];
  const r=mannKendall(y);
  assert.equal(r.s,56);
  assert.ok(Math.abs(r.p-0.000097958)<0.00002);
  assert.equal(mannKendall(Array(20).fill(5)).p>0.999999,true);
});
test("Detrended lag-1 retains only consecutive years",()=>{
  const y=[2000,2001,2002,2005,2006,2007,2010,2011,2012,2015,2016,2017];
  const result=analyze(y.map((year,i)=>({year,value:year*.15+(i*i)%7})));
  assert.equal(result.status,"exploratory");
  assert.equal(result.lag1Pairs,8);
  assert.ok(result.lag1===null || Math.abs(result.lag1)<=1);
});
test("The archived dataset contains authentic source metadata and 41 years",()=>{
  assert.equal(snapshot.apiVersion,"v2.10.0");
  assert.equal(snapshot.locations.liberia.series.length,41);
  assert.equal(snapshot.locations.limon.series.length,41);
  assert.equal(snapshot.locations.limon.series.find(x=>x[0]===2024)[2],6757.3);
  assert.equal(snapshot.locations.liberia.sha256.length,64);
});
test("Browser Sen slopes agree with original Python EXP-001 to rounding tolerance",()=>{
  const expected={liberia:{T2M:-0.11268630161375472,PRECTOTCORR:434.8516194331983},
                  limon:{T2M:0.1678632212536314,PRECTOTCORR:918.7686507936507}};
  for(const place of ["liberia","limon"]) for(const variable of ["T2M","PRECTOTCORR"]){
    const x=fromSnapshot(snapshot,place,variable,1985,2025);
    const result=analyze(x.points);
    assert.equal(result.n,41);
    assert.ok(Math.abs(result.slopePerDecade-expected[place][variable])<0.001,
      "Unexpected JS/Python Sen difference for "+place+"/"+variable);
  }
});
test("Use actual NASA coordinates and prevent invalid requests",()=>{
  const x=fromSnapshot(snapshot,"limon","T2M",1985,2025);
  assert.deepEqual(x.meta.resolvedCoordinates,[-83.03,9.99,354.78]);
  assert.throws(()=>powerUrl(95,0,1985,2025),/Invalid/);
  assert.ok(powerUrl(10.63,-85.44,1985,2025).includes("PRECTOTCORR"));
});
test("Fewer than 10 annual points cannot claim a trend",()=>{
  const x=fromSnapshot(snapshot,"limon","T2M",2021,2025);
  assert.equal(analyze(x.points).status,"insufficient");
});
