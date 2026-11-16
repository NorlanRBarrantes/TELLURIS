/* EXP-017: Optional long-form evidence film. No automatic playback or broken-video UI. */
export const FILM_SRC="/assets/telluris-evidence-film-115x.mp4";
export function initEvidenceFilm(doc=document,win=window){
  const trigger=doc.querySelector("[data-film-open]");
  const dialog=doc.querySelector("[data-film-dialog]");
  const video=dialog?.querySelector("[data-film-video]");
  const closer=dialog?.querySelector("[data-film-close]");
  if(!trigger||!dialog||!video||!closer)return null;
  // Activate the button only after the separately uploaded MP4 is available.
  // GitHub source commits never imply that binary media has been deployed.
  const check=async()=>{
    try{
      const response=await win.fetch(FILM_SRC,{method:"HEAD",cache:"no-cache"});
      if(!response.ok)return false;
      trigger.hidden=false;
      return true;
    }catch{return false;}
  };
  trigger.addEventListener("click",()=>{
    if(!video.getAttribute("src"))video.setAttribute("src",FILM_SRC);
    if(typeof dialog.showModal==="function")dialog.showModal();
    else dialog.setAttribute("open","");
    const play=video.play?.();
    if(play?.catch)play.catch(()=>{});
  });
  const close=()=>{
    video.pause?.();
    if(typeof dialog.close==="function"&&dialog.open)dialog.close();
    else dialog.removeAttribute("open");
  };
  closer.addEventListener("click",close);
  dialog.addEventListener("close",()=>video.pause?.());
  dialog.addEventListener("click",e=>{if(e.target===dialog)close();});
  check();
  return {check,close};
}
if(typeof document!=="undefined")initEvidenceFilm();
