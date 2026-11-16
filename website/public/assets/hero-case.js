/* EXP-016 — A short, user-controlled evidence story on slide 00.
 * The only plotted numbers are taken from the checked-in, original NASA POWER
 * EXP-001 archive. Trends remain descriptive and not climate attribution.
 */
export const STORY=Object.freeze({
 es:[
  {eyebrow:"01 / EL PROBLEMA",heading:"Tener datos no es comprender la Tierra.",
   body:"Una gráfica puede mostrar una tendencia, pero no decirnos si proviene de variabilidad natural, de un cambio físico o de limitaciones de la fuente. Necesitamos preguntar, comparar y verificar."},
  {eyebrow:"02 / EL CASO REAL",heading:"Dos lugares. 41 años de evidencia.",
   body:"Analizamos temperatura NASA POWER de 1985 a 2025 en celdas próximas a Liberia y Limón. Las pendientes estimadas difieren, pero no demuestran por sí solas un cambio climático validado."},
  {eyebrow:"03 / EL POTENCIAL",heading:"De investigar el clima a abrir nuevas preguntas.",
   body:"La misma metodología podría ampliarse a vegetación, agua y caracterización preliminar de zonas de ensayo científico terrestre. Son posibilidades futuras, no servicios operativos ni criterios para lanzar cohetes."}
 ],
 en:[
  {eyebrow:"01 / THE PROBLEM",heading:"Having data is not understanding Earth.",
   body:"A graph can reveal a trend without telling us whether it reflects natural variability, a physical change, or limitations in the source. We need to ask, compare, and verify."},
  {eyebrow:"02 / THE REAL CASE",heading:"Two places. 41 years of evidence.",
   body:"We examined NASA POWER temperature from 1985 to 2025 in grid cells near Liberia and Limón. Estimated slopes differ, but alone they do not establish a validated climate change finding."},
  {eyebrow:"03 / FUTURE POTENTIAL",heading:"From climate questions to new research.",
   body:"This method could expand to vegetation, water and preliminary environmental characterization of Earth-based research sites. These are future possibilities, not operational services or rocket launch criteria."}
 ]
});
const YEARS=Object.freeze({start:1985,end:2025,count:41});
export function checkedAnnualSeries(archive){
 if(!archive||archive.schema!=="telluris.exp001.annual.v1"||
    archive.dataset!=="NASA POWER Monthly Point MERRA2"||
    archive.units?.T2M!=="C"||archive.period?.[0]!==YEARS.start||
    archive.period?.[1]!==YEARS.end)throw new Error("Unexpected NASA archive");
 const out={};
 for(const key of ["liberia","limon"]){
  const site=archive.locations?.[key],series=site?.series;
  if(!Array.isArray(series)||series.length!==YEARS.count||
     !Array.isArray(site.coordinates)||!site.sha256)throw new Error("Incomplete NASA source: "+key);
  out[key]=series.map((r,i)=>{
   if(!Array.isArray(r)||r.length!==3||r[0]!==YEARS.start+i||
      !Number.isFinite(r[1]))throw new Error("Invalid NASA annual record: "+key);
   return {year:r[0],value:r[1]};
  });
 }
 return out;
}
export function plotPoints(rows,lower,upper){
 if(!Array.isArray(rows)||rows.length!==41||!(upper>lower))throw new Error("Invalid T2M plot");
 return rows.map(p=>{
  const x=40+(p.year-YEARS.start)/40*414;
  const y=196-(p.value-lower)/(upper-lower)*139;
  return x.toFixed(2)+","+y.toFixed(2);
 }).join(" ");
}
export function renderPlot(svg,archive,lang="es"){
 const rows=checkedAnnualSeries(archive);
 const vals=[...rows.liberia,...rows.limon].map(x=>x.value);
 const lo=Math.floor((Math.min(...vals)-.25)*2)/2;
 const hi=Math.ceil((Math.max(...vals)+.25)*2)/2;
 const g=svg.querySelector("[data-case-series]");
 if(!g)throw new Error("Chart element missing");
 const NS="http://www.w3.org/2000/svg";
 while(g.firstChild)g.removeChild(g.firstChild);
 function node(tag,attrs={},value=null){
  const el=svg.ownerDocument.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
  if(value!==null)el.textContent=String(value);
  g.appendChild(el);return el;
 }
 for(let i=0;i<3;i++){
  const v=lo+(hi-lo)*i/2,y=196-(v-lo)/(hi-lo)*139;
  node("line",{x1:40,y1:y.toFixed(2),x2:454,y2:y.toFixed(2),
   stroke:"#677aa9","stroke-opacity":".38","stroke-width":1});
  node("text",{x:5,y:(y+4).toFixed(2),fill:"#a7bada","font-size":11},v.toFixed(1));
 }
 for(const year of [1985,2005,2025]){
  node("text",{x:(40+(year-1985)/40*414).toFixed(2),y:222,
   fill:"#a7bada","font-size":11,"text-anchor":year===1985?"start":year===2025?"end":"middle"},year);
 }
 for(const [key,color] of [["liberia","#2ddbe8"],["limon","#a493ff"]]){
  node("polyline",{"data-plot-series":key,points:plotPoints(rows[key],lo,hi),
   fill:"none",stroke:color,"stroke-width":2.7,"stroke-linecap":"round",
   "stroke-linejoin":"round"});
 }
 svg.setAttribute("aria-label",lang==="en"?
  "Actual 1985–2025 NASA POWER annual air temperature for Liberia and Limón, plotted on one Celsius scale":
  "Temperatura anual NASA POWER 1985–2025 para Liberia y Limón, misma escala en grados Celsius");
 return {rows,lower:lo,upper:hi};
}
export function initHeroCase(doc=document,win=window){
 const story=doc.querySelector("[data-case-story]");
 if(!story)return null;
 const lang=doc.body?.dataset.lang==="en"?"en":"es";
 const copy=STORY[lang],title=story.querySelector("[data-case-heading]"),
  body=story.querySelector("[data-case-body]"),eyebrow=story.querySelector("[data-case-eyebrow]"),
  counter=story.querySelector("[data-case-counter]"),
  visual=doc.querySelector("[data-case-visual]"),
  nav=[...story.querySelectorAll("[data-case-step]")],
  prev=story.querySelector("[data-case-prev]"),next=story.querySelector("[data-case-next]");
 if(nav.length!==3||!title||!body||!visual||!prev||!next)return null;
 let current=0;
 const panels=[...visual.querySelectorAll("[data-case-panel]")];
 function change(i){
  current=Math.max(0,Math.min(2,i));
  const step=copy[current];title.textContent=step.heading;body.textContent=step.body;
  eyebrow.textContent=step.eyebrow;
  counter.textContent=(current+1)+" / 3";
  prev.disabled=current===0;next.disabled=current===2;
  visual.dataset.scene=String(current);story.dataset.step=String(current);
  nav.forEach((b,n)=>b.setAttribute("aria-pressed",String(n===current)));
  panels.forEach(p=>p.hidden=Number(p.dataset.casePanel)!==current);
  return current;
 }
 for(const btn of nav)btn.addEventListener("click",()=>change(Number(btn.dataset.caseStep)));
 prev.addEventListener("click",()=>change(current-1));
 next.addEventListener("click",()=>change(current+1));
 story.addEventListener("keydown",event=>{
  if(event.altKey||event.metaKey||event.ctrlKey)return;
  if(event.key==="ArrowRight"||event.key==="ArrowLeft"){
   event.preventDefault();event.stopPropagation();
   change(current+(event.key==="ArrowRight"?1:-1));
  }
 });
 story.dataset.ready="true";
 change(0);
 const chart=visual.querySelector("[data-case-chart]");
 const status=visual.querySelector("[data-case-status]");
 if(chart&&status){
  const fetcher=win.fetch?.bind(win);
  if(!fetcher){status.textContent=lang==="en"?"NASA plot unavailable. Use the Explorer.":"Gráfico no disponible. Consulta el Explorer.";}
  else fetcher("/telluris/explore/data/exp001-annual.json")
    .then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
    .then(json=>{
     renderPlot(chart,json,lang);
     status.textContent=lang==="en"?"41 original annual values per grid cell · NASA POWER / MERRA-2":
      "41 valores anuales originales por celda · NASA POWER / MERRA-2";
     visual.dataset.source="verified-archive";
    }).catch(()=>{
     status.textContent=lang==="en"?"The original NASA series could not load. Open the Explorer.":
      "No se pudo cargar la serie original NASA. Abre el Explorer.";
     visual.dataset.source="unavailable";
    });
 }
 return {get step(){return current;},go:change};
}
if(typeof document!=="undefined")initHeroCase();
