import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  GIBS_WMS,GLOBE_LAYERS,DEFAULT_GIBS_DATE,
  validateGlobeDate,gibsWmsUrl,gibsTextureUV,sphereUVForLongitude,
  GIBS_TEXTURE_U_OFFSET,gibsLayerDisclosure
} from "../public/assets/globe-layers.js";

test("NASA WMS 1.1.1 uses correct EPSG:4326 longitude-first bounds",()=>{
  const u=new URL(gibsWmsUrl("marble",{width:1024}));
  assert.equal(u.origin,"https://gibs.earthdata.nasa.gov");
  assert.equal(u.pathname,"/wms/epsg4326/best/wms.cgi");
  assert.equal(u.searchParams.get("VERSION"),"1.1.1");
  assert.equal(u.searchParams.get("REQUEST"),"GetMap");
  assert.equal(u.searchParams.get("SRS"),"EPSG:4326");
  assert.equal(u.searchParams.get("BBOX"),"-180,-90,180,90");
  assert.equal(u.searchParams.get("WIDTH"),"1024");
  assert.equal(u.searchParams.get("HEIGHT"),"512");
  assert.equal(u.searchParams.get("LAYERS"),"BlueMarble_NextGeneration");
  assert.equal(u.searchParams.get("TIME"),null);
  assert.equal(GIBS_WMS,u.origin+u.pathname);
});

test("MODIS scientific layer requests transparent original NASA visualization",()=>{
  const u=new URL(gibsWmsUrl("lst",{date:DEFAULT_GIBS_DATE,width:1536}));
  assert.equal(u.searchParams.get("LAYERS"),"MODIS_Terra_L3_Land_Surface_Temp_Daily_Day");
  assert.equal(u.searchParams.get("FORMAT"),"image/png");
  assert.equal(u.searchParams.get("TRANSPARENT"),"TRUE");
  assert.equal(u.searchParams.get("TIME"),"2024-07-15");
  assert.equal(u.searchParams.get("HEIGHT"),"768");
  assert.equal(GLOBE_LAYERS.lst.nativeUnit,"K");
  assert.equal(GLOBE_LAYERS.lst.visualPixelValueReliable,false);
});

test("MODIS true color identifies itself as imagery not physical trend field",()=>{
  const u=new URL(gibsWmsUrl("truecolor",{date:"2024-08-06"}));
  assert.equal(u.searchParams.get("LAYERS"),"MODIS_Terra_CorrectedReflectance_TrueColor");
  assert.equal(u.searchParams.get("FORMAT"),"image/jpeg");
  assert.equal(GLOBE_LAYERS.truecolor.type,"imagery");
  assert.match(gibsLayerDisclosure("truecolor","en","2024-08-06"),/not a climate trend/);
});

test("Reject unknown layer, impossible date and arbitrarily large images",()=>{
  assert.throws(()=>gibsWmsUrl("untrusted"),/Unknown/);
  assert.throws(()=>gibsWmsUrl("marble",{width:3200}),/Invalid/);
  assert.throws(()=>validateGlobeDate("2024-02-30"),/Invalid/);
  assert.throws(()=>validateGlobeDate("2024-02-29&OTHER=bad"),/Date must/);
  assert.throws(()=>validateGlobeDate("1999-01-01"),/outside/);
  assert.throws(()=>validateGlobeDate("2999-01-01"),/outside/);
});

test("NASA WMS texture matches Three.js sphere geometry at known longitude anchors",()=>{
  // Three r170: u=0 is longitude -90°, u=.25 Greenwich, u=.5 +90°.
  // NASA equirectangular map: u=0 is -180°, u=.5 Greenwich.
  assert.equal(GIBS_TEXTURE_U_OFFSET,.25);
  assert.equal(sphereUVForLongitude(-90),0);
  assert.equal(sphereUVForLongitude(0),.25);
  assert.equal(sphereUVForLongitude(90),.5);
  assert.equal(gibsTextureUV(0),.25);
  assert.equal(gibsTextureUV(.25),.5);
  assert.equal(gibsTextureUV(.5),.75);
  assert.equal(gibsTextureUV(.75),0);
  for(const longitude of [-179,-85.44,-83.03,-74.006,0,2.3522,90,179]){
    const actual=gibsTextureUV(sphereUVForLongitude(longitude));
    const expected=(longitude+180)/360;
    assert.ok(Math.abs(actual-expected)<1e-12,
      "NASA map misregistration at "+longitude+"°: "+actual+" != "+expected);
  }
  assert.throws(()=>sphereUVForLongitude(181),/Invalid longitude/);
  assert.throws(()=>gibsTextureUV(NaN),/Invalid Three.js sphere U/);
});

test("Scientific disclosure does not confuse surface and air temperature",()=>{
  const en=gibsLayerDisclosure("lst","en");
  assert.match(en,/LAND SURFACE/);
  assert.match(en,/not air/);
  assert.match(en,/downsampled/);
  assert.match(en,/not numeric temperatures/);
  assert.match(gibsLayerDisclosure("marble","es"),/No muestra tendencias/);
});

test("Bilingual globe controls remain linked to the source-specific modules",()=>{
  for(const language of ["","en/"]){
    const page=readFileSync(new URL("../public/"+language+"telluris/explore/index.html",import.meta.url),"utf8");
    for(const id of ["globe-stage","globe-layer","globe-date","globe-zoom-in",
        "globe-zoom-out","globe-reset","globe-spin","globe-selection",
        "globe-analyze","globe-nasa-legend","globe-source-link"])
      assert.ok(page.includes('id="'+id+'"'),language+id);
    assert.ok(page.includes("globe.css?v=exp008-20261115"));
    assert.ok(page.includes("globe.js?v=exp008-uvfix-20261115"));
    assert.ok(page.includes('option value="lst"'));
    assert.ok(page.includes('option value="truecolor"'));
  }
});

test("Runtime applies positive quarter-turn texture registration to NASA sources",()=>{
  const js=readFileSync(new URL("../public/assets/globe.js",import.meta.url),"utf8");
  assert.match(js,/texture\.repeat\.set\(1,1\)/);
  assert.match(js,/texture\.offset\.set\(GIBS_TEXTURE_U_OFFSET,0\)/);
  assert.ok(!js.includes("texture.repeat.x=-1"),"Reverse/negative U must never return");
  assert.match(js,/globe-layers\.js\?v=exp008-uvfix-20261115/);
});
