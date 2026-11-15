import test from "node:test";import assert from "node:assert/strict";
import {SCHEMA,parseIMERG,comparePrecipitation} from "../public/assets/gpm.js";
function sample(n=12,y=2023){
 return {schema:SCHEMA,dataset:"GPM_3IMERGM_07",run:"Final",version:"V07B",
 units:"mm/hr",temporalResolution:"monthly",requestedCoordinates:[10.63,-85.44],
 gridCellCenter:[10.65,-85.45],records:Array.from({length:n},(_,i)=>({
  month:y+"-"+String(i+1).padStart(2,"0"),precipitationMmHr:1,
  sourceFilename:"3IMERG.2023.V07B.nc4",sha256:"a".repeat(64)}))};
}
test("NASA monthly mm/hr rate becomes a 365-day annual accumulation",()=>{
 const r=parseIMERG(sample(),10.63,-85.44);
 assert.equal(r.annual[0].value,8760);
 assert.equal(r.trust,"user_imported_unverified_source_manifest");
});
test("Leap year yields 8784 mm at 1 mm/hr",()=>{
 assert.equal(parseIMERG(sample(12,2024),10.63,-85.44).annual[0].value,8784);
});
test("Incomplete years never become annual estimates",()=>{
 const r=parseIMERG(sample(11),10.63,-85.44);
 assert.equal(r.annual.length,0);
 assert.equal(r.incomplete[0].validMonths,11);
});
test("Unknown IMERG collection, units, sensor run or wrong location are refused",()=>{
 for(const [key,value] of [["dataset","FAKE"],["units","mm/day"],["run","Early"],["version","V06"]]){
  const s=sample();s[key]=value;
  assert.throws(()=>parseIMERG(s,10.63,-85.44));
 }
 assert.throws(()=>parseIMERG(sample(),9.99,-83.03),/mismatch/);
});
test("Duplicate source months and missing original hashes are refused",()=>{
 const s=sample();s.records.push({...s.records[0]});
 assert.throws(()=>parseIMERG(s,10.63,-85.44),/Duplicate/);
 const h=sample();h.records[0].sha256=null;
 assert.throws(()=>parseIMERG(h,10.63,-85.44),/provenance/);
});
test("POWER vs GPM annual statistics match by year only",()=>{
 const power=[{year:2022,value:1000},{year:2023,value:120},{year:2024,value:230}];
 const imerg={annual:[{year:2023,value:100},{year:2024,value:200}],trust:"imported"};
 const d=comparePrecipitation(power,imerg);
 assert.equal(d.yearsCompared,2);
 assert.equal(d.meanBiasMmYr,25);
 assert.equal(d.rmseMmYr,25.4951);
 assert.equal(d.correlation,1);
 assert.equal(d.trends,null);
 assert.equal(d.validatedPhysicalTrend,false);
});
test("Mismatched years cannot masquerade as validation",()=>{
 assert.throws(()=>comparePrecipitation([{year:2025,value:100}],
  {annual:[{year:2001,value:100}]}),/overlapping/);
});
