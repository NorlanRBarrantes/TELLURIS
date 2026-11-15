/* TELLURIS EXP-008 — NASA GIBS imagery on interactive, geographic 3D Earth.
 * Globe imagery is for visual exploration only; NASA POWER performs separate
 * numerical time-series analysis. No color-to-temperature inference.
 * Three.js r170 (MIT); NASA GIBS; Natural Earth geography (public domain).
 */
import {GLOBE_LAYERS,DEFAULT_GIBS_DATE,gibsWmsUrl,
        gibsLayerDisclosure,validateGlobeDate,GIBS_TEXTURE_U_OFFSET} from "./globe-layers.js?v=exp008-uvfix-20261115";
import {initWeatherCanvas} from "./globe-weather.js?v=exp009-20261115";

const el=id=>document.getElementById(id);
const stage=el("globe-stage"),status=el("globe-status");
const lang=document.documentElement.lang.startsWith("es")?"es":"en";
const es=lang==="es";
const say=(spanish,english)=>es?spanish:english;
const controls={
  layer:el("globe-layer"),date:el("globe-date"),spin:el("globe-spin"),
  source:el("globe-source-link"),meta:el("globe-layer-meta"),
  legend:el("globe-nasa-legend"),selection:el("globe-selection"),
  analyze:el("globe-analyze")
};
const locations={liberia:[10.63,-85.44],limon:[9.99,-83.03]};
const messages={
  loading:say("Cargando visualización desde NASA GIBS…","Loading NASA GIBS visualization…"),
  ready:say("Mapa NASA cargado · arrastra, acerca y selecciona un lugar.",
            "NASA map loaded · drag, zoom and select a place."),
  failed:say("La imagen NASA no está disponible: se conserva el globo geográfico. Puedes investigar con NASA POWER.",
             "NASA imagery unavailable: geographic globe remains. NASA POWER analysis is still available."),
  unavailable:say("WebGL no disponible. Usa los botones de localización y el formulario científico.",
                  "WebGL unavailable. Use location buttons and the scientific form.")
};
function setStatus(message){if(status)status.textContent=message;}
function describeLayer(id,date){
  const spec=GLOBE_LAYERS[id];
  if(controls.meta)controls.meta.textContent=gibsLayerDisclosure(id,lang,date);
  if(controls.source){
    controls.source.href=spec.reference;
    controls.source.textContent=say("Ficha y procedencia NASA ↗","NASA source and documentation ↗");
  }
  if(controls.legend)controls.legend.hidden=id!=="lst";
}
function chooseLocation(key,point=null){
  const place=el("location"),lat=el("latitude"),lon=el("longitude");
  if(!place||!lat||!lon)return;
  place.value=key;
  place.dispatchEvent(new Event("change",{bubbles:true}));
  if(key==="custom"&&point){
    lat.value=point[0].toFixed(4);
    lon.value=point[1].toFixed(4);
    lat.dispatchEvent(new Event("change",{bubbles:true}));
    lon.dispatchEvent(new Event("change",{bubbles:true}));
  }
  if(controls.selection){
    const label=place.selectedOptions[0]?.textContent||say("Punto personalizado","Custom point");
    controls.selection.textContent=label+" · "+
      Number(lat.value).toFixed(3)+"°, "+Number(lon.value).toFixed(3)+"°";
  }
  document.querySelectorAll("[data-globe-location]").forEach(b=>
    b.setAttribute("aria-pressed",String(b.dataset.globeLocation===key)));
  setStatus(say("Ubicación seleccionada; consulta NASA POWER para sus datos.",
                "Location selected; query NASA POWER for source observations."));
}
document.querySelectorAll("[data-globe-location]").forEach(b=>
  b.addEventListener("click",()=>chooseLocation(b.dataset.globeLocation)));
controls.analyze?.addEventListener("click",()=>{
  const button=el("live-btn");
  button?.scrollIntoView({behavior:"smooth",block:"center"});
  button?.focus({preventScroll:true});
});
if(controls.date && !controls.date.value)controls.date.value=DEFAULT_GIBS_DATE;
if(controls.layer)describeLayer(controls.layer.value,controls.date?.value||DEFAULT_GIBS_DATE);

async function boot(){
  if(!stage)return;
  let T;
  try{T=await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");}
  catch{setStatus(say("No fue posible cargar Three.js; usa los botones de localización.",
                      "Could not load Three.js; use the location buttons."));return;}

  let renderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});}
  catch{setStatus(messages.unavailable);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=T.SRGBColorSpace;
  stage.append(renderer.domElement);
  const weather=initWeatherCanvas(el("globe-weather-canvas"),
    el("globe-weather-mode"),el("globe-weather-note"),{language:lang});
  const receiveEvidence=event=>weather.update(event.detail);
  window.addEventListener("telluris:source-data",receiveEvidence);

  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(36,1,.1,80);
  const HOME_Z=5.45,MIN_Z=3.95,MAX_Z=9.3;
  camera.position.set(0,0,HOME_Z);
  const group=new T.Group();scene.add(group);
  const R=1.62;
  const planetMat=new T.MeshPhongMaterial({
    color:0x176080,shininess:16,specular:0x315467
  });
  const sphere=new T.Mesh(new T.SphereGeometry(R,96,64),planetMat);
  group.add(sphere);
  const overlayMat=new T.MeshBasicMaterial({
    transparent:true,opacity:.9,depthWrite:false,side:T.FrontSide
  });
  const overlay=new T.Mesh(new T.SphereGeometry(R*1.006,96,64),overlayMat);
  overlay.visible=false;group.add(overlay);
  group.rotation.set(.16,85*Math.PI/180,0);

  scene.add(new T.AmbientLight(0xdaf3ff,1.65));
  const sun=new T.DirectionalLight(0xfff2dc,2.6);
  sun.position.set(4,2,5);scene.add(sun);
  const fill=new T.DirectionalLight(0x3f91c8,.55);
  fill.position.set(-3,-1,-4);scene.add(fill);

  // Subtle atmospheric rim — visual styling, not remotely sensed content.
  const atmosphereMat=new T.ShaderMaterial({
    transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    vertexShader:"varying vec3 n; varying vec3 viewDir; void main(){vec4 mv=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal);viewDir=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",
    fragmentShader:"varying vec3 n; varying vec3 viewDir; void main(){float edge=pow(1.0-max(dot(normalize(n),normalize(viewDir)),0.0),3.0);gl_FragColor=vec4(0.24,0.65,0.93,0.52*edge);}"
  });
  const atm=new T.Mesh(new T.SphereGeometry(R*1.065,64,48),atmosphereMat);
  group.add(atm);

  // Deterministic background dots. Decorative, not catalogued stars.
  let seed=71893;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const stars=[];
  for(let i=0;i<400;i++){
    const theta=random()*Math.PI*2,z=random()*2-1,rad=Math.sqrt(1-z*z);
    const depth=12+random()*22;
    stars.push(depth*rad*Math.cos(theta),depth*z,depth*rad*Math.sin(theta));
  }
  const starGeo=new T.BufferGeometry();
  starGeo.setAttribute("position",new T.Float32BufferAttribute(stars,3));
  const starMat=new T.PointsMaterial({color:0xc1e9f7,size:.065,sizeAttenuation:true,transparent:true,opacity:.56,depthWrite:false});
  scene.add(new T.Points(starGeo,starMat));

  const globePoint=(lat,lon,r=R*1.015)=>{
    const a=lat*Math.PI/180,b=lon*Math.PI/180;
    return new T.Vector3(r*Math.cos(a)*Math.sin(b),
      r*Math.sin(a),r*Math.cos(a)*Math.cos(b));
  };
  const gridMaterial=new T.LineBasicMaterial({
    color:0x7ecbd0,transparent:true,opacity:.18,depthWrite:false
  });
  const coastMaterial=new T.LineBasicMaterial({
    color:0xb9f4d6,transparent:true,opacity:.5,depthWrite:false
  });
  function drawLine(vertices,material){
    if(vertices.length<6)return;
    const geometry=new T.BufferGeometry();
    geometry.setAttribute("position",new T.Float32BufferAttribute(vertices,3));
    group.add(new T.Line(geometry,material));
  }
  for(let lat=-60;lat<=60;lat+=30){
    const v=[];
    for(let lon=-180;lon<=180;lon+=4){
      const p=globePoint(lat,lon,R*1.018);v.push(p.x,p.y,p.z);
    }
    drawLine(v,gridMaterial);
  }
  for(let lon=-180;lon<180;lon+=30){
    const v=[];
    for(let lat=-86;lat<=86;lat+=4){
      const p=globePoint(lat,lon,R*1.018);v.push(p.x,p.y,p.z);
    }
    drawLine(v,gridMaterial);
  }

  const markers=[];
  for(const [key,[lat,lon]] of Object.entries(locations)){
    const color=key==="liberia"?0xffd19e:0x80ffe0;
    const dot=new T.Mesh(new T.SphereGeometry(.048,20,16),
      new T.MeshBasicMaterial({color,depthTest:true}));
    dot.userData.key=key;dot.position.copy(globePoint(lat,lon,R*1.048));
    group.add(dot);markers.push(dot);
    const ring=new T.Mesh(new T.RingGeometry(.085,.101,36),
      new T.MeshBasicMaterial({color,transparent:true,opacity:.82,
        side:T.DoubleSide,depthWrite:false}));
    ring.position.copy(globePoint(lat,lon,R*1.05));
    ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),
      ring.position.clone().normalize());
    group.add(ring);
  }
  try{
    const response=await fetch("/assets/ne_110m_land.geojson");
    if(!response.ok)throw Error("Coastlines unavailable");
    const map=await response.json();
    for(const feature of map.features||[]){
      const shape=feature.geometry;
      const polygons=shape?.type==="Polygon"?[shape.coordinates]:
        shape?.type==="MultiPolygon"?shape.coordinates:[];
      for(const polygon of polygons)for(const ring of polygon){
        let v=[],previous=null;
        for(const [lon,lat] of ring){
          if(!Number.isFinite(lon)||!Number.isFinite(lat))continue;
          if(previous!==null && Math.abs(previous-lon)>180){
            drawLine(v,coastMaterial);v=[];
          }
          const p=globePoint(lat,lon,R*1.023);
          v.push(p.x,p.y,p.z);previous=lon;
        }
        drawLine(v,coastMaterial);
      }
    }
  }catch{ /* The NASA layer still works even without the vector coast overlay. */ }

  const textureCache=new Map();
  function nasaTexture(id,date){
    const mobile=window.matchMedia?.("(max-width: 660px)").matches;
    const url=gibsWmsUrl(id,{date,width:mobile?1024:1536});
    if(!textureCache.has(url)){
      const loader=new T.TextureLoader();
      loader.setCrossOrigin("anonymous");
      const promise=loader.loadAsync(url).then(texture=>{
        texture.colorSpace=T.SRGBColorSpace;
        // Longitude alignment: SphereGeometry U=(lon+90)/360 whereas
        // NASA GIBS WMS U=(lon+180)/360. Shift +1/4 turn, never mirror.
        // Also applies to the transparent LST overlay, preserving layer registration.
        texture.wrapS=T.RepeatWrapping;
        texture.repeat.set(1,1);
        texture.offset.set(GIBS_TEXTURE_U_OFFSET,0);
        texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
        texture.needsUpdate=true;
        return texture;
      }).catch(err=>{textureCache.delete(url);throw err;});
      textureCache.set(url,promise);
    }
    return textureCache.get(url);
  }

  let generation=0;
  async function applyLayer(){
    const id=controls.layer?.value||"marble";
    const date=controls.date?.value||DEFAULT_GIBS_DATE;
    let resultDate=date;
    try{if(GLOBE_LAYERS[id]?.dated)resultDate=validateGlobeDate(date);}
    catch{
      setStatus(say("Fecha inválida para MODIS; selecciona una fecha real hasta ayer.",
                    "Invalid MODIS date; select an actual date before today."));
      return;
    }
    describeLayer(id,resultDate);
    const turn=++generation;
    // Never display the prior selected product under a new source/date label.
    overlay.visible=false;
    planetMat.map=null;planetMat.color.setHex(0x176080);planetMat.needsUpdate=true;
    if(controls.legend)controls.legend.hidden=true;
    setStatus(messages.loading);
    try{
      if(id==="lst"){
        const [background,mask]=await Promise.all([
          nasaTexture("marble",resultDate),nasaTexture("lst",resultDate)
        ]);
        if(turn!==generation)return;
        planetMat.map=background;planetMat.color.setHex(0xffffff);
        planetMat.needsUpdate=true;
        overlayMat.map=mask;overlayMat.needsUpdate=true;
        overlay.visible=true;
      }else{
        const texture=await nasaTexture(id,resultDate);
        if(turn!==generation)return;
        planetMat.map=texture;planetMat.color.setHex(0xffffff);
        planetMat.needsUpdate=true;
        overlay.visible=false;
      }
      if(controls.legend)controls.legend.hidden=id!=="lst";
      setStatus(messages.ready);
    }catch{
      if(turn!==generation)return;
      // No stale raster may be presented as the newly selected NASA product.
      overlay.visible=false;
      planetMat.map=null;planetMat.color.setHex(0x176080);planetMat.needsUpdate=true;
      if(controls.legend)controls.legend.hidden=true;
      setStatus(messages.failed);
    }
  }
  controls.layer?.addEventListener("change",applyLayer);
  controls.date?.addEventListener("change",()=>{
    if(controls.layer?.value==="marble"){
      describeLayer("marble",controls.date.value);
      return;
    }
    applyLayer();
  });
  applyLayer();

  const zoom=change=>{camera.position.z=Math.max(MIN_Z,Math.min(MAX_Z,camera.position.z+change));};
  el("globe-zoom-in")?.addEventListener("click",()=>zoom(-.55));
  el("globe-zoom-out")?.addEventListener("click",()=>zoom(.55));
  el("globe-reset")?.addEventListener("click",()=>{
    group.rotation.set(.16,85*Math.PI/180,0);camera.position.z=HOME_Z;
    setStatus(say("Vista centrada en Costa Rica.","View centered on Costa Rica."));
  });
  let spinning=false;
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false;
  controls.spin?.addEventListener("click",()=>{
    spinning=!spinning;
    controls.spin.setAttribute("aria-pressed",String(spinning));
    controls.spin.textContent=spinning?
      say("Pausar giro","Pause rotation"):say("Giro automático","Auto rotate");
  });

  const tooltip=el("globe-hover-tooltip");
  const hoverRay=new T.Raycaster();
  function hideTooltip(){if(tooltip)tooltip.hidden=true;}
  function showHover(ev){
    if(!tooltip||ev.pointerType==="touch"){hideTooltip();return;}
    const area=renderer.domElement.getBoundingClientRect();
    const mouse=new T.Vector2(
      (ev.clientX-area.left)*2/area.width-1,
      1-(ev.clientY-area.top)*2/area.height
    );
    hoverRay.setFromCamera(mouse,camera);
    const hits=hoverRay.intersectObjects([...markers,sphere]);
    if(!hits.length){hideTooltip();return;}
    const key=hits[0].object.userData.key;
    let label,lat,lon;
    if(key){
      [lat,lon]=locations[key];
      label=key==="liberia"?"Liberia · Costa Rica":"Limón · Costa Rica";
    }else{
      const point=group.worldToLocal(hits[0].point.clone()).normalize();
      lat=Math.asin(point.y)*180/Math.PI;
      lon=Math.atan2(point.x,point.z)*180/Math.PI;
      label=say("Punto geográfico","Geographic point");
    }
    tooltip.textContent=label+" · "+lat.toFixed(2)+"°, "+lon.toFixed(2)+"° · "+
      say("Clic para investigar (no medición climática).",
          "Click to investigate (not a climate measurement).");
    tooltip.style.left=Math.max(8,Math.min(area.width-270,
      ev.clientX-area.left+14))+"px";
    tooltip.style.top=Math.max(8,Math.min(area.height-60,
      ev.clientY-area.top-60))+"px";
    tooltip.hidden=false;
  }
  let pointer=null,moved=false;
  const canvas=renderer.domElement;
  canvas.tabIndex=0;
  canvas.setAttribute("role","application");
  canvas.setAttribute("aria-label",say(
    "Globo interactivo: flechas para girar, más y menos para acercar. Selecciona un punto para investigar.",
    "Interactive globe: arrow keys rotate; plus and minus zoom. Select a point to investigate."
  ));
  canvas.style.touchAction="none";
  canvas.addEventListener("pointerdown",ev=>{
    if(ev.button!==0)return;
    hideTooltip();
    pointer=[ev.clientX,ev.clientY,group.rotation.x,group.rotation.y,ev.pointerId];
    moved=false;canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener("pointermove",ev=>{
    if(!pointer){showHover(ev);return;}
    if(pointer[4]!==ev.pointerId)return;
    hideTooltip();
    const dx=ev.clientX-pointer[0],dy=ev.clientY-pointer[1];
    if(Math.abs(dx)+Math.abs(dy)>6)moved=true;
    if(moved){
      group.rotation.y=pointer[3]+dx*.007;
      group.rotation.x=Math.max(-1.25,Math.min(1.25,pointer[2]+dy*.006));
    }
  });
  canvas.addEventListener("pointercancel",()=>{pointer=null;hideTooltip();});
  canvas.addEventListener("pointerleave",hideTooltip);
  canvas.addEventListener("pointerup",ev=>{
    if(!pointer||pointer[4]!==ev.pointerId)return;
    pointer=null;if(moved)return;
    const rect=canvas.getBoundingClientRect();
    const mouse=new T.Vector2(
      (ev.clientX-rect.left)*2/rect.width-1,
      1-(ev.clientY-rect.top)*2/rect.height
    );
    const ray=new T.Raycaster();
    ray.setFromCamera(mouse,camera);
    const hits=ray.intersectObjects([...markers,sphere]);
    if(!hits.length)return;
    if(hits[0].object.userData.key){
      chooseLocation(hits[0].object.userData.key);return;
    }
    const p=group.worldToLocal(hits[0].point.clone()).normalize();
    chooseLocation("custom",[
      Math.asin(p.y)*180/Math.PI,
      Math.atan2(p.x,p.z)*180/Math.PI
    ]);
  });
  canvas.addEventListener("wheel",ev=>{
    ev.preventDefault();
    zoom(Math.sign(ev.deltaY)*.35);
  },{passive:false});
  canvas.addEventListener("keydown",ev=>{
    const x=.095;
    switch(ev.key){
      case "ArrowLeft":group.rotation.y-=x;break;
      case "ArrowRight":group.rotation.y+=x;break;
      case "ArrowUp":group.rotation.x=Math.min(1.25,group.rotation.x+x);break;
      case "ArrowDown":group.rotation.x=Math.max(-1.25,group.rotation.x-x);break;
      case "+":case "=":zoom(-.5);break;
      case "-":case "_":zoom(.5);break;
      case "Home":group.rotation.set(.16,85*Math.PI/180,0);camera.position.z=HOME_Z;break;
      default:return;
    }
    ev.preventDefault();
  });
  function resize(){
    const width=Math.max(210,stage.clientWidth);
    const height=Math.max(280,stage.clientHeight);
    camera.aspect=width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
  }
  resize();
  const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(resize):null;
  observer?.observe(stage);
  if(!observer)window.addEventListener("resize",resize);
  let running=true;
  function animate(){
    if(!running)return;
    if(spinning&&!reduced&&!document.hidden)group.rotation.y+=.001;
    if(!document.hidden)renderer.render(scene,camera);
    weather.frame(performance.now());
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener("pagehide",()=>{
    running=false;generation++;observer?.disconnect();
    window.removeEventListener("telluris:source-data",receiveEvidence);
    weather.dispose();renderer.dispose();
  },{once:true});
}
boot();
