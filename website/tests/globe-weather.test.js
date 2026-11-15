import test from "node:test";
import assert from "node:assert/strict";
import {weatherSource,weatherParticleCount,weatherDescription}
 from "../public/assets/globe-weather.js";

test("Rain animation is source gated to NASA annual PRECTOTCORR not current weather",()=>{
 const raw={variable:"PRECTOTCORR",year:2025,value:1850,
   unit:"mm / year",origin:"NASA POWER LIVE JSON"};
 const rain=weatherSource(raw,"rain");
 assert.equal(rain.mode,"rain");
 assert.equal(weatherSource(raw,"wind"),null);
 assert.equal(weatherSource({...raw,unit:"mm/day"},"rain"),null);
 assert.equal(weatherSource({...raw,value:NaN},"rain"),null);
 assert.equal(weatherSource({...raw,year:2027},"rain"),null);
 assert.equal(weatherSource({...raw,origin:""},"rain"),null);
 assert.ok(weatherParticleCount(rain)>0);
 assert.equal(weatherParticleCount(null),0);
 assert.match(weatherDescription(rain,"rain","en"),/NOT a real weather field/);
 assert.match(weatherDescription(rain,"rain","es"),/NO campo meteorológico real/);
});
test("Wind animation cannot invent direction from scalar annual WS10M",()=>{
 const wind=weatherSource({variable:"WS10M",year:2024,value:3.5,
   unit:"m/s",origin:"ARCHIVED NASA POWER"},"wind");
 assert.equal(wind.value,3.5);
 assert.ok(weatherParticleCount(wind)>0);
 assert.match(weatherDescription(wind,"wind","en"),/no wind direction/);
 assert.match(weatherDescription(null,"wind","es"),/Carga primero/);
 assert.match(weatherDescription(null,"none","es"),/desactivadas/);
});
test("Weather particle intensity is bounded for extreme but finite source inputs",()=>{
 const rain=weatherSource({variable:"PRECTOTCORR",year:2025,value:10000000,
   unit:"mm / year",origin:"NASA POWER"},"rain");
 const wind=weatherSource({variable:"WS10M",year:2025,value:500,
   unit:"m/s",origin:"NASA POWER"},"wind");
 assert.equal(weatherParticleCount(rain),90);
 assert.equal(weatherParticleCount(wind),84);
});
test("The full-width globe and research lab exist in both languages",async()=>{
 const {readFileSync}=await import("node:fs");
 for(const lang of ["","en/"]){
   const page=readFileSync(new URL("../public/"+lang+"telluris/explore/index.html",import.meta.url),"utf8");
   for(const id of ["globe-weather-mode","globe-weather-canvas","globe-hover-tooltip",
     "observatory","obs-run-live","obs-run-archive","obs-second-controls",
     "obs-main-place","obs-main-variable","obs-main-lat","obs-main-lon",
     "obs-main-start","obs-main-end","obs-export-csv","obs-export-json",
     "obs-results","obs-chart","obs-question-form","obs-glossary-answer"])
      assert.ok(page.includes('id="'+id+'"'),lang+id);
   assert.ok(page.indexOf('class="globe-card globe-card-v2"') < page.indexOf('class="explore-layout"'));
   assert.ok(page.indexOf('id="observatory"') < page.indexOf('class="explore-layout"'));
   assert.equal((page.match(/id="globe-stage"/g)||[]).length,1);
   assert.ok(page.includes("observatory.css?v=exp009-20261115"));
 }
});

test("Research primary controls update the same scientific form as the globe",async()=>{
 const {readFileSync}=await import("node:fs");
 const script=readFileSync(new URL("../public/assets/observatory.js",import.meta.url),"utf8");
 assert.match(script,/primary\.variable\.append\(child\.cloneNode\(true\)\)/);
 assert.match(script,/form\[key\]\.dispatchEvent\(new Event\("change"/);
 assert.match(script,/form\.place\.dispatchEvent\(new Event\("change"/);
 assert.match(script,/buildMatrixEvidence\(current\)/);
 assert.match(script,/matrixCSV\(report\)/);
});
