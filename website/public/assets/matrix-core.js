/* TELLURIS EXP-009 · deterministic, evidence-limited multi-location / multi-variable core.
 * Data never invented; original NASA POWER series, units and source communities stay intact.
 * Matrix slopes are DESCRIPTIVE Theil–Sen estimates, not multiple-testing-adjusted significance.
 */
import {VARIABLES,POWER_READY_CODES,senSlope,fromPower,fromSnapshot} from "./science.js";

export const INVESTIGATION_MODES=Object.freeze([
  "one-one","one-two","all-one","all-two"
]);
export const VARIABLE_FAMILIES=Object.freeze({
  atmosphere:["T2M","T2M_MAX","T2M_MIN","RH2M","QV2M","PS","CLOUD_AMT"],
  winds:["WS10M","WD10M","U10M","V10M"],
  energy:["ALLSKY_SFC_SW_DWN","ALLSKY_SFC_LW_DWN","ALLSKY_SRF_ALB","EVPTRNS"],
  water:["PRECTOTCORR","GWETTOP","GWETROOT"]
});
export function chosenCodes(mode,variable){
  if(!INVESTIGATION_MODES.includes(mode))throw Error("Unknown research mode");
  if(!Object.hasOwn(VARIABLES,variable))throw Error("Unknown NASA variable");
  return mode.startsWith("all")?[...POWER_READY_CODES]:[variable];
}
export function siteCount(mode){
  if(!INVESTIGATION_MODES.includes(mode))throw Error("Unknown research mode");
  return mode.endsWith("two")?2:1;
}
export function batchPowerUrl(site,codes,community,start,end){
  if(!site||![site.lat,site.lon,start,end].every(Number.isFinite)||
     Math.abs(site.lat)>90||Math.abs(site.lon)>180||
     !Number.isInteger(start)||!Number.isInteger(end)||
     start<1981||end>2025||start>end)
    throw Error("Invalid NASA batch coordinates/years");
  if(!Array.isArray(codes)||!codes.length||codes.length>20||
     !["RE","AG"].includes(community)||
     new Set(codes).size!==codes.length||
     !codes.every(code=>Object.hasOwn(VARIABLES,code)&&VARIABLES[code].community===community))
    throw Error("Invalid NASA parameter group (maximum 20 per community)");
  const query=new URLSearchParams({
    parameters:codes.join(","),community,
    longitude:String(site.lon),latitude:String(site.lat),
    start:String(start),end:String(end),format:"JSON"
  });
  return "https://power.larc.nasa.gov/api/temporal/monthly/point?"+query;
}
export function planBatches(sites,codes,start,end){
  if(!Array.isArray(sites)||!(sites.length===1||sites.length===2)||
     !Array.isArray(codes)||!codes.length||
     new Set(codes).size!==codes.length)throw Error("Invalid investigation request");
  const groups=new Map();
  for(const code of codes){
    const entry=VARIABLES[code];
    if(!entry)throw Error("Unknown NASA parameter");
    if(!groups.has(entry.community))groups.set(entry.community,[]);
    groups.get(entry.community).push(code);
  }
  const plan=[];
  for(const site of sites)for(const [community,members] of groups)
    for(let i=0;i<members.length;i+=20){
      const chunk=members.slice(i,i+20);
      plan.push({siteId:site.id,site,community,codes:chunk,
        url:batchPowerUrl(site,chunk,community,start,end)});
    }
  return plan;
}
export function verifyLocation(payload,site){
  const c=payload?.geometry?.coordinates;
  if(!Array.isArray(c)||!Number.isFinite(Number(c[0]))||
    !Number.isFinite(Number(c[1]))||
    Math.abs(Number(c[0])-site.lon)>.1||
    Math.abs(Number(c[1])-site.lat)>.1)
    throw Error("NASA returned unexpected source-grid coordinates");
  return true;
}
export function parseBatch(payload,batch,start,end){
  verifyLocation(payload,batch.site);
  const output={};
  for(const code of batch.codes){
    try{
      const parsed=fromPower(payload,code,start,end);
      output[code]={status:parsed.points.length>=10?"ready":"insufficient",data:parsed,
        sourceUrl:batch.url,reason:parsed.points.length<10?"Fewer than 10 complete years":null};
    }catch(error){
      output[code]={status:"unavailable",reason:error.message};
    }
  }
  return output;
}
export function parseArchive(snapshot,sites,codes,start,end){
  const output={};
  for(const site of sites){
    const values={};
    for(const code of codes){
      if(!["T2M","PRECTOTCORR"].includes(code)){
        values[code]={status:"unavailable",reason:"Not included in the 2-variable annual NASA archive"};
      }else if(!["liberia","limon"].includes(site.id)){
        values[code]={status:"unavailable",reason:"Archived NASA series covers Liberia and Limón only"};
      }else{
        try{
          const data=fromSnapshot(snapshot,site.id,code,start,end);
          values[code]={status:data.points.length>=10?"ready":"insufficient",
            data,reason:data.points.length<10?"Fewer than 10 complete years":null};
        }catch(e){values[code]={status:"unavailable",reason:e.message};}
      }
    }
    output[site.id]=values;
  }
  return output;
}
export function summarizeSeries(record,code){
  if(record?.status!=="ready")return {status:record?.status||"unavailable",
    reason:record?.reason||"No NASA source data"};
  const points=record.data.points;
  const def=VARIABLES[code];
  const vals=points.map(p=>p.value);
  const first=points[0],last=points.at(-1);
  if(def.aggregation==="circular")return {status:"circular",n:points.length,
    start:first.year,end:last.year,unit:def.unit,latest:last.value,
    slopePerDecade:null,raw:record.data};
  const slope=senSlope(points)*10;
  if(!Number.isFinite(slope))return {status:"insufficient",reason:"No finite Sen slope"};
  const n=points.length;
  const typical=vals.reduce((a,b)=>a+b,0)/n;
  return {status:"descriptive",n,start:first.year,end:last.year,
    slopePerDecade:slope,unit:def.unit,slopeUnit:def.slopeUnit,
    mean:typical,latest:last.value,raw:record.data};
}
export function matchedDifference(a,b){
  if(!a||!b||!Array.isArray(a.points)||!Array.isArray(b.points))
    return {status:"unavailable"};
  const other=new Map(b.points.map(p=>[p.year,p.value]));
  const diff=a.points.filter(p=>other.has(p.year))
    .map(p=>({year:p.year,value:p.value-other.get(p.year)}));
  if(diff.length<10)return {status:"insufficient",n:diff.length};
  return {status:"descriptive",n:diff.length,
    start:diff[0].year,end:diff.at(-1).year,points:diff,
    slopePerDecade:senSlope(diff)*10};
}
export function matrixRows(codes,records,sites){
  return codes.map(code=>{
    const a=records[sites[0].id]?.[code];
    const b=sites[1]?records[sites[1].id]?.[code]:null;
    const left=summarizeSeries(a,code),right=sites[1]?summarizeSeries(b,code):null;
    const paired=sites[1]&&left.status==="descriptive"&&right?.status==="descriptive"
      ?matchedDifference(a.data,b.data):null;
    return {code,definition:VARIABLES[code],left,right,paired,
      a:a?.data||null,b:b?.data||null};
  });
}
export function standardizedObservations(points){
  const clean=(points||[]).filter(p=>Number.isInteger(p.year)&&Number.isFinite(p.value));
  if(clean.length<10)return {status:"insufficient",points:[]};
  const avg=clean.reduce((t,p)=>t+p.value,0)/clean.length;
  const variance=clean.reduce((t,p)=>t+(p.value-avg)**2,0)/clean.length;
  const sd=Math.sqrt(variance);
  if(sd<1e-12)return {status:"flat",points:[],mean:avg};
  return {status:"descriptive",mean:avg,sd,
    points:clean.map(p=>({year:p.year,value:(p.value-avg)/sd}))};
}
export function summarizeInvestigation(rows,{lang="es",sites=[]}={}){
  const es=lang!=="en";
  const compared=rows.filter(r=>r.left.status==="descriptive"&&
    (!r.right||r.right.status==="descriptive"));
  const unavailable=rows.filter(r=>r.left.status==="unavailable"||
    r.right?.status==="unavailable").length;
  const circular=rows.filter(r=>r.left.status==="circular").length;
  const inc=compared.filter(r=>r.left.slopePerDecade>0).length;
  const dec=compared.filter(r=>r.left.slopePerDecade<0).length;
  const flat=compared.length-inc-dec;
  const a=sites[0]?.label||(es?"Primera zona":"First location");
  const b=sites[1]?.label;
  const intro=es?
    "TELLURIS examinó "+compared.length+" variable(s) con series completas en "+a+
    (b?" y "+b:"")+". En "+a+", "+inc+" muestran pendiente positiva, "+
    dec+" negativa y "+flat+" sin dirección estimada.":
    "TELLURIS examined "+compared.length+" variable(s) with complete annual series in "+a+
    (b?" and "+b:"")+". For "+a+", "+inc+" have positive estimated slopes, "+
    dec+" negative and "+flat+" no estimated direction.";
  const notes=[];
  if(unavailable)notes.push(es?
    unavailable+" variable(s) no tienen datos válidos disponibles en esta consulta. No se imputaron valores.":
    unavailable+" variables have unavailable source data in this request. No values were imputed.");
  if(circular)notes.push(es?
    "La dirección del viento es circular: se excluye de las pendientes lineales.":
    "Wind direction is circular and excluded from linear trend slopes.");
  if(compared.some(r=>r.code==="PRECTOTCORR"))notes.push(es?
    "Los cambios de precipitación necesitan contrastarse con NASA GPM antes de atribuir tendencias climáticas.":
    "Precipitation changes need NASA GPM cross-validation before climate attribution.");
  notes.push(es?
    "Estas direcciones son DESCRIPTIVAS: no demuestran significancia, mecanismos físicos ni causalidad. NASA POWER proporciona productos modelados o satelitales, no estaciones puntuales; 18 pruebas simultáneas requerirían control de comparaciones múltiples.":
    "Directions are DESCRIPTIVE: they establish no statistical significance, mechanism or causality. NASA POWER uses modeled/satellite products, not point stations; testing 18 variables would require multiple-comparison controls.");
  return {intro,notes,available:compared.length,unavailable,circular,inc,dec,flat};
}
export function groundedAnswer(question,rows,{lang="es",sites=[]}={}){
  const es=lang!=="en",q=String(question||"").toLocaleLowerCase();
  if(!rows?.length)return es?"Primero carga observaciones NASA verificables.":"Load verifiable NASA observations first.";
  const matches=rows.filter(r=>q.includes(r.code.toLowerCase())||
    q.includes((es?r.definition.nameEs:r.definition.name).toLowerCase()));
  if(/(causa|por qué|porque|responsable|cause|why|causality)/.test(q))
    return es?
      "No podemos determinar por qué ocurrió un cambio solo con estas series. Podemos contrastar señales compatibles, pero correlación y coincidencia temporal no demuestran causalidad; hacen falta procesos físicos, controles espaciales y fuentes independientes.":
      "These series cannot establish why a change happened. Co-moving signals may suggest hypotheses, not causation; physical processes, spatial controls and independent sources are required.";
  if(/(signific|confiab|certeza|segur|p-valor|significan|confidence|certain|reliable)/.test(q))
    return es?
      "La matriz presenta pendientes descriptivas sin pruebas de significancia. Para una sola variable, el panel clásico ofrece Mann–Kendall y un intervalo Sen condicionales, con supuestos y limitaciones. Un análisis de 18 variables necesita controlar las comparaciones múltiples y revisar autocorrelación.":
      "This matrix contains descriptive slopes without significance claims. The single-variable panel offers conditional Mann–Kendall and Sen intervals with assumptions. Eighteen variables require multiple-testing control and serial-dependence review.";
  if(matches.length){
    const r=matches[0],fmt=n=>Number(n).toLocaleString(es?"es-CR":"en-US",{maximumFractionDigits:2});
    const name=es?r.definition.nameEs:r.definition.name;
    if(r.left.status!=="descriptive")return es?
      name+": no hay una tendencia lineal interpretable en esta fuente (sin datos o variable circular).":
      name+": no interpretable linear trend from this source (missing observations or circular variable).";
    let response=name+" · "+(sites[0]?.label||"A")+": "+
      fmt(r.left.slopePerDecade)+" "+r.definition.slopeUnit+" ("+
      r.left.start+"–"+r.left.end+", n="+r.left.n+").";
    if(r.right?.status==="descriptive")
      response+=" "+(sites[1]?.label||"B")+": "+
        fmt(r.right.slopePerDecade)+" "+r.definition.slopeUnit+
        " (n="+r.right.n+").";
    return response+" "+(es?
      "Estimaciones descriptivas, sin atribución causal ni significancia validada.":
      "Descriptive estimates; no validated significance or causal attribution.");
  }
  const summary=summarizeInvestigation(rows,{lang,sites});
  return summary.intro+" "+summary.notes.join(" ");
}
