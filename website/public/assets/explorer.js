import {VARIABLES, powerUrl, fromPower, fromSnapshot, analyze} from "./science.js";
import {buildEvidence, compareEvidence, answerEvidence} from "./evidence.js";

const uiLanguage = document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "en";
const locale = uiLanguage === "es" ? "es-CR" : "en-US";
// UI strings are localized; scientific parameter codes, values and source metadata are never altered.
const spanishPhrases = {
  "Coordinates are required.": "Las coordenadas son obligatorias.",
  "Choose complete years between 1981 and 2025.": "Selecciona años completos entre 1981 y 2025.",
  "Select at least ten years for exploratory trend analysis.": "Selecciona al menos diez años para estimar la tendencia.",
  "Enter valid latitude and longitude.": "Ingresa coordenadas válidas.",
  "Awaiting new data": "Esperando nuevos datos",
  "Settings changed. Request NASA data or load the archived NASA sample.": "La configuración cambió. Consulta NASA o carga la muestra archivada.",
  "Yearly values from the selected NASA model grid point. The amber line shows the Theil–Sen estimate; it is not a forecast.": "Valores anuales de la celda del modelo NASA. La línea naranja muestra la estimación Theil–Sen; no es un pronóstico.",
  "Data origin": "Origen de los datos",
  "NASA source": "Fuente NASA",
  "POWER API version": "Versión de POWER API",
  "Original units": "Unidades originales",
  "Reported coordinates": "Coordenadas reportadas",
  "Dataset retrieved": "Fecha de obtención",
  "Sample count": "Cantidad de años",
  "Source hash": "Huella de archivo",
  "Not provided": "No especificado",
  "Unknown": "Desconocido",
  "Use downloaded response": "Consultar respuesta original",
  "Original NASA archive and execution ↗": "Ver archivo original y ejecución NASA ↗",
  "Original NASA POWER request ↗": "Ver solicitud NASA POWER ↗",
  "Air temperature at 2 m": "Temperatura del aire a 2 m",
  "Annual precipitation": "Precipitación anual",
  "Fewer than ten complete annual observations were available. Check the period and data coverage.": "Se obtuvieron menos de diez años completos. Revisa el período y la cobertura.",
  "Estimated upward direction": "Dirección estimada ascendente",
  "Estimated downward direction": "Dirección estimada descendente",
  "No estimated direction": "Sin dirección estimada",
  " years": " años",
  " months per year": " meses por año",
  "Lag-1 residual correlation: insufficient consecutive pairs.": "Correlación residual de retardo 1: no hay suficientes pares consecutivos.",
  "Lag-1 residual correlation (diagnostic only): ": "Correlación residual de retardo 1 (solo diagnóstico): ",
  " using ": " con ",
  " consecutive-year pairs.": " pares de años consecutivos.",
  "Selected location": "Ubicación seleccionada",
  " Precipitation records show large long-term differences; product homogeneity and independent validation have not yet been established.": " La precipitación presenta diferencias históricas muy grandes; aún no se ha comprobado la homogeneidad del producto ni su validación independiente.",
  "Source loaded. Trend calculated from ": "Fuente cargada. Tendencia calculada con ",
  " complete annual values. Statistical interpretation is provisional.": " valores anuales completos. La interpretación estadística es provisional.",
  "Archived samples are available only for Liberia and Limón.": "Las muestras archivadas solo están disponibles para Liberia y Limón.",
  "Loading archived original NASA-derived annual series…": "Cargando series anuales archivadas obtenidas de NASA…",
  "Archived data file unavailable (HTTP ": "Archivo archivado no disponible (HTTP ",
  "Archive load failed: ": "Error al cargar el archivo: ",
  " You can still request live NASA POWER data or import a saved JSON response.": " Aún puedes consultar NASA en vivo o importar un JSON guardado.",
  "Requesting historical NASA POWER data. This may take a moment.": "Consultando datos históricos de NASA POWER…",
  "NASA returned HTTP ": "NASA devolvió HTTP ",
  "Returned NASA coordinates do not match the requested point.": "Las coordenadas de NASA no coinciden con el punto solicitado.",
  "NASA request failed: ": "No se pudo consultar NASA: ",
  "time limit exceeded": "se excedió el tiempo límite",
  ". If the browser blocks cross-origin requests, load the archived sample or import NASA JSON.": ". Si el navegador bloquea solicitudes entre dominios, utiliza la muestra archivada o importa un JSON de NASA.",
  "This file's reported point differs from selected coordinates.": "El punto del archivo difiere de las coordenadas seleccionadas.",
  "IMPORTED NASA POWER JSON (verify origin)": "JSON NASA POWER IMPORTADO (verificar origen)",
  "Unknown: locally imported file": "Desconocida: archivo importado",
  "Cannot import source file: ": "No se pudo importar el archivo: ",
  "NASA POWER LIVE JSON": "NASA POWER EN VIVO",
  "ARCHIVED NASA POWER · EXP-001": "NASA POWER ARCHIVADO · EXP-001",
  "NASA annual archive covers only T2M and PRECTOTCORR. Choose Live NASA for the selected variable.": "El archivo NASA contiene únicamente T2M y PRECTOTCORR. Para esta variable selecciona la consulta NASA en vivo.",
  "Annual circular mean of monthly wind directions. A linear trend and original Mann–Kendall p-value are not appropriate for angles.": "Media anual circular de direcciones mensuales del viento. Una tendencia lineal y el valor p original de Mann–Kendall no son adecuados para ángulos.",
  "Not applicable to circular wind direction": "No aplica a la dirección circular del viento",
  "Wind direction is circular: 359° is adjacent to 1°. The markers display circular annual summaries; no linear trend is drawn.": "La dirección del viento es circular: 359° está junto a 1°. Los puntos muestran resúmenes anuales circulares; no se dibuja tendencia lineal.",
  "NASA POWER field": "Campo NASA POWER",
  "Annual aggregation": "Agregación anual",
  "NASA community": "Comunidad NASA",
  "Day-weighted mean": "Media ponderada por días",
  "Day-weighted monthly rate accumulated into annual total": "Tasa mensual acumulada por días hasta total anual",
  "Circular mean of monthly bearings": "Media circular de direcciones mensuales",
  "Selected scientific parameter": "Parámetro científico seleccionado"
};
function L(value) {
  let result = String(value);
  if (uiLanguage === "es") {
    for (const [original, translated] of Object.entries(spanishPhrases))
      result = result.replaceAll(original, translated);
  }
  return result;
}
const byId = id => document.getElementById(id);
const form = byId("explore-form");
const fields = {place:byId("location"), lat:byId("latitude"),lon:byId("longitude"),
  variable:byId("variable"), start:byId("from-year"),end:byId("to-year")};
const known = {liberia:[10.63,-85.44],limon:[9.99,-83.03]};
let active = null;
let evidenceContext = null;
let comparisonContext = "";
byId("evidence-form")?.addEventListener("submit", event => {
  event.preventDefault();
  byId("evidence-answer").textContent = answerEvidence(byId("evidence-question").value,evidenceContext,comparisonContext);
});

function setMessage(message, error=false) {
  const box = byId("message");
  box.textContent = L(message);
  box.classList.toggle("error", error);
}
function bounds() {
  if (!fields.lat.value.trim() || !fields.lon.value.trim()) throw new Error("Coordinates are required.");
  const start = Number(fields.start.value), end = Number(fields.end.value),
    lat = Number(fields.lat.value), lon=Number(fields.lon.value);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end ||
      start < 1981 || end > 2025) throw new Error("Choose complete years between 1981 and 2025.");
  if (end-start+1 < 10) throw new Error("Select at least ten years for exploratory trend analysis.");
  if (![lat,lon].every(Number.isFinite) || Math.abs(lat)>90 || Math.abs(lon)>180)
    throw new Error("Enter valid latitude and longitude.");
  return {lat,lon,start,end};
}
function updateVariableGuide() {
  const v=VARIABLES[fields.variable.value];
  if(!v)return;
  const guide=byId("variable-guide");
  if(guide)guide.textContent=(uiLanguage==="es"?v.nameEs:v.name)+
    " · "+(uiLanguage==="es"?v.descriptionEs:v.descriptionEn)+" · "+
    v.unit+" · NASA POWER ("+v.community+") · "+
    (v.aggregation==="sum_rate"?
      (uiLanguage==="es"?"suma anual de la precipitación":"annual sum of precipitation"):
     v.aggregation==="circular"?
      (uiLanguage==="es"?"dirección circular; sin tendencia lineal":"circular bearing; no linear trend"):
      (uiLanguage==="es"?"media anual ponderada por días":"day-weighted annual mean"));
  const allowedArchive=["T2M","PRECTOTCORR"].includes(fields.variable.value)
    &&fields.place.value!=="custom";
  byId("snapshot-btn").disabled=!allowedArchive;
  byId("snapshot-btn").title=allowedArchive?"":L(
    "NASA annual archive covers only T2M and PRECTOTCORR. Choose Live NASA for the selected variable.");
}
function resetWhenChanged() {
  updateVariableGuide();
  active = null;
  evidenceContext = null;
  comparisonContext = "";
  byId("results").hidden = true;
  byId("source-mode").textContent = L("Awaiting new data");
  setMessage("Settings changed. Request NASA data or load the archived NASA sample.");
}
function updateCoordinates() {
  const custom = fields.place.value === "custom";
  fields.lat.readOnly = fields.lon.readOnly = !custom;
  updateVariableGuide();
  if (!custom) [fields.lat.value, fields.lon.value] = known[fields.place.value];
  resetWhenChanged();
}
fields.place.addEventListener("change", updateCoordinates);
byId("question-presets")?.addEventListener("click",event=>{
  const choice=event.target.closest("button[data-question-variable]");
  if(!choice || !Object.hasOwn(VARIABLES,choice.dataset.questionVariable))return;
  fields.variable.value=choice.dataset.questionVariable;
  resetWhenChanged();
  fields.variable.focus();
});

for (const el of [fields.variable,fields.start,fields.end,fields.lat,fields.lon])
  el.addEventListener("change", resetWhenChanged);

function node(tag, attrs={}, text=null) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key,value] of Object.entries(attrs)) n.setAttribute(key,String(value));
  if (text !== null) n.textContent = text;
  return n;
}
function renderChart(points, analysis, variable) {
  const svg=byId("trend-chart"); svg.replaceChildren();
  const W=760,H=350,pad={l:70,r:22,t:22,b:42};
  const X0=points[0].year, X1=points[points.length-1].year;
  const vals=points.map(p=>p.value);
  const circular=VARIABLES[variable].aggregation==="circular";
  const lineA=circular?null:analysis.intercept;
  const lineB=circular?null:analysis.intercept+analysis.slope*(X1-X0);
  let lo=circular?0:Math.min(...vals,lineA,lineB);
  let hi=circular?360:Math.max(...vals,lineA,lineB);
  if (hi===lo){lo-=1;hi+=1;} else {const extra=(hi-lo)*.11;lo-=extra;hi+=extra;}
  const x=year=>pad.l + (year-X0)/(X1-X0)*(W-pad.l-pad.r);
  const y=value=>H-pad.b - (value-lo)/(hi-lo)*(H-pad.t-pad.b);
  for(let i=0;i<=4;i++){
    const v=lo+(hi-lo)*i/4,cy=y(v);
    svg.append(node("line",{x1:pad.l,x2:W-pad.r,y1:cy,y2:cy,stroke:"#bdd7d6","stroke-opacity":0.14,"stroke-dasharray":"4 6"}));
    svg.append(node("text",{x:pad.l-11,y:cy+4,"text-anchor":"end",fill:"#a4b9bd","font-size":12}, v.toFixed(circular?0:VARIABLES[variable].unit==="°C"?1:VARIABLES[variable].unit==="fraction"?2:0)));
  }
  for(let i=0;i<=4;i++){
    const yr=Math.round(X0+(X1-X0)*i/4);
    svg.append(node("text",{x:x(yr),y:H-13,"text-anchor":"middle",fill:"#a4b9bd","font-size":12},yr));
  }
  if(!circular){
    const pointsPath=points.map((p,i)=>(i?"L":"M")+x(p.year).toFixed(2)+","+y(p.value).toFixed(2)).join(" ");
    svg.append(node("path",{d:pointsPath,fill:"none",stroke:"#79d5ce","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"}));
    svg.append(node("path",{d:"M"+x(X0)+","+y(lineA)+" L"+x(X1)+","+y(lineB),fill:"none",stroke:"#efb779","stroke-width":2.7,"stroke-dasharray":"8 6","stroke-linecap":"round"}));
  }
  points.forEach(p=>{
    const circle=node("circle",{cx:x(p.year),cy:y(p.value),r:3.7,fill:"#9de6dc","fill-opacity":.86,tabindex:"0"});
    circle.append(node("title",{},p.year+": "+p.value.toFixed(variable==="WD10M"?1:2)+" "+VARIABLES[variable].unit));
    svg.append(circle);
  });
  byId("chart-caption").textContent=L(circular?
    "Wind direction is circular: 359° is adjacent to 1°. The markers display circular annual summaries; no linear trend is drawn.":
    "Yearly values from the selected NASA model grid point. The amber line shows the Theil–Sen estimate; it is not a forecast.");
  byId("chart-legend").hidden=circular;
}
function display(n, value) {byId(n).textContent=L(value);}
function renderProvenance(meta,variable,n) {
  const values=[
    ["Data origin",meta.kind],
    ["NASA source",meta.source],
    ["POWER API version",meta.version],
    ["Original units",meta.originalUnit],
    ["NASA POWER field",variable],
    ["NASA community",meta.community||VARIABLES[variable].community],
    ["Annual aggregation",meta.aggregation==="sum_rate"?
      "Day-weighted monthly rate accumulated into annual total":
      meta.aggregation==="circular"?"Circular mean of monthly bearings":"Day-weighted mean"],
    ["Reported coordinates",Array.isArray(meta.resolvedCoordinates)?meta.resolvedCoordinates.map(x=>Number(x).toFixed(3)).join(", "):"Not provided"],
    ["Dataset retrieved",meta.retrievedUtc||"Unknown"],
    ["Sample count",String(n)],
    ["Source hash",meta.rawSha256 ? meta.rawSha256.slice(0,16)+"…":"Use downloaded response"]
  ];
  const dl=byId("provenance");dl.replaceChildren();
  for(const [label,value] of values){
    const dt=document.createElement("dt"),dd=document.createElement("dd");
    dt.textContent=L(label);dd.textContent=L(value);dl.append(dt,dd);
  }
  const a=byId("source-link");
  a.href=meta.archiveLink || active?.queryUrl || "https://power.larc.nasa.gov/";
  a.textContent=L(meta.archiveLink ? "Original NASA archive and execution ↗" : "Original NASA POWER request ↗");
}
function renderTable(points,variable){
  const body=byId("annual-rows");body.replaceChildren();
  for(const p of points){
    const tr=document.createElement("tr"),th=document.createElement("th"),td=document.createElement("td");
    th.textContent=String(p.year);th.scope="row";
    td.textContent=p.value.toLocaleString(locale,{minimumFractionDigits:variable==="PRECTOTCORR"?1:2,maximumFractionDigits:2});
    tr.append(th,td);body.append(tr);
  }
  byId("unit-header").textContent=L(VARIABLES[variable].name)+" ("+VARIABLES[variable].unit+")";
}
function acceptData(output, queryUrl=null, paired=null){
  const variable=fields.variable.value;
  const def=VARIABLES[variable];
  const circular=def.aggregation==="circular";
  const ordered=[...output.points].sort((a,b)=>a.year-b.year);
  const result=circular?
    {status:"descriptive",points:ordered,n:ordered.length,
     start:ordered[0]?.year,end:ordered.at(-1)?.year}:
    analyze(ordered);
  if(result.n<10 || !["exploratory","descriptive"].includes(result.status)){
    active=null;byId("results").hidden=true;
    setMessage("Fewer than ten complete annual observations were available. Check the period and data coverage.",true);
    return;
  }
  active={points:result.points,analysis:result,variable,meta:output.meta,queryUrl};
  byId("results").hidden=false;
  const fmt=(x,d=2)=>Number(x).toLocaleString(locale,{minimumFractionDigits:d,maximumFractionDigits:d});
  display("slope-value",circular?"—":(result.slopePerDecade>=0?"+":"")+fmt(result.slopePerDecade)+" "+def.slopeUnit);
  display("slope-direction",circular?"Not applicable to circular wind direction":
    result.slopePerDecade>0?"Estimated upward direction":
    result.slopePerDecade<0?"Estimated downward direction":"No estimated direction");
  display("sample-value",String(result.n)+" years");
  display("sample-period",result.start+"–"+result.end+" · 12/12 months per year");
  display("p-value",circular?"—":result.mk.p<.001?"< 0.001":result.mk.p.toFixed(4));
  display("p-value-note",circular?"Not applicable to circular wind direction":
    uiLanguage==="es"?"Exploratorio; independencia no verificada":"Exploratory; independence unverified");
  display("autocorr-note",circular?"Annual circular mean of monthly wind directions. A linear trend and original Mann–Kendall p-value are not appropriate for angles.":
    result.lag1===null?"Lag-1 residual correlation: insufficient consecutive pairs.":
    "Lag-1 residual correlation (diagnostic only): "+result.lag1.toFixed(3)+" using "+result.lag1Pairs+" consecutive-year pairs.");
  display("chart-title",L(VARIABLES[variable].name)+" · "+(fields.place.selectedOptions[0]?.textContent||L("Selected location")));
  renderChart(result.points,result,variable);
  renderTable(result.points,variable);
  renderProvenance(output.meta,variable,result.n);
  byId("source-mode").textContent=L(output.meta.kind);
  const warning=variable==="PRECTOTCORR"?
    " Precipitation records show large long-term differences; product homogeneity and independent validation have not yet been established.":"";
  setMessage(circular?
    "Annual circular mean of monthly wind directions. A linear trend and original Mann–Kendall p-value are not appropriate for angles.":
    "Source loaded. Trend calculated from "+result.n+" complete annual values. Statistical interpretation is provisional."+warning);
  const placeName=fields.place.selectedOptions[0]?.textContent||"NASA point";
  evidenceContext=buildEvidence(result,variable,placeName,output.meta.source,uiLanguage);
  byId("evidence-brief").textContent=evidenceContext?.summary||"—";
  byId("evidence-caveat").textContent=evidenceContext?.caution||"—";
  comparisonContext=!circular && paired?.status==="exploratory"
    ? compareEvidence(result,paired,placeName,fields.place.value==="liberia"?"Limón":"Liberia",uiLanguage) : "";
  const compare=byId("comparison-output");
  compare.hidden=!comparisonContext;
  compare.textContent=comparisonContext;
  byId("evidence-answer").textContent=uiLanguage==="es"?"Pregunta por tendencias, fuente, limitaciones o comparación.":"Ask about trends, source, limitations or comparison.";
}
async function snapshot(){
  try{
    const {start,end}=bounds();
    if(fields.place.value==="custom") throw new Error("Archived samples are available only for Liberia and Limón.");
    if(!["T2M","PRECTOTCORR"].includes(fields.variable.value))
      throw new Error("NASA annual archive covers only T2M and PRECTOTCORR. Choose Live NASA for the selected variable.");
    setMessage("Loading archived original NASA-derived annual series…");
    const response=await fetch("/telluris/explore/data/exp001-annual.json",{cache:"no-cache"});
    if(!response.ok) throw new Error("Archived data file unavailable (HTTP "+response.status+").");
    const archive=await response.json();
    const current=fromSnapshot(archive,fields.place.value,fields.variable.value,start,end);
    const otherPlace=fields.place.value==="liberia"?"limon":"liberia";
    const paired=analyze(fromSnapshot(archive,otherPlace,fields.variable.value,start,end).points);
    acceptData(current,null,paired);
  }catch(e){
    byId("results").hidden=true;
    setMessage("Archive load failed: "+e.message+" You can still request live NASA POWER data or import a saved JSON response.",true);
  }
}
byId("snapshot-btn").addEventListener("click",snapshot);
form.addEventListener("submit",async event=>{
  event.preventDefault();
  let cfg;
  try{cfg=bounds();}catch(e){setMessage(e.message,true);return;}
  const query=powerUrl(cfg.lat,cfg.lon,cfg.start,cfg.end,fields.variable.value);
  const controller=new AbortController();
  const button=byId("live-btn");button.disabled=true;
  const timeout=setTimeout(()=>controller.abort(),60000);
  setMessage("Requesting historical NASA POWER data. This may take a moment.");
  try{
    const response=await fetch(query,{signal:controller.signal,mode:"cors"});
    if(!response.ok) throw new Error("NASA returned HTTP "+response.status);
    const payload=await response.json();
    if(!Array.isArray(payload.geometry?.coordinates) ||
        Math.abs(Number(payload.geometry.coordinates[0])-cfg.lon)>.1 ||
        Math.abs(Number(payload.geometry.coordinates[1])-cfg.lat)>.1)
      throw new Error("Returned NASA coordinates do not match the requested point.");
    acceptData(fromPower(payload,fields.variable.value,cfg.start,cfg.end),query);
  }catch(e){
    setMessage("NASA request failed: "+(e.name==="AbortError"?"time limit exceeded":e.message)+
      ". If the browser blocks cross-origin requests, load the archived sample or import NASA JSON.",true);
  }finally{clearTimeout(timeout);button.disabled=false;}
});
byId("file-input").addEventListener("change",async event=>{
  const file=event.target.files&&event.target.files[0];if(!file)return;
  try{
    const cfg=bounds(),payload=JSON.parse(await file.text());
    if(!Array.isArray(payload.geometry?.coordinates) ||
       Math.abs(Number(payload.geometry.coordinates[0])-cfg.lon)>.1 ||
       Math.abs(Number(payload.geometry.coordinates[1])-cfg.lat)>.1)
      throw new Error("This file's reported point differs from selected coordinates.");
    const parsed=fromPower(payload,fields.variable.value,cfg.start,cfg.end);
    parsed.meta.kind="IMPORTED NASA POWER JSON (verify origin)";
    parsed.meta.retrievedUtc="Unknown: locally imported file";
    acceptData(parsed);
  }catch(e){setMessage("Cannot import source file: "+e.message,true);}
});
byId("download-csv").addEventListener("click",()=>{
  if(!active)return;
  const title="year,value_"+active.variable.toLowerCase();
  const meta="# unit: "+VARIABLES[active.variable].unit+"; annual aggregation: "+VARIABLES[active.variable].aggregation;
  const lines=[meta,title,...active.points.map(p=>p.year+","+p.value)];
  const blob=new Blob([lines.join("\n")+"\n"],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="telluris_"+fields.place.value+"_"+active.variable+"_"+active.analysis.start+"-"+active.analysis.end+".csv";
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
});
const selectedCode=new URLSearchParams(window.location.search).get("variable");
if(selectedCode && Object.hasOwn(VARIABLES,selectedCode)){
  fields.variable.value=selectedCode;
}
updateVariableGuide();
if(["T2M","PRECTOTCORR"].includes(fields.variable.value))snapshot();
else setMessage("Settings changed. Request NASA data or load the archived NASA sample.");
