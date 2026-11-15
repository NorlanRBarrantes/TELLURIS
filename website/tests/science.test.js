import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {VARIABLES, POWER_READY_CODES, powerUrl, fromPower, fromSnapshot, analyze, mannKendall, senSlope} from "../public/assets/science.js";

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
  assert.throws(()=>fromPower(f,"PRECTOTCORR",2023,2024),/Unexpected PRECTOTCORR unit/);
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

test("Live-verified NASA POWER registry has 18 distinct codes and correct communities",()=>{
 assert.equal(POWER_READY_CODES.length,18);
 assert.equal(new Set(POWER_READY_CODES).size,18);
 for(const code of POWER_READY_CODES){
  const v=VARIABLES[code];
  assert.ok(v.nativeUnits?.length);
  assert.ok(["AG","RE"].includes(v.community));
  assert.ok(["mean","sum_rate","circular"].includes(v.aggregation));
  const url=new URL(powerUrl(10.63,-85.44,2023,2025,code));
  assert.equal(url.searchParams.get("parameters"),code);
  assert.equal(url.searchParams.get("community"),v.community);
 }
});
test("All 18 verified POWER metadata schemas aggregate 12 months correctly",()=>{
 for(const code of POWER_READY_CODES){
  const v=VARIABLES[code];
  const source={"PRECTOTCORR":2,"T2M":25,"T2M_MAX":31,"T2M_MIN":18,
  "RH2M":70,"WS10M":5,"WD10M":60,"U10M":-3,"V10M":-4,
  "ALLSKY_SFC_SW_DWN":5.2,"PS":100,"CLOUD_AMT":40,"QV2M":16,
  "ALLSKY_SFC_LW_DWN":9.5,"ALLSKY_SRF_ALB":.11,
  "EVPTRNS":2.48,"GWETROOT":.57,"GWETTOP":.53}[code];
  const series={};
  for(const year of [2023,2024]) for(let month=1;month<=12;month++)
    series[year+String(month).padStart(2,"0")]=source;
  const payload={header:{fill_value:-999,sources:["MERRA2"],api:{version:"test"}},
   parameters:{[code]:{units:v.nativeUnits[0]}},
   geometry:{coordinates:[-85.44,10.63,0]},properties:{parameter:{[code]:series}}};
  const rows=fromPower(payload,code,2023,2024).points;
  assert.equal(rows.length,2,code);
  if(code==="PRECTOTCORR")assert.deepEqual(rows.map(x=>x.value),[730,732]);
  else assert.ok(rows.every(x=>Math.abs(x.value-source)<1e-8),code);
  payload.parameters[code].units="WRONG-UNIT";
  assert.throws(()=>fromPower(payload,code,2023,2024),/Unexpected .* unit/);
 }
});
test("Wind direction uses circular average and is excluded from linear trend interpretation",()=>{
 const code="WD10M",series={};
 for(let m=1;m<=12;m++)series["2023"+String(m).padStart(2,"0")]=m%2?359:1;
 const payload={header:{fill_value:-999},parameters:{WD10M:{units:"Degrees"}},
  properties:{parameter:{WD10M:series}}};
 const p=fromPower(payload,code,2023,2023).points[0];
 assert.ok(p.value<3||p.value>357,"Angles 359° and 1° must average near NORTH, not 180°.");
 assert.equal(VARIABLES.WD10M.trendCompatible,false);
});
test("Rate and mean aggregations have distinct annual units",()=>{
 assert.equal(VARIABLES.PRECTOTCORR.aggregation,"sum_rate");
 assert.equal(VARIABLES.EVPTRNS.aggregation,"mean");
 assert.equal(VARIABLES.EVPTRNS.unit,"MJ/m²/day");
 assert.equal(VARIABLES.GWETROOT.nativeUnits[0],"1");
 assert.equal(VARIABLES.ALLSKY_SFC_SW_DWN.nativeUnits[0],"kW-hr/m^2/day");
});
test("Archived NASA data refuse non-archived variables",()=>{
 for(const variable of ["RH2M","WS10M","EVPTRNS","WD10M"]){
  assert.throws(()=>fromSnapshot(snapshot,"liberia",variable,1985,2025),/only for T2M/);
 }
});
