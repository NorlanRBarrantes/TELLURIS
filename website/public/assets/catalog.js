/* TELLURIS research catalog · descriptive only; no unsupported data endpoints. */
const lang=document.documentElement.lang==="en"?"en":"es";
const tr=(es,en)=>lang==="es"?es:en;
const el=id=>document.getElementById(id);
const search=el("catalog-search"),group=el("catalog-group"),kind=el("catalog-kind");
const grid=el("catalog-grid"),more=el("catalog-more"),summary=el("catalog-summary");
let entries=[],shown=12;

function itemCard(entry) {
  const card=document.createElement("article");
  card.className="catalog-card";
  const head=document.createElement("div");head.className="catalog-card-top";
  const type=document.createElement("span");type.className="catalog-type";
  type.textContent=entry.category==="connected"?tr("Variable NASA disponible","Available NASA variable"):
    entry.category==="derived"?tr("Indicador derivado","Derived indicator"):
    tr("Variable o fenómeno candidato","Research variable or phenomenon");
  const badge=document.createElement("span");
  badge.className=entry.category==="connected"||entry.status==="connected"?"catalog-badge live":"catalog-badge";
  badge.textContent=entry.category==="connected"?tr("Conectada","Connected"):
    entry.status==="connected"?tr("Conectada","Connected"):
    entry.status==="partial"?tr("Integración parcial","Partially connected"):
    entry.status==="partial_exploratory"?tr("Prototipo exploratorio","Exploratory prototype"):
    tr("En investigación","Research only");
  head.append(type,badge);
  const name=document.createElement("h3");name.textContent=lang==="es"?entry.name_es:entry.name_en;
  const explain=document.createElement("p");
  explain.className="catalog-description";
  explain.textContent=entry.category==="connected"?
    tr("Variable NASA POWER verificada con consulta real; resolución de modelo o producto, no estación meteorológica.","Source-verified NASA POWER variable; represents model/product spatial support, not a local weather station."):
    entry.category==="derived"?(lang==="es"?entry.description_es:tr("Requiere datos y validación metodológica específica.","Requires suitable data and separately validated methods.")):
    (lang==="es"?entry.source_phrase_es:tr("Producto o medición candidata por verificar.","Candidate product or measurement to be verified."));
  const small=document.createElement("div");small.className="catalog-card-bottom";
  small.textContent=entry.category==="connected"?
    "NASA POWER · "+(entry.community||"modelo") + " · "+entry.unit:
    entry.category==="derived"?tr("Cálculo metodológico propuesto","Proposed computed indicator"):
    tr("Área: ","Domain: ")+(lang==="es"?entry.domain_es:entry.domain_en);
  card.append(head,name,explain,small);
  if(entry.category==="connected"){
    const link=document.createElement("a");
    link.href=(lang==="es"?"/telluris/explore/":"/en/telluris/explore/")+
      "?variable="+encodeURIComponent(entry.id);
    link.className="catalog-open";link.textContent=tr("Abrir en explorador ↗","Open in explorer ↗");
    card.append(link);
  } else if(entry.category==="research"){
    const foot=document.createElement("p");foot.className="catalog-note";
    foot.textContent=tr("Fuentes propuestas para esta familia: ","Candidate sources for this group: ")+entry.source_candidates.join(" · ");
    card.append(foot);
    if(entry.integration_codes?.length){
      const status=document.createElement("p");status.className="catalog-note";
      status.textContent=(lang==="es"?entry.integration_note_es:entry.integration_note_en)||
        tr("Estos parámetros ya se pueden consultar con NASA POWER.","These parameters are now queryable with NASA POWER.");
      card.append(status);
      const links=document.createElement("div");
      links.className="catalog-integrations";
      for(const code of entry.integration_codes){
        const a=document.createElement("a");a.className="catalog-open";
        a.href=(lang==="es"?"/telluris/explore/":"/en/telluris/explore/")+"?variable="+encodeURIComponent(code);
        a.textContent=code+" ↗";links.append(a);
      }
      card.append(links);
    }
    if(entry.source_evidence && entry.source_evidence.status==="api_sample_verified"){
      const note=document.createElement("p");note.className="catalog-note";
      note.textContent=lang==="es"?entry.source_evidence.description_es:entry.source_evidence.description_en;
      const evidence=document.createElement("a");
      evidence.className="catalog-open";evidence.href=entry.source_evidence.verification_url;
      evidence.target="_blank";evidence.rel="noopener noreferrer";
      evidence.textContent=tr("Ver prueba real de NASA ↗","View real NASA verification ↗");
      card.append(note,evidence);
    }
    if(entry.spatial_evidence &&
       entry.spatial_evidence.status==="one_date_spatial_qa_and_one_year_landcover_verified"){
      const note=document.createElement("p");note.className="catalog-note";
      note.textContent=lang==="es"?entry.spatial_evidence.description_es:entry.spatial_evidence.description_en;
      const evidence=document.createElement("a");
      evidence.className="catalog-open";evidence.href=entry.spatial_evidence.verification_url;
      evidence.target="_blank";evidence.rel="noopener noreferrer";
      evidence.textContent=tr("Ver auditoría geográfica NASA ↗","View NASA site audit ↗");
      card.append(note,evidence);
    }
  }
  return card;
}
function matches(entry,q,grp,type){
 if(type!=="all"&&entry.category!==type)return false;
 if(grp!=="all"&&entry.group!==grp)return false;
 if(!q)return true;
 const txt=[entry.name_es,entry.name_en,entry.id,entry.group,entry.source_phrase_es,entry.description_es,...(entry.integration_codes||[]),
   ...(entry.source_candidates||[])].filter(Boolean).join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 return txt.includes(q);
}
function render() {
 const q=search.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const matching=entries.filter(e=>matches(e,q,group.value,kind.value));
 grid.replaceChildren(...matching.slice(0,shown).map(itemCard));
 summary.textContent=tr("Resultados: ","Results: ")+matching.length+" · "+tr("Mostrando ","Showing ")+Math.min(shown,matching.length);
 more.hidden=shown>=matching.length;
 if(!matching.length) {
   const empty=document.createElement("p");empty.className="catalog-empty";
   empty.textContent=tr("No hay coincidencias. Prueba otra palabra o categoría.","No matches. Try another keyword or category.");
   grid.append(empty);
 }
}
for(const input of [search,group,kind])input.addEventListener(input===search?"input":"change",()=>{shown=12;render();});
more.addEventListener("click",()=>{shown+=12;render();});
try{
 const response=await fetch("/telluris/catalog/data/catalog.json",{cache:"no-cache"});
 if(!response.ok)throw new Error("HTTP "+response.status);
 const data=await response.json();
 if(data.schema!=="telluris.catalog.2026-11-15.v2"||data.connected.length!==18||
    data.candidates.length!==49||data.indicators.length!==10)throw new Error("Invalid catalog schema or entries.");
 entries=[
 ...data.connected.map(e=>({...e,category:"connected",group:"connected",status:"connected"})),
 ...data.candidates.map(e=>({...e,category:"research",group:e.domain_es,status:e.implementation_status})),
 ...data.indicators.map(e=>({...e,category:"derived",group:"indicators",status:e.implementation_status,
 name_en:({1:"Climate anomalies",2:"Decadal trends",3:"Extreme heat days",4:"Standardized precipitation index (SPI)",5:"Consecutive dry days",6:"Temperature range",7:"Vapor pressure deficit (VPD)",8:"Multivariable correlations",9:"Change points",10:"Statistical uncertainty"})[e.number]}))
 ];
 for(const g of data.groups){
   const option=document.createElement("option");
   option.value=g.es;option.textContent=lang==="es"?g.es:g.en;group.append(option);
 }
 for(const [value,label] of [["connected",tr("Variables conectadas","Connected variables")],["indicators",tr("Indicadores derivados","Derived indicators")]]){
   const option=document.createElement("option");option.value=value;option.textContent=label;group.append(option);
 }
 el("count-live").textContent=data.connected.length;
 el("count-research").textContent=data.candidates.length;
 el("count-derived").textContent=data.indicators.length;
 render();
}catch(error){
 summary.textContent=tr("No se pudo cargar el catálogo: ","Unable to load catalog: ")+error.message;
 summary.classList.add("catalog-error");
}