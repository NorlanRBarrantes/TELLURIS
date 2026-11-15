import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {VARIABLES,fromPower} from "../public/assets/science.js";
import {buildEvidence,answerEvidence} from "../public/assets/evidence.js";

const read=p=>readFileSync(new URL("../public/"+p,import.meta.url),"utf8");
const catalog=JSON.parse(read("telluris/catalog/data/catalog.json"));

test("EXP-004 has descriptions in both languages for every live NASA POWER variable",()=>{
 assert.equal(Object.keys(VARIABLES).length,18);
 for(const [code,v] of Object.entries(VARIABLES)){
  assert.ok(v.descriptionEs.length>30,code+" missing plain Spanish definition");
  assert.ok(v.descriptionEn.length>30,code+" missing plain English definition");
  assert.ok(v.nativeUnits.length>0,code);
  assert.ok(catalog.connected.some(x=>x.id===code),code+" absent from public catalog");
 }
});
test("All 22 team-requested atmosphere and water topics have specific, matched source candidates",()=>{
 const wanted=catalog.candidates.filter(x=>x.number<=22);
 assert.equal(wanted.length,22);
 for(const item of wanted){
  assert.ok(item.source_candidates.length>0,item.id);
  assert.ok(item.spatial_support_es?.length>5,item.id);
  assert.ok(item.validation_gate_es?.length>5,item.id);
 }
 assert.ok(wanted.find(x=>x.id==="C15").source_candidates.includes("NASA GLDAS · Qs / Qsb"));
 assert.ok(wanted.find(x=>x.id==="C16").source_candidates[0].includes("SWOT"));
 assert.ok(wanted.find(x=>x.id==="C19").source_candidates[0].includes("SMAP"));
 assert.ok(wanted.find(x=>x.id==="C22").source_candidates[0].includes("OPERA"));
});
test("Weather or water questions are actually selectable in both languages",()=>{
 for(const page of ["telluris/explore/index.html","en/telluris/explore/index.html"]){
  const html=read(page);
  for(const variable of ["T2M","PRECTOTCORR","RH2M","WS10M","GWETROOT","ALLSKY_SFC_SW_DWN"]){
   assert.ok(html.includes('data-question-variable="'+variable+'"'),page+" "+variable);
  }
  assert.ok(html.includes('id="variable-guide"'));
  assert.ok(html.includes('id="compare-locations"'));
  assert.ok(html.includes('id="p-value-note"'));
  assert.ok(html.includes('id="chart-legend"'));
 }
 const js=read("assets/explorer.js");
 assert.ok(js.includes("requestGeneration"));
 assert.ok(js.includes("comparisonRequested"));
 assert.ok(js.includes('powerUrl(cfg.lat,cfg.lon,cfg.start,cfg.end,variable)'));
});
test("Evidence never treats wind bearing as a linear slope or significant p-value",()=>{
 const a={status:"descriptive",points:[{year:2023,value:359},{year:2024,value:1}],
   start:2023,end:2024,n:2};
 const ev=buildEvidence(a,"WD10M","Liberia","NASA POWER","es");
 assert.ok(ev.summary.includes("promedios circulares"));
 assert.ok(!ev.summary.includes("Theil"));
 const ans=answerEvidence("¿Es significativo estadísticamente?",ev);
 assert.ok(ans.includes("no se estima"));
 assert.ok(!ans.includes("Valor p original:"));
});
test("Evidence identifies RH2M correctly and uses the actual provider unit",()=>{
 const a={status:"exploratory",slopePerDecade:1.5,n:20,start:2000,end:2019,
  mk:{p:.013},lag1:null};
 const ev=buildEvidence(a,"RH2M","Limón","NASA POWER","es");
 assert.ok(ev.summary.includes("Humedad relativa a 2 m"));
 assert.ok(!ev.summary.includes("precipitación anual"));
 assert.ok(ev.summary.includes("pp / decade"));
});
test("Circular wind source rejects impossible direction and missing month",()=>{
 const months={};
 for(let month=1;month<=12;month++)months["2024"+String(month).padStart(2,"0")]=12;
 months["202410"]=361;
 const data={header:{fill_value:-999},parameters:{WD10M:{units:"Degrees"}},
   properties:{parameter:{WD10M:months}}};
 assert.equal(fromPower(data,"WD10M",2024,2024).points.length,0);
 months["202410"]=12;
 assert.equal(fromPower(data,"WD10M",2024,2024).points.length,1);
});
