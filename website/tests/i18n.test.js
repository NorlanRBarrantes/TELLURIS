import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";

const root=path.resolve(fileURLToPath(new URL("../public/",import.meta.url)));
const read=rel=>readFileSync(path.join(root,rel),"utf8");
const pages=[
 ["index.html","es","/","/","/en/"],
 ["telluris/index.html","es","/","/","/en/"],
 ["telluris/explore/index.html","es","/telluris/explore/","/telluris/explore/","/en/telluris/explore/"],
 ["en/index.html","en","/en/","/","/en/"],
 ["en/telluris/index.html","en","/en/","/","/en/"],
 ["en/telluris/explore/index.html","en","/en/telluris/explore/","/telluris/explore/","/en/telluris/explore/"],
 ["about/index.html","es","/about/","/about/","/en/about/"],
 ["en/about/index.html","en","/en/about/","/about/","/en/about/"]
];
for(const [file,lang,route,es,en] of pages){
 test("Language, canonical URL and navigation: "+route,()=>{
  const h=read(file);
  assert.ok(h.includes('<html lang="'+lang+'"'));
  assert.ok(h.includes('<link rel="canonical" href="https://projecturiel.earth'+route+'">'));
  assert.ok(h.includes('hreflang="es-CR" href="https://projecturiel.earth'+es+'"'));
  assert.ok(h.includes('hreflang="en" href="https://projecturiel.earth'+en+'"'));
  assert.ok(h.includes('href="'+es+'" lang="es"'));
  assert.ok(h.includes('href="'+en+'" lang="en"'));
  assert.ok(h.includes("language-switch"));
 });
 test("Local CSS, scripts and icons are resolvable: "+route,()=>{
  const h=read(file),dir=path.dirname(path.join(root,file));
  const refs=[...h.matchAll(/(?:href|src)="([^"]+\.(?:css|js|svg)(?:\?[^"]*)?)"/g)].map(x=>x[1]);
  assert.ok(refs.length >= 3);
  for(const ref of refs) {
   if(ref.startsWith("https://")) continue;
   const asset=ref.split("?")[0];
   const local=asset.startsWith("/")?path.join(root,asset.slice(1)):path.resolve(dir,asset);
   assert.ok(existsSync(local),file+" broken asset: "+ref);
  }
 });
}
test("Previously published /es/ pages remain Spanish and canonicalized",()=>{
 for(const [file,canonical] of [["es/index.html","/"],["es/telluris/index.html","/"]]){
  const html=read(file);
  assert.ok(html.includes('<html lang="es">'));
  assert.ok(html.includes('<link rel="canonical" href="https://projecturiel.earth'+canonical+'">'));
  assert.ok(html.includes("language-switch"));
 }
});
test("Spanish explorer labels are actually translated",()=>{
 const s=read("telluris/explore/index.html");
 for(const phrase of ["Define la pregunta","Señal histórica","Consultar datos NASA en vivo","Lo que los datos no demuestran","Precipitación anual","Valor p de Mann"]) {
  assert.ok(s.includes(phrase),"Missing Spanish phrase: "+phrase);
 }
 const en=read("en/telluris/explore/index.html");
 assert.ok(en.includes("Follow the evidence."));
 assert.ok(en.includes("Request live NASA data"));
});
test("Dynamic analysis feedback is localized and shares the archived NASA data",()=>{
 const js=read("assets/explorer.js");
 for(const phrase of ["Fuente cargada.","Tendencia calculada","No se pudo consultar NASA","Correlación residual","spanishPhrases","uiLanguage"])assert.ok(js.includes(phrase));
 assert.ok(js.includes('fetch("/telluris/explore/data/exp001-annual.json"'));
 assert.ok(existsSync(path.join(root,"telluris/explore/data/exp001-annual.json")));
});
test("Sitemap indexes 8 canonical TELLURIS / team / scientific URLs",()=>{
 const map=read("sitemap.xml");
 const routes=["/","/en/","/about/","/en/about/",
  "/telluris/explore/","/en/telluris/explore/",
  "/telluris/catalog/","/en/telluris/catalog/"];
 for(const route of routes)assert.ok(map.includes('<loc>https://projecturiel.earth'+route+'</loc>'));
 assert.equal((map.match(/<loc>/g)||[]).length,routes.length);
 assert.ok(!map.includes("<loc>https://projecturiel.earth/telluris/</loc>"));
 assert.ok(!map.includes("<loc>https://projecturiel.earth/es/</loc>"));
});
