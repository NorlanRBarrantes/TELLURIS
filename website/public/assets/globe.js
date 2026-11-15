/* Geographic navigation only; no climate values are inferred from globe colors.
 * Three.js r170 MIT; Natural Earth land geometry public domain.
 */
const stage=document.getElementById("globe-stage");
const status=document.getElementById("globe-status");
const lang=document.documentElement.lang.startsWith("es")?"es":"en";
const coords={liberia:[10.63,-85.44],limon:[9.99,-83.03]};
function select(key,point=null){
 const place=document.getElementById("location"),lat=document.getElementById("latitude"),lon=document.getElementById("longitude");
 place.value=key;place.dispatchEvent(new Event("change",{bubbles:true}));
 if(key==="custom"&&point){
  lat.value=point[0].toFixed(4);lon.value=point[1].toFixed(4);
  lat.dispatchEvent(new Event("change",{bubbles:true}));
  lon.dispatchEvent(new Event("change",{bubbles:true}));
  status.textContent=lang==="es"?"Coordenadas seleccionadas; consulta NASA para analizarlas.":"Coordinates selected; request NASA data for analysis.";
 }
 document.querySelectorAll("[data-globe-location]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.globeLocation===key)));
}
document.querySelectorAll("[data-globe-location]").forEach(button=>button.addEventListener("click",()=>select(button.dataset.globeLocation)));
async function boot(){
 if(!stage)return;
 let T;
 try{T=await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");}
 catch{status.textContent=lang==="es"?"Mapa 3D no disponible; usa los botones.":"3D globe unavailable; use location buttons.";return;}
 let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});}
 catch{status.textContent=lang==="es"?"WebGL no disponible; usa los botones.":"WebGL unavailable; use location buttons.";return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 renderer.setClearColor(0,0);stage.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,1,.1,100);
 camera.position.z=5.8;
 const group=new T.Group();scene.add(group);
 const R=1.65;
 const sphere=new T.Mesh(new T.SphereGeometry(R,64,48),new T.MeshPhongMaterial({color:0x0d4962,shininess:30,specular:0x478fac}));
 group.add(sphere);scene.add(new T.AmbientLight(0xc6eaf1,1.3));
 const sun=new T.DirectionalLight(0xffffff,2.0);sun.position.set(3,3,5);scene.add(sun);
 const globePoint=(lat,lon,r=R*1.011)=>{
  const a=lat*Math.PI/180,b=lon*Math.PI/180;
  return new T.Vector3(r*Math.cos(a)*Math.sin(b),r*Math.sin(a),r*Math.cos(a)*Math.cos(b));
 };
 const grid=new T.LineBasicMaterial({color:0x9de5e1,transparent:true,opacity:.19});
 const coastline=new T.LineBasicMaterial({color:0x86ceb0,transparent:true,opacity:.84});
 function line(values,material){
  if(values.length<6)return;
  const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(values,3));
  group.add(new T.Line(g,material));
 }
 for(let latitude=-60;latitude<=60;latitude+=30){
  const values=[];for(let longitude=-180;longitude<=180;longitude+=3){const p=globePoint(latitude,longitude);values.push(p.x,p.y,p.z);}
  line(values,grid);
 }
 for(let longitude=-180;longitude<180;longitude+=30){
  const values=[];for(let latitude=-87;latitude<=87;latitude+=3){const p=globePoint(latitude,longitude);values.push(p.x,p.y,p.z);}
  line(values,grid);
 }
 const markers=[];
 for(const [key,[lat,lon]] of Object.entries(coords)){
  const mesh=new T.Mesh(new T.SphereGeometry(.055,16,12),new T.MeshBasicMaterial({color:key==="liberia"?0xffcd8b:0x83ffd9}));
  mesh.userData.key=key;mesh.position.copy(globePoint(lat,lon,R*1.03));group.add(mesh);markers.push(mesh);
 }
 group.rotation.y=85*Math.PI/180;
 status.textContent=lang==="es"?"Arrastra para girar y pulsa un punto para investigar.":"Drag to rotate; click a point to investigate.";
 try{
  const response=await fetch("/assets/ne_110m_land.geojson");
  if(!response.ok)throw Error("Coastline unavailable");
  const geo=await response.json();
  for(const f of geo.features||[]){
   const polygons=f.geometry?.type==="Polygon"?[f.geometry.coordinates]:f.geometry?.type==="MultiPolygon"?f.geometry.coordinates:[];
   for(const polygon of polygons)for(const ring of polygon){
    let values=[],prev=null;
    for(const c of ring){
     const lon=Number(c[0]),lat=Number(c[1]);
     if(!Number.isFinite(lon)||!Number.isFinite(lat))continue;
     if(prev!==null&&Math.abs(prev-lon)>180){line(values,coastline);values=[];}
     const p=globePoint(lat,lon,R*1.018);values.push(p.x,p.y,p.z);prev=lon;
    }
    line(values,coastline);
   }
  }
 }catch{status.textContent=lang==="es"?"Globo disponible; costas no cargadas.":"Globe available; coastline overlay missing.";}
 let pointer=null,moved=false;
 const canvas=renderer.domElement;canvas.style.touchAction="pan-y";
 canvas.addEventListener("pointerdown",ev=>{pointer=[ev.clientX,ev.clientY,group.rotation.x,group.rotation.y];moved=false;canvas.setPointerCapture(ev.pointerId);});
 canvas.addEventListener("pointermove",ev=>{
  if(!pointer)return;
  const dx=ev.clientX-pointer[0],dy=ev.clientY-pointer[1];
  if(Math.abs(dx)+Math.abs(dy)>6)moved=true;
  if(moved){group.rotation.y=pointer[3]+dx*.008;group.rotation.x=Math.max(-1.3,Math.min(1.3,pointer[2]+dy*.006));}
 });
 canvas.addEventListener("pointerup",ev=>{
  if(!pointer)return;
  pointer=null;if(moved)return;
  const rect=canvas.getBoundingClientRect(),mouse=new T.Vector2((ev.clientX-rect.left)*2/rect.width-1,1-(ev.clientY-rect.top)*2/rect.height);
  const ray=new T.Raycaster();ray.setFromCamera(mouse,camera);
  const hits=ray.intersectObjects([...markers,sphere]);
  if(!hits.length)return;
  if(hits[0].object.userData.key){select(hits[0].object.userData.key);return;}
  const local=group.worldToLocal(hits[0].point.clone()).normalize();
  select("custom",[Math.asin(local.y)*180/Math.PI,Math.atan2(local.x,local.z)*180/Math.PI]);
 });
 function resize(){const width=Math.max(200,stage.clientWidth),height=Math.max(240,stage.clientHeight);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);}
 resize();const observer=new ResizeObserver(resize);observer.observe(stage);
 let running=true;function frame(){if(!running)return;renderer.render(scene,camera);requestAnimationFrame(frame);}frame();
 window.addEventListener("pagehide",()=>{running=false;observer.disconnect();renderer.dispose();},{once:true});
}
boot();
