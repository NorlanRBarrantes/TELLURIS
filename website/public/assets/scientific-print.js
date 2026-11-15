/* EXP-007E: print-ready report generated solely from EXP-005 scientific evidence.
 * The browser's Print -> Save as PDF action is the PDF exporter; no external service.
 */
const esc=v=>String(v??"—").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));
const fmt=v=>Number.isFinite(v)?Number(v).toLocaleString("en-US",{maximumFractionDigits:5}):"—";
function chart(observations){
 const points=observations.filter(p=>Number.isInteger(p.year)&&Number.isFinite(p.value));
 if(points.length<2)return "";
 const values=points.map(p=>p.value),min=Math.min(...values),max=Math.max(...values),range=max-min||1;
 const line=points.map((p,i)=>(50+i*660/(points.length-1)).toFixed(2)+","+
   (215-(p.value-min)*170/range).toFixed(2)).join(" ");
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 255" role="img" aria-label="Annual NASA series">'+
 '<rect width="750" height="255" fill="#eff7f5" rx="8"/>'+
 '<path d="M50 28V215H725" fill="none" stroke="#57716e"/>'+
 '<polyline points="'+line+'" fill="none" stroke="#0b8175" stroke-width="3"/>'+
 '<text x="50" y="243" font-size="13">'+points[0].year+'</text>'+
 '<text x="725" y="243" text-anchor="end" font-size="13">'+points.at(-1).year+'</text>'+
 '<text x="50" y="20" font-size="12">'+esc(fmt(max))+'</text>'+
 '<text x="50" y="210" font-size="12">'+esc(fmt(min))+'</text></svg>';
}
export function printableScientificReport(report,{language="es"}={}){
 if(report?.schema!=="telluris.exp005.scientific_report.v1"||
    !Array.isArray(report.annualObservations)||!report.annualObservations.length)
   throw Error("Computed scientific report required");
 const es=language!=="en",T=(a,b)=>es?a:b;
 const data=report.originalData||{},a=report.analysis||{},estimate=a.estimate||{},tests=a.tests||{};
 const ci=estimate.ci95RankBasedIndependentYears;
 const lines=report.annualObservations.map(p=>"<tr><td>"+esc(p.year)+"</td><td>"+esc(fmt(p.value))+"</td></tr>").join("");
 const limitations=(report.limitations||[]).map(s=>"<li>"+esc(s)+"</li>").join("");
 const details=(name,value)=>"<dt>"+esc(name)+"</dt><dd>"+esc(value)+"</dd>";
 const style='@page{size:A4;margin:17mm}*{box-sizing:border-box}body{font:13px/1.48 Arial,system-ui,sans-serif;color:#15343b;max-width:850px;margin:auto;padding:18px}h1{font-size:26px;margin:6px 0}h2{font-size:17px;color:#087a70;margin:23px 0 8px}header{border-bottom:3px solid #087a70;padding-bottom:12px}.muted{color:#4e6c70}.warning{border-left:4px solid #b87e23;background:#fff5e0;padding:11px;margin:15px 0}dl{display:grid;grid-template-columns:175px auto;gap:6px 12px}dd{margin:0;overflow-wrap:anywhere}dt{color:#526c70}svg{display:block;width:100%}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}td,th{text-align:left;padding:5px 8px;border-bottom:1px solid #dbe7e4}tr{break-inside:avoid}h2{break-after:avoid}section{break-inside:avoid}footer{border-top:1px solid #c2d1cf;margin-top:20px;padding-top:10px;font-size:11px}ul{padding-left:20px}@media print{body{padding:0}}';
 return '<!doctype html><html lang="'+(es?"es":"en")+'"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1"><title>TELLURIS Scientific Report</title>'+
 '<style>'+style+'</style></head><body><header><p class="muted">PROJECT URIEL · TELLURIS</p>'+
 '<h1>'+T("Informe científico","Scientific report")+'</h1><p>'+esc(report.label)+' · '+
 esc(report.parameter)+' · '+esc(report.unit)+'</p></header>'+
 '<div class="warning"><strong>'+T("Significancia climática no validada independientemente.","Climate significance not independently validated.")+'</strong>'+
 '<p>'+T("Este informe conserva los supuestos de EXP-005. Una estimación de tendencia no demuestra causalidad.","This report preserves EXP-005 assumptions. A trend estimate does not establish causality.")+'</p></div>'+
 '<section><h2>'+T("Procedencia NASA","NASA provenance")+'</h2><dl>'+
 details(T("Producto","Product"),data.provider)+details(T("Fuentes","Sources"),data.sources)+
 details(T("Versión API","API version"),data.apiVersion)+
 details(T("Coordenadas solicitadas","Requested coordinates"),Array.isArray(report.coordinateInput)?report.coordinateInput.join(", "):"—")+
 details(T("Coordenadas fuente","Source coordinates"),Array.isArray(data.resolvedCoordinates)?data.resolvedCoordinates.join(", "):"—")+
 details(T("Solicitud origen","Source request"),data.sourceURL)+
 details(T("SHA-256 original","Original SHA-256"),data.rawArchiveSha256)+
 details(T("Años","Period"),Array.isArray(a.period)?a.period.join("–"):"—")+
 details(T("Observaciones","Observations"),report.annualObservations.length)+
 details(T("Unidad original","Original unit"),data.nativeUnit)+'</dl></section>'+
 '<section><h2>'+T("Estimación y límites","Estimate and limits")+'</h2><dl>'+
 details(T("Theil–Sen por década","Theil–Sen per decade"),fmt(estimate.slopePerDecade)+" "+String(report.unit??""))+
 details(T("IC 95% (independencia anual)","95% CI (annual independence)"),
   ci?"["+fmt(ci.lowPerDecade)+", "+fmt(ci.highPerDecade)+"]":"—")+
 details("Mann–Kendall p",fmt(tests.originalMannKendall?.p))+
 details(T("Estado científico","Scientific status"),T("Exploratorio","Exploratory"))+'</dl>'+
 chart(report.annualObservations)+'</section>'+
 '<section><h2>'+T("Limitaciones","Limitations")+'</h2><ul>'+limitations+'</ul></section>'+
 '<h2>'+T("Serie anual","Annual observations")+'</h2><table><thead><tr><th>'+T("Año","Year")+'</th><th>'+T("Valor","Value")+
 ' ('+esc(report.unit)+')</th></tr></thead><tbody>'+lines+'</tbody></table>'+
 '<footer><p>'+T("Para obtener el PDF: Archivo → Imprimir → Guardar como PDF.","To create a PDF: File → Print → Save as PDF.")+'</p>'+
 '<p>'+esc(report.independentProject)+' — '+esc(report.nasaAffiliation)+'</p>'+
 '<p>'+T("Metodología","Methodology")+': '+esc(report.reproducibility?.methodology)+
 ' · '+T("Generado","Generated")+': '+esc(report.generatedUtc)+'</p></footer></body></html>';
}
