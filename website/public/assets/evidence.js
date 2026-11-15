/* Deterministic, source-grounded explanation. NOT generative AI. */
const units={T2M:"°C / decade",PRECTOTCORR:"mm / decade"};
const fmt=(x,lang)=>Number(x).toLocaleString(lang==="es"?"es-CR":"en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const cautious={
 es:"El valor p original de Mann–Kendall es provisional: no se ha validado la independencia temporal ni la homogeneidad del producto. No demuestra por sí solo significancia estadística ni causalidad.",
 en:"The original Mann–Kendall p-value is provisional: serial independence and product homogeneity have not been validated. It alone does not establish statistical significance or causation."
};
export function buildEvidence(analysis,variable,location,source,lang="es"){
 if(analysis?.status!=="exploratory")return null;
 const slope=fmt(analysis.slopePerDecade,lang),unit=units[variable]||"units / decade";
 const topic=variable==="T2M"?(lang==="es"?"temperatura del aire a 2 m":"air temperature at 2 m"):(lang==="es"?"precipitación anual":"annual precipitation");
 const direction=analysis.slopePerDecade>0?(lang==="es"?"ascendente":"upward"):analysis.slopePerDecade<0?(lang==="es"?"descendente":"downward"):(lang==="es"?"sin dirección neta":"without a net direction");
 const summary=lang==="es"
  ?"En "+location+", la "+topic+" presenta una pendiente Theil–Sen "+direction+" de "+slope+" "+unit+" en "+analysis.n+" años completos ("+analysis.start+"–"+analysis.end+")."
  :"At "+location+", "+topic+" has an "+direction+" Theil–Sen slope of "+slope+" "+unit+" from "+analysis.n+" complete years ("+analysis.start+"–"+analysis.end+").";
 return {summary,caution:cautious[lang],source:source||"NASA POWER",lang,analysis,unit};
}
export function compareEvidence(first,other,firstName,otherName,lang="es"){
 if(!first||!other||first.status!=="exploratory"||other.status!=="exploratory")return "";
 const line=firstName+": "+fmt(first.slopePerDecade,lang)+"; "+otherName+": "+fmt(other.slopePerDecade,lang);
 return lang==="es"
  ?"Comparación de tendencias de dos puntos NASA ("+line+"). Ambas pendientes se estiman por separado; esto NO constituye una prueba estadística de diferencia entre regiones."
  :"NASA two-point trend comparison ("+line+"). Each slope is estimated independently; this is NOT a statistical test of between-region differences.";
}
export function answerEvidence(question,evidence,comparison=""){
 if(!evidence)return "No data loaded / No hay datos cargados.";
 const lang=evidence.lang;
 const q=String(question||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 if(/signific|confian|certeza|p.valor|p-value|statistic/.test(q))
  return (lang==="es"?"Valor p original: ":"Original p-value: ")+evidence.analysis.mk.p.toFixed(4)+". "+evidence.caution;
 if(/origen|fuente|nasa|source|dato/.test(q))
  return (lang==="es"?"Fuente identificada: ":"Identified source: ")+evidence.source+". "+(lang==="es"?"Los valores son de una celda de modelo, no un promedio provincial.":"Values represent a model-grid point, not a region-wide average.");
 if(/autocorrel|incertid|limit|depend|error|uncert|reliab/.test(q))
  return evidence.caution+" "+(evidence.analysis.lag1===null?(lang==="es"?"Autocorrelación no estimable.":"Autocorrelation unavailable."):(lang==="es"?"Diagnóstico lag-1: ":"Lag-1 diagnostic: ")+evidence.analysis.lag1.toFixed(3)+".");
 if(/compar|region|liberia|limon|diferenc|compare/.test(q))
  return comparison|| (lang==="es"?"Compara Liberia y Limón usando el archivo NASA para observar ambas pendientes.":"Load the NASA archive to compare Liberia and Limón point slopes.");
 if(/tenden|cambi|sub|baj|pendient|trend|change|slope|rate/.test(q))return evidence.summary+" "+evidence.caution;
 return lang==="es"?"Pregunta por tendencia, fuente, incertidumbre, significancia o comparación.":"Ask about trend, source, uncertainty, significance or comparison.";
}
