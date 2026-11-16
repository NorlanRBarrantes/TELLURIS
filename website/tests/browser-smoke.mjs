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
  assert.equal(await home.locator("a.jg-action[href='/telluris/explore/']").count(),1);
  assert.equal(await home.locator('a[href="/about/"]').count()>0,true);
  assert.equal(await home.locator(".jg-slide").count(),6);
  assert.equal(await home.locator(".jg-slide.is-active").getAttribute("data-slide"),"intro");
  assert.equal(await home.locator("[data-slide-skip]").count(),1);
  await home.locator("[data-slide-skip]").click();
  assert.equal(await home.locator(".jg-slide.is-active").getAttribute("data-slide"),"explorer");
  assert.equal(await home.locator(".jg-slide.is-active a.jg-action").getAttribute("href"),"/telluris/explore/");
  await home.locator('[data-slide-to="0"]').click();
  assert.equal(await home.locator('[data-slide-prev]').isDisabled(),true);
  assert.equal(await home.locator('[data-slide-next]').isEnabled(),true);
  const extent=await home.evaluate(()=>({
    document:document.documentElement.scrollHeight,viewport:window.innerHeight
  }));
  assert.ok(extent.document<=extent.viewport+7,"Homepage must not be a vertical-scroll storytelling page: "+JSON.stringify(extent));
  await home.locator("[data-slide-next]").click();
  assert.equal(await home.locator(".jg-slide.is-active").getAttribute("data-slide"),"how");
  await home.keyboard.press("ArrowRight");
  assert.equal(await home.locator(".jg-slide.is-active").getAttribute("data-slide"),"method");
  await home.locator('[data-slide-to="3"]').click();
  assert.equal(await home.locator(".jg-slide.is-active").getAttribute("data-slide"),"capabilities");
  assert.ok(home.url().endsWith("#capabilities"));
  await home.locator('[data-slide-to="5"]').click();
  assert.equal(await home.locator(".jg-slide.is-active").getAttribute("data-slide"),"explorer");
  assert.equal(await home.locator('[data-slide-next]').isDisabled(),true);
  assert.equal(await home.locator(".jg-slide.is-active a.jg-action").getAttribute("href"),"/telluris/explore/");
  await home.locator('[data-slide-to="0"]').click();
  await noOverflow(home,"Spanish desktop landing");
  await home.screenshot({path:"browser-artifacts/telluris-home-1440.png",fullPage:true});
  await go(home,"/telluris/");
  assert.match(await home.locator("h1").innerText(),/TELLURIS/);
  assert.equal(await home.locator('link[rel="canonical"]').getAttribute("href"),
    "https://projecturiel.earth/");

  const about=await desktop.newPage();
  await go(about,"/about/");
  assert.match(await about.locator("h1").innerText(),/La curiosidad nos impulsa/i);
  assert.equal(await about.locator(".jg-card").count(),4);
  await go(about,"/en/about/");
  assert.match(await about.locator("h1").innerText(),/Curiosity drives us/i);

  const lab=await desktop.newPage();
  await go(lab,"/telluris/explore/");
  await lab.waitForFunction(()=>document.querySelector("#obs-main-variable").options.length>=18);
  assert.equal(await lab.locator("#globe-weather-mode").count(),0);
  assert.equal(await lab.locator("#globe-spin").count(),0);
  assert.equal(await lab.locator("#globe-stage").count(),1);
  assert.equal(await lab.locator("#detail-research").evaluate(el=>el.open),false);
  assert.equal(await lab.locator("#obs-other-place option[value=liberia]").count(),0,
    "With zone A Liberia, zone B Liberia must be absent/unselectable.");
  assert.equal(await lab.locator("#obs-other-place").inputValue(),"limon");
  // The four modes are distinct operational states, not decorative buttons.
  for(const [kind,two,one] of [
    ["one-one",false,true],["one-two",true,true],
    ["all-one",false,false],["all-two",true,false]
  ]){
    await lab.locator('[data-obs-mode="'+kind+'"]').click();
    assert.equal(await lab.locator('[data-obs-mode="'+kind+'"]').getAttribute("aria-pressed"),"true");
    assert.equal(await lab.locator("#obs-second-controls").isVisible(),two,kind+" B visibility");
    assert.equal(await lab.locator("#obs-main-variable").evaluate(el=>el.closest("label").hidden),!one,kind+" variable scope");
    assert.equal(await lab.locator("#obs-results").isVisible(),false,kind+" must clear prior results");
  }
  assert.equal(await lab.locator(".question-presets").count(),0);
  assert.equal(await lab.locator(".obs-prompt-list").count(),0);

  await lab.locator(".obs-primary-config summary").click();
  await lab.locator("#obs-main-place").selectOption("limon");
  await lab.waitForFunction(()=>document.querySelector("#obs-other-place").value==="liberia");
  assert.equal(await lab.locator("#obs-other-place option[value=limon]").count(),0,
    "With zone A Limón, zone B Limón must be absent/unselectable.");

  // Even custom coordinates cannot be used to compare a point to itself.
  await lab.locator("#obs-main-place").selectOption("custom");
  await lab.locator("#obs-main-lat").fill("10.63");
  await lab.locator("#obs-main-lat").dispatchEvent("change");
  await lab.locator("#obs-main-lon").fill("-85.44");
  await lab.locator("#obs-main-lon").dispatchEvent("change");
  assert.equal(await lab.locator("#obs-other-place option[value=liberia]").count(),0);
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
  // All-variables mode intentionally hides its irrelevant single-variable selector.
  assert.equal(await lab.locator("#obs-main-variable").isVisible(),false);
  await lab.locator(".obs-archive-advanced summary").click();
  await lab.locator("#obs-run-archive").click();
  await lab.locator("#obs-results").waitFor({state:"visible",timeout:15000});
  assert.equal(await lab.locator("#obs-rows tr").count(),18);
  assert.equal(await lab.locator("#obs-kpi-available").innerText(),"2");
  assert.equal(await lab.locator("#obs-kpi-unavailable").innerText(),"16");
  assert.equal(await lab.locator("#obs-chart polyline").count()>=1,true);
  await lab.locator(".obs-detail-link").click();
  assert.equal(await lab.locator("#detail-research").evaluate(el=>el.open),true);
  // In-browser event explorer is exercised with STRUCTURAL fixtures only;
  // original USGS/EONET live-source checks are in separate EXP-011 API CI.
  await lab.route("https://earthquake.usgs.gov/fdsnws/event/1/query?**",route=>route.fulfill({
    contentType:"application/geo+json",body:JSON.stringify({
      type:"FeatureCollection",features:[{
        type:"Feature",id:"us9000000",geometry:{type:"Point",coordinates:[-85.5,10.7,22]},
        properties:{mag:4.3,time:Date.UTC(2026,10,1),place:"Near Costa Rica",
          status:"reviewed",url:"https://earthquake.usgs.gov/earthquakes/eventpage/us9000000"}
      }]
    })
  }));
  await lab.locator("#events-type").selectOption("earthquakes");
  await lab.locator("#events-run").click();
  await lab.locator("#events-result").waitFor({state:"visible"});
  assert.equal(await lab.locator("#events-list tr").count(),1);
  assert.match(await lab.locator("#events-summary").innerText(),/USGS/);
  assert.equal((await lab.locator("#events-source-link").getAttribute("href")).startsWith("https://earthquake.usgs.gov/"),true);
  assert.ok((await lab.locator("#events-map circle").count())>=3);
  await lab.unroute("https://earthquake.usgs.gov/fdsnws/event/1/query?**");
  await lab.route("https://earthquake.usgs.gov/fdsnws/event/1/query?**",route=>
    route.fulfill({status:204,body:""}));
  await lab.locator("#events-run").click();
  await lab.locator("#events-result").waitFor({state:"visible"});
  assert.match(await lab.locator("#events-summary").innerText(),/0 eventos/);
  assert.match(await lab.locator("#events-list tr").first().innerText(),/No se recibieron eventos/);
  await lab.route("https://eonet.gsfc.nasa.gov/api/v3/events?**",route=>route.fulfill({
    contentType:"application/json",body:JSON.stringify({events:[{
      id:"EONET_3456",title:"Documented wildfire observation",
      categories:[{id:"wildfires"}],geometry:[{
        type:"Point",coordinates:[-85.61,10.5],date:"2026-10-30T10:00:00Z"
      }]
    }]})
  }));
  await lab.locator("#events-type").selectOption("wildfires");
  assert.equal(await lab.locator("#events-mag-field").isVisible(),false);
  assert.equal(await lab.locator("#events-type").inputValue(),"wildfires");
  assert.equal(await lab.locator("#events-result").isVisible(),false,"Changing sources clears old results");
  await lab.locator("#events-run").click();
  await lab.locator("#events-result").waitFor({state:"visible"});
  assert.match(await lab.locator("#events-list tr").first().innerText(),/Documented wildfire observation/);
  assert.match(await lab.locator("#events-summary").innerText(),/NASA EONET/);
  assert.ok((await lab.locator("#events-source-link").getAttribute("href")).startsWith("https://eonet.gsfc.nasa.gov/"));
  await noOverflow(lab,"Spanish desktop Explorer");

  const en=await desktop.newPage();
  await go(en,"/en/");
  assert.match(await en.locator("h1").innerText(),/TELLURIS/);
  await go(en,"/en/telluris/explore/");
  await en.waitForFunction(()=>document.querySelector("#obs-main-variable").options.length>=18);
  assert.equal(await en.locator("#natural-events").count(),1);
  assert.equal(await en.locator("#events-type option").count(),6);
  assert.equal(await en.locator("#obs-other-place option[value=liberia]").count(),0);

  const mobile=await contextAt(390,844);
  const mobileHome=await mobile.newPage();
  await go(mobileHome,"/");
  assert.equal(await mobileHome.locator(".jg-slide.is-active").getAttribute("data-slide"),"intro");
  assert.equal(await mobileHome.locator('[data-slide-to="4"]').isVisible(),true);
  await mobileHome.locator('[data-slide-to="4"]').click();
  assert.equal(await mobileHome.locator(".jg-slide.is-active").getAttribute("data-slide"),"rigor");
  await mobileHome.locator('[data-slide-to="0"]').click();
  await noOverflow(mobileHome,"Spanish mobile home");
  await mobileHome.screenshot({path:"browser-artifacts/telluris-home-390.png",fullPage:true});
  const mobileLab=await mobile.newPage();
  await go(mobileLab,"/telluris/explore/");
  await mobileLab.waitForFunction(()=>document.querySelector("#obs-main-variable").options.length>=18);
  assert.equal(await mobileLab.locator(".explorer-breadcrumb a").isVisible(),true);
  assert.equal(await mobileLab.locator(".explorer-breadcrumb a").getAttribute("href"),"/");
  await noOverflow(mobileLab,"Spanish mobile Explorer");
  await mobileLab.screenshot({path:"browser-artifacts/telluris-explorer-390.png",fullPage:true});
  assert.deepEqual(errors,[],"No unhandled page exceptions");
  console.log("EXP010_BROWSER_ACCEPTANCE_PASS: ES/EN desktop/mobile, coherent navigation, mutual exclusions, NASA archive and advanced disclosure.");
}finally{
  await browser.close();
}
