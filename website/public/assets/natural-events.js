/* EXP-011 · two independent public event catalogs, read-only.
 * No mixed-source trend inference or synthetic seismic/weather data.
 */
import {EVENT_TYPES,eventRequest,parseUSGS,parseEONET,plotEvent} from "./natural-events-core.js?v=exp011-20261115";
const root=document.getElementById("natural-events");
if(root){
 const es=document.documentElement.lang!=="en";
 const L=(esText,enText)=>es?esText:enText;
 const el=id=>document.getElementById(id);
 const input={type:el("events-type"),days:el("events-days"),radius:el("events-radius"),
   mag:el("events-min-mag"),run:el("events-run"),status:el("events-status"),
   result:el("events-result"),summary:el("events-summary"),map:el("events-map"),
   table:el("events-list"),provenance:el("events-source-link"),notice:el("events-caveat")};
 const zone={lat:el("latitude"),lon:el("longitude"),place:el("location")};
 let controller=null,seq=0;
 const create=(tag,text,klass="")=>{
   const n=document.createElement(tag);if(text!=null)n.textContent=String(text);
   if(klass)n.className=klass;return n;
 };
 const svg=(tag,attrs={},text=null)=>{
   const n=document.createElementNS("http://www.w3.org/2000/svg",tag);
   for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));
   if(text!=null)n.textContent=text;return n;
 };
 const number=n=>Number(n).toLocaleString(es?"es-CR":"en-US",{maximumFractionDigits:1});
 function invalidate(){
   seq++;controller?.abort();controller=null;
   input.run.disabled=false;input.result.hidden=true;
   input.status.textContent=L("Configura un tipo de evento y consulta su fuente original.",
     "Select an event type and query its original source.");
   input.status.classList.remove("events-error");
 }
 for(const field of [...Object.values(zone),input.type,input.days,input.radius,input.mag])
   field?.addEventListener("change",invalidate);
 function syncType(){
   const seismic=input.type.value==="earthquakes";
   el("events-mag-field").hidden=!seismic;
   el("events-provider").textContent=EVENT_TYPES[input.type.value].provider;
   invalidate();
 }
 input.type.addEventListener("change",syncType);
 function drawMap(records,site,radius){
   const map=input.map;map.replaceChildren();map.setAttribute("viewBox","0 0 820 360");
   map.setAttribute("role","img");
   map.setAttribute("aria-label",L("Posiciones aproximadas de epicentros/eventos respecto al punto elegido; no representa un mapa de peligro.",
      "Approximate epicenter/event positions relative to the selected point; not a hazard map."));
   map.append(svg("rect",{x:0,y:0,width:820,height:360,fill:"#061925",rx:12}));
   // An explicitly schematic lat-lon coordinate plane, not a satellite basemap.
   for(let i=1;i<=7;i++)map.append(svg("line",{x1:i*102.5,y1:0,x2:i*102.5,y2:360,stroke:"#255465","stroke-width":.8}));
   for(let i=1;i<=3;i++)map.append(svg("line",{x1:0,y1:i*90,x2:820,y2:i*90,stroke:"#255465","stroke-width":.8}));
   map.append(svg("circle",{cx:410,cy:180,r:4.8,fill:"#b0f2db",stroke:"#052332","stroke-width":1}));
   map.append(svg("circle",{cx:410,cy:180,r:12,fill:"none",stroke:"#b0f2db","stroke-width":1.3,opacity:.7}));
   const limited=records.slice(0,400);
   for(const item of limited){
     const p=plotEvent(item,site,radius);
     if(!p)continue;
     const circle=svg("circle",{cx:Math.round(p.x*820),cy:Math.round(p.y*360),
       r:item.kind==="earthquakes"?Math.max(2,Math.min(11,(item.magnitude-1.5)*2.2)):5,
       fill:item.kind==="earthquakes"?"#ffc493":"#77c4ec",opacity:.74,
       stroke:"#05212b","stroke-width":1});
     circle.append(svg("title",{},item.name+" · "+
       new Date(item.timeMs).toISOString().slice(0,16)+" UTC"));
     map.append(circle);
   }
   map.append(svg("text",{x:14,y:25,fill:"#94c2ce","font-size":12},
     L("PLANO DE COORDENADAS / SIN MAPA BASE","GEOGRAPHIC COORDINATE PLOT / NO BASEMAP")));
   map.append(svg("text",{x:14,y:346,fill:"#9ac6cf","font-size":11},
     L("Centro: ","Center: ")+site.lat.toFixed(3)+", "+site.lon.toFixed(3)+
     " · "+radius+" km "+L("de radio","radius")));
 }
 function render(output,site){
   input.result.hidden=false;input.table.replaceChildren();
   const kind=input.type.value;
   const fmtDate=new Intl.DateTimeFormat(es?"es-CR":"en-US",{
     year:"numeric",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit",timeZone:"UTC"
   });
   input.summary.textContent=number(output.items.length)+" "+L("eventos devueltos dentro de ","events returned within ")+
     output.radiusKm+" km · "+output.timeRange.join(" → ")+" · "+output.provider+
     (output.capped?L(" · LÍMITE DE RESULTADOS ALCANZADO"," · RESULT LIMIT REACHED"):"");
   input.notice.textContent=kind==="earthquakes"?
     L("USGS: catálogo de sismos por magnitud mínima, distancia y periodo. Los registros pueden revisarse; el recuento NO es una tasa sísmica corregida ni una predicción. No comparar esta serie con una pendiente climática como si fueran la misma observación.",
       "USGS: earthquake events filtered by magnitude, distance and period. The catalog may be revised; counts are NOT completeness-adjusted rates or predictions. Do not confuse seismic events with climate trends."):
     L("NASA EONET: catálogo de eventos notificados, NO mediciones físicas, imágenes satelitales ni inventario exhaustivo. Un resultado vacío no descarta un evento.",
       "NASA EONET: reported event inventory, NOT physical measurements, satellite imagery or an exhaustive census. An empty result does not prove that no event occurred.");
   input.provenance.href=output.sourceUrl;
   input.provenance.textContent=L("Abrir consulta original ↗","Open original source query ↗");
   drawMap(output.items,site,output.radiusKm);
   for(const event of output.items.slice(0,35)){
     const tr=document.createElement("tr");
     const name=create("td",null);
     if(event.url){
       const a=create("a",event.name);a.href=event.url;a.target="_blank";a.rel="noopener noreferrer";name.append(a);
     }else name.textContent=event.name;
     tr.append(name,create("td",fmtDate.format(new Date(event.timeMs))+" UTC"),
       create("td",kind==="earthquakes"?
         ("M "+number(event.magnitude)):L("Evento reportado","Reported event")),
       create("td",event.depthKm===null?"—":number(event.depthKm)+" km"),
       create("td",event.lat.toFixed(3)+", "+event.lon.toFixed(3)));
     input.table.append(tr);
   }
   if(output.items.length===0){
     const tr=document.createElement("tr");
     const td=create("td",L("No se recibieron eventos en esta consulta. Esto no demuestra que no hayan ocurrido.",
       "No events returned for this query. This is not proof that none occurred."));
     td.colSpan=5;tr.append(td);input.table.append(tr);
   }
 }
 async function run(){
   invalidate();
   const token=++seq,ac=new AbortController();
   controller=ac;
   let request;
   try{
     request=eventRequest({
       type:input.type.value,lat:Number(zone.lat.value),lon:Number(zone.lon.value),
       days:Number(input.days.value),radiusKm:Number(input.radius.value),
       minMagnitude:Number(input.mag.value)
     });
   }catch(error){input.status.textContent=error.message;input.status.classList.add("events-error");return;}
   input.run.disabled=true;
   input.status.textContent=L("Consultando observaciones originales en ","Requesting original records from ")+request.provider+"…";
   try{
     const response=await fetch(request.url,{signal:ac.signal});
     if(!response.ok)throw Error(request.provider+" HTTP "+response.status);
     const payload=await response.json();
     if(token!==seq)return;
     const data=request.type==="earthquakes"?parseUSGS(payload,request):parseEONET(payload,request);
     render(data,{lat:request.lat,lon:request.lon});
     input.status.textContent=L("Consulta completada · fuente original accesible.","Request complete · original source available.");
   }catch(error){
     if(token!==seq)return;
     input.status.textContent=L("No se pudo consultar la fuente: ","Source query failed: ")+error.message+
       L(". No se reemplazó por datos simulados.",". No synthetic observations were substituted.");
     input.status.classList.add("events-error");
   }finally{if(token===seq){controller=null;input.run.disabled=false;}}
 }
 input.run.addEventListener("click",run);
 // Let catalog entries select their event family. Never auto-fetch costly endpoints.
 const wanted=new URLSearchParams(location.search).get("events");
 if(Object.hasOwn(EVENT_TYPES,wanted))input.type.value=wanted;
 syncType();
}
