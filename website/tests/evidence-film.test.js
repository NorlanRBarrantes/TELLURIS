import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FILM_SRC,initEvidenceFilm} from "../public/assets/evidence-film.js";
const root=new URL("../public/",import.meta.url);

test("EXP-017 uses a stable same-origin video asset and never autoplay on page load",()=>{
 assert.equal(FILM_SRC,"/assets/telluris-evidence-film-115x.mp4");
 const script=readFileSync(new URL("assets/evidence-film.js",root),"utf8");
 assert.match(script,/method:"HEAD"/);
 assert.match(script,/trigger.hidden=false/);
 assert.doesNotMatch(script,/video\.autoplay\s*=/);
});
test("EXP-017 is opt-in and bilingual on six landing entrypoints",()=>{
 for(const route of ["","en/","telluris/","en/telluris/","es/","es/telluris/"]){
  const html=readFileSync(new URL(route+"index.html",root),"utf8");
  assert.equal((html.match(/data-film-open/g)||[]).length,1,route);
  assert.equal((html.match(/data-film-dialog/g)||[]).length,1,route);
  assert.ok(html.includes("data-film-open hidden"),route);
  assert.ok(html.includes('data-film-video controls playsinline preload="none"'),route);
  assert.ok(html.includes("evidence-film.js?v=exp017"),route);
  assert.ok(html.includes("evidence-film.css?v=exp017"),route);
  assert.ok(!html.includes("<video autoplay"),route);
 }
});
test("EXP-017 does not interfere with slide deck shortcuts while dialog open",()=>{
 const script=readFileSync(new URL("assets/journey-slider.js",root),"utf8");
 assert.match(script,/dialog\[open\]/);
});
