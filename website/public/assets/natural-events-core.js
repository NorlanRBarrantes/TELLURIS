/* EXP-011 · Original event observations, NEVER a NASA POWER climate series.
 * USGS FDSN earthquake events and NASA EONET natural event inventories.
 * Strict URL allowlist and bounds; no trends or seismic hazard predictions.
 */
export const EVENT_TYPES=Object.freeze({
 earthquakes:Object.freeze({provider:"USGS",labelEs:"Sismos",labelEn:"Earthquakes"}),
 wildfires:Object.freeze({provider:"NASA EONET",labelEs:"Incendios observados",labelEn:"Wildfires (events)"}),
 volcanoes:Object.freeze({provider:"NASA EONET",labelEs:"Eventos volcánicos",labelEn:"Volcanic events"}),
 floods:Object.freeze({provider:"NASA EONET",labelEs:"Inundaciones",labelEn:"Flood events"}),
 severeStorms:Object.freeze({provider:"NASA EONET",labelEs:"Tormentas intensas",labelEn:"Severe storms"}),
 landslides:Object.freeze({provider:"NASA EONET",labelEs:"Deslizamientos reportados",labelEn:"Landslide events"})
});
export const EVENT_DAYS=Object.freeze([30,90,365]);
export const EVENT_RADIUS_KM=Object.freeze([200,500,1000]);
export const EVENT_MAGNITUDES=Object.freeze([2.5,3.5,4.5]);
export const USGS_MAX_EVENTS=500;
export const EONET_MAX_EVENTS=150;
export function isCoordinate(lat,lon){
 return Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
}
export function eventWindow(now,days){
 if(!(now instanceof Date)||!Number.isFinite(now.getTime())||!EVENT_DAYS.includes(days))
  throw Error("Invalid event observation period");
 const end=new Date(now.getTime()),start=new Date(end.getTime()-days*86400000);
 return {start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10)};
}
export function eventRequest({type,lat,lon,days=90,radiusKm=500,minMagnitude=2.5,now=new Date()}){
 if(!Object.hasOwn(EVENT_TYPES,type)||!isCoordinate(lat,lon)||
    !EVENT_RADIUS_KM.includes(radiusKm))throw Error("Invalid event type or location/radius");
 const {start,end}=eventWindow(now,days);
 if(type==="earthquakes"){
  if(!EVENT_MAGNITUDES.includes(minMagnitude))throw Error("Unsupported magnitude threshold");
  const q=new URLSearchParams({
   format:"geojson",starttime:start,endtime:end,
   latitude:String(lat),longitude:String(lon),
   maxradiuskm:String(radiusKm),minmagnitude:String(minMagnitude),
   limit:String(USGS_MAX_EVENTS),orderby:"time"
  });
  return {provider:"USGS Earthquake Catalog",url:"https://earthquake.usgs.gov/fdsnws/event/1/query?"+q,
   start,end,type,radiusKm,minMagnitude,lat,lon,maxResults:USGS_MAX_EVENTS};
 }
 // NASA EONET accepts a geographic rectangle; exact radial trimming is client-side.
 // Avoid high latitudes / dateline crossing: clamp bounding box at legal lon/lat.
 const latRadius=radiusKm/111.2;
 const lonRadius=Math.min(179,latRadius/Math.max(.15,Math.cos(lat*Math.PI/180)));
 const north=Math.min(90,lat+latRadius),south=Math.max(-90,lat-latRadius);
 const west=Math.max(-180,lon-lonRadius),east=Math.min(180,lon+lonRadius);
 const q=new URLSearchParams({category:type,status:"all",start,end,
    limit:String(EONET_MAX_EVENTS),bbox:[west,north,east,south].map(x=>x.toFixed(4)).join(",")});
 return {provider:"NASA EONET v3",url:"https://eonet.gsfc.nasa.gov/api/v3/events?"+q,
   start,end,type,radiusKm,lat,lon,maxResults:EONET_MAX_EVENTS};
}
export function distanceKm(a,b){
 if(!isCoordinate(a.lat,a.lon)||!isCoordinate(b.lat,b.lon))return NaN;
 const r=Math.PI/180,dlat=(b.lat-a.lat)*r,dlon=(b.lon-a.lon)*r;
 const h=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlon/2)**2;
 return 6371.0088*2*Math.asin(Math.min(1,Math.sqrt(Math.max(0,h))));
}
function safeEarthquake(feature){
 if(!feature||feature.type!=="Feature"||!feature.properties||
   !Array.isArray(feature.geometry?.coordinates))return null;
 const [lon,lat,depth]=feature.geometry.coordinates;
 if(feature.properties.mag===null||feature.properties.mag===undefined)return null;
 const mag=Number(feature.properties.mag),time=Number(feature.properties.time);
 if(!isCoordinate(lat,lon)||!Number.isFinite(mag)||mag<0||
   !Number.isFinite(time)||!Number.isFinite(depth)||depth< -10||depth>1000)return null;
 const url=String(feature.properties.url||"");
 const safeUrl=/^https:\/\/earthquake\.usgs\.gov\/earthquakes\/eventpage\/[a-z0-9_-]+(?:\/)?$/i.test(url)?url:null;
 return {id:String(feature.id||""),kind:"earthquakes",provider:"USGS",
   lat,lon,depthKm:depth,magnitude:mag,timeMs:time,
   name:String(feature.properties.place||"Epicenter").slice(0,180),url:safeUrl,
   eventStatus:String(feature.properties.status||"").slice(0,40)};
}
export function parseUSGS(payload,request){
 if(request?.type!=="earthquakes"||payload?.type!=="FeatureCollection"||
    !Array.isArray(payload.features))throw Error("Invalid USGS GeoJSON response");
 const items=payload.features.map(safeEarthquake).filter(Boolean).filter(e=>
   distanceKm({lat:request.lat,lon:request.lon},e)<=request.radiusKm+1 &&
   e.magnitude>=request.minMagnitude
 ).sort((a,b)=>b.timeMs-a.timeMs);
 return {provider:request.provider,sourceUrl:request.url,items,
   capped:payload.features.length>=request.maxResults,
   timeRange:[request.start,request.end],radiusKm:request.radiusKm,
   caveat:"Catalog is thresholded, spatially filtered and can be incomplete or magnitude-dependent. Counts are NOT a normalized seismic frequency trend. These events are USGS records, not NASA observations."};
}
function pointGeometry(event){
 const array=Array.isArray(event?.geometry)?event.geometry:[];
 // EONET geometry is a list of observation locations (Point or Polygon).
 // This MVP accepts a verified Point only, not arbitrary polygon centroids.
 return array.filter(g=>g?.type==="Point"&&Array.isArray(g.coordinates)&&
   isCoordinate(Number(g.coordinates[1]),Number(g.coordinates[0]))).at(-1);
}
export function parseEONET(payload,request){
 if(request?.type==="earthquakes"||!Object.hasOwn(EVENT_TYPES,request?.type)||
   !Array.isArray(payload?.events))throw Error("Invalid NASA EONET response");
 const items=payload.events.map(e=>{
   const geo=pointGeometry(e);
   if(!geo)return null;
   const [lon,lat]=geo.coordinates.map(Number);
   const when=Date.parse(geo.date);
   if(!Number.isFinite(when)||distanceKm({lat:request.lat,lon:request.lon},{lat,lon})>request.radiusKm+1)return null;
   const matching=Array.isArray(e.categories)&&e.categories.some(c=>c.id===request.type);
   if(!matching)return null;
   const id=String(e.id||"").slice(0,120);
   const url=/^[A-Za-z0-9_-]+$/.test(id)?"https://eonet.gsfc.nasa.gov/api/v3/events/"+id:null;
   return {id,kind:request.type,provider:"NASA EONET",lat,lon,depthKm:null,
     magnitude:null,timeMs:when,name:String(e.title||"Natural event").slice(0,180),url,
     eventStatus:e.closed?"closed":"open"};
 }).filter(Boolean).sort((a,b)=>b.timeMs-a.timeMs);
 return {provider:request.provider,sourceUrl:request.url,items,
   capped:payload.events.length>=request.maxResults,
   timeRange:[request.start,request.end],radiusKm:request.radiusKm,
   caveat:"NASA EONET is a curated catalog of reported natural events, not an exhaustive event census. Point locations are indicative, not physical magnitude measurements. Empty results do not prove absence of events."};
}
export function plotEvent(item,site,radiusKm){
 if(!isCoordinate(item.lat,item.lon)||!isCoordinate(site.lat,site.lon))return null;
 const cosine=Math.max(.15,Math.cos(site.lat*Math.PI/180));
 const x=0.5+(item.lon-site.lon)*111.2*cosine/(radiusKm*2.2);
 const y=0.5-(item.lat-site.lat)*111.2/(radiusKm*2.2);
 return {x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y))};
}
