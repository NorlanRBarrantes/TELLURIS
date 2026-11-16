import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 SLIDE_IDS,slideIndexFromHash,nextSlideIndex,swipeDirection
} from "../public/assets/journey-slider.js";
test("Exactly six presentations retain 00 intro, 01 problem, 02 method, 03 features, 04 rigor, 05 explorer",()=>{
 assert.deepEqual(SLIDE_IDS,["intro","how","method","capabilities","rigor","explorer"]);
 for(const lang of ["","en/","telluris/","en/telluris/","es/","es/telluris/"]){
  const html=readFileSync(new URL("../public/"+lang+"index.html",import.meta.url),"utf8");
  assert.equal((html.match(/class="jg-slide(?: is-active)?"/g)||[]).length,6,lang);
  assert.equal((html.match(/data-slide-to="/g)||[]).length,6,lang);
  assert.equal((html.match(/data-slide-next/g)||[]).length,1,lang);
  assert.equal((html.match(/data-slide-prev/g)||[]).length,1,lang);
  assert.ok(html.includes('class="jg-deck-track"'));
  assert.ok(html.includes("journey-slider.js?v=exp011-slides-20261115"));
  assert.ok(html.includes("jg-slide-nav"));
  assert.ok(html.includes("data-slide-skip"),lang);
  assert.ok(html.includes("/assets/visual-identity.css?v=exp012-20261115"),lang);
  assert.ok(html.includes("/assets/uriel-symbol-128.png"),lang);
  assert.ok(!html.includes('class="jg-cta-row"><a class="jg-action"'),lang);
 }
});
test("URL anchors and navigation stay within boundaries",()=>{
 assert.equal(slideIndexFromHash(""),0);
 assert.equal(slideIndexFromHash("#how"),1);
 assert.equal(slideIndexFromHash("#method"),2);
 assert.equal(slideIndexFromHash("#variables"),3);
 assert.equal(slideIndexFromHash("#challenge"),4);
 assert.equal(slideIndexFromHash("#explorer"),5);
 assert.equal(slideIndexFromHash("#unknown"),0);
 assert.equal(nextSlideIndex(0,-1),0);
 assert.equal(nextSlideIndex(5,1),5);
 assert.equal(nextSlideIndex(2,1),3);
 assert.equal(swipeDirection(-145,12),1);
 assert.equal(swipeDirection(145,12),-1);
 assert.equal(swipeDirection(15,180),0);
 assert.equal(swipeDirection(-60,98),0);
});
test("No autoplay, keyboard focus traps or fake NASA data in the slider",()=>{
 const script=readFileSync(new URL("../public/assets/journey-slider.js",import.meta.url),"utf8");
 assert.ok(script.includes('event.key==="ArrowRight"'));
 assert.ok(script.includes('event.key==="ArrowLeft"'));
 assert.ok(script.includes("touchstart"));
 assert.ok(script.includes("touchend"));
 assert.ok(script.includes('setAttribute("inert","")'));
 assert.ok(!script.includes("setInterval("));
});
