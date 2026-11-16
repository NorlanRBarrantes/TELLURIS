import test from "node:test";
import assert from "node:assert/strict";
import {
 EVENT_TYPES,eventWindow,eventRequest,distanceKm,parseUSGS,parseEONET,plotEvent
} from "../public/assets/natural-events-core.js";

const now=new Date("2026-11-15T14:30:00Z");
const site={lat:10.63,lon:-85.44};
test("Only explicit original USGS and NASA EONET event families are allowed",()=>{
 assert.deepEqual(Object.keys(EVENT_TYPES),["earthquakes","wildfires","volcanoes","floods","severeStorms","landslides"]);
 assert.deepEqual(eventWindow(now,30),{start:"2026-10-16",end:"2026-11-15"});
 assert.throws(()=>eventWindow(now,400),/Invalid/);
 assert.throws(()=>eventRequest({type:"unknown",...site,now}),/Invalid/);
 assert.throws(()=>eventRequest({type:"earthquakes",lat:90.1,lon:-85,now}),/Invalid/);
 assert.throws(()=>eventRequest({type:"earthquakes",...site,minMagnitude:0,now}),/Unsupported/);
});
test("Earthquake API request is geocentric, thresholded, bounded, sourced",()=>{
 const r=eventRequest({type:"earthquakes",...site,days:90,radiusKm:500,minMagnitude:3.5,now});
 const url=new URL(r.url);
 assert.equal(url.origin,"https://earthquake.usgs.gov");
 assert.equal(url.searchParams.get("latitude"),"10.63");
 assert.equal(url.searchParams.get("longitude"),"-85.44");
 assert.equal(url.searchParams.get("maxradiuskm"),"500");
 assert.equal(url.searchParams.get("minmagnitude"),"3.5");
 assert.equal(url.searchParams.get("format"),"geojson");
 assert.equal(url.searchParams.get("limit"),"500");
 assert.equal(url.searchParams.get("starttime"),"2026-08-17");
 assert.equal(r.provider,"USGS Earthquake Catalog");
});
test("NASA EONET is an event catalog, NEVER a MODIS pixel or sea-level series",()=>{
 for(const type of ["wildfires","volcanoes","floods","severeStorms","landslides"]){
   const r=eventRequest({type,...site,days:365,radiusKm:1000,now});
   const u=new URL(r.url);
   assert.equal(u.origin,"https://eonet.gsfc.nasa.gov");
   assert.equal(u.pathname,"/api/v3/events");
   assert.equal(u.searchParams.get("category"),type);
   assert.equal(u.searchParams.get("status"),"all");
   assert.ok(u.searchParams.get("bbox").split(",").map(Number).every(Number.isFinite));
   assert.ok(!r.url.includes("FIRMS")&&!r.url.includes("SWOT"));
 }
});
const usgsRequest=eventRequest({type:"earthquakes",...site,now});
const usgs={type:"FeatureCollection",features:[
 {type:"Feature",id:"us9000test",geometry:{type:"Point",coordinates:[-85.6,10.5,22]},
  properties:{time:Date.UTC(2026,10,1),mag:4.1,place:"Near Liberia",
   status:"reviewed",url:"https://earthquake.usgs.gov/earthquakes/eventpage/us9000test"}},
 {type:"Feature",id:"outside",geometry:{type:"Point",coordinates:[-120,49,5]},
  properties:{time:Date.UTC(2026,10,1),mag:6,place:"Not Costa Rica"}},
 {type:"Feature",id:"invalid",geometry:{type:"Point",coordinates:[-85.6,10.5,5]},
  properties:{time:Date.UTC(2026,10,1),mag:null,place:"No magnitude"}}
]};
test("USGS parses only actual geocoded magnitude/depth/time, rejects far/invalid entries",()=>{
 const r=parseUSGS(usgs,usgsRequest);
 assert.equal(r.items.length,1);
 assert.equal(r.items[0].magnitude,4.1);
 assert.equal(r.items[0].depthKm,22);
 assert.equal(r.items[0].provider,"USGS");
 assert.ok(r.items[0].url.startsWith("https://earthquake.usgs.gov/"));
 assert.equal(r.capped,false);
 assert.match(r.caveat,/NOT a normalized seismic frequency trend/);
 assert.throws(()=>parseUSGS({events:[]},usgsRequest),/Invalid/);
});
test("Correct geodesic distance and non-hazard schematic position",()=>{
 const km=distanceKm(site,{lat:10.5,lon:-85.6});
 assert.ok(km>10&&km<30);
 assert.ok(distanceKm(site,site)<.001);
 const pos=plotEvent({lat:10.5,lon:-85.6},site,500);
 assert.ok(pos.x>=0&&pos.x<=1&&pos.y>=0&&pos.y<=1);
});
test("EONET only accepts matching Point event geometry within selected radius",()=>{
 const req=eventRequest({type:"wildfires",...site,now});
 const payload={events:[
  {id:"EONET_123",title:"Documented wildfire",closed:null,
   categories:[{id:"wildfires"}],geometry:[{type:"Point",coordinates:[-85.7,10.4],date:"2026-10-30T12:00:00Z"}]},
  {id:"EONET_124",title:"Flood, not wildfire",categories:[{id:"floods"}],
   geometry:[{type:"Point",coordinates:[-85.5,10.5],date:"2026-10-30T12:00:00Z"}]},
  {id:"EONET_125",title:"Polygon must not be given fabricated epicenter",
   categories:[{id:"wildfires"}],geometry:[{type:"Polygon",coordinates:[[]],date:"2026-10-30T12:00:00Z"}]}
 ]};
 const r=parseEONET(payload,req);
 assert.equal(r.items.length,1);
 assert.equal(r.items[0].provider,"NASA EONET");
 assert.equal(r.items[0].magnitude,null);
 assert.equal(r.items[0].depthKm,null);
 assert.match(r.caveat,/curated catalog/);
 assert.throws(()=>parseEONET({features:[]},req),/Invalid/);
});
