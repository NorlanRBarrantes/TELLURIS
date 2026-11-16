import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

test("EXP-010 removes wind, rain and automatic globe rotation from both languages",()=>{
 const globe=readFileSync(new URL("../public/assets/globe.js",import.meta.url),"utf8");
 const exp=readFileSync(new URL("../public/assets/explorer.js",import.meta.url),"utf8");
 assert.ok(!globe.includes("initWeatherCanvas"));
 assert.ok(!globe.includes("weather.frame"));
 assert.ok(!globe.includes("globe-spin"));
 assert.ok(!exp.includes("telluris:source-data"));
 for(const lang of ["","en/"]){
   const html=readFileSync(new URL("../public/"+lang+"telluris/explore/index.html",import.meta.url),"utf8");
   for(const forbidden of ["globe-weather-canvas","globe-weather-mode","globe-spin","question-presets","data-obs-prompt","data-obs-term","obs-drilldown"])
     assert.ok(!html.includes(forbidden),lang+forbidden);
   for(const required of ["globe-stage","globe-hover-tooltip","globe-zoom-in","globe-reset",
     "observatory","obs-run-live","obs-run-archive","obs-second-controls",
     "obs-main-place","obs-main-variable","obs-main-lat","obs-main-lon",
     "obs-main-start","obs-main-end","obs-export-csv","obs-export-json","obs-results","obs-chart","obs-question-form"])
     assert.ok(html.includes('id="'+required+'"'),lang+required);
   assert.ok(html.indexOf('class="globe-card globe-card-v2"')<html.indexOf('class="explore-layout"'));
   assert.ok(html.includes("globe.js?v=exp010-static-20261115"));
 }
});

test("Research controls retain original source, export, and synced form",()=>{
 const script=readFileSync(new URL("../public/assets/observatory.js",import.meta.url),"utf8");
 assert.match(script,/primary\.variable\.append\(child\.cloneNode\(true\)\)/);
 assert.match(script,/form\[key\]\.dispatchEvent\(new Event\("change"/);
 assert.match(script,/form\.place\.dispatchEvent\(new Event\("change"/);
 assert.match(script,/buildMatrixEvidence\(current\)/);
 assert.match(script,/matrixCSV\(report\)/);
 assert.match(script,/second\.place\.replaceChildren/);
 assert.match(script,/secondaryOptionCatalog/);
});
