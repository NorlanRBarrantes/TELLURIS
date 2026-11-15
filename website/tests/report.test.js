import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {analyze,fromSnapshot} from "../public/assets/science.js";
import {buildScientificReport} from "../public/assets/report.js";
const file=new URL("../public/telluris/explore/data/exp001-annual.json",import.meta.url);
const snap=JSON.parse(readFileSync(file,"utf8"));
test("Portable scientific report never certifies NASA climate significance",()=>{
 const series=fromSnapshot(snap,"limon","T2M",1985,2025);
 const result=analyze(series.points);
 const doc=buildScientificReport({variable:"T2M",meta:series.meta,analysis:result},
   {unit:"°C",placeLabel:"Limón"});
 assert.equal(doc.schema,"telluris.exp005.scientific_report.v1");
 assert.equal(doc.annualObservations.length,41);
 assert.equal(doc.parameter,"T2M");
 assert.equal(doc.analysis.validatedSignificance,false);
 assert.equal(doc.analysis.estimate.slopePerDecade,result.slopePerDecade);
 assert.ok(doc.analysis.tests.blockOrderPermutations.length===2);
 assert.ok(doc.originalData.rawArchiveSha256.length===64);
 assert.ok(doc.limitations.some(x=>x.includes("Multiple comparisons")));
});
test("Wind direction scientific report omits MK and Sen",()=>{
 const a={status:"descriptive",start:2000,end:2009,
   points:Array.from({length:10},(_,i)=>({year:2000+i,value:350+i}))};
 const doc=buildScientificReport({analysis:a,variable:"WD10M",meta:{kind:"NASA POWER",source:"MERRA2"}});
 assert.equal(doc.analysis.type,"circular_annual_descriptive");
 assert.equal(doc.analysis.validatedSignificance,false);
 assert.equal(JSON.stringify(doc.analysis).includes("originalMannKendall"),false);
});
test("Scientific report refuses missing or unverified annual records",()=>{
 assert.throws(()=>buildScientificReport({variable:"T2M",analysis:{points:[]},meta:{}}));
});
