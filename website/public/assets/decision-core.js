/* EXP-013 — deterministic, evidence-bound interpretation and decision support.
   NASA measurements remain authoritative. This is NOT generative AI, a forecast,
   risk scoring or verified causal attribution. No synthetic observations. */
import {VARIABLES} from "./science.js";

const GROUPS={
 temperature:["T2M","T2M_MAX","T2M_MIN"],
 rain:["PRECTOTCORR"],
 humidity:["RH2M","QV2M"],
 wind:["WS10M","WD10M","U10M","V10M"],
 pressure:["PS"],
 cloud:["CLOUD_AMT"],
 energy:["ALLSKY_SFC_SW_DWN","ALLSKY_SFC_LW_DWN","ALLSKY_SRF_ALB"],
 soil:["GWETTOP","GWETROOT"],
 evaporation:["EVPTRNS"]
};
const guidance={
 temperature:{
  es:["Variabilidad natural, circulación atmosférica, cambios del entorno y diferencias entre productos son hipótesis que requieren contrastes independientes.",
      "Si se repitiera una tendencia térmica, podrían cambiar las condiciones de exposición al calor o demanda de refrigeración; estos datos no pronostican temperaturas futuras.",
      "Contrastar el registro con estaciones meteorológicas y revisar indicadores diarios de calor antes de activar medidas locales.",
      "Investigar adaptación térmica de edificios, espacios verdes y protocolos de salud pública con autoridades competentes."],
  en:["Natural variability, atmospheric circulation, land-setting changes and differences between data products are hypotheses requiring independent checks.",
      "If a thermal tendency persisted, heat exposure and cooling demand might change; this record does not forecast future temperatures.",
      "Cross-check with weather stations and daily heat indicators before taking local measures.",
      "Evaluate building heat adaptation, green spaces and public-health protocols with qualified local authorities."]
 },
 rain:{
  es:["La circulación atmosférica, la estacionalidad, la variabilidad del Pacífico y cambios de las fuentes de datos podrían influir; no se ha identificado una causa.",
      "Si continuara un patrón de precipitación, podría modificar la gestión hídrica; no permite anticipar lluvias o sequías concretas.",
      "Contrastar lluvia con pluviómetros y con GPM IMERG; revisar meses y cobertura antes de interpretar impactos.",
      "Evaluar planes flexibles de uso del agua, drenaje y seguimiento hidrológico basados en varias fuentes."],
  en:["Atmospheric circulation, seasonality, Pacific variability and source-product changes may contribute; no driver has been established.",
      "If a precipitation pattern persisted, it could affect water management; this does not predict specific floods or droughts.",
      "Cross-check rainfall against gauges and GPM IMERG; review months and coverage before interpreting impacts.",
      "Consider flexible water-use, drainage and hydrological-monitoring plans using multiple sources."]
 },
 humidity:{
  es:["Humedad y temperatura interactúan, pero la asociación no identifica por sí sola un mecanismo local.",
      "Una variación sostenida podría modificar el confort térmico o la demanda evaporativa; no es una previsión de humedad.",
      "Contrastar con temperatura y series de estaciones en periodos equivalentes.",
      "Planificar vigilancia combinada de calor y humedad y revisar métodos de exposición humana adecuados."],
  en:["Humidity and temperature interact, but association alone does not identify a local physical mechanism.",
      "A sustained change could affect thermal comfort or evaporative demand; this is not a humidity forecast.",
      "Compare against matched-period temperature and independent station observations.",
      "Plan joint heat-humidity monitoring and evaluate appropriate human-exposure methods."]
 },
 wind:{
  es:["Circulación, relieve, estacionalidad y resolución espacial pueden influir en el viento modelado.",
      "Los cambios descriptivos de viento no predicen tormentas, daños ni rachas locales.",
      "Usar estaciones de viento y distinguir velocidad de dirección circular; revisar la escala temporal.",
      "Evaluar exposición eólica y protocolos según mapas oficiales y estudios de ingeniería locales."],
  en:["Circulation, terrain, seasonality and spatial resolution can influence modeled wind.",
      "Descriptive wind changes do not predict storms, damage or local gusts.",
      "Use independent wind stations and distinguish speed from circular direction; examine temporal scale.",
      "Assess wind exposure and protocols with official hazard maps and local engineering studies."]
 },
 pressure:{
  es:["La presión refleja sistemas meteorológicos y variación espacial del producto; una pendiente no determina el mecanismo.",
      "Una diferencia histórica de presión no es un aviso de tormenta ni una proyección meteorológica.",
      "Contrastar con patrones estacionales y observaciones meteorológicas independientes.",
      "Utilizar pronósticos y alertas oficiales para decisiones operativas, no extrapolación de esta pendiente."],
  en:["Pressure reflects weather systems and product spatial variation; a slope cannot identify a mechanism.",
      "A historical pressure difference is neither a storm warning nor a weather forecast.",
      "Compare seasonal patterns and independent meteorological measurements.",
      "Use official forecasts and alerts for operational decisions, not an extrapolation of this slope."]
 },
 cloud:{
  es:["Nubosidad, humedad y observabilidad satelital interactúan; faltan otros productos para estudiar propiedades ópticas.",
      "Un cambio en nubosidad podría afectar radiación recibida, sin determinar sus efectos por sí solo.",
      "Comprobar fechas, definición de fracción nubosa y coherencia con radiación solar.",
      "Incorporar CERES o MODIS con controles de calidad antes de hacer planificación dependiente de nubosidad."],
  en:["Cloud, humidity and satellite observability interact; separate products are needed for optical properties.",
      "Cloud-amount changes could influence incoming radiation, but do not establish impacts by themselves.",
      "Check dates, cloud-fraction definition and consistency with solar radiation.",
      "Add quality-controlled CERES/MODIS products before cloud-dependent planning."]
 },
 energy:{
  es:["Nubes, composición atmosférica y propiedades superficiales pueden influir; estas variables no equivalen al balance neto terrestre.",
      "Cambios energéticos podrían modificar condiciones superficiales, pero este indicador aislado no cuantifica impactos.",
      "Verificar unidades, geometría, época y variable antes de compararla con temperatura.",
      "Ampliar con CERES y fuentes regionales de energía para hipótesis contrastables."],
  en:["Clouds, atmospheric composition and surface properties may influence these measures; they are not net Earth energy balance.",
      "Energy changes could affect surface conditions, but this variable alone cannot quantify impacts.",
      "Verify units, geography, period and variable before comparing with temperature.",
      "Add CERES and regional energy evidence for testable hypotheses."]
 },
 soil:{
  es:["Precipitación, demanda evaporativa, condiciones del suelo y parametrización del modelo podrían influir.",
      "Una variación en humedad relativa modelada del suelo podría motivar vigilancia hídrica; no demuestra disponibilidad real de agua.",
      "Contrastar con lluvia, estaciones de suelo y SMAP/GLDAS; el índice 0–1 no es humedad volumétrica.",
      "Diseñar seguimiento de suelos y agua con fuentes independientes antes de recomendar cambios agrícolas específicos."],
  en:["Rainfall, evaporative demand, soil conditions and model parameterization may contribute.",
      "A relative modeled soil-wetness change may justify water monitoring; it does not measure actual water availability.",
      "Check rainfall, ground stations and SMAP/GLDAS; the 0–1 measure is not volumetric water content.",
      "Develop independent soil-and-water monitoring before making specific agricultural recommendations."]
 },
 evaporation:{
  es:["Radiación, viento, temperatura, humedad y parametrización pueden afectar este flujo energético.",
      "Un cambio energético no equivale directamente a milímetros de agua perdida y no pronostica sequías.",
      "Verificar el significado de MJ/m²/día y contrastar con humedad del suelo y mediciones de agua.",
      "Incorporar productos adecuados de evapotranspiración hídrica antes de establecer escenarios de demanda."],
  en:["Radiation, wind, temperature, humidity and model configuration can affect this energy flux.",
      "An energy-flux change is not directly millimeters of water loss and does not predict drought.",
      "Check the MJ/m²/day definition and compare against soil water and other water observations.",
      "Add valid water-flux evapotranspiration products before building demand scenarios."]
 }
};
const fmt=(value,lang,decimals=2)=>Number.isFinite(value)?
 Number(value).toLocaleString(lang==="es"?"es-CR":"en-US",
 {maximumFractionDigits:decimals,minimumFractionDigits:0}):"—";
const groupFor=code=>Object.keys(GROUPS).find(k=>GROUPS[k].includes(code))||null;
const reading=(value,unit,lang)=>Number.isFinite(value)?fmt(value,lang)+" "+unit:"—";
export function buildDecisionBrief(row,{sites=[],start=null,end=null,lang="es"}={}){
 const es=lang!=="en";
 if(!row||!Object.hasOwn(VARIABLES,row.code))return null;
 const name=es?VARIABLES[row.code].nameEs:VARIABLES[row.code].name;
 const unit=VARIABLES[row.code].unit;
 const a=row.left||{},b=row.right||null;
 const supported=a.status==="descriptive"||a.status==="circular";
 const group=groupFor(row.code);
 const advice=guidance[group]||[];
 const total=Number.isInteger(start)&&Number.isInteger(end)&&end>=start?end-start+1:null;
 const n=Number.isInteger(a.n)?a.n:0;
 const cov=total?Math.round(100*n/total):null;
 const two=sites.length===2&&b!==null;
 const lastPair=two&&row.paired?.status==="descriptive"?row.paired.points.at(-1):null;
 const linear=a.status==="descriptive"&&Number.isFinite(a.slopePerDecade);
 const direction=linear?(a.slopePerDecade>0?(es?"positiva":"positive"):
  a.slopePerDecade<0?(es?"negativa":"negative"):(es?"cero":"zero")):null;
 const evidence=!supported?
   (es?"No hay suficientes observaciones originales para interpretar este parámetro.":"Insufficient original observations to interpret this parameter."):
   a.status==="circular"?
     (es?"La dirección media anual se trata como ángulo circular: no existe una pendiente lineal válida.":"Annual mean wind bearing is circular: a linear slope is not valid."):
     (es?"En "+(sites[0]?.label||"A")+", "+name+" tiene una pendiente Theil–Sen descriptiva "+direction+" de "+reading(a.slopePerDecade,VARIABLES[row.code].slopeUnit,lang)+
       " durante "+n+" años observados. No es una proyección ni una prueba de significancia.":
       "At "+(sites[0]?.label||"A")+", "+name+" has a "+direction+" descriptive Theil–Sen slope of "+reading(a.slopePerDecade,VARIABLES[row.code].slopeUnit,lang)+
       " across "+n+" observed years. This is neither a forecast nor established significance.");
 const metrics=[
  {label:es?"Último valor · A":"Latest value · A",value:supported?reading(a.latest,unit,lang):"—",
   note:supported?(es?"Año "+a.end:"Year "+a.end):(es?"Sin serie válida":"No valid series")},
  {label:es?"Cambio / década · A":"Change / decade · A",value:linear?reading(a.slopePerDecade,VARIABLES[row.code].slopeUnit,lang):"—",
   note:linear?(es?"Pendiente descriptiva":"Descriptive slope"):(es?"No estimable":"Not estimable")},
  {label:es?"Cobertura anual · A":"Annual coverage · A",value:total&&supported?n+"/"+total+" · "+cov+"%":"—",
   note:es?"Años válidos dentro del intervalo":"Valid years in requested range"},
  {label:two?(es?"Diferencia A − B":"Difference A − B"):(es?"Media histórica · A":"Historical mean · A"),
   value:two?(lastPair?reading(lastPair.value,unit,lang):"—"):(supported&&Number.isFinite(a.mean)?reading(a.mean,unit,lang):"—"),
   note:two?(lastPair?(es?"Mismo año "+lastPair.year:"Matched year "+lastPair.year):(es?"Años no compatibles":"No matched years")):
     (es?"Media de años observados":"Mean across observed years")}
 ];
 const limit=es?
   "Hipótesis y opciones generales, no atribución causal, predicción local ni asesoría profesional. Verifica homogeneidad, autocorrelación, incertidumbre y fuentes independientes antes de decidir.":
   "General hypotheses and decision options, not causal attribution, a local forecast or professional advice. Check source homogeneity, autocorrelation, uncertainty and independent evidence before acting.";
 return {code:row.code,name,unit,ready:supported,metrics,evidence,
   drivers:supported?advice[es?"es":"en"][0]:(es?"Se requieren observaciones originales.":"Original observations are required."),
   outlook:supported?advice[es?"es":"en"][1]:(es?"No se formula escenario sin datos.":"No scenario without data."),
   near:supported?advice[es?"es":"en"][2]:(es?"Consultar datos antes de tomar decisiones.":"Retrieve data before making decisions."),
   long:supported?advice[es?"es":"en"][3]:(es?"Definir fuentes y controles de calidad.":"Define data sources and quality controls."),
   limitation:limit};
}
export function buildAIRequest(brief,row,{sites=[],start,end,lang="es",source=""}={}){
 if(!brief?.ready||!row?.a?.points?.length)return null;
 const pack=(which,summary,site)=>summary&&site?{
  label:String(site.label||"").slice(0,100),
  lat:Number(site.lat),lon:Number(site.lon),
  status:summary.status,
  annual:(which?.points||[]).filter(x=>Number.isInteger(x.year)&&Number.isFinite(x.value))
    .slice(-50).map(x=>[x.year,x.value])
 }:null;
 return {schema:"telluris.ai.source_brief.v1",lang:lang==="en"?"en":"es",
  code:brief.code,unit:brief.unit,source:String(source).slice(0,60),
  requestedYears:[start,end],
  siteA:pack(row.a,row.left,sites[0]),
  siteB:pack(row.b,row.right,sites[1]),
  descriptiveSlopePerDecade:Number.isFinite(row.left.slopePerDecade)?
    row.left.slopePerDecade:null,
  warning:"Browser-provided unverified evidence; no validated significance, source homogeneity, causation or forecasting. Provide only conditional hypotheses and proportionate general recommendations."};
}
