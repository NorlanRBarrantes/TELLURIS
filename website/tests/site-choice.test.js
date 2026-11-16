import test from "node:test";
import assert from "node:assert/strict";
import {
 KNOWN_SITES,sameSite,presetAtPoint,primarySiteIdentity,
 chooseSecondarySite,filterSecondaryOptions
} from "../public/assets/site-choice.js";

test("Liberia in A is not selectable in B; reversing A to Limón changes the exclusion",()=>{
 const options=["liberia","limon","custom"];
 const liberia=filterSecondaryOptions(options,primarySiteIdentity("liberia",10.63,-85.44));
 const limon=filterSecondaryOptions(options,primarySiteIdentity("limon",9.99,-83.03));
 assert.deepEqual(liberia,[
  {value:"liberia",available:false},{value:"limon",available:true},{value:"custom",available:true}
 ]);
 assert.deepEqual(limon,[
  {value:"liberia",available:true},{value:"limon",available:false},{value:"custom",available:true}
 ]);
 assert.equal(chooseSecondarySite("liberia","liberia"),"limon");
 assert.equal(chooseSecondarySite("limon","limon"),"liberia");
 assert.equal(chooseSecondarySite("liberia","custom"),"custom");
 assert.equal(chooseSecondarySite("liberia","limon"),"limon");
});

test("Custom coordinate alias matching an exact known site also excludes B preset",()=>{
 assert.equal(presetAtPoint(10.63,-85.44),"liberia");
 assert.equal(presetAtPoint(9.99,-83.03),"limon");
 assert.equal(primarySiteIdentity("custom",10.63,-85.44),"liberia");
 assert.equal(primarySiteIdentity("custom",9.99,-83.03),"limon");
 assert.equal(primarySiteIdentity("custom",2,-75),null);
 assert.equal(presetAtPoint(10.63,-83.03),null);
 assert.equal(KNOWN_SITES.liberia.lat,10.63);
 const available=filterSecondaryOptions(["liberia","limon","custom"],
   primarySiteIdentity("custom",10.63,-85.44));
 assert.equal(available[0].available,false);
});

test("Coordinate-duplicate validation catches custom-vs-preset and custom-vs-custom",()=>{
 assert.equal(sameSite({lat:10.63,lon:-85.44},KNOWN_SITES.liberia),true);
 assert.equal(sameSite({lat:10.63,lon:-85.44},{lat:10.63,lon:-85.44}),true);
 assert.equal(sameSite({lat:10.63,lon:-85.44},{lat:10.63,lon:-85.439}),false);
 assert.equal(sameSite({lat:NaN,lon:0},{lat:0,lon:0}),false);
});

test("Browser controller hides forbidden site and rejects duplicate coordinates",async()=>{
 const {readFileSync}=await import("node:fs");
 const js=readFileSync(new URL("../public/assets/observatory.js",import.meta.url),"utf8");
 assert.match(js,/filterSecondaryOptions/);
 assert.match(js,/second\.place\.replaceChildren/);
 assert.match(js,/secondaryOptionCatalog/);
 assert.match(js,/if\(sameSite\(first,other\)\)/);
 assert.match(js,/f===form\.place\|\|f===form\.lat\|\|f===form\.lon/);
});
