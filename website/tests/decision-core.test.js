import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildDecisionBrief,buildAIRequest} from "../public/assets/decision-core.js";
import {VARIABLES} from "../public/assets/science.js";
import {parseArchive,matrixRows} from "../public/assets/matrix-core.js";

const sites=[{id:"liberia",label:"Liberia",lat:10.63,lon:-85.44},
{id:"limon",label:"Limón",lat:9.99,lon:-83.03}];
const data=JSON.parse(readFileSync(new URL("../public/telluris/explore/data/exp001-annual.json",import.meta.url),"utf8"));

test("All 18 NASA POWER parameters have source-specific conditional guidance",()=>{
 for(const code of Object.keys(VARIABLES)){
  const row={code,left:{status:"descriptive",n:30,end:2020,latest:10,mean:9,slopePerDecade:0.2}};
  const brief=buildDecisionBrief(row,{sites:[sites[0]],start:1991,end:2020,lang:"en"});
  assert.equal(brief.ready,true);
  assert.equal(brief.metrics.length,4);
  assert.ok(brief.drivers.length>55,"Every parameter needs a substantive source-specific hypothesis");
  assert.ok(!/is caused by|will certainly|will definitely/i.test(brief.drivers));
  assert.match(brief.limitation,/not causal attribution/);
 }
});
test("NASA archive drives KPI readings with actual original source, without invented precision",()=>{
 const records=parseArchive(data,sites,["T2M","PRECTOTCORR"],1985,2025);
 const rows=matrixRows(["T2M","PRECTOTCORR"],records,sites);
 for(const row of rows){
  const x=buildDecisionBrief(row,{sites,start:1985,end:2025,lang:"es"});
  assert.equal(x.ready,true);
  assert.equal(x.metrics[2].value.includes("41"),true);
  assert.match(x.metrics[1].note,/descriptiva/i);
  assert.match(x.metrics[3].note,/Año|año/);
  const request=buildAIRequest(x,row,{sites,start:1985,end:2025,lang:"es",source:"archive"});
  assert.equal(request.schema,"telluris.ai.source_brief.v1");
  assert.equal(request.siteA.annual.length,41);
  assert.equal(request.siteB.annual.length,41);
  assert.equal(request.code,row.code);
  assert.equal(request.warning.includes("no validated significance"),true);
 }
});
test("No source means no fake dashboard claim and no AI request",()=>{
 const row={code:"T2M",left:{status:"unavailable"},a:null,right:null};
 const brief=buildDecisionBrief(row,{sites:[sites[0]],start:1985,end:2025,lang:"en"});
 assert.equal(brief.ready,false);
 assert.match(brief.evidence,/Insufficient/);
 assert.equal(brief.metrics[0].value,"—");
 assert.equal(buildAIRequest(brief,row,{sites,start:1985,end:2025}),null);
});
test("Circular wind direction cannot show a numeric slope or fake outlook",()=>{
 const row={code:"WD10M",left:{status:"circular",latest:359,n:30,end:2020},a:{points:[{year:2020,value:359}]}};
 const x=buildDecisionBrief(row,{sites:[sites[0]],start:1991,end:2020,lang:"en"});
 assert.equal(x.metrics[1].value,"—");
 assert.match(x.evidence,/circular/);
});
test("Two-zone KPI uses matched-year difference, not subtraction of different years",()=>{
 const row={code:"T2M",left:{status:"descriptive",latest:10,end:2025,n:41,mean:8,slopePerDecade:0.3},
 right:{status:"descriptive"},paired:{status:"descriptive",points:[{year:2021,value:1.25},{year:2024,value:2.5}]}};
 const x=buildDecisionBrief(row,{sites,start:1985,end:2025,lang:"en"});
 assert.match(x.metrics[3].note,/2024/);assert.match(x.metrics[3].value,/2.5/);
});
test("Explorer has ES/EN evidence KPIs without an unavailable AI CTA",()=>{
 for(const path of ["telluris/explore/index.html","en/telluris/explore/index.html"]){
  const h=readFileSync(new URL("../public/"+path,import.meta.url),"utf8");
  for(const id of ["obs-decision","obs-decision-name","obs-d-metric-0","obs-d-metric-3",
    "obs-d-evidence","obs-d-drivers","obs-d-outlook","obs-d-near","obs-d-long"])
   assert.ok(h.includes('id="'+id+'"'),path+" missing "+id);
  assert.ok(h.includes('class="obs-deep-data"'));
  assert.ok(!h.includes('obs-ai-run')&&!h.includes('obs-ai-output')&&!h.includes('obs-ai-panel'));
 }
 const js=readFileSync(new URL("../public/assets/observatory.js",import.meta.url),"utf8");
 assert.ok(js.includes('buildDecisionBrief('));
 assert.ok(!js.includes('buildAIRequest('));
 assert.ok(js.includes('textContent='));
 assert.ok(!js.includes('/api/telluris-ai.php'));
 assert.ok(!js.includes('OPENAI_API_KEY'));
});
