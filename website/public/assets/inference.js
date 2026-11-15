/* TELLURIS EXP-005: inference sensitivity; deterministic, dependency-free.
 * The MK p and Sen rank CI assume independent annual observations.
 * Nonoverlapping-block permutation is a sensitivity analysis UNDER exchangeable
 * stationary blocks, not a universal Hamed–Rao correction nor proof of causality.
 * Never label a physical NASA trend "validated" without product-homogeneity QA.
 */
const TWO_SIDED_Z_95 = 1.959963984540054;

function median(xs) {
  if (!xs.length) return NaN;
  const a=[...xs].sort((x,y)=>x-y),n=a.length;
  return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2;
}
function assertAnnual(points) {
  if (!Array.isArray(points)||points.length<2) throw new Error("Annual series too short.");
  const a=[...points].sort((x,y)=>x.year-y.year);
  if(a.some((v,i)=>!Number.isInteger(v.year)||!Number.isFinite(v.value)||
      (i>0&&v.year===a[i-1].year)))throw new Error("Invalid annual input years or values.");
  return a;
}
function signSum(values) {
  let s=0;
  for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)
    s+=Math.sign(values[j]-values[i]);
  return s;
}
function varS(values) {
  const n=values.length,groups=new Map();
  for(const value of values)groups.set(value,(groups.get(value)||0)+1);
  let tie=0;
  for(const k of groups.values())if(k>1)tie+=k*(k-1)*(2*k+5);
  return (n*(n-1)*(2*n+5)-tie)/18;
}
function slopePairs(points) {
  const slopes=[];
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)
    slopes.push((points[j].value-points[i].value)/(points[j].year-points[i].year));
  return slopes.sort((a,b)=>a-b);
}
/** Sen 95% rank-based slope interval. Formula follows Sen (1968), matching SciPy
 * scipy.stats.theilslopes with explicit year coordinates and ties in y.
 * Intercept CI is NOT supplied. The interval has iid/monotonic-trend assumptions.
 */
export function senConfidenceInterval(points) {
  const a=assertAnnual(points),slopes=slopePairs(a);
  const n=slopes.length,sigma=Math.sqrt(Math.max(0,varS(a.map(x=>x.value))));
  const lo=Math.max(0,Math.min(n-1,Math.round((n-TWO_SIDED_Z_95*sigma)/2)-1));
  const hi=Math.max(0,Math.min(n-1,Math.round((n+TWO_SIDED_Z_95*sigma)/2)));
  return {confidence:.95,slope:median(slopes),low:slopes[lo],high:slopes[hi],
    lowPerDecade:slopes[lo]*10,highPerDecade:slopes[hi]*10,
    excludesZero:slopes[lo]>0||slopes[hi]<0,
    assumption:"iid_rank_based",method:"Sen-1968 rank-based 95% CI"};
}
function randomGenerator(seed) {
  let t=seed>>>0;
  return ()=>{t+=0x6D2B79F5;let n=t;n=Math.imul(n^(n>>>15),n|1);
    n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};
}
function contiguous(a){return a.every((x,i)=>i===0||x.year===a[i-1].year+1);}
/** Monte Carlo two-sided block-order permutation null. Preserves intra-block
 * order and rough short-memory autocorrelation; exchangeability of blocks under
 * the null is an UNVERIFIED assumption for each physical time series.
 * B=999 gives a Monte Carlo p resolution of .001.
 */
export function blockOrderPermutation(points,blockYears=3,draws=999,seed=20261115) {
  const a=assertAnnual(points);
  if(!Number.isInteger(blockYears)||blockYears<2||blockYears>10||
     !Number.isInteger(draws)||draws<99||draws>4999)throw new Error("Invalid permutation configuration.");
  const count=Math.ceil(a.length/blockYears);
  if(!contiguous(a)||count<6){
    return {available:false,reason:!contiguous(a)?"missing_annual_years":"too_few_blocks",
      blockYears,blocks:count,draws:0,p:null};
  }
  const blocks=[];
  for(let i=0;i<a.length;i+=blockYears)
    blocks.push(a.slice(i,i+blockYears).map(x=>x.value));
  const observed=Math.abs(signSum(a.map(x=>x.value)));
  const rng=randomGenerator(seed),indices=blocks.map((_,i)=>i);
  let exceed=0;
  for(let trial=0;trial<draws;trial++){
    const order=[...indices];
    for(let i=order.length-1;i>0;i--){
      const j=Math.floor(rng()*(i+1));
      [order[i],order[j]]=[order[j],order[i]];
    }
    const shuffled=order.flatMap(j=>blocks[j]);
    if(Math.abs(signSum(shuffled))>=observed)exceed++;
  }
  return {available:true,reason:null,blockYears,blocks:count,draws,
    exceed,p:(exceed+1)/(draws+1),null:"exchangeable_nonoverlapping_blocks",
    seed};
}
/** Evidence-tier classification explicitly NOT a validation label.
 * No hidden decision is allowed to turn numerical significance into proof.
 */
export function assessTrendEvidence(points,mk,lag1,lag1Pairs) {
  const a=assertAnnual(points);
  const ci=senConfidenceInterval(a);
  const block3=blockOrderPermutation(a,3);
  const block5=blockOrderPermutation(a,5);
  const contiguousYears=contiguous(a);
  const lag1Threshold=lag1Pairs>=5?1.96/Math.sqrt(lag1Pairs):null;
  const serialFlag=lag1Threshold!==null&&lag1!==null&&
    Math.abs(lag1)>lag1Threshold;
  const n=a.length;
  const allAvailable=block3.available&&block5.available;
  const conditionalSignal=mk.p<.05&&ci.excludesZero;
  const sensitivityAgreement=allAvailable&&
    block3.p<.05&&block5.p<.05;
  return {
    status:!allAvailable?"insufficient_sensitivity":
       (conditionalSignal&&sensitivityAgreement?"consistent_exploratory":"inconclusive"),
    validatedSignificance:false,
    assumptionTested:"iid_monotonic_trend",
    alpha:.05, mkConditionalP:mk.p, mkConditionalBelowAlpha:mk.p<.05,
    senCI:ci, blockTests:[block3,block5],
    serialDiagnostic:{lag1,consecutivePairs:lag1Pairs,heuristicThreshold:lag1Threshold,
      flagged:serialFlag,interpretedAs:"diagnostic_not_independence_test"},
    n,contiguousYears,conditionalSignal,sensitivityAgreement,
    reason:"Requires independent source homogeneity, serial-dependence and stationarity checks",
    method:"MK iid + Sen iid slope CI + 3/5yr block-order permutation sensitivity"
  };
}
/** Difference between paired, same-variable, same-year series at two grid
 * positions. This is a temporal contrast, NOT a causal comparison.
 */
export function pairedAnnualDifferences(first,second){
  const a=assertAnnual(first),b=assertAnnual(second);
  const lookup=new Map(b.map(x=>[x.year,x.value]));
  return a.filter(x=>lookup.has(x.year)).map(x=>({year:x.year,
    value:x.value-lookup.get(x.year)}));
}
