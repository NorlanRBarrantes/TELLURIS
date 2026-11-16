import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";

const root=path.resolve(fileURLToPath(new URL("../public/",import.meta.url)));
const read=rel=>readFileSync(path.join(root,rel),"utf8");
const data=JSON.parse(read("telluris/catalog/data/catalog.json"));

test("Team source is preserved; catalog JSON is versioned and all entries retained",()=>{
 assert.equal(data.schema,"telluris.catalog.2026-11-15.v2");
 assert.equal(data.connected.length,18);
 assert.equal(data.candidates.length,49);
 assert.equal(data.indicators.length,10);
 assert.equal(data.groups.length,6);
 assert.deepEqual(data.candidates.map(x=>x.number),Array.from({length:49},(_,i)=>i+1));
 assert.deepEqual(data.indicators.map(x=>x.number),Array.from({length:10},(_,i)=>i+1));
 assert.equal(data.groups.reduce((a,x)=>a+x.count,0),49);
 assert.equal(new Set(data.candidates.map(x=>x.id)).size,49);
});
test("Only the actual NASA POWER variable pair is connected",()=>{
 assert.ok(data.connected.some(x=>x.id==="T2M"));
 assert.ok(data.connected.some(x=>x.id==="PRECTOTCORR"));
 assert.ok(data.connected.some(x=>x.id==="RH2M"));
 assert.ok(data.connected.some(x=>x.id==="WD10M"));
 assert.ok(data.connected.some(x=>x.id==="EVPTRNS"));
 assert.equal(new Set(data.connected.map(x=>x.id)).size,18);
 assert.ok(data.connected.every(x=>x.implementation_status==="connected"));
 assert.equal(data.candidates.length,49);
 assert.equal(data.candidates.find(x=>x.id==="C01").implementation_status,"connected");
 assert.equal(data.candidates.find(x=>x.id==="C13").implementation_status,"partial");
 assert.ok(data.candidates.find(x=>x.id==="C17").implementation_status==="not_connected");
 assert.ok(data.indicators.every(x=>x.implementation_status!=="connected"));
});
test("Source catalog includes key geosphere/cryosphere/human domains",()=>{
 for(const name of ["Geosfera y actividad sísmica","Criosfera","Actividad humana y territorio"]){
   assert.ok(data.candidates.some(x=>x.domain_es===name));
 }
 assert.ok(data.candidates.find(x=>x.number===29).name_es.includes("Puntos calientes"));
 assert.ok(data.candidates.find(x=>x.number===47).name_es.includes("Luces nocturnas"));
 assert.ok(data.candidates.find(x=>x.number===44).name_es.includes("hielo marino"));
});
test("Bilingual static catalog has correct language, canonical and source assets",()=>{
 for(const [route,file,lang] of [["/telluris/catalog/","telluris/catalog/index.html","es"],
                                   ["/en/telluris/catalog/","en/telluris/catalog/index.html","en"]]){
  const html=read(file);
  assert.ok(html.includes('<html lang="'+lang+'">'));
  assert.ok(html.includes('<link rel="canonical" href="https://projecturiel.earth'+route+'">'));
  for(const item of ["/telluris/catalog/","/en/telluris/catalog/"])assert.ok(html.includes('href="https://projecturiel.earth'+item+'"'));
  for(const p of ["site.css","catalog.css","catalog.js"]){
    const url=(html.match(new RegExp('(?:href|src)="([^"]*'+p.replace(".","\\.")+'(?:\\?[^"]*)?)"'))||[])[1];
    assert.ok(url,"Missing "+p+" from "+file);
    assert.ok(existsSync(path.resolve(root,path.dirname(file),url.split("?")[0])),"Broken static asset "+url);
  }
  assert.ok(html.includes('href="/telluris/catalog/data/catalog.json"'));
 }
});
test("Research candidates cannot open unsupported scientific tools",()=>{
 const js=read("assets/catalog.js");
 assert.ok(js.includes('entry.category==="connected"'));
 assert.ok(js.includes('if(entry.category==="connected"){'));
 assert.ok(js.includes('else if(entry.category==="research")'));
 assert.ok(js.includes('textContent='));
 assert.ok(!js.includes('innerHTML'));
 assert.ok(js.includes('fetch("/telluris/catalog/data/catalog.json"'));
});
test("The team/Explorer pages and sitemap provide catalog navigation",()=>{
 for(const p of ["telluris/index.html","en/telluris/index.html","telluris/explore/index.html","en/telluris/explore/index.html"]){
  assert.ok(read(p).includes(p.startsWith("en/")?'/en/telluris/catalog/':'/telluris/catalog/'));
 }
 const map=read("sitemap.xml");
 assert.ok(map.includes("<loc>https://projecturiel.earth/telluris/catalog/</loc>"));
 assert.ok(map.includes("<loc>https://projecturiel.earth/en/telluris/catalog/</loc>"));
});

test("MODIS probe is visibly evidenced but not represented as a connected variable",()=>{
 const e=data.candidates.find(x=>x.id==="C23");
 assert.equal(e.implementation_status,"not_connected");
 assert.equal(e.source_evidence.status,"api_sample_verified");
 assert.ok(e.source_evidence.verification_url.includes("/actions/runs/43737483122"));
 const src=read("assets/catalog.js");
 assert.ok(src.includes("api_sample_verified"));
 assert.ok(src.includes('entry.category==="connected"'));
});

test("MODIS IGBP 2023 spatial QA is evidence only and not a connected variable",()=>{
 const e=data.candidates.find(x=>x.id==="C23");
 assert.equal(e.implementation_status,"not_connected");
 assert.equal(e.spatial_evidence.status,"one_date_spatial_qa_and_one_year_landcover_verified");
 assert.ok(e.spatial_evidence.verification_url.includes("EXP-003D-IGBP.md"));
 assert.ok(read("assets/catalog.js").includes("one_date_spatial_qa_and_one_year_landcover_verified"));
});

test("18 NASA POWER links target distinct and available explorer parameter IDs",()=>{
 const vars=JSON.parse(read("telluris/catalog/data/catalog.json"));
 assert.equal(vars.connected.length,18);
 const html=read("telluris/explore/index.html");
 const en=read("en/telluris/explore/index.html");
 for(const x of vars.connected){
  assert.ok(html.includes('value="'+x.id+'"'),"Missing Spanish selector "+x.id);
  assert.ok(en.includes('value="'+x.id+'"'),"Missing English selector "+x.id);
 }
 const js=read("assets/catalog.js");
 assert.ok(js.includes('encodeURIComponent(entry.id)'));
 assert.ok(js.includes('entry.integration_codes'));
});


test("USGS event dimensions are source-integrated without being mislabeled NASA POWER climate parameters",()=>{
 const quakeIds=["C31","C32","C33","C34"];
 assert.equal(data.connected.length,18);
 assert.equal(data.candidates.length,49);
 for(const id of quakeIds){
   const e=data.candidates.find(c=>c.id===id);
   assert.equal(e.implementation_status,"partial");
   assert.equal(e.event_integration.status,"event_api_connected");
   assert.equal(e.event_integration.type,"earthquakes");
   assert.match(e.event_integration.source_url,/earthquake\.usgs\.gov/);
   assert.ok(e.event_integration.fields.length>0);
 }
 for(const [id,type] of [["C22","floods"],["C29","wildfires"],
                           ["C36","volcanoes"],["C38","landslides"]]){
   const e=data.candidates.find(c=>c.id===id);
   assert.equal(e.implementation_status,"not_connected");
   assert.equal(e.related_event.type,type);
   assert.match(e.related_event.note_en,/not |not /i);
 }
 const js=read("assets/catalog.js");
 assert.ok(js.includes("entry.event_integration"));
 assert.ok(js.includes("entry.related_event"));
 assert.ok(js.includes('encodeURIComponent(entry.event_integration.type)'));
});
