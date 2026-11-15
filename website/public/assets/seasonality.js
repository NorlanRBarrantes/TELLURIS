/* EXP-007C: descriptive month-of-year comparisons from complete-year NASA POWER input.
 * Reference is the early half of the selected years, NOT a formal climatology.
 */
export function summarizeMonthly(records,{unit="",aggregation="mean"}={}){
  if(!Array.isArray(records)||!records.length)throw Error("Monthly records required");
  if(!["mean","sum_rate"].includes(aggregation))throw Error("Unsupported aggregation");
  const byYear=new Map();
  for(const row of records){
    if(!row||!Number.isInteger(row.year)||row.year<1900||row.year>2100||
       !Number.isInteger(row.month)||row.month<1||row.month>12||
       !Number.isFinite(row.value)||!Number.isInteger(row.days)||
       row.days<28||row.days>31)throw Error("Invalid source month");
    if(!byYear.has(row.year))byYear.set(row.year,new Map());
    const months=byYear.get(row.year);
    if(months.has(row.month))throw Error("Duplicate source month");
    months.set(row.month,{value:row.value,days:row.days});
  }
  const complete=[...byYear.keys()].filter(y=>byYear.get(y).size===12).sort((a,b)=>a-b);
  if(complete.length<10)return {status:"insufficient",completeYears:complete.length};
  const cut=Math.floor(complete.length/2);
  const early=complete.slice(0,cut),late=complete.slice(cut);
  const mean=(years,month)=>years.reduce((sum,y)=>sum+byYear.get(y).get(month).value,0)/years.length;
  const monthly=Array.from({length:12},(_,idx)=>{
    const month=idx+1,reference=mean(early,month),recent=mean(late,month);
    return {month,reference,recent,delta:recent-reference,
      latestAnomaly:byYear.get(complete.at(-1)).get(month).value-reference};
  });
  const qValue=(year,q)=>{
    const rows=[1+q*3,2+q*3,3+q*3].map(m=>byYear.get(year).get(m));
    if(aggregation==="sum_rate")return rows.reduce((s,r)=>s+r.value,0);
    const d=rows.reduce((s,r)=>s+r.days,0);
    return rows.reduce((s,r)=>s+r.value*r.days,0)/d;
  };
  const quarters=Array.from({length:4},(_,q)=>{
    const reference=early.reduce((s,y)=>s+qValue(y,q),0)/early.length;
    const recent=late.reduce((s,y)=>s+qValue(y,q),0)/late.length;
    return {quarter:q+1,reference,recent,delta:recent-reference};
  });
  return {status:"descriptive",unit,aggregation,completeYears:complete.length,
    referenceYears:[early[0],early.at(-1)],recentYears:[late[0],late.at(-1)],
    latestYear:complete.at(-1),monthly,quarters,
    caveat:"Internal early/late halves and latest-year month-matched anomalies; not an official climatological normal or a statistical significance test."};
}
