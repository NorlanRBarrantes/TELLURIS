import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  GIBS_WMS,GLOBE_LAYERS,DEFAULT_GIBS_DATE,
  validateGlobeDate,gibsWmsUrl,gibsTextureUV,gibsLayerDisclosure
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

test("NASA map texture east-positive alignment is not mirrored",()=>{
  // Three SphereGeometry: longitude 0 -> u0, +90 -> u.75,
  // -90 -> u.25, +/-180 -> u.5; NASA Plate Carrée expects .5,.75,.25,0.
  assert.equal(gibsTextureUV(0),.5);
  assert.equal(gibsTextureUV(.75),.75);
  assert.equal(gibsTextureUV(.25),.25);
  assert.equal(gibsTextureUV(.5),0);
});

test("Scientific disclosure does not confuse surface and air temperature",()=>{
  const en=gibsLayerDisclosure("lst","en");
  assert.match(en,/LAND SURFACE/);
  assert.match(en,/not air/);
  assert.match(en,/downsampled/);
  assert.match(en,/not numeric temperatures/);
  assert.match(gibsLayerDisclosure("marble","es"),/no muestra tendencias/);
});

test("Bilingual globe controls remain linked to the source-specific modules",()=>{
  for(const language of ["","en/"]){
    const page=readFileSync(new URL("../public/"+language+"telluris/explore/index.html",import.meta.url),"utf8");
    for(const id of ["globe-stage","globe-layer","globe-date","globe-zoom-in",
        "globe-zoom-out","globe-reset","globe-spin","globe-selection",
        "globe-analyze","globe-nasa-legend","globe-source-link"])
      assert.ok(page.includes('id="'+id+'"'),language+id);
    assert.ok(page.includes("globe.css?v=exp008-20261115"));
    assert.ok(page.includes("globe.js?v=exp008-20261115"));
    assert.ok(page.includes('option value="lst"'));
    assert.ok(page.includes('option value="truecolor"'));
  }
});
