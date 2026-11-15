import test from "node:test";
import assert from "node:assert/strict";
import {fromPower} from "../public/assets/science.js";
import {summarizeMonthly} from "../public/assets/seasonality.js";
function NASA(monthlyRate=2){
 const PRECTOTCORR={};
 for(let y=2011;y<=2020;y++)for(let m=1;m<=12;m++)
  PRECTOTCORR[y+String(m).padStart(2,"0")]=monthlyRate;
 return {header:{fill_value:-999,sources:["MERRA2"],api:{version:"test"}},
   parameters:{PRECTOTCORR:{units:"mm/day"}},
   properties:{parameter:{PRECTOTCORR}},
   geometry:{coordinates:[-85.44,10.63,0]}};
}
test("POWER monthly precipitation is converted to actual calendar month totals",()=>{
 const data=fromPower(NASA(),"PRECTOTCORR",2011,2020);
 assert.equal(data.monthly.length,120);
 assert.equal(data.monthly.find(p=>p.year===2012&&p.month===2).value,58);
 assert.equal(data.monthly.find(p=>p.year===2011&&p.month===2).value,56);
 assert.deepEqual(data.points.filter(p=>p.year===2012).map(p=>p.value),[732]);
 const p=summarizeMonthly(data.monthly,{aggregation:"sum_rate",unit:"mm/month"});
 assert.equal(p.status,"descriptive");
 assert.equal(p.monthly.length,12);
});
test("POWER excludes all monthly rows from incomplete annual observations",()=>{
 const json=NASA();
 json.properties.parameter.PRECTOTCORR["201112"]=-999;
 const data=fromPower(json,"PRECTOTCORR",2011,2020);
 assert.equal(data.points.length,9);
 assert.equal(data.monthly.some(p=>p.year===2011),false);
 assert.equal(summarizeMonthly(data.monthly).status,"insufficient");
});
