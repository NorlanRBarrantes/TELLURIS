/* EXP-011 · Accessible six-slide judge presentation for TELLURIS.
 * No autoplay, no hijacking of ordinary vertical scrolling, no fake NASA data.
 */
export const SLIDE_IDS=Object.freeze(["intro","how","method","capabilities","rigor","explorer"]);
export function slideIndexFromHash(hash){
  const name=String(hash||"").replace(/^#/,"");
  const aliases={variables:"capabilities",challenge:"rigor"};
  const id=aliases[name]||name;
  const index=SLIDE_IDS.indexOf(id);
  return index<0?0:index;
}
export function nextSlideIndex(index,delta,total=SLIDE_IDS.length){
  if(!Number.isInteger(index)||!Number.isInteger(delta))throw Error("Invalid slide navigation");
  return Math.max(0,Math.min(total-1,index+delta));
}
export function swipeDirection(dx,dy){
  if(!Number.isFinite(dx)||!Number.isFinite(dy)||Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.5)return 0;
  return dx<0?1:-1;
}
export function initJourneyDeck(doc=document,win=window){
  const deck=doc.querySelector('[data-page="telluris-journey"] .jg-deck');
  if(!deck)return {active:0,go(){}};
  const slides=[...deck.querySelectorAll(".jg-slide")];
  const nav=deck.querySelector(".jg-slide-nav");
  const prev=nav?.querySelector('[data-slide-prev]'),next=nav?.querySelector('[data-slide-next]');
  const numbered=[...nav.querySelectorAll("[data-slide-to]")];
  const status=deck.querySelector("#jg-slide-status");
  if(slides.length!==SLIDE_IDS.length||numbered.length!==SLIDE_IDS.length)throw Error("Invalid TELLURIS slide markup");
  let active=0,gesture=null;
  const slidesArea=deck.querySelector(".jg-deck-track");
  const reduce=win.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false;
  function change(index,{updateHistory=true}={}){
    const target=nextSlideIndex(index,0);
    active=target;
    deck.style.setProperty("--jg-current",String(target));
    slides.forEach((slide,i)=>{
      const shown=i===target;
      slide.classList.toggle("is-active",shown);
      slide.setAttribute("aria-hidden",String(!shown));
      if(shown)slide.removeAttribute("inert");else slide.setAttribute("inert","");
      slide.scrollTop=0;
    });
    numbered.forEach((b,i)=>{
      b.setAttribute("aria-current",i===target?"step":"false");
      b.setAttribute("aria-pressed",String(i===target));
    });
    if(prev)prev.disabled=target===0;
    if(next)next.disabled=target===slides.length-1;
    if(status){
      const title=numbered[target]?.dataset.title||"";
      status.textContent=(target+1)+" / "+slides.length+" · "+title;
    }
    if(updateHistory){
      const suffix=target===0?"":("#"+SLIDE_IDS[target]);
      const dest=win.location.pathname+win.location.search+suffix;
      if(win.history?.replaceState)win.history.replaceState(null,"",dest);
    }
    if(!reduce)deck.classList.add("jg-ready");
  }
  function navigate(delta){change(nextSlideIndex(active,delta));}
  prev?.addEventListener("click",()=>navigate(-1));
  next?.addEventListener("click",()=>navigate(1));
  for(const [i,button] of numbered.entries())button.addEventListener("click",()=>change(i));
  doc.addEventListener("keydown",event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.defaultPrevented)return;
    const target=event.target;
    if(target?.closest?.("input,textarea,select,[contenteditable],button,a,summary"))return;
    if(event.key==="ArrowRight"||event.key==="PageDown"){event.preventDefault();navigate(1);}
    else if(event.key==="ArrowLeft"||event.key==="PageUp"){event.preventDefault();navigate(-1);}
    else if(event.key==="Home"){event.preventDefault();change(0);}
    else if(event.key==="End"){event.preventDefault();change(slides.length-1);}
  });
  slidesArea?.addEventListener("touchstart",event=>{
    if(event.touches.length!==1)return;
    gesture={x:event.touches[0].clientX,y:event.touches[0].clientY,
      target:event.target};
  },{passive:true});
  slidesArea?.addEventListener("touchend",event=>{
    if(!gesture||event.changedTouches.length!==1)return;
    const t=event.changedTouches[0],dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;
    const from=gesture.target;gesture=null;
    if(from?.closest?.("a,button,input,select,textarea,summary"))return;
    const delta=swipeDirection(dx,dy);
    if(delta)navigate(delta);
  },{passive:true});
  win.addEventListener("hashchange",()=>change(slideIndexFromHash(win.location.hash),{updateHistory:false}));
  // Links in the header still use ordinary language-specific #anchors.
  doc.querySelectorAll('a[href^="/#"],a[href^="/en/#"]').forEach(link=>{
    link.addEventListener("click",event=>{
      const dest=new URL(link.href,win.location.href);
      if(dest.pathname!==win.location.pathname)return;
      const ix=slideIndexFromHash(dest.hash);
      if(dest.hash&&ix>=0){
        event.preventDefault();change(ix);
      }
    });
  });
  change(slideIndexFromHash(win.location.hash),{updateHistory:false});
  return {get active(){return active;},go:change};
}
if(typeof document!=="undefined")initJourneyDeck();
