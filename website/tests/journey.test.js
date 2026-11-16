import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(fileURLToPath(new URL("../public/",import.meta.url)));
const read=route=>readFileSync(path.join(root,route),"utf8");
const landing=[
 ["index.html","/","es","/telluris/explore/"],
 ["en/index.html","/en/","en","/en/telluris/explore/"],
 ["telluris/index.html","/","es","/telluris/explore/"],
 ["en/telluris/index.html","/en/","en","/en/telluris/explore/"],
 ["es/index.html","/","es","/telluris/explore/"],
 ["es/telluris/index.html","/","es","/telluris/explore/"]
];
test("Product homepage replaces the team-first hero at all historic entries",()=>{
 for(const [file,canonical,lang,cta] of landing){
   const html=read(file);
   assert.match(html,/<h1[^>]*>TELLURIS/);
   assert.match(html,/data-page="telluris-journey"/);
   assert.ok(html.includes('rel="canonical" href="https://projecturiel.earth'+canonical+'"'),file);
   assert.ok(html.includes('href="'+cta+'"'),file+" open Explorer link missing");
   assert.ok(html.includes('href="'+(lang==="es"?"/about/":"/en/about/")+'"'),file+" team link missing");
   for(const anchor of ['id="how"','id="method"','id="capabilities"','id="variables"','id="rigor"','id="explorer"'])
     assert.ok(html.includes(anchor),file+" missing journey stage "+anchor);
   assert.equal((html.match(/class="jg-step-label"/g)||[]).length,4);
   assert.ok(html.includes("NASA POWER"));
   assert.ok(html.includes("NASA GIBS"));
   assert.ok(html.includes("Theil–Sen"));
   assert.ok(html.includes("NASA Space Apps"));
   assert.ok(html.includes("18 "));
   assert.ok(!html.includes("11 local tests passed"));
   assert.ok(!html.includes("Sin hallazgos históricos verificados"));
   assert.ok(!html.includes('id="research-form"'),"Landing should not contain a competing demo form");
 }
});
test("About Project Uriel is independent and does not usurp the product",()=>{
 for(const [file,canonical,lang] of [
   ["about/index.html","/about/","es"],["en/about/index.html","/en/about/","en"]
 ]){
   const html=read(file);
   assert.ok(html.includes('rel="canonical" href="https://projecturiel.earth'+canonical+'"'));
   assert.ok(html.includes('data-page="project-uriel-about"'));
   assert.ok(html.includes("PROJECT URIEL"));
   assert.ok(html.includes("TELLURIS"));
   assert.ok(html.includes('href="'+(lang==="es"?"/":"/en/")+'"'));
   assert.ok(html.includes("Software")||html.includes("SOFTWARE"));
   assert.ok(html.includes("NASA"));
   assert.ok(html.includes("GitHub"));
 }
});
test("All public internal URLs from primary pages resolve to known static routes",()=>{
 const pages=["index.html","en/index.html","about/index.html","en/about/index.html",
  "telluris/index.html","en/telluris/index.html",
  "telluris/explore/index.html","en/telluris/explore/index.html",
  "telluris/catalog/index.html","en/telluris/catalog/index.html"];
 const errors=[];
 for(const page of pages){
   const html=read(page);
   for(const match of html.matchAll(/\b(?:href|src)="(\/[^"]+)"/g)){
     const ref=match[1].split("#")[0].split("?")[0];
     if(!ref)continue;
     const target=path.join(root,ref.slice(1));
     if(!existsSync(target)&&!existsSync(path.join(target,"index.html")))errors.push(page+" -> "+ref);
   }
 }
 assert.deepEqual(errors,[]);
});
test("Only the 8 actual canonical URLs are in the sitemap",()=>{
 const sitemap=read("sitemap.xml");
 for(const route of ["/","/en/","/about/","/en/about/",
 "/telluris/explore/","/en/telluris/explore/",
 "/telluris/catalog/","/en/telluris/catalog/"]){
   assert.ok(sitemap.includes("https://projecturiel.earth"+route+"</loc>"));
 }
 assert.equal((sitemap.match(/<loc>/g)||[]).length,8);
 assert.ok(!sitemap.includes("<loc>https://projecturiel.earth/telluris/</loc>"));
});
test("Explorer remains NASA scientific tool, with advanced methods preserved but not prominent",()=>{
 for(const page of ["telluris/explore/index.html","en/telluris/explore/index.html"]){
   const html=read(page);
   assert.ok(html.includes('id="observatory"'));
   assert.ok(html.includes('id="detail-research" class="lab-advanced"'));
   assert.ok(html.includes('id="print-report"'));
   assert.ok(html.includes('id="download-csv"'));
   assert.ok(html.includes('id="gpm-file"'));
   assert.ok(html.includes('id="globe-stage"'));
   assert.ok(!html.includes('id="globe-spin"'));
   assert.ok(!html.includes('id="globe-weather-canvas"'));
   assert.ok(!html.includes('class="question-presets"'));
   assert.ok(html.includes('href="'+(page.startsWith("en/")?"/en/about/":"/about/")+'"'));
 }
});
