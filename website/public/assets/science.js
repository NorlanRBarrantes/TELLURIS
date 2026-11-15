/* TELLURIS scientific core · pure ECMAScript, zero dependencies.
 * All p values assume independent annual observations; climate inference is not validated.
 */
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
    "fromAnnual": 1
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
    "fromAnnual": 2
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
    ]
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
    "aggregation": "mean"
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
    "trendCompatible": false
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
    "aggregation": "mean"
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
    "aggregation": "mean"
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
    "aggregation": "mean"
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
    "aggregation": "mean"
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
    "aggregation": "mean"
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
    "aggregation": "mean"
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
    ]
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
    "aggregation": "mean"
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
    "aggregation": "mean"
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
    ]
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
    "aggregation": "mean"
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
    ]
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
    ]
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
    lag1, lag1Pairs:earlier.length, points:sorted};
}
