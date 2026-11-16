/* TELLURIS EXP-010 · pure duplicate-site and preset-filter rules.
 * Two research sites cannot be the same physical point (even with custom labels).
 * Equal coordinates within the configured pick tolerance are not two observations.
 */
export const KNOWN_SITES=Object.freeze({
  liberia:Object.freeze({lat:10.63,lon:-85.44}),
  limon:Object.freeze({lat:9.99,lon:-83.03})
});
export const SAME_SITE_EPS=0.0001;
export function sameSite(a,b){
  if(!a||!b||![a.lat,a.lon,b.lat,b.lon].every(Number.isFinite))return false;
  return Math.abs(a.lat-b.lat)<SAME_SITE_EPS &&
         Math.abs(a.lon-b.lon)<SAME_SITE_EPS;
}
export function presetAtPoint(lat,lon){
  const a={lat,lon};
  return Object.keys(KNOWN_SITES).find(key=>sameSite(a,KNOWN_SITES[key]))||null;
}
export function primarySiteIdentity(value,lat,lon){
  if(value==="liberia"||value==="limon")return value;
  return presetAtPoint(lat,lon);
}
export function fallbackOpposite(key){
  return key==="liberia"?"limon":"liberia";
}
export function chooseSecondarySite(primary,selected){
  if(primary&&selected===primary)return fallbackOpposite(primary);
  return selected;
}
export function filterSecondaryOptions(optionValues,primary){
  return optionValues.map(value=>({
    value,available:value!==primary || value==="custom"
  }));
}
