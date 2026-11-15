import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {printableScientificReport} from "../public/assets/scientific-print.js";
import {buildScientificReport} from "../public/assets/report.js";
import {fromSnapshot,analyze} from "../public/assets/science.js";
const snap=JSON.parse(readFileSync(new URL("../public/telluris/explore/data/exp001-annual.json",import.meta.url),"utf8"));
test("The print report includes real NASA series and explicit uncertainty",()=>{
 const src=fromSnapshot(snap,"liberia","T2M",1985,2025);
 const doc=buildScientificReport({variable:"T2M",analysis:analyze(src.points),meta:src.meta},{unit:"°C",placeLabel:"Liberia"});
 const html=printableScientificReport(doc);
 assert.match(html,/<svg/);
 assert.match(html,/Significancia climática no validada/);
 assert.match(html,/1985/);
 assert.match(html,/2025/);
 assert.equal(html.match(/<tr><td/g).length,41);
});
test("Untrusted text is escaped in generated HTML",()=>{
 const src=fromSnapshot(snap,"liberia","T2M",1985,2025);
 const doc=buildScientificReport({variable:"T2M",analysis:analyze(src.points),meta:src.meta},{unit:"°C",placeLabel:"<img src=x onerror=alert(1)>"});
 const html=printableScientificReport(doc,{language:"en"});
 assert.ok(html.includes("&lt;img"));
 assert.ok(!html.includes("<img"));
});
test("Malformed report cannot be printed",()=>assert.throws(()=>
 printableScientificReport({schema:"bad",annualObservations:[]}),/required/));
