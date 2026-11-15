import test from "node:test";
import assert from "node:assert/strict";
import {summarizeMonthly} from "../public/assets/seasonality.js";
const days=(y,m)=>new Date(Date.UTC(y,m,0)).getUTCDate();
const sample=()=>Array.from({length:10},(_,i)=>2011+i).flatMap(year=>
  Array.from({length:12},(_,j)=>({year,month:j+1,days:days(year,j+1),value:year<2016?2:4})));
test("Internal two-period climatology and month-matched anomalies",()=>{
 const p=summarizeMonthly(sample(),{unit:"mm/month",aggregation:"sum_rate"});
 assert.equal(p.status,"descriptive");
 assert.deepEqual(p.referenceYears,[2011,2015]);
 assert.deepEqual(p.recentYears,[2016,2020]);
 assert.equal(p.monthly.length,12);
 assert.equal(p.monthly[0].delta,2);
 assert.equal(p.monthly[0].latestAnomaly,2);
 assert.equal(p.quarters[0].delta,6);
});
test("Day-weighted quarterly mean is not arithmetic mean",()=>{
 const source=sample();source[0].value=20;
 const p=summarizeMonthly(source(),{aggregation:"mean"});
 assert.ok(p.quarters[0].reference>2);
});
test("Duplicate months and circular direction are rejected",()=>{
 const source=sample();
 assert.throws(()=>summarizeMonthly([...source,source[0]]),/Duplicate/);
 assert.throws(()=>summarizeMonthly(source,{aggregation:"circular"}),/Unsupported/);
});
test("Incomplete years never count as complete",()=>{
 const partial=sample().filter(r=>!(r.year===2020&&r.month===12));
 assert.equal(summarizeMonthly(partial).completeYears,9);
});
