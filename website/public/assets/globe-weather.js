/* EXP-009 atmospheric storytelling layer — not NASA spatial observations.
 * No animated wind/rain until a matching, loaded annual NASA POWER series exists.
 * Scalar WS10M has no source-specific compass bearing; rain annual totals are not
 * real-time or local radar rates. Animation direction/location is decorative.
 */
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export function weatherSource(detail,mode){
  if(!detail||!["wind","rain"].includes(mode))return null;
  const accepted=mode==="wind"?"WS10M":"PRECTOTCORR";
  const unit=mode==="wind"?"m/s":"mm / year";
  if(detail.variable!==accepted||detail.unit!==unit||
     !Number.isInteger(detail.year)||detail.year<1981||detail.year>2025||
     !Number.isFinite(detail.value)||detail.value<0||!detail.origin)
    return null;
  return {mode,year:detail.year,value:detail.value,unit,
    origin:String(detail.origin).slice(0,120)};
}
export function weatherParticleCount(source){
  if(!source)return 0;
  return source.mode==="rain"?
    clamp(Math.round(24+source.value/70),24,90):
    clamp(Math.round(22+source.value*4),22,84);
}
export function weatherDescription(source,mode,language="es"){
  const es=language!=="en";
  if(mode==="none")return es?
    "Animaciones desactivadas. Las imágenes NASA y los análisis científicos permanecen independientes.":
    "Animations disabled. NASA imagery and scientific analysis remain separate.";
  if(!source)return es?
    "Carga primero datos NASA POWER de "+(mode==="rain"?"precipitación PRECTOTCORR":"viento WS10M")+
      " para activar la ilustración. No se mostrarán observaciones simuladas.":
    "Load NASA POWER "+(mode==="rain"?"precipitation PRECTOTCORR":"wind WS10M")+
      " observations to enable this illustration. No fabricated observations are displayed.";
  const amount=source.value.toLocaleString(es?"es-CR":"en-US",{maximumFractionDigits:1});
  return es?
    "Ilustración didáctica, NO campo meteorológico real: "+source.year+" · "+
      (mode==="rain"?"precipitación anual ":"velocidad media anual del viento ")+
      amount+" "+source.unit+". Movimiento y posiciones decorativos; no indica dirección, lluvia actual ni predicciones. Fuente: "+source.origin+".":
    "Educational illustration, NOT a real weather field: "+source.year+" · "+
      (mode==="rain"?"annual precipitation ":"annual mean wind speed ")+
      amount+" "+source.unit+". Motion/placement are decorative; no wind direction, present rain or forecast is shown. Source: "+source.origin+".";
}
export function initWeatherCanvas(canvas,selector,note,{language="es"}={}){
  if(!canvas||!selector||!note)return {update(){},frame(){},dispose(){}};
  const ctx=canvas.getContext("2d");
  if(!ctx)return {update(){},frame(){},dispose(){}};
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false;
  let detail=null,mode=selector.value||"none",lastTime=0;
  let width=0,height=0;
  const particles=Array.from({length:90},(_,i)=>{
    const hash=x=>(((x*1664525+1013904223)>>>0)/4294967296);
    return {x:hash(i+31),y:hash(i*3+47),speed:.12+hash(i*9+13)*.28,
      drift:hash(i*7+27)*.5+.5,size:2+hash(i*5+29)*5};
  });
  function updateNote(){
    const available=weatherSource(detail,mode);
    note.textContent=weatherDescription(available,mode,language);
  }
  function selectMode(){
    mode=selector.value;lastTime=0;updateNote();
    if(mode==="none")ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  selector.addEventListener("change",selectMode);
  updateNote();
  function resize(){
    const box=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(box.width)),h=Math.max(1,Math.round(box.height));
    if(w===width&&h===height)return;
    width=w;height=h;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);
    canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  return {
    update(next){detail=next||null;updateNote();},
    frame(t){
      resize();const source=weatherSource(detail,mode);
      if(!source||reduced||document.hidden){
        ctx.clearRect(0,0,width,height);return;
      }
      const dt=lastTime?Math.min((t-lastTime)/1000,.05):0;
      lastTime=t;
      ctx.clearRect(0,0,width,height);
      const count=weatherParticleCount(source);
      ctx.lineCap="round";
      for(let i=0;i<count;i++){
        const p=particles[i];
        if(mode==="rain"){
          p.x=(p.x+dt*.035*p.drift)%1;
          p.y=(p.y+dt*p.speed*(.75+source.value/12000))%1;
          ctx.strokeStyle="rgba(120,191,234,.4)";
          ctx.lineWidth=.7;
          ctx.beginPath();
          ctx.moveTo(p.x*width,p.y*height);
          ctx.lineTo(p.x*width+1.6,p.y*height+p.size*2.8);
          ctx.stroke();
        }else{
          p.x=(p.x+dt*p.speed*(.75+source.value/25))%1;
          p.y=(p.y+dt*.025*p.drift)%1;
          ctx.strokeStyle="rgba(156,241,223,.39)";
          ctx.lineWidth=.9;
          ctx.beginPath();
          ctx.moveTo(p.x*width,p.y*height);
          ctx.lineTo(p.x*width+p.size*3,p.y*height);
          ctx.stroke();
        }
      }
    },
    dispose(){selector.removeEventListener("change",selectMode);}
  };
}
