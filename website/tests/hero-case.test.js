import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {STORY,checkedAnnualSeries,plotPoints} from "../public/assets/hero-case.js";
const root=new URL("../public/",import.meta.url);
const source=JSON.parse(readFileSync(new URL("telluris/explore/data/exp001-annual.json",root),"utf8"));
test("EXP-016 uses exactly 41 annual NASA model-grid observations for each location",()=>{
 const series=checkedAnnualSeries(source);
 assert.equal(series.liberia.length,41);assert.equal(series.limon.length,41);
 assert.equal(series.liberia[0].year,1985);assert.equal(series.limon.at(-1).year,2025);
 assert.equal(series.liberia.at(-1).value,27.584575);
 assert.equal(series.limon[0].value,23.777397);
 for(const key of ["liberia","limon"]){
  const pts=plotPoints(series[key],23,29).split(" ");
  assert.equal(pts.length,41);
  assert.ok(pts.every(p=>/^\d+\.\d{2},\d+\.\d{2}$/.test(p)));
 }
});
test("EXP-016 rejects wrong version, incomplete and invented measurements",()=>{
 assert.throws(()=>checkedAnnualSeries({...source,schema:"fake"}));
 const incomplete=structuredClone(source);incomplete.locations.limon.series.pop();
 assert.throws(()=>checkedAnnualSeries(incomplete));
 const fake=structuredClone(source);fake.locations.liberia.series[9][1]=Number.NaN;
 assert.throws(()=>checkedAnnualSeries(fake));
});
test("EXP-016 story is accurately bilingual and separates proven science from future possibilities",()=>{
 for(const lang of ["es","en"]){
  assert.equal(STORY[lang].length,3);
  assert.match(STORY[lang][1].body,/1985.*2025/);
  assert.match(STORY[lang][1].body,/Liberia/);
  assert.match(STORY[lang][1].body,/Lim[oó]n/);
  assert.match(STORY[lang][2].body,lang==="en"?/future possibilities/:/posibilidades futuras/);
 }
});
test("EXP-016 appears on all six entrypoint aliases, without a new video",()=>{
 const routes=["","en/","telluris/","en/telluris/","es/","es/telluris/"];
 for(const route of routes){
  const h=readFileSync(new URL(route+"index.html",root),"utf8");
  assert.equal((h.match(/data-case-story/g)||[]).length,1,route);
  assert.equal((h.match(/data-case-step="/g)||[]).length,3,route);
  assert.ok(h.includes('data-case-chart'),route);
  assert.ok(h.includes('data-slide-skip'),route);
  assert.ok(h.includes('hero-case.js?v=exp016'),route);
  assert.ok(h.includes('hero-case.css?v=exp016'),route);
  assert.ok(!h.includes('autoplay'),route);
  assert.ok(h.includes("NASA POWER")&&h.includes("1985"),route);
 }
});
