/* TELLURIS scientific core · pure ECMAScript, zero dependencies.
 * Original MK p and Sen rank CI assume independent annual observations.
 * Block-order permutation is a non-final sensitivity check; physical model
 * homogeneity, stationarity and external validation remain unresolved.
 */
import {assessTrendEvidence} from "./inference.js";
export const VARIABLES = Object.freeze({
  "T2M": {
    "name": "Air temperature at 2 m",
    "nameEs": "Temperatura del aire a 2 m",
    "unit": "°C",
    "slopeUnit": "°C / decade",
    "community": "RE",
    "nativeUnits": [
      "C"
    ],
    "aggregation": "mean",
    "fromAnnual": 1,
    "descriptionEs": "Temperatura del aire modelada a dos metros; la media anual pondera los meses según su duración.",
    "descriptionEn": "Modeled air temperature at two meters; the annual mean weights each month by its length."
  },
  "PRECTOTCORR": {
    "name": "Annual precipitation",
    "nameEs": "Precipitación anual",
    "unit": "mm / year",
    "slopeUnit": "mm / decade",
    "community": "RE",
    "nativeUnits": [
      "mm/day"
    ],
    "aggregation": "sum_rate",
    "fromAnnual": 2,
    "descriptionEs": "Tasa de precipitación corregida del modelo; sumamos milímetros por día multiplicados por los días de cada mes. Se necesita contrastar con datos independientes.",
    "descriptionEn": "Model-corrected precipitation rate; annual millimeters sum the monthly mm/day times days. Independent cross-check remains necessary."
  },
  "RH2M": {
    "name": "Relative humidity at 2 m",
    "nameEs": "Humedad relativa a 2 m",
    "unit": "%",
    "slopeUnit": "pp / decade",
    "community": "AG",
    "nativeUnits": [
      "%"
    ],
    "aggregation": "mean",
    "range": [
      0,
      100
    ],
    "descriptionEs": "Porcentaje de humedad del aire respecto de la saturación a dos metros, no masa absoluta de vapor.",
    "descriptionEn": "Humidity as a percentage of saturation at two meters, not absolute water vapor mass."
  },
  "WS10M": {
    "name": "Wind speed at 10 m",
    "nameEs": "Velocidad del viento a 10 m",
    "unit": "m/s",
    "slopeUnit": "m/s / decade",
    "community": "RE",
    "nativeUnits": [
      "m/s"
    ],
    "aggregation": "mean",
    "descriptionEs": "Velocidad media modelada del viento a diez metros; no representa ráfagas ni mediciones entre edificios.",
    "descriptionEn": "Modeled mean wind speed at ten meters; not gust speed or readings between buildings."
  },
  "WD10M": {
    "name": "Wind direction at 10 m",
    "nameEs": "Dirección del viento a 10 m",
    "unit": "°",
    "slopeUnit": "not applicable",
    "community": "RE",
    "nativeUnits": [
      "Degrees"
    ],
    "aggregation": "circular",
    "trendCompatible": false,
    "descriptionEs": "Dirección desde la que viene el viento, en grados (0° norte, 90° este). El promedio anual es circular; no se calcula pendiente lineal.",
    "descriptionEn": "Bearing from which the wind blows (0° north, 90° east). The annual average is circular; linear trends are not calculated."
  },
  "U10M": {
    "name": "Eastward wind at 10 m",
    "nameEs": "Componente este del viento a 10 m",
    "unit": "m/s",
    "slopeUnit": "m/s / decade",
    "community": "RE",
    "nativeUnits": [
      "m/s"
    ],
    "aggregation": "mean",
    "descriptionEs": "Componente este-oeste de la velocidad a diez metros; positivo hacia el este y negativo hacia el oeste.",
    "descriptionEn": "East-west wind component at ten meters; positive eastward and negative westward."
  },
  "V10M": {
    "name": "Northward wind at 10 m",
    "nameEs": "Componente norte del viento a 10 m",
    "unit": "m/s",
    "slopeUnit": "m/s / decade",
    "community": "RE",
    "nativeUnits": [
      "m/s"
    ],
    "aggregation": "mean",
    "descriptionEs": "Componente norte-sur de la velocidad a diez metros; positivo hacia el norte y negativo hacia el sur.",
    "descriptionEn": "North-south wind component at ten meters; positive northward and negative southward."
  },
  "ALLSKY_SFC_SW_DWN": {
    "name": "Solar shortwave irradiance at surface",
    "nameEs": "Radiación solar superficial incidente",
    "unit": "kWh/m²/day",
    "slopeUnit": "kWh/m²/day / decade",
    "community": "RE",
    "nativeUnits": [
      "kW-hr/m^2/day"
    ],
    "aggregation": "mean",
    "descriptionEs": "Energía solar de onda corta que llega a la superficie por unidad de área y día, con nubosidad.",
    "descriptionEn": "Shortwave sunlight reaching the surface per area and day under all-sky conditions."
  },
  "T2M_MAX": {
    "name": "Mean of monthly maximum temperatures",
    "nameEs": "Media anual de las máximas mensuales",
    "unit": "°C",
    "slopeUnit": "°C / decade",
    "community": "AG",
    "nativeUnits": [
      "C"
    ],
    "aggregation": "mean",
    "descriptionEs": "Resumen anual de los valores máximos mensuales del aire, ponderados por días; no es el récord anual absoluto.",
    "descriptionEn": "Day-weighted annual summary of monthly maximum-air-temperature values, not an absolute annual record."
  },
  "T2M_MIN": {
    "name": "Mean of monthly minimum temperatures",
    "nameEs": "Media anual de las mínimas mensuales",
    "unit": "°C",
    "slopeUnit": "°C / decade",
    "community": "AG",
    "nativeUnits": [
      "C"
    ],
    "aggregation": "mean",
    "descriptionEs": "Resumen anual de los valores mínimos mensuales del aire, ponderados por días; no es el mínimo anual absoluto.",
    "descriptionEn": "Day-weighted annual summary of monthly minimum-air-temperature values, not the absolute year's lowest reading."
  },
  "PS": {
    "name": "Surface air pressure",
    "nameEs": "Presión atmosférica superficial",
    "unit": "kPa",
    "slopeUnit": "kPa / decade",
    "community": "AG",
    "nativeUnits": [
      "kPa"
    ],
    "aggregation": "mean",
    "descriptionEs": "Presión atmosférica estimada en la superficie del terreno por el modelo, en kilopascales.",
    "descriptionEn": "Modeled atmospheric pressure at the local ground surface, in kilopascals."
  },
  "CLOUD_AMT": {
    "name": "Cloud amount",
    "nameEs": "Cantidad de nubosidad",
    "unit": "%",
    "slopeUnit": "pp / decade",
    "community": "AG",
    "nativeUnits": [
      "%"
    ],
    "aggregation": "mean",
    "range": [
      0,
      100
    ],
    "descriptionEs": "Fracción de la zona cubierta por nubes expresada en porcentaje; no mide por sí sola su espesor óptico.",
    "descriptionEn": "The percentage of the region covered by clouds; not a measurement of cloud optical thickness."
  },
  "QV2M": {
    "name": "Specific humidity at 2 m",
    "nameEs": "Humedad específica a 2 m",
    "unit": "g/kg",
    "slopeUnit": "g/kg / decade",
    "community": "AG",
    "nativeUnits": [
      "g/kg"
    ],
    "aggregation": "mean",
    "descriptionEs": "Cantidad de vapor de agua por kilogramo de aire a dos metros, expresada en g/kg.",
    "descriptionEn": "Water vapor mass per kilogram of air at two meters, in g/kg."
  },
  "ALLSKY_SFC_LW_DWN": {
    "name": "Downward longwave at surface",
    "nameEs": "Radiación infrarroja descendente",
    "unit": "kWh/m²/day",
    "slopeUnit": "kWh/m²/day / decade",
    "community": "RE",
    "nativeUnits": [
      "kW-hr/m^2/day"
    ],
    "aggregation": "mean",
    "descriptionEs": "Flujo energético infrarrojo descendente que llega a la superficie; no equivale al balance energético total.",
    "descriptionEn": "Downward longwave infrared energy flux reaching the surface; not the entire Earth energy balance."
  },
  "ALLSKY_SRF_ALB": {
    "name": "All-sky surface albedo",
    "nameEs": "Albedo superficial",
    "unit": "fraction",
    "slopeUnit": "fraction / decade",
    "community": "RE",
    "nativeUnits": [
      "dimensionless"
    ],
    "aggregation": "mean",
    "range": [
      0,
      1
    ],
    "descriptionEs": "Fracción de radiación solar que la superficie refleja (0 a 1); no equivale a cambio de cobertura terrestre.",
    "descriptionEn": "Fraction of incoming sunlight reflected by the surface (0 to 1); not a direct land-cover change measure."
  },
  "EVPTRNS": {
    "name": "Evapotranspiration energy flux",
    "nameEs": "Flujo energético de evapotranspiración",
    "unit": "MJ/m²/day",
    "slopeUnit": "MJ/m²/day / decade",
    "community": "AG",
    "nativeUnits": [
      "MJ/m^2/day"
    ],
    "aggregation": "mean",
    "descriptionEs": "Flujo de energía asociado a evapotranspiración, en MJ/m²/día. No lo presentamos como milímetros de agua.",
    "descriptionEn": "Energy flux associated with evapotranspiration, in MJ/m²/day. It is not shown as millimeters of water."
  },
  "GWETROOT": {
    "name": "Root-zone soil wetness",
    "nameEs": "Humedad relativa de la zona radicular",
    "unit": "fraction",
    "slopeUnit": "fraction / decade",
    "community": "AG",
    "nativeUnits": [
      "1"
    ],
    "aggregation": "mean",
    "range": [
      0,
      1
    ],
    "descriptionEs": "Índice modelado de humedad relativa de la zona de raíces, entre 0 y 1; no es contenido volumétrico ni caudal.",
    "descriptionEn": "Modeled root-zone relative wetness on a 0–1 scale; not volumetric soil water or river discharge."
  },
  "GWETTOP": {
    "name": "Surface soil wetness",
    "nameEs": "Humedad relativa del suelo superficial",
    "unit": "fraction",
    "slopeUnit": "fraction / decade",
    "community": "AG",
    "nativeUnits": [
      "1"
    ],
    "aggregation": "mean",
    "range": [
      0,
      1
    ],
    "descriptionEs": "Índice modelado de humedad del suelo superficial, entre 0 y 1; no es sensor in situ ni satélite SMAP.",
    "descriptionEn": "Modeled surface soil wetness on a 0–1 scale; not a ground sensor or SMAP satellite measurement."
  }
});
export const POWER_READY_CODES = Object.freeze(Object.keys(VARIABLES));
export function powerUrl(lat, lon, start, end, variable=null) {
  if (![lat, lon, start, end].every(Number.isFinite) || Math.abs(lat)>90 || Math.abs(lon)>180 ||
      start > end || start < 1981 || end > 2100) throw new Error("Invalid coordinates or year range.");
  if (variable!==null && !Object.hasOwn(VARIABLES,variable)) throw new Error("Unknown NASA POWER parameter.");
  const q = new URLSearchParams({
    parameters: variable===null ? "T2M,PRECTOTCORR" : variable,
    community: variable===null ? "RE" : VARIABLES[variable].community,
    longitude: String(lon), latitude: String(lat),
    start: String(start), end: String(end), format: "JSON"
  });
  return "https://power.larc.nasa.gov/api/temporal/monthly/point?" + q;
}
const days = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
function assertVariable(variable) {
  if (!Object.hasOwn(VARIABLES, variable)) throw new Error("Unknown scientific variable.");
}
function finite(value, fill) {
  if (value === null || typeof value === "boolean") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed === fill) return null;
  return parsed;
}
export function fromPower(payload, variable, start, end) {
  assertVariable(variable);
  const def=VARIABLES[variable];
  if (!payload || !payload.properties?.parameter || !payload.header ||
      !payload.parameters?.[variable]) throw new Error("Invalid NASA POWER JSON / metadata.");
  const series=payload.properties.parameter[variable];
  if (!series || typeof series!=="object") throw new Error("Missing requested NASA variable.");
  const fill=Number(payload.header.fill_value);
  if (!Number.isFinite(fill)) throw new Error("Missing or invalid NASA fill value.");
  const nativeUnit=payload.parameters[variable].units;
  if (!def.nativeUnits.includes(nativeUnit))
    throw new Error("Unexpected "+variable+" unit: "+String(nativeUnit));
  const points=[],incomplete=[];
  let ignoredAnnualKeys=0;
  for(let year=start;year<=end;year++){
    if(Object.hasOwn(series,String(year)+"13"))ignoredAnnualKeys++;
    let weighted=0,daysTotal=0,count=0,sines=0,cosines=0;
    for(let month=1;month<=12;month++){
      const key=String(year)+String(month).padStart(2,"0");
      const value=finite(series[key],fill);
      if (value===null ||
          (def.aggregation==="sum_rate" && value<0) ||
          (def.range && (value<def.range[0] || value>def.range[1])) ||
          (def.aggregation==="circular" && (value<0 || value>360))) continue;
      const d=days(year,month);
      if(def.aggregation==="circular"){
        const radians=value*Math.PI/180;
        sines+=Math.sin(radians)*d;cosines+=Math.cos(radians)*d;
      }else{weighted+=value*d;}
      daysTotal+=d;count++;
    }
    if(count===12){
      let value;
      if(def.aggregation==="sum_rate")value=weighted;
      else if(def.aggregation==="circular"){
        const norm=Math.hypot(sines,cosines)/daysTotal;
        value=norm<1e-8?null:(Math.atan2(sines,cosines)*180/Math.PI+360)%360;
      }else value=weighted/daysTotal;
      if(value!==null && Number.isFinite(value))points.push({year,value});
      else incomplete.push(year);
    }else incomplete.push(year);
  }
  return {points,meta:{
    kind:"NASA POWER LIVE JSON",
    source:(payload.header.sources||[]).join(", ")||"Not specified",
    version:payload.header.api?.version||"Not specified",
    originalUnit:nativeUnit,resolvedCoordinates:payload.geometry?.coordinates,
    fill,incomplete,ignoredAnnualKeys,period:[start,end],
    aggregation:def.aggregation,community:def.community,
    retrievedUtc:new Date().toISOString()
  }};
}
export function fromSnapshot(snapshot, place, variable, start, end) {
  assertVariable(variable);
  if (!snapshot || snapshot.schema !== "telluris.exp001.annual.v1")
    throw new Error("Unrecognized archived NASA dataset.");
  if (!Object.hasOwn(snapshot.locations, place))
    throw new Error("No archived NASA sample for this location.");
  if (!VARIABLES[variable].fromAnnual)
    throw new Error("Archived NASA samples are available only for T2M and PRECTOTCORR.");
  const site = snapshot.locations[place], col = VARIABLES[variable].fromAnnual;
  const points = site.series.filter(row => row[0] >= start && row[0] <= end)
    .map(row => ({year: row[0], value: row[col]}));
  return {points, meta: {
    kind: "ARCHIVED NASA POWER · EXP-001", source: "MERRA2", version: snapshot.apiVersion,
    originalUnit: snapshot.units[variable], resolvedCoordinates: site.coordinates,
    rawSha256: site.sha256, retrievedUtc: snapshot.retrievedUTC,
    period: [start, end], archiveLink: snapshot.sourceRun,
    note: "NASA monthly data aggregated into annual values; the archive uses rounded display values."
  }};
}
export function median(numbers) {
  if (!numbers.length) return NaN;
  const sorted = [...numbers].sort((a,b) => a-b), i = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2;
}
export function senSlope(points) {
  const slopes = [];
  for (let i = 0; i < points.length; i++)
    for (let j = i+1; j < points.length; j++)
      slopes.push((points[j].value - points[i].value) / (points[j].year - points[i].year));
  return median(slopes);
}
function normalTwoSidedP(z) {
  // Abramowitz–Stegun approximation for erf with |error| below ~1.5e-7.
  const a = [0.254829592,-0.284496736,1.421413741,-1.453152027,1.061405429];
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const erf = 1 - (((((a[4]*t+a[3])*t+a[2])*t+a[1])*t+a[0])*t) * Math.exp(-z*z/2);
  return Math.max(0, Math.min(1, 1 - erf));
}
export function mannKendall(values) {
  const n = values.length;
  if (n < 2 || !values.every(Number.isFinite)) throw new Error("At least two valid samples needed.");
  let s = 0;
  const groups = new Map();
  for (const x of values) groups.set(x, (groups.get(x)||0)+1);
  for (let i=0;i<n;i++) for (let j=i+1;j<n;j++)
    s += Math.sign(values[j] - values[i]);
  let tie = 0;
  for (const c of groups.values()) if (c > 1) tie += c*(c-1)*(2*c+5);
  const variance = (n*(n-1)*(2*n+5) - tie)/18;
  const z = variance === 0 ? 0 : (s > 0 ? s-1 : s < 0 ? s+1 : 0) / Math.sqrt(variance);
  return {s, variance, z, p: normalTwoSidedP(z), tau: s/(n*(n-1)/2)};
}
export function analyze(points) {
  const sorted = [...points].sort((a,b) => a.year-b.year);
  const n = sorted.length;
  if (n < 10 || new Set(sorted.map(p => p.year)).size !== n ||
      sorted.some(p => !Number.isFinite(p.value))) return {status:"insufficient", n};
  const slope = senSlope(sorted);
  const originYear = sorted[0].year;
  const intercept = median(sorted.map(p => p.value - slope*(p.year-originYear)));
  const mk = mannKendall(sorted.map(p => p.value));
  const residual = sorted.map(p => p.value - slope * (p.year-originYear));
  const earlier = [], later = [];
  for (let i=0;i<n-1;i++) {
    if (sorted[i+1].year === sorted[i].year+1) {
      earlier.push(residual[i]); later.push(residual[i+1]);
    }
  }
  let lag1 = null;
  if (earlier.length >= 3) {
    const xm = earlier.reduce((a,b) => a+b,0)/earlier.length;
    const ym = later.reduce((a,b) => a+b,0)/later.length;
    const cross = earlier.reduce((a,x,i) => a + (x-xm)*(later[i]-ym),0);
    const xx = earlier.reduce((a,x) => a+(x-xm)**2,0);
    const yy = later.reduce((a,y) => a+(y-ym)**2,0);
    if (xx > 0 && yy > 0) lag1 = cross/Math.sqrt(xx*yy);
  }
  return {status:"exploratory", n, start:sorted[0].year, end:sorted[n-1].year,
    slope, slopePerDecade: slope*10, intercept, originYear, mk,
    lag1, lag1Pairs:earlier.length, points:sorted,
    inference:assessTrendEvidence(sorted,mk,lag1,earlier.length)};
}
