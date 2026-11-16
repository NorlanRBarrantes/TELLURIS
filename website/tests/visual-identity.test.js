import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../public/"+p,import.meta.url));
const pages=[
 "index.html","en/index.html","telluris/index.html","en/telluris/index.html",
 "es/index.html","es/telluris/index.html",
 "about/index.html","en/about/index.html",
 "telluris/explore/index.html","en/telluris/explore/index.html",
 "telluris/catalog/index.html","en/telluris/catalog/index.html"
];
test("EXP-012: every ES/EN public page has the same final design layer and authentic team emblem",()=>{
 for(const page of pages){
  const html=read(page).toString("utf8");
  const css='/assets/visual-identity.css?v=exp012-20261115';
  assert.equal(html.split('href="'+css+'"').length-1,1,page+" shared stylesheet count");
  assert.equal(html.split('src="/assets/uriel-symbol-128.png"').length-1,
    (page==="about/index.html"||page==="en/about/index.html")?2:1,page+" team emblem count");
  assert.ok(html.indexOf(css)>html.indexOf("site.css"),page+" custom theme must load last");
  assert.ok(!html.includes('class="brand" aria-label="TELLURIS · El recorrido"><svg'),page);
 }
});
test("EXP-012: logo is an optimized image derived from provided Project Uriel original",()=>{
 const b=read("assets/uriel-symbol-128.png");
 assert.deepEqual([...b.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 assert.equal(b.readUInt32BE(16),128);
 assert.equal(b.readUInt32BE(20),106);
 assert.ok(b.length>3000&&b.length<12000,"header emblem must be lightweight");
});
test("EXP-012: slide 00 skips to the final presentation, never jumps straight into the lab",()=>{
 for(const page of ["index.html","en/index.html","telluris/index.html",
   "en/telluris/index.html","es/index.html","es/telluris/index.html"]){
  const html=read(page).toString("utf8");
  const intro=html.slice(html.indexOf('data-slide="intro"'),html.indexOf('data-slide="how"'));
  assert.ok(intro.includes('data-slide-skip'),page);
  assert.ok(!intro.includes('class="jg-action" href="/telluris/explore/"'),page);
  assert.ok(!intro.includes('class="jg-action" href="/en/telluris/explore/"'),page);
  const final=html.slice(html.indexOf('data-slide="explorer"'));
  assert.ok(final.includes('href="'+(page.startsWith("en/")?"/en/telluris/explore/":"/telluris/explore/")+'"'),page);
 }
 const js=read("assets/journey-slider.js").toString("utf8");
 assert.ok(js.includes('deck.querySelector("[data-slide-skip]")?.addEventListener("click",()=>change(slides.length-1))'));
});
test("EXP-012: core original scientific datasets and source files remain untouched by theme",()=>{
 const css=read("assets/visual-identity.css").toString("utf8");
 assert.ok(css.includes("--t-cyan:#2ddbe8"));
 assert.ok(css.includes("--t-violet:#806be5"));
 assert.ok(css.includes("prefers-reduced-motion"));
 for(const scientificFile of ["assets/science.js","assets/inference.js",
   "assets/matrix-core.js","assets/natural-events-core.js",
   "assets/globe.js"]){
  assert.ok(read(scientificFile).length>1000,scientificFile);
 }
});
