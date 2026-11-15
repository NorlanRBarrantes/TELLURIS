/* TELLURIS EXP-008 · NASA GIBS source-aware globe layers.
 * WMS 1.1.1 EPSG:4326 has lon/lat BBOX ordering. This is a VISUALIZATION
 * endpoint: a color is never converted into a quantitative observation.
 * Source: https://nasa-gibs.github.io/gibs-api-docs/access-basics/
 */
export const GIBS_WMS="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi";
export const GLOBE_LAYERS=Object.freeze({
  marble:Object.freeze({
    layer:"BlueMarble_NextGeneration",type:"background",format:"image/jpeg",
    dated:false,source:"NASA GIBS / Blue Marble Next Generation",
    reference:"https://nasa-gibs.github.io/gibs-api-docs/access-basics/"
  }),
  truecolor:Object.freeze({
    layer:"MODIS_Terra_CorrectedReflectance_TrueColor",type:"imagery",
    format:"image/jpeg",dated:true,source:"NASA GIBS / Terra MODIS corrected reflectance",
    reference:"https://worldview.earthdata.nasa.gov/"
  }),
  lst:Object.freeze({
    layer:"MODIS_Terra_L3_Land_Surface_Temp_Daily_Day",type:"scientific-visualization",
    format:"image/png",dated:true,source:"NASA GIBS / Terra MODIS L3 daytime land-surface temperature",
    nativeUnit:"K",nativeSpatialResolution:"1 km",visualPixelValueReliable:false,
    reference:"https://worldview.earthdata.nasa.gov/?l=MODIS_Terra_L3_Land_Surface_Temp_Daily_Day"
  })
});
export const DEFAULT_GIBS_DATE="2024-07-15";
export function validateGlobeDate(date) {
  if(typeof date!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw Error("Date must be YYYY-MM-DD");
  const ms=Date.parse(date+"T00:00:00Z");
  if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==date)
    throw Error("Invalid calendar date");
  if(date<"2000-03-01"||ms>Date.now()-86400000)
    throw Error("Date outside conservative MODIS availability range");
  return date;
}
export function gibsWmsUrl(id,{date=DEFAULT_GIBS_DATE,width=1536}={}) {
  const layer=GLOBE_LAYERS[id];
  if(!layer)throw Error("Unknown NASA GIBS layer");
  if(!Number.isInteger(width)||width<512||width>2048||width%2!==0)
    throw Error("Invalid WMS image width");
  const query=new URLSearchParams({
    SERVICE:"WMS",VERSION:"1.1.1",REQUEST:"GetMap",
    LAYERS:layer.layer,STYLES:"",SRS:"EPSG:4326",
    BBOX:"-180,-90,180,90",WIDTH:String(width),
    HEIGHT:String(width/2),FORMAT:layer.format
  });
  if(layer.dated)query.set("TIME",validateGlobeDate(date));
  if(layer.format==="image/png")query.set("TRANSPARENT","TRUE");
  return GIBS_WMS+"?"+query.toString();
}
/* Three SphereGeometry UV uses a seam at longitude zero and reverses U
 * relative to an east-positive 0°-centred equirectangular NASA WMS image.
 * Set RepeatWrapping and U' = 0.5 - U to align Washington, Liberia and Limón
 * with the geometry, rather than displaying mirrored/shifted continents.
 */
export function gibsTextureUV(threeU) {
  return ((0.5-threeU)%1+1)%1;
}
export function gibsLayerDisclosure(id,lang="es",date=DEFAULT_GIBS_DATE) {
  const es=lang!=="en";
  if(id==="marble")return es?
    "NASA Blue Marble · imagen de referencia global sin fecha de observación seleccionable. No muestra tendencias ni mediciones puntuales.":
    "NASA Blue Marble · global reference composite without a selectable observation date. Not a trend or point measurement.";
  if(id==="truecolor")return es?
    "MODIS Terra · reflectancia corregida en color natural · fecha solicitada "+date+
    ". Puede haber nubes o zonas sin imagen; no equivale a una tendencia climática.":
    "MODIS Terra · corrected true-color reflectance · requested date "+date+
    ". Clouds and data gaps may occur; this is not a climate trend.";
  if(id==="lst")return es?
    "MODIS Terra · temperatura diurna de la SUPERFICIE (no del aire), producto L3; fuente en K, resolución nativa aproximada 1 km; imagen global remuestreada. El color no autoriza leer una temperatura numérica sin leyenda/valores de la fuente. Fecha solicitada "+date+".":
    "MODIS Terra · daytime LAND SURFACE (not air) temperature, L3; native units K, nominal source resolution 1 km; global image downsampled. Colors are not numeric temperatures without verified source legend/pixel values. Requested date "+date+".";
  throw Error("Unknown globe disclosure layer");
}
