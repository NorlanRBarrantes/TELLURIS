import test from "node:test";
import assert from "node:assert/strict";
import {senConfidenceInterval,blockOrderPermutation,pairedAnnualDifferences,
        assessTrendEvidence} from "../public/assets/inference.js";
import {analyze,mannKendall} from "../public/assets/science.js";
function points(n,fun,start=1985){return Array.from({length:n},(_,i)=>({year:start+i,value:fun(i)}));}
test("Sen confidence limits are exact on a perfect linear trend with elapsed years",()=>{
 const x=points(41,i=>9+2*i);
 const c=senConfidenceInterval(x);
 assert.equal(c.low,2);assert.equal(c.high,2);assert.equal(c.slope,2);
 assert.equal(c.lowPerDecade,20);assert.ok(c.excludesZero);
});
test("A flat constant series never produces false-significance confidence bounds",()=>{
 const x=points(41,_=>10);
 const c=senConfidenceInterval(x);
 assert.equal(c.low,0);assert.equal(c.high,0);
 assert.equal(c.excludesZero,false);
 const mk=mannKendall(x.map(v=>v.value));
 const evidence=assessTrendEvidence(x,mk,0,39);
 assert.equal(evidence.validatedSignificance,false);
 assert.equal(evidence.status,"inconclusive");
});
test("Sen 95% CI contains the median slope and is sign-symmetric",()=>{
 const x=points(37,i=>Math.sin(i*1.73)*4+.3*i);
 const ci=senConfidenceInterval(x);
 const negative=senConfidenceInterval(x.map(v=>({...v,value:-v.value})));
 assert.ok(ci.low<=ci.slope&&ci.slope<=ci.high);
 assert.ok(Math.abs(ci.low+negative.high)<1e-10);
 assert.ok(Math.abs(ci.high+negative.low)<1e-10);
});
test("Block-order Monte Carlo is deterministic and its p-value is smoothed",()=>{
 const x=points(41,i=>i+.15*Math.sin(i));
 const a=blockOrderPermutation(x,3,999);
 const b=blockOrderPermutation(x,3,999);
 assert.deepEqual(a,b);
 assert.ok(a.p>=.001&&a.p<=1);
 assert.equal(a.blocks,14);
 assert.equal(a.seed,20261115);
});
test("Missing years or fewer than six blocks prohibit block permutation",()=>{
 const gap=points(41,i=>i);gap[12].year+=.5;
 assert.equal(blockOrderPermutation(gap,3).reason,"missing_annual_years");
 const short=points(24,i=>i);
 assert.equal(blockOrderPermutation(short,5).reason,"too_few_blocks");
});
test("Paired contrast aligns dates by year even if one series has a gap",()=>{
 const a=[{year:2000,value:10},{year:2001,value:20},{year:2003,value:30}];
 const b=[{year:2000,value:7},{year:2002,value:11},{year:2003,value:15}];
 assert.deepEqual(pairedAnnualDifferences(a,b),[{year:2000,value:3},{year:2003,value:15}]);
});
test("Block permutation cannot be misreported as certified significance",()=>{
 const monotone=points(41,i=>i);
 const mk=mannKendall(monotone.map(x=>x.value));
 const r=assessTrendEvidence(monotone,mk,0,40);
 assert.equal(r.status,"consistent_exploratory");
 assert.equal(r.validatedSignificance,false);
 assert.equal(r.blockTests.length,2);
 assert.equal(r.senCI.excludesZero,true);
 assert.equal(r.serialDiagnostic.interpretedAs,"diagnostic_not_independence_test");
});
test("Residual autocorrelation is flagged as a heuristic and not proven independence",()=>{
 const series=points(41,i=>i*.06+Math.sin(i*.3)*4);
 const output=analyze(series);
 const r=assessTrendEvidence(series,output.mk,output.lag1,output.lag1Pairs);
 assert.equal(typeof r.serialDiagnostic.flagged,"boolean");
 assert.equal(r.serialDiagnostic.interpretedAs,"diagnostic_not_independence_test");
 assert.equal(r.assumptionTested,"iid_monotonic_trend");
});
test("Non-constant observations cannot be labeled validated based on raw MK alone",()=>{
 const x=points(41,i=>i+.9*Math.sin(i/2));
 const r=assessTrendEvidence(x,mannKendall(x.map(v=>v.value)),.7,40);
 assert.equal(r.validatedSignificance,false);
 assert.equal(r.reason.includes("homogeneity"),true);
});
