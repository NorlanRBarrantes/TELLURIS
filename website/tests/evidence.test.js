import test from "node:test";
import assert from "node:assert/strict";
import {buildEvidence,compareEvidence,answerEvidence} from "../public/assets/evidence.js";
const sample=(s)=>({status:"exploratory",n:41,start:1985,end:2025,slopePerDecade:s,mk:{p:.003},lag1:.45});
test("No unvalidated significance classification",()=>{
 const e=buildEvidence(sample(.12),"T2M","Liberia","MERRA2","es");
 assert.match(answerEvidence("¿Es significativo?",e),/provisional/);
 assert.doesNotMatch(answerEvidence("¿Es significativo?",e),/es estadísticamente significativo/);
});
test("No invented output for insufficient data",()=>assert.equal(buildEvidence({status:"insufficient"},"T2M","Liberia","MERRA2"),null));
test("Two point contrast is explicitly descriptive",()=>assert.match(compareEvidence(sample(.12),sample(-.03),"Liberia","Limón"),/NO constituye/));
test("Traceability and English diagnostic",()=>{
 const e=buildEvidence(sample(.12),"T2M","Liberia","MERRA2","en");
 assert.match(answerEvidence("source",e),/MERRA2/);
 assert.match(answerEvidence("uncertainty",e),/0.450/);
});
