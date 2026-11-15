/* TELLURIS EXP-009 · source-grounded multi-zone Research Observatory.
 * NASA POWER monthly point API accepts up to 20 codes / point, per community.
 * Visual matrix slopes = descriptive estimates, NEVER 18 validated p-values.
 */
import {VARIABLES} from "./science.js";
import {chosenCodes,siteCount,planBatches,parseBatch,parseArchive,
        matrixRows,summarizeInvestigation,groundedAnswer,coMovementClues,
        buildMatrixEvidence,matrixCSV} from "./matrix-core.js";

const root=document.getElementById("observatory");
if(root){
const el=id=>document.getElementById(id);
const es=document.documentElement.lang.startsWith("es");
const L=(esText,enText)=>es?esText:enText;
const locale=es?"es-CR":"en-US";
const N=(x,d=2)=>Number.isFinite(x)?Number(x).toLocaleString(locale,{
  minimumFractionDigits:0,maximumFractionDigits:d}):"—";
const known={
  liberia:{lat:10.63,lon:-85.44},
  limon:{lat:9.99,lon:-83.03}
};
const form={
  place:el("location"),lat:el("latitude"),lon:el("longitude"),
  variable:el("variable"),start:el("from-year"),end:el("to-year")
};
const second={place:el("obs-other-place"),lat:el("obs-other-lat"),lon:el("obs-other-lon")};
const primary={
  place:el("obs-main-place"),variable:el("obs-main-variable"),
  lat:el("obs-main-lat"),lon:el("obs-main-lon"),
  start:el("obs-main-start"),end:el("obs-main-end")
};
for(const child of form.variable.children)
  primary.variable.append(child.cloneNode(true));
const run=el("obs-run-live"),archiveButton=el("obs-run-archive"),cancel=el("obs-cancel");
const status=el("obs-status"),results=el("obs-results"),summary=el("obs-summary");
const matrixHead=el("obs-head"),matrixBody=el("obs-rows");
const focusTitle=el("obs-focus-title"),focusDetail=el("obs-focus-detail");
const focusChart=el("obs-chart"),sourceLink=el("obs-source-link");
const insight=el("obs-explanation"),answer=el("obs-answer");
let mode="all-two",controller=null,generation=0,current=null,selectedCode="T2M";
const localeCode=(code)=>es?VARIABLES[code].nameEs:VARIABLES[code].name;

function announce(message,problem=false){
  status.textContent=message;
  status.classList.toggle("obs-error",problem);
}
function setBusy(busy){
  run.disabled=busy;archiveButton.disabled=busy;
  cancel.hidden=!busy;
  root.setAttribute("aria-busy",String(busy));
}
function setMode(value){
  mode=value;
  root.querySelectorAll("[data-obs-mode]").forEach(b=>{
    b.setAttribute("aria-pressed",String(b.dataset.obsMode===mode));
  });
  el("obs-second-controls").hidden=siteCount(mode)===1;
  el("obs-single-hint").hidden=!mode.startsWith("one");
  el("obs-family-filter").value="all";
  cancelCurrent();
  results.hidden=true;
  announce(L("Modo seleccionado: elige consultar NASA o usar la muestra archivada.",
             "Mode selected: request NASA data or use the archived sample."));
}
function cancelCurrent(){
  generation++;controller?.abort();controller=null;
  setBusy(false);
}
function getLocations(){
  const lat=Number(form.lat.value),lon=Number(form.lon.value);
  if(!form.lat.value.trim()||!form.lon.value.trim()||
     !Number.isFinite(lat)||!Number.isFinite(lon)||
     Math.abs(lat)>90||Math.abs(lon)>180)
    throw Error(L("Primera zona: coordenadas inválidas.","First location: invalid coordinates."));
  const place=form.place.value;
  const first={
    id:place==="custom"?"custom-a":place,
    label:form.place.selectedOptions[0]?.textContent||"A",lat,lon
  };
  if(siteCount(mode)===1)return [first];
  const id=second.place.value,lat2=Number(second.lat.value),lon2=Number(second.lon.value);
  if(!second.lat.value.trim()||!second.lon.value.trim()||
     !Number.isFinite(lat2)||!Number.isFinite(lon2)||
     Math.abs(lat2)>90||Math.abs(lon2)>180)
    throw Error(L("Segunda zona: coordenadas inválidas.","Second location: invalid coordinates."));
  const other={id:id==="custom"?"custom-b":id,
    label:second.place.selectedOptions[0]?.textContent||"B",lat:lat2,lon:lon2};
  if(Math.abs(first.lat-other.lat)<.0001&&Math.abs(first.lon-other.lon)<.0001)
    throw Error(L("Elige dos coordenadas distintas para comparar.",
                  "Choose two distinct coordinates for comparison."));
  return [first,other];
}
function getBounds(){
  const start=Number(form.start.value),end=Number(form.end.value);
  if(!Number.isInteger(start)||!Number.isInteger(end)||
     start<1981||end>2025||start>end||end-start+1<10)
    throw Error(L("Selecciona al menos diez años completos entre 1981 y 2025.",
                  "Select at least ten complete years between 1981 and 2025."));
  return {start,end};
}
function updateSecond(){
  const id=second.place.value,custom=id==="custom";
  second.lat.readOnly=second.lon.readOnly=!custom;
  if(!custom){
    second.lat.value=known[id].lat;
    second.lon.value=known[id].lon;
  }
}
function syncPrimary(){
  primary.place.value=form.place.value;
  primary.variable.value=form.variable.value;
  primary.lat.value=form.lat.value;
  primary.lon.value=form.lon.value;
  primary.start.value=form.start.value;
  primary.end.value=form.end.value;
  primary.lat.readOnly=primary.lon.readOnly=form.place.value!=="custom";
  const lat=Number(form.lat.value),lon=Number(form.lon.value);
  const label=form.place.selectedOptions[0]?.textContent||
    L("Coordenadas seleccionadas","Selected coordinates");
  el("obs-primary-label").textContent=label+" · "+
    (Number.isFinite(lat)?N(lat,3):"—")+"°, "+
    (Number.isFinite(lon)?N(lon,3):"—")+"°";
}
function syncSecond(){
  const selected=form.place.value;
  if(selected==="liberia"&&second.place.value==="liberia")
    second.place.value="limon";
  else if(selected==="limon"&&second.place.value==="limon")
    second.place.value="liberia";
  updateSecond();
  syncPrimary();
}
function clearResult(){
  if(current){
    current=null;
    results.hidden=true;
    announce(L("La configuración cambió. Ejecuta nuevamente la investigación.",
               "Configuration changed. Run the investigation again."));
  }
  cancelCurrent();
}
second.place.addEventListener("change",()=>{updateSecond();clearResult();});
primary.place.addEventListener("change",()=>{
  form.place.value=primary.place.value;
  form.place.dispatchEvent(new Event("change",{bubbles:true}));
});
for(const key of ["variable","lat","lon","start","end"]){
  primary[key].addEventListener("change",()=>{
    if(["lat","lon"].includes(key)&&form.place.value!=="custom")return;
    form[key].value=primary[key].value;
    form[key].dispatchEvent(new Event("change",{bubbles:true}));
  });
}
for(const f of [second.lat,second.lon,form.lat,form.lon,
  form.place,form.variable,form.start,form.end])
  f.addEventListener("change",()=>{
    if(f===form.place)syncSecond();
    syncPrimary();
    clearResult();
  });
root.querySelectorAll("[data-obs-mode]").forEach(b=>
  b.addEventListener("click",()=>setMode(b.dataset.obsMode)));

async function loadSource(fromArchive){
  cancelCurrent();
  const token=++generation,ac=new AbortController();
  controller=ac;
  let sites,codes,start,end;
  try{
    ({start,end}=getBounds());
    sites=getLocations();
    codes=chosenCodes(mode,form.variable.value);
  }catch(error){announce(error.message,true);controller=null;return;}
  setBusy(true);results.hidden=true;
  const output={};for(const site of sites)output[site.id]={};
  let completed=0;
  try{
    if(fromArchive){
      if(sites.some(s=>!["liberia","limon"].includes(s.id)))
        throw Error(L("La muestra científica cubre únicamente Liberia y Limón. Usa NASA en vivo para otras coordenadas.",
          "The archived sample covers only Liberia and Limón. Use live NASA for custom coordinates."));
      announce(L("Cargando archivo original NASA EXP-001 (solo T2M y precipitación)…",
        "Loading original NASA EXP-001 archive (T2M and precipitation only)…"));
      const res=await fetch("/telluris/explore/data/exp001-annual.json",{
        signal:ac.signal,cache:"no-cache"
      });
      if(!res.ok)throw Error("Archive HTTP "+res.status);
      const data=await res.json();
      if(token!==generation)return;
      Object.assign(output,parseArchive(data,sites,codes,start,end));
    }else{
      const batches=planBatches(sites,codes,start,end);
      // Sequential batches avoid a burst of 4 simultaneous 41-year NASA requests.
      // Source-community failures are tracked separately, never replaced with fictitious values.
      for(const batch of batches){
        if(ac.signal.aborted)throw Error("Aborted");
        announce(L("NASA POWER: consulta ","NASA POWER: request ")+
          (completed+1)+"/"+batches.length+" · "+batch.site.label+" · "+
          batch.community+" ("+batch.codes.length+" "+L("variables","variables")+")");
        try{
          const response=await fetch(batch.url,{signal:ac.signal,mode:"cors"});
          if(!response.ok)throw Error("NASA HTTP "+response.status);
          const payload=await response.json();
          if(token!==generation)return;
          Object.assign(output[batch.siteId],parseBatch(payload,batch,start,end));
        }catch(error){
          if(ac.signal.aborted)throw error;
          for(const code of batch.codes){
            output[batch.siteId][code]={status:"unavailable",reason:error.message};
          }
        }
        completed++;
      }
    }
    if(token!==generation)return;
    const rows=matrixRows(codes,output,sites);
    current={rows,sites,mode,source:fromArchive?"archive":"NASA POWER LIVE",records:output,start,end};
    selectedCode=codes.includes(form.variable.value)?form.variable.value:codes[0];
    if(!rows.some(r=>r.code===selectedCode&&r.left.status!=="unavailable"))
      selectedCode=rows.find(r=>r.left.status==="descriptive")?.code||selectedCode;
    render();
    announce(fromArchive?
      L("Muestra NASA archivada cargada: solo 2 de las 18 variables disponen de series aquí.",
        "NASA archive loaded: only 2 of 18 variables have source series here."):
      L("Consulta NASA completada. Los datos ausentes se muestran como ausentes.",
        "NASA requests completed. Missing observations are disclosed as unavailable."));
  }catch(error){
    if(token!==generation)return;
    announce(error.name==="AbortError"?
      L("Consulta cancelada.","Request cancelled."):(error.message||String(error)),true);
  }finally{
    if(token===generation){controller=null;setBusy(false);}
  }
}
run.addEventListener("click",()=>loadSource(false));
archiveButton.addEventListener("click",()=>loadSource(true));
cancel.addEventListener("click",()=>{
  cancelCurrent();announce(L("Consulta cancelada por la persona usuaria.","Request cancelled by user."),true);
});
function node(tag,text="",cls=""){
  const result=document.createElement(tag);
  result.textContent=String(text);
  if(cls)result.className=cls;
  return result;
}
function cell(row,value,cls=""){
  const td=node("td",value,cls);row.append(td);return td;
}
function statusText(r,definition){
  if(!r)return "—";
  if(r.status==="circular")return L("Circular · sin pendiente lineal","Circular · no linear slope")+
    " · "+r.n+" "+L("años","years")+" ("+r.start+"–"+r.end+")";
  if(r.status!=="descriptive")return L("Sin datos verificables","Source unavailable");
  const direction=r.slopePerDecade>0?"↑":r.slopePerDecade<0?"↓":"↔";
  return direction+" "+N(r.slopePerDecade,3)+" "+definition.slopeUnit+
    " · "+r.n+" "+L("años","years")+" ("+r.start+"–"+r.end+")";
}
function filterFamily(row,family){
  if(family==="all")return true;
  const types={
    atmosphere:["T2M","T2M_MAX","T2M_MIN","RH2M","QV2M","PS","CLOUD_AMT"],
    wind:["WS10M","WD10M","U10M","V10M"],
    water:["PRECTOTCORR","GWETTOP","GWETROOT"],
    energy:["ALLSKY_SFC_SW_DWN","ALLSKY_SFC_LW_DWN","ALLSKY_SRF_ALB","EVPTRNS"]
  };
  return types[family]?.includes(row.code)??false;
}
function renderTable(){
  matrixHead.replaceChildren();matrixBody.replaceChildren();
  const two=current.sites.length===2;
  for(const h of [
    L("Variable NASA","NASA parameter"),current.sites[0].label,
    ...(two?[current.sites[1].label,L("Contraste pareado A − B","Matched difference A − B")]:[])
  ])matrixHead.append(node("th",h));
  const family=el("obs-family-filter").value;
  let shown=0;
  for(const row of current.rows){
    if(!filterFamily(row,family))continue;
    shown++;
    const tr=document.createElement("tr");
    tr.classList.toggle("obs-row-active",row.code===selectedCode);
    const variableTd=document.createElement("td");
    const select=node("button",localeCode(row.code),"obs-parameter-link");
    select.type="button";
    select.addEventListener("click",()=>{selectedCode=row.code;renderTable();renderFocus();});
    variableTd.append(select,node("small",row.code+" · "+row.definition.unit));
    tr.append(variableTd);
    const aCell=cell(tr,statusText(row.left,row.definition));
    aCell.title=row.left.reason||L("Pendiente descriptiva, sin significancia validada.",
      "Descriptive slope, no validated significance.");
    if(two){
      const bCell=cell(tr,statusText(row.right,row.definition));
      bCell.title=row.right?.reason||L("Pendiente descriptiva, no es una prueba de causalidad.",
        "Descriptive slope, not a causal test.");
      cell(tr,row.paired?.status==="descriptive"?
        N(row.paired.slopePerDecade,3)+" "+row.definition.slopeUnit+
          " · "+row.paired.n+" "+L("años comunes","matched years"):
        "—");
    }
    matrixBody.append(tr);
  }
  el("obs-count").textContent=shown+" / "+current.rows.length;
}
function svg(tag,attrs={},text=null){
  const x=document.createElementNS("http://www.w3.org/2000/svg",tag);
  for(const [key,val] of Object.entries(attrs))x.setAttribute(key,String(val));
  if(text!==null)x.textContent=String(text);
  return x;
}
function drawChart(row){
  focusChart.replaceChildren();
  const sequences=[
    {data:row.a?.points,color:"#a6edc9",label:current.sites[0].label},
    ...(row.b?.points?[{data:row.b.points,color:"#ffbb83",label:current.sites[1].label}]:[])
  ].filter(s=>s.data?.length);
  if(row.left.status==="circular"||!sequences.length){
    el("obs-chart-legend").replaceChildren();
    focusChart.setAttribute("aria-label",L("Sin gráfica anual: datos ausentes o variable circular.",
      "No annual chart: data missing or circular variable."));
    return;
  }
  const all=sequences.flatMap(s=>s.data).filter(p=>Number.isFinite(p.value));
  const start=Math.min(...all.map(p=>p.year)),end=Math.max(...all.map(p=>p.year));
  const min=Math.min(...all.map(p=>p.value)),max=Math.max(...all.map(p=>p.value));
  const range=max-min||1,w=720,h=260,l=55,r=15,t=24,b=38;
  const x=y=>l+(y-start)/Math.max(1,end-start)*(w-l-r);
  const y=v=>t+(1-(v-min)/range)*(h-t-b);
  focusChart.setAttribute("viewBox","0 0 "+w+" "+h);
  focusChart.setAttribute("role","img");
  focusChart.setAttribute("aria-label",L("Serie anual NASA, escala común en ","Annual NASA data, shared unit scale in ")+row.definition.unit);
  focusChart.append(svg("rect",{x:0,y:0,width:w,height:h,rx:13,fill:"#061e30"}));
  for(let i=0;i<=4;i++){
    const val=min+(range*i/4),yy=y(val);
    focusChart.append(svg("line",{x1:l,y1:yy,x2:w-r,y2:yy,stroke:"#335568","stroke-width":.8}));
    focusChart.append(svg("text",{x:l-8,y:yy+4,"text-anchor":"end",
      fill:"#b4d6db","font-size":10},N(val,1)));
  }
  focusChart.append(svg("text",{x:l,y:h-11,fill:"#aecad2","font-size":11},String(start)));
  focusChart.append(svg("text",{x:w-r,y:h-11,fill:"#aecad2","font-size":11,"text-anchor":"end"},String(end)));
  for(const s of sequences){
    const valid=s.data.filter(p=>Number.isFinite(p.value)).sort((a,b)=>a.year-b.year);
    if(valid.length<2)continue;
    const coords=valid.map(p=>x(p.year).toFixed(1)+","+y(p.value).toFixed(1)).join(" ");
    focusChart.append(svg("polyline",{points:coords,fill:"none",stroke:s.color,
      "stroke-width":2.5,"stroke-linejoin":"round","stroke-linecap":"round"}));
  }
  const legend=el("obs-chart-legend");legend.replaceChildren();
  for(const s of sequences) {
    const x=node("span",s.label);x.style.setProperty("--legend-color",s.color);
    legend.append(x);
  }
}
function renderFocus(){
  const row=current?.rows.find(r=>r.code===selectedCode);
  if(!row)return;
  focusTitle.textContent=localeCode(row.code)+" · "+row.code;
  focusDetail.textContent=L(
    "Cada línea muestra valores anuales de la MISMA variable en su unidad original ("+row.definition.unit+
      "). No compara magnitudes de unidades distintas. La pendiente es descriptiva.",
    "Each line shows annual observations for the SAME variable in original units ("+row.definition.unit+
      "). Different units are never plotted together. Slopes are descriptive.");
  drawChart(row);
  const links=el("obs-provenance");links.replaceChildren();
  for(const s of current.sites){
    const record=current.records[s.id]?.[row.code];
    const u=record?.sourceUrl||record?.data?.meta?.archiveLink;
    if(u&&/^https:\/\//.test(u)){
      const a=node("a",s.label+" · "+L("Fuente NASA ↗","NASA source ↗"));a.href=u;
      a.target="_blank";a.rel="noopener noreferrer";links.append(a);
    }
  }
  const detail=el("obs-drilldown");detail.disabled=!Object.hasOwn(VARIABLES,row.code);
}
function renderClues(){
  const grid=el("obs-clue-grid");grid.replaceChildren();
  const clues=coMovementClues(current.rows,current.sites);
  if(!clues.length){
    grid.append(node("p",L(
      "No hay suficientes pares de series NASA completas para contrastar cambios de años consecutivos. Prueba «Todas las variables» con NASA en vivo.",
      "Not enough complete NASA series for consecutive-year co-movement. Try All variables with live NASA."
    ),"obs-clue-empty"));
    return;
  }
  for(const clue of clues){
    const first=VARIABLES[clue.first],second=VARIABLES[clue.second];
    const card=node("article","","obs-clue");
    card.append(node("strong",(es?first.nameEs:first.name)+" / "+(es?second.nameEs:second.name)));
    for(const entry of clue.sites){
      const r=entry.r;
      const kind=r>.3?L("Cambios con dirección parecida","Changes moved in similar directions"):
        r<-.3?L("Cambios de dirección opuesta","Changes moved in opposite directions"):
          L("Asociación lineal débil","Weak linear association");
      card.append(node("p",entry.site+" · r = "+N(r,2)+" · "+
        entry.n+" "+L("pares anuales","matched annual changes")+" · "+kind));
    }
    card.append(node("small",L(
      "Asociación descriptiva dentro de productos NASA POWER compartidos. No implica causa, significancia ni independencia.",
      "Descriptive association within related NASA POWER products. Not causation, significance or independent validation."
    )));
    grid.append(card);
  }
}
function render(){
  results.hidden=false;
  const summaryData=summarizeInvestigation(current.rows,{
    lang:es?"es":"en",sites:current.sites
  });
  summary.textContent=summaryData.intro;
  el("obs-kpi-available").textContent=String(summaryData.available);
  el("obs-kpi-up").textContent=String(summaryData.inc);
  el("obs-kpi-down").textContent=String(summaryData.dec);
  el("obs-kpi-unavailable").textContent=String(summaryData.unavailable);
  const source=el("obs-source-kind");
  source.textContent=current.source==="archive"?
    L("NASA POWER · archivo anual original, 2 parámetros","NASA POWER · original annual archive, 2 parameters"):
    L("NASA POWER · solicitudes mensuales en vivo","NASA POWER · live monthly requests");
  insight.replaceChildren(node("p",summaryData.intro));
  for(const note of summaryData.notes)insight.append(node("p",note,"obs-caution"));
  renderTable();renderFocus();renderClues();
  answer.textContent=L("Pregunta por una variable, las diferencias, sus causas posibles o la confiabilidad.",
    "Ask about a variable, differences, possible causes or reliability.");
}
function downloadEvidence(kind){
  if(!current)return;
  const report=buildMatrixEvidence(current);
  const isCSV=kind==="csv";
  const text=isCSV?matrixCSV(report):JSON.stringify(report,null,2)+"\n";
  const blob=new Blob([text],{type:isCSV?"text/csv;charset=utf-8":"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;
  a.download="telluris_EXP009_"+current.mode+"_"+current.start+"-"+current.end+
    (isCSV?".csv":".json");
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
el("obs-export-csv").addEventListener("click",()=>downloadEvidence("csv"));
el("obs-export-json").addEventListener("click",()=>downloadEvidence("json"));
el("obs-family-filter").addEventListener("change",()=>{if(current)renderTable();});
el("obs-drilldown").addEventListener("click",()=>{
  if(!current)return;
  form.variable.value=selectedCode;
  form.variable.dispatchEvent(new Event("change",{bubbles:true}));
  form.variable.scrollIntoView({behavior:"smooth",block:"center"});
  form.variable.focus({preventScroll:true});
});
el("obs-question-form").addEventListener("submit",event=>{
  event.preventDefault();
  answer.textContent=groundedAnswer(el("obs-question").value,current?.rows,{
    lang:es?"es":"en",sites:current?.sites||[]
  });
});
root.querySelectorAll("[data-obs-prompt]").forEach(b=>
  b.addEventListener("click",()=>{
    el("obs-question").value=b.dataset.obsPrompt;
    answer.textContent=groundedAnswer(b.dataset.obsPrompt,current?.rows,{
      lang:es?"es":"en",sites:current?.sites||[]
    });
  }));
const defs={
 "sen":L("La pendiente Theil–Sen resume cuánto cambia una variable por década mediante la mediana de pendientes entre años. No predice el futuro.",
         "Theil–Sen is the median slope between annual observations, expressed per decade. It is not a forecast."),
 "pvalue":L("El valor p supone un modelo estadístico. Un valor pequeño no prueba causalidad ni certifica que una tendencia climática sea real; la dependencia temporal importa.",
            "A p-value is conditional on a statistical model. A small p-value does not prove causation or independently certify a climate trend."),
 "ci":L("Un intervalo de confianza depende de supuestos. Si incluye cero, una pendiente nula sigue siendo compatible con esos supuestos.",
        "A confidence interval depends on assumptions. If it includes zero, a zero slope remains compatible under those assumptions."),
 "paired":L("Contraste A − B: para cada año disponible en ambas zonas se resta B de A, y después se estima su cambio con el tiempo.",
            "Matched A − B: subtract B from A in each jointly observed year, then estimate the change of the differences over time."),
 "model":L("NASA POWER combina fuentes modeladas y satelitales en celdas geográficas. No es un termómetro ni pluviómetro físico ubicado en ese punto.",
           "NASA POWER combines modeled and satellite sources on grids. It is not a physical thermometer or rain gauge at the exact point.")
};
root.querySelectorAll("[data-obs-term]").forEach(b=>
  b.addEventListener("click",()=>{
    el("obs-glossary-answer").textContent=defs[b.dataset.obsTerm]||"";
  }));

syncSecond();
setMode("all-two");
}
