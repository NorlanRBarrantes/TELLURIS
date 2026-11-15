// EXP-006: imported NASA GPM IMERG Final V07 monthly product comparison.
// Source authenticity is never certified by user-uploaded metadata.
import {analyze} from "./science.js";
export const SCHEMA="telluris.exp006.imerg_final_monthly.v1";
const leap=y=>y%4===0&&(y%100!==0||y%400===0);
const days=(y,m)=>[31,leap(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1];
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const r=x=>Number(x.toFixed(5));
export function parseIMERG(payload,lat,lon){
 if(!payload||payload.schema!==SCHEMA||payload.dataset!=="GPM_3IMERGM_07"||
    payload.run!=="Final"||!/^V07[A-Z]?$/.test(payload.version||"")||
    payload.units!=="mm/hr"||payload.temporalResolution!=="monthly")
   throw Error("Require source-specific NASA IMERG Final V07 monthly mm/hr manifest");
 for(const c of [payload.requestedCoordinates,payload.gridCellCenter]){
   if(!Array.isArray(c)||c.length!==2||c.some(x=>!Number.isFinite(x))||
      Math.abs(c[0]-lat)>.11||Math.abs(c[1]-lon)>.11)
      throw Error("IMERG source grid/coordinate mismatch");
 }
 if(!Array.isArray(payload.records)||!payload.records.length||payload.records.length>500)
   throw Error("Missing IMERG source records");
 const monthSet=new Set(),annual=new Map();
 for(const item of payload.records){
   if(!item||!/^(19|20)\d\d-(0[1-9]|1[0-2])$/.test(item.month||""))
      throw Error("Invalid source month");
   if(monthSet.has(item.month))throw Error("Duplicate IMERG month");
   monthSet.add(item.month);
   const [year,month]=item.month.split("-").map(Number);
   if(year<2000||year>2025||!Number.isFinite(item.precipitationMmHr)||
      typeof item.precipitationMmHr!=="number"||item.precipitationMmHr<0||item.precipitationMmHr>250)
      throw Error("Out-of-range original IMERG rate");
   if(!item.sourceFilename?.includes("3IMERG")||!/^[a-f0-9]{64}$/.test(item.sha256||""))
      throw Error("Missing original source filename/SHA256 provenance");
   if(!annual.has(year))annual.set(year,[]);
   annual.get(year).push({month,total:item.precipitationMmHr*24*days(year,month)});
 }
 const full=[],missing=[];
 for(const [year,rows] of [...annual].sort((a,b)=>a[0]-b[0])){
   if(rows.length===12)full.push({year,value:r(rows.reduce((a,x)=>a+x.total,0))});
   else missing.push({year,validMonths:rows.length});
 }
 return {annual:full,incomplete:missing,monthlyCount:monthSet.size,
   dataset:payload.dataset,version:payload.version,
   gridCellCenter:payload.gridCellCenter,
   trust:"user_imported_unverified_source_manifest",
   caveat:"NASA IMERG Final is satellite-gauge blended; grids, calibration and lineage differ from POWER."};
}
export function comparePrecipitation(power,imerg){
 const lookup=new Map(imerg.annual.map(x=>[x.year,x.value]));
 const pairs=power.filter(x=>Number.isInteger(x.year)&&Number.isFinite(x.value)&&lookup.has(x.year))
  .sort((a,b)=>a.year-b.year)
  .map(x=>({year:x.year,powerMm:x.value,imergMm:lookup.get(x.year),
    differenceMm:r(x.value-lookup.get(x.year))}));
 if(!pairs.length)throw Error("No overlapping complete years");
 const dif=pairs.map(x=>x.differenceMm);
 const a=pairs.map(x=>x.powerMm),b=pairs.map(x=>x.imergMm),ma=mean(a),mb=mean(b);
 const cov=mean(a.map((x,i)=>(x-ma)*(b[i]-mb)));
 const va=mean(a.map(x=>(x-ma)**2)),vb=mean(b.map(x=>(x-mb)**2));
 const stats={meanBiasMmYr:r(mean(dif)),maeMmYr:r(mean(dif.map(Math.abs))),
   rmseMmYr:r(Math.sqrt(mean(dif.map(x=>x*x)))),
   correlation:va>0&&vb>0?r(cov/Math.sqrt(va*vb)):null};
 let trends=null;
 if(pairs.length>=10){
   const fit=k=>analyze(pairs.map(x=>({year:x.year,value:x[k]})));
   const three=[fit("powerMm"),fit("imergMm"),fit("differenceMm")];
   if(three.every(x=>x.status==="exploratory"))
      trends=Object.fromEntries(["power","imerg","difference"].map((key,i)=>[key,{
        slopeMmPerDecade:three[i].slopePerDecade,
        exploratoryEvidence:three[i].inference.status,
        validatedSignificance:false
      }]));
 }
 return {schema:"telluris.exp006.precipitation_comparison.v1",
   pairs,yearsCompared:pairs.length,firstYear:pairs[0].year,lastYear:pairs.at(-1).year,
   ...stats,trends,sourceTrust:imerg.trust,validatedPhysicalTrend:false,
   caveats:["Uses only complete overlapping years","IMERG is satellite-gauge blended",
    "Source grid cells, retrievals and homogeneity differ",
    "Imported original-source provenance is not independently authenticated",
    "Agreement, correlation and p-values do not prove a causal or validated climate trend"]};
}
