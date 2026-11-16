/* EXP-010 browser UX acceptance test (real Chromium).
 * Runs against a localhost mirror of the fully assembled site.
 * External NASA images and Three.js CDN are deliberately blocked to check
 * the expected graceful source-unavailable fallback; original-source WMS
 * and scientific API probes are separately verified in GitHub Actions.
 */
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdir} from "node:fs/promises";

const base="http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true,args:["--disable-gpu"]});
await mkdir("browser-artifacts",{recursive:true});
async function contextAt(width,height){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  // NASA/image/CDN outages must never break science controls.
  await context.route("https://cdn.jsdelivr.net/**",route=>route.abort());
  await context.route("https://gibs.earthdata.nasa.gov/**",route=>route.abort());
  return context;
}
const errors=[];
async function go(page,url){
  page.on("pageerror",e=>errors.push(url+": "+e.message));
  const response=await page.goto(base+url,{waitUntil:"domcontentloaded"});
  assert.equal(response.status(),200,url);
  await page.waitForLoadState("networkidle",{timeout:14000}).catch(()=>{});
}
async function noOverflow(page,label){
  const x=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    document:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert.ok(x.document<=x.viewport+6,label+" overflow "+JSON.stringify(x));
}
try{
  // Spanish product-first landing, no duplicate home funnel.
  const desktop=await contextAt(1440,900);
  const home=await desktop.newPage();
  await go(home,"/");
  assert.match(await home.locator("h1").innerText(),/TELLURIS/);
  assert.equal(await home.locator(".jg-section .jg-step-label").count(),4);
  assert.equal(await home.locator("a.jg-action[href='/telluris/explore/']").count(),2);
  assert.equal(await home.locator('a[href="/about/"]').count()>0,true);
  await noOverflow(home,"Spanish desktop landing");
  await home.screenshot({path:"browser-artifacts/telluris-home-1440.png",fullPage:true});
  await go(home,"/telluris/");
  assert.match(await home.locator("h1").innerText(),/TELLURIS/);
  assert.equal(await home.locator('link[rel="canonical"]').getAttribute("href"),
    "https://projecturiel.earth/");

  const about=await desktop.newPage();
  await go(about,"/about/");
  assert.match(await about.locator("h1").innerText(),/La curiosidad nos impulsa/);
  assert.equal(await about.locator(".jg-card").count(),4);
  await go(about,"/en/about/");
  assert.match(await about.locator("h1").innerText(),/Curiosity drives us/);

  const lab=await desktop.newPage();
  await go(lab,"/telluris/explore/");
  await lab.waitForFunction(()=>document.querySelector("#obs-main-variable").options.length>=18);
  assert.equal(await lab.locator("#globe-weather-mode").count(),0);
  assert.equal(await lab.locator("#globe-spin").count(),0);
  assert.equal(await lab.locator("#globe-stage").count(),1);
  assert.equal(await lab.locator("#detail-research").evaluate(el=>el.open),false);
  assert.equal(await lab.locator("#obs-other-place option[value=liberia]").evaluate(e=>e.disabled&&e.hidden),true,
    "With zone A Liberia, zone B Liberia must be absent/unselectable.");
  assert.equal(await lab.locator("#obs-other-place").inputValue(),"limon");

  await lab.locator(".obs-primary-config summary").click();
  await lab.locator("#obs-main-place").selectOption("limon");
  await lab.waitForFunction(()=>document.querySelector("#obs-other-place").value==="liberia");
  assert.equal(await lab.locator("#obs-other-place option[value=limon]").evaluate(e=>e.disabled&&e.hidden),true,
    "With zone A Limón, zone B Limón must be absent/unselectable.");

  // Even custom coordinates cannot be used to compare a point to itself.
  await lab.locator("#obs-main-place").selectOption("custom");
  await lab.locator("#obs-main-lat").fill("10.63");
  await lab.locator("#obs-main-lat").dispatchEvent("change");
  await lab.locator("#obs-main-lon").fill("-85.44");
  await lab.locator("#obs-main-lon").dispatchEvent("change");
  assert.equal(await lab.locator("#obs-other-place option[value=liberia]").evaluate(e=>e.disabled),true);
  await lab.locator("#obs-other-place").selectOption("custom");
  await lab.locator("#obs-other-lat").fill("10.63");
  await lab.locator("#obs-other-lat").dispatchEvent("change");
  await lab.locator("#obs-other-lon").fill("-85.44");
  await lab.locator("#obs-other-lon").dispatchEvent("change");
  await lab.locator("#obs-run-live").click();
  assert.match(await lab.locator("#obs-status").innerText(),/dos coordenadas distintas/);

  // Full archived matrix: original two source variables, sixteen clearly unavailable.
  await lab.locator("#obs-main-place").selectOption("liberia");
  await lab.locator("#obs-other-place").selectOption("limon");
  await lab.locator("#obs-main-variable").selectOption("T2M");
  await lab.locator(".obs-archive-advanced summary").click();
  await lab.locator("#obs-run-archive").click();
  await lab.locator("#obs-results").waitFor({state:"visible",timeout:15000});
  assert.equal(await lab.locator("#obs-rows tr").count(),18);
  assert.equal(await lab.locator("#obs-kpi-available").innerText(),"2");
  assert.equal(await lab.locator("#obs-kpi-unavailable").innerText(),"16");
  assert.equal(await lab.locator("#obs-chart polyline").count()>=1,true);
  await lab.locator(".obs-detail-link").click();
  assert.equal(await lab.locator("#detail-research").evaluate(el=>el.open),true);
  await noOverflow(lab,"Spanish desktop Explorer");

  const en=await desktop.newPage();
  await go(en,"/en/");
  assert.match(await en.locator("h1").innerText(),/TELLURIS/);
  await go(en,"/en/telluris/explore/");
  await en.waitForFunction(()=>document.querySelector("#obs-main-variable").options.length>=18);
  assert.equal(await en.locator("#obs-other-place option[value=liberia]").evaluate(e=>e.disabled&&e.hidden),true);

  const mobile=await contextAt(390,844);
  const mobileHome=await mobile.newPage();
  await go(mobileHome,"/");
  await noOverflow(mobileHome,"Spanish mobile home");
  await mobileHome.screenshot({path:"browser-artifacts/telluris-home-390.png",fullPage:true});
  const mobileLab=await mobile.newPage();
  await go(mobileLab,"/telluris/explore/");
  await mobileLab.waitForFunction(()=>document.querySelector("#obs-main-variable").options.length>=18);
  await noOverflow(mobileLab,"Spanish mobile Explorer");
  await mobileLab.screenshot({path:"browser-artifacts/telluris-explorer-390.png",fullPage:true});
  assert.deepEqual(errors,[],"No unhandled page exceptions");
  console.log("EXP010_BROWSER_ACCEPTANCE_PASS: ES/EN desktop/mobile, coherent navigation, mutual exclusions, NASA archive and advanced disclosure.");
}finally{
  await browser.close();
}
