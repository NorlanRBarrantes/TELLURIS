import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {VARIABLES,POWER_READY_CODES} from "../public/assets/science.js";
import {INVESTIGATION_MODES,VARIABLE_FAMILIES,chosenCodes,siteCount,
  batchPowerUrl,planBatches,verifyLocation,parseBatch,parseArchive,
  summarizeSeries,matchedDifference,matrixRows,standardizedObservations,
  summarizeInvestigation,groundedAnswer} from "../public/assets/matrix-core.js";

const sites=[{id:"liberia",label:"Liberia",lat:10.63,lon:-85.44},
             {id:"limon",label:"Limón",lat:9.99,lon:-83.03}];
const archive=JSON.parse(readFileSync(new URL("../public/telluris/explore/data/exp001-annual.json",import.meta.url),"utf8"));

test("Four investigation modes cover requested 1×1, 1×2, 18×1 and 18×2",()=>{
 assert.deepEqual(INVESTIGATION_MODES,["one-one","one-two","all-one","all-two"]);
 assert.equal(siteCount("one-one"),1);
 assert.equal(siteCount("one-two"),2);
 assert.equal(siteCount("all-one"),1);
 assert.equal(siteCount("all-two"),2);
 assert.deepEqual(chosenCodes("one-two","T2M"),["T2M"]);
 assert.equal(chosenCodes("all-two","T2M").length,18);
 assert.equal(new Set(POWER_READY_CODES).size,18);
 const listed=Object.values(VARIABLE_FAMILIES).flat();
 assert.deepEqual(listed.slice().sort(),[...POWER_READY_CODES].sort());
});

test("NASA monthly batch URL groups no more than 20 source parameters in original communities",()=>{
 const plans=planBatches(sites,chosenCodes("all-two","T2M"),1985,2025);
 assert.equal(plans.length,4,"Expected 2 sites × 2 NASA POWER communities");
 for(const p of plans){
   assert.ok(p.codes.length<=20);
   const url=new URL(p.url);
   assert.equal(url.searchParams.get("community"),p.community);
   assert.equal(url.searchParams.get("parameters"),p.codes.join(","));
   assert.equal(Number(url.searchParams.get("latitude")),p.site.lat);
   assert.equal(Number(url.searchParams.get("longitude")),p.site.lon);
   assert.ok(p.codes.every(code=>VARIABLES[code].community===p.community));
 }
 assert.throws(()=>batchPowerUrl(sites[0],["T2M","GWETTOP"],"RE",1985,2025),/Invalid/);
 assert.throws(()=>batchPowerUrl(sites[0],["T2M","T2M"],"RE",1985,2025),/Invalid/);
 assert.throws(()=>batchPowerUrl(sites[0],Array(21).fill("T2M"),"RE",1985,2025),/Invalid/);
 assert.throws(()=>planBatches([],["T2M"],1985,2025),/Invalid/);
});

test("NASA original point coordinates must match; data never assigned to another location",()=>{
 assert.equal(verifyLocation({geometry:{coordinates:[-85.44,10.63,0]}},sites[0]),true);
 assert.throws(()=>verifyLocation({geometry:{coordinates:[-83.03,9.99,0]}},sites[0]),/unexpected/);
});

test("Archive demonstrates only two actual observed source variables and preserves gaps",()=>{
 const codes=chosenCodes("all-two","T2M");
 const result=parseArchive(archive,sites,codes,1985,2025);
 assert.equal(Object.keys(result.liberia).length,18);
 assert.equal(Object.keys(result.limon).length,18);
 assert.equal(result.liberia.T2M.data.points.length,41);
 assert.equal(result.limon.PRECTOTCORR.data.points.length,41);
 assert.equal(result.liberia.WS10M.status,"unavailable");
 const rows=matrixRows(codes,result,sites);
 assert.equal(rows.length,18);
 assert.equal(rows.filter(x=>x.left.status==="descriptive"&&x.right?.status==="descriptive").length,2);
 assert.equal(rows.filter(x=>x.left.status==="unavailable").length,16);
 assert.ok(Number.isFinite(rows.find(r=>r.code==="T2M").paired.slopePerDecade));
});

test("Matched-year difference never subtracts different calendar years",()=>{
 const a={points:Array.from({length:12},(_,i)=>({year:2000+i,value:10+i}))};
 const b={points:Array.from({length:12},(_,i)=>({year:2001+i,value:2+i*2}))};
 const p=matchedDifference(a,b);
 assert.equal(p.status,"descriptive");
 assert.equal(p.n,11);
 assert.equal(p.start,2001);
 assert.equal(p.end,2011);
 assert.ok(Number.isFinite(p.slopePerDecade));
 assert.equal(matchedDifference(a,{points:[{year:2000,value:1}]}).status,"insufficient");
});

test("Circular wind summaries never invent a linear trend",()=>{
 const values={status:"ready",data:{points:Array.from({length:12},(_,i)=>({year:2000+i,value:(i*30)%360}))}};
 const r=summarizeSeries(values,"WD10M");
 assert.equal(r.status,"circular");assert.equal(r.slopePerDecade,null);
});

test("Independent per-variable standardization cannot mix physical units",()=>{
 const src=Array.from({length:10},(_,i)=>({year:2011+i,value:10+i}));
 const z=standardizedObservations(src);
 assert.equal(z.status,"descriptive");
 assert.ok(Math.abs(z.points.reduce((s,p)=>s+p.value,0))<1e-10);
 assert.equal(standardizedObservations(src.slice(0,3)).status,"insufficient");
 assert.equal(standardizedObservations(src.map(p=>({...p,value:5}))).status,"flat");
});

test("Narrative is deterministic, cautious and never asserts cause or p-values",()=>{
 const result=parseArchive(archive,sites,chosenCodes("all-two","T2M"),1985,2025);
 const rows=matrixRows(chosenCodes("all-two","T2M"),result,sites);
 const summary=summarizeInvestigation(rows,{lang:"es",sites});
 assert.equal(summary.available,2);
 assert.equal(summary.unavailable,16);
 assert.match(summary.notes.join(" "),/DESCRIPTIVAS/);
 assert.match(groundedAnswer("¿Por qué cambió la lluvia?",rows,{lang:"es",sites}),/no demuestran causalidad/);
 assert.match(groundedAnswer("¿Es significativo?",rows,{lang:"es",sites}),/comparaciones múltiples/);
 assert.match(groundedAnswer("T2M",rows,{lang:"es",sites}),/°C \/ decade/);
});
