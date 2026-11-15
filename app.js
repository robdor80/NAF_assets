"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const houses = {
    valrik:["Valrik",["Treskal"]],
    darovan:["Darovan",["Treihord","Syvaris","Taramin","Veldora"]],
    gldren:["Gldren",["Halhhei"]],
    edranor:["Edranor",["Rodas","Dorth","Karsath","Lumina"]],
    aethros:["Aethros",[]]
  };
  const subjects={
    exterior:"Aldea|Pueblo|Villa|Ciudad|Barrio|Plaza|Mercado|Calle|Callejón|Camino|Calzada|Puente|Puerto|Muelle|Costa|Playa|Mar|Río|Riachuelo|Lago|Cascada|Bosque|Monte|Montañas|Valle|Llanura|Descampado|Campo de cultivo|Huerto|Viñedo|Pradera|Granja|Molino|Aserradero|Mina|Cantera|Cueva|Ruinas|Fortaleza|Muralla|Torre|Jardín|Cementerio|Acantilado|Pantano",
    interior:"Taberna|Posada|Cocina|Comedor|Sala común|Habitación|Camarote|Vivienda rural|Vivienda urbana|Salón|Tienda|Mercado cubierto|Herrería|Carpintería|Taller|Almacén|Granero|Establo|Bodega|Molino|Galería de mina|Cueva|Biblioteca|Archivo|Templo|Enfermería|Sala del consejo|Ayuntamiento|Cuartel|Armería|Calabozo|Torre interior|Palacio|Cripta|Baño|Pasillo|Escalera|Despacho",
    portrait:"Aldeano|Agricultor|Pescador|Leñador|Herrero|Carpintero|Mercader|Posadero|Tabernero|Panadero|Marinero|Guardia|Soldado|Cazador|Sanador|Escriba|Erudito|Artesano|Noble|Religioso|Viajero|Niño|Anciano|Sirviente|Minero|Pastor|Viticultor|Cocinero|Capitán|Explorador"
  };
  const roleMap={Aldeano:"villager",Agricultor:"farmer",Pescador:"fisher",Leñador:"woodcutter",Herrero:"blacksmith",Carpintero:"carpenter",Mercader:"merchant",Posadero:"innkeeper",Tabernero:"tavernkeeper",Panadero:"baker",Marinero:"sailor",Guardia:"guard",Soldado:"soldier",Cazador:"hunter",Sanador:"healer",Escriba:"scribe",Erudito:"scholar",Artesano:"artisan",Noble:"noble",Religioso:"priest",Viajero:"traveller",Niño:"child",Anciano:"elder",Sirviente:"servant",Minero:"miner",Pastor:"shepherd",Viticultor:"winemaker",Cocinero:"cook",Capitán:"captain",Explorador:"ranger"};
  const root="Worldbuilding/Direccion artistica/Biblia visual/";
  const bib=[
    ["global","Biblia global Nimroel","General/NIMROEL_GLOBAL_VISUAL_BIBLE_v0.5.md"],
    ["norgard","Perfil visual Norgard","Culturas/Norgard/NORGARD_VISUAL_PROFILE_v0.1.md"],
    ["scene","Biblia de escenas","Categorias/Escenas/SCENE_ENVIRONMENT_VISUAL_BIBLE_v0.1.md"],
    ["settlement","Biblia de asentamientos","Categorias/Asentamientos/SETTLEMENT_VISUAL_BIBLE_v0.1.md"],
    ["portrait","Biblia de retratos NPC","Categorias/NPC/NPC_PORTRAIT_VISUAL_BIBLE_v0.3.md"],
    ["treskal_village","Aldeas de Treskal","Culturas/Norgard/Perfiles locales/Treskal/Aldeas/TRESKAL_VILLAGE_VISUAL_PROFILE_v0.1.md"],
    ["treskal_portrait","Retratos Treskal","Culturas/Norgard/Perfiles locales/Treskal/TRESKAL_PORTRAIT_VISUAL_BIBLE_v0.2.md"],
    ["darovan_portrait","Retratos Darovan","Culturas/Norgard/Perfiles locales/Darovan/DAROVAN_PORTRAIT_VISUAL_BIBLE_v0.1.md"],
    ["edranor_portrait","Retratos Edranor","Culturas/Norgard/Perfiles locales/Edranor/EDRANOR_PORTRAIT_VISUAL_BIBLE_v0.1.md"],
    ["edranor_env","Entornos Edranor","Culturas/Norgard/Perfiles locales/Edranor/EDRANOR_ENVIRONMENT_VISUAL_BIBLE_v0.1.md"],
    ["edranor_locations","Lugares Edranor","Culturas/Norgard/Perfiles locales/Edranor/EDRANOR_LOCATIONS_VISUAL_BIBLE_v0.1.md"]
  ];
  const fields="house place customPlace subject customSubject time weather season notes scale population camera portraitSex customSex portraitAge preferredId referenceId".split(" ");
  const validId=/^[a-z][a-z0-9]*(?:_[a-z0-9]+)+_(?!000)[0-9]{3}$/;
  let kind="exterior",mode="new",manual=new Set();
  function slug(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"");}
  function addOpt(v,t){const x=document.createElement("option");x.value=v;x.textContent=t;return x;}
  function fill(id,choices,preferred){$(id).replaceChildren(...choices.map(x=>addOpt(x[0],x[1])));if(choices.some(x=>x[0]===preferred))$(id).value=preferred;}
  function label(id){return $(id).selectedOptions[0]?.textContent||"";}
  function autoBibles(){
    const x=["global","norgard"],h=$("house").value,p=$("place").value;
    if(kind==="portrait"){
      x.push("portrait");
      if(p==="treskal")x.push("treskal_portrait");
      if(h==="darovan")x.push("darovan_portrait");
      if(h==="edranor")x.push("edranor_portrait");
    }else{
      x.push("scene");
      if(kind==="exterior"&&["aldea","pueblo","villa","ciudad","barrio","plaza","mercado","calle","callejon","granja"].includes($("subject").value))x.push("settlement");
      if(kind==="exterior"&&p==="treskal"&&["aldea","pueblo","granja"].includes($("subject").value))x.push("treskal_village");
      if(h==="edranor")x.push("edranor_env","edranor_locations");
    }
    return x;
  }
  function selectedBibles(){
    if(!$("manualBibles").checked)return autoBibles();
    return [...new Set(["global","norgard",kind==="portrait"?"portrait":"scene",...manual])];
  }
  function renderBibles(){
    $("bibleSelector").classList.toggle("is-hidden",!$("manualBibles").checked);
    const always=["global","norgard",kind==="portrait"?"portrait":"scene"];
    $("biblesList").replaceChildren(...bib.map(([id,name])=>{
      const l=document.createElement("label"),check=document.createElement("input"),span=document.createElement("span");
      l.className="bible-option";check.type="checkbox";check.checked=always.includes(id)||manual.has(id);check.disabled=always.includes(id);
      check.addEventListener("change",()=>{if(check.checked)manual.add(id);else manual.delete(id);save();});
      span.textContent=name;l.append(check,span);return l;
    }));
  }
  function placeName(){return $("place").value==="other"?$("customPlace").value.trim():$("place").value==="auto"?"Por decidir":label("place");}
  function focusName(){return $("subject").value==="other"?$("customSubject").value.trim():label("subject");}
  function setHouse(want){
    const places=houses[$("house").value][1].map(x=>[slug(x),x]);
    fill("place",[...places,["auto","Localidad por decidir"],["other","Otra localización…"]],want);
    renderBibles();sync();
  }
  function setKind(want,keep){
    kind=want;
    document.querySelectorAll("[data-kind]").forEach(b=>{const on=b.dataset.kind===kind;b.classList.toggle("is-active",on);b.setAttribute("aria-pressed",String(on));});
    $("subjectLabel").textContent=kind==="portrait"?"Profesión / tipo de personaje":kind==="interior"?"Tipo de interior":"Lugar o entorno";
    fill("subject",[...subjects[kind].split("|").map(x=>[slug(x),x]),["other","Otro (describir)"]],keep);
    $("portraitSexWrap").classList.toggle("is-hidden",kind!=="portrait");
    $("portraitAgeWrap").classList.toggle("is-hidden",kind!=="portrait");
    if(kind==="portrait")document.querySelector(".advanced").open=true;
    renderBibles();sync();
  }
  function setMode(want){
    mode=want;
    document.querySelectorAll("[data-mode]").forEach(b=>{const on=b.dataset.mode===mode;b.classList.toggle("is-active",on);b.setAttribute("aria-pressed",String(on));});
    $("referenceWrap").classList.toggle("is-hidden",mode!=="variant");sync();
  }
  function sync(){
    $("customPlaceWrap").classList.toggle("is-hidden",$("place").value!=="other");
    $("customSubjectWrap").classList.toggle("is-hidden",$("subject").value!=="other");
    $("customSexWrap").classList.toggle("is-hidden",kind!=="portrait"||$("portraitSex").value!=="other");
    $("summaryHouse").textContent=houses[$("house").value][0];
    $("summaryPlace").textContent=placeName()||"Pendiente";
    $("summarySubject").textContent=focusName()||"Pendiente";
    $("summaryMode").textContent=mode==="new"?"Nueva":"Variante";
    $("summaryFormat").textContent=kind==="portrait"?"4:5 · 768 × 960":"16:9 · 1920 × 1080";
    $("previewType").textContent=kind==="portrait"?"RETRATO":kind==="interior"?"ESCENA INTERIOR":"ESCENA EXTERIOR";
    $("previewGlyph").textContent=kind==="portrait"?"◉":kind==="interior"?"▣":"◇";
    $("status").textContent="";$("status").classList.remove("is-error");save();
  }
  function save(){
    const o={kind,mode,manualOn:$("manualBibles").checked,manual:[...manual]};fields.forEach(x=>o[x]=$(x).value);
    try{localStorage.setItem("naf_draft_v1",JSON.stringify(o));}catch(e){}
  }
  function restore(){
    let o=null;try{o=JSON.parse(localStorage.getItem("naf_draft_v1")||"null");}catch(e){}
    if(!o||!houses[o.house]){setKind("exterior");return;}
    $("house").value=o.house;setHouse(o.place);
    setKind(subjects[o.kind]?o.kind:"exterior",o.subject);
    fields.filter(x=>!["house","place","subject"].includes(x)).forEach(x=>{if(typeof o[x]==="string")$(x).value=o[x];});
    if(o.mode==="variant")setMode("variant");
    $("manualBibles").checked=!!o.manualOn;manual=new Set(Array.isArray(o.manual)?o.manual.filter(x=>bib.some(b=>b[0]===x)):[]);
    renderBibles();sync();
  }
  function request(){
    const preferred=$("preferredId").value.trim(),ref=$("referenceId").value.trim(),portrait=kind==="portrait";
    if($("place").value==="other"&&!$("customPlace").value.trim())throw Error("Escribe el nombre de la localización.");
    if($("subject").value==="other"&&!$("customSubject").value.trim())throw Error("Especifica el entorno o tipo de personaje.");
    if(mode==="variant"&&!validId.test(ref))throw Error("Escribe un ID de referencia válido, terminado en _001 a _999.");
    if(preferred&&(!validId.test(preferred)||preferred.length>96||!preferred.startsWith((portrait?"portrait_":"scene_"))))throw Error("El ID propuesto no cumple Naming v1 de NAP.");
    if(mode==="variant"&&preferred===ref)throw Error("La variante debe tener un ID nuevo, diferente al de referencia.");
    if(portrait&&!$("portraitSex").value)throw Error("En Más opciones, selecciona el sexo del retrato.");
    if(portrait&&$("portraitSex").value==="other"&&!$("customSex").value.trim())throw Error("Describe el sexo o identificación del personaje.");
    const house=$("house").value,place=$("place").value==="other"?slug($("customPlace").value):$("place").value==="auto"?house:$("place").value;
    const role=$("subject").value==="other"?slug($("customSubject").value):roleMap[focusName()]||slug(focusName());
    const sex=$("portraitSex").value==="other"?slug($("customSex").value):$("portraitSex").value;
    if(!place||(portrait&&(!role||!sex)))throw Error("Hay identificadores que no pueden representarse en el formato NAP.");
    if([place,house,...(portrait?[role,sex]:[])].some(x=>x.length>64))throw Error("Los identificadores de clasificación deben tener como máximo 64 caracteres (NAP).");
    const classification={culture:"norgard",realm:"norgard",region:house,location:place};
    if(portrait){classification.role=role;classification.sex=sex;}
    return {
      naf_schema_version:1,kind:"solicitud_no_paquete_nap",universe_id:"nimroel",
      asset_type:portrait?"portrait":"scene",production_profile:portrait?"portrait_npc":"scene_environment",
      category:kind,asset_id_proposed:preferred||null,identity_mode:mode,reference_asset_id:mode==="variant"?ref:null,
      geography:{realm:"Norgard",house,house_name:houses[house][0],location:place,place_name:placeName(),
        canonical_status:house==="gldren"&&$("place").value==="halhhei"?"indicada_por_usuario_pendiente_verificacion":$("place").value==="auto"?"pendiente_concretar":"seleccionada"},
      focus:{key:$("subject").value,label:focusName()},appearance:{
        time:label("time"),weather:label("weather"),season:label("season"),scale:label("scale"),
        occupancy:label("population"),camera:label("camera"),
        portrait_sex:portrait?($("portraitSex").value==="other"?$("customSex").value.trim():label("portraitSex")):null,
        portrait_age:portrait?$("portraitAge").value.trim()||null:null},
      free_description:$("notes").value.trim(),
      visual_bibles:{mode:$("manualBibles").checked?"seleccion_manual_aditiva":"seleccion_automatica",
        paths:selectedBibles().map(id=>root+bib.find(b=>b[0]===id)[2])},
      nap_output:{manifest_version:2,classification,master_size:portrait?[768,960]:[1920,1080],
        zip_exactly_five_root_files:true,zip_contents:["<asset_id>.png","<asset_id>_manifest.json","<asset_id>_prompt.md","<asset_id>_info.md","<asset_id>_visual_identity.json"],
        webp_by_nap:true,sqlite_only_after_real_import:true}
    };
  }
  function markdown(){
    const r=request(),title=r.category==="portrait"?"Retrato":r.category==="interior"?"Escena interior":"Escena exterior";
    const lines=[
      "# NAF — Solicitud de "+title,"","> Solicitud para ChatGPT. NO es un ZIP ni un manifest listo para importar en NAP.","",
      "## Objetivo","",title+" · "+r.geography.house_name+" / "+r.geography.place_name+" · "+r.focus.label+".",
      r.identity_mode==="variant"?"Crear una variante del recurso "+r.reference_asset_id+" con nuevo ID.":"Crear una imagen completamente nueva.","",
      "## Descripción del autor","",r.free_description||"Sin más detalles: escoger una composición variada pero conforme al canon.","",
      "## Ambiente","",
      "- Hora: "+r.appearance.time,"- Meteorología: "+r.appearance.weather,"- Estación: "+r.appearance.season,
      "- Tamaño: "+r.appearance.scale,"- Ocupación: "+r.appearance.occupancy,"- Encuadre: "+r.appearance.camera,
      ...(r.category==="portrait"?["- Sexo: "+r.appearance.portrait_sex,"- Edad aparente: "+(r.appearance.portrait_age||"Por decidir")]:[]),"",
      "## Biblias que deben consultarse en robdor80/Videojuego_Nimroel","",
      ...r.visual_bibles.paths.map(x=>"- "+x),"",
      "## Solicitud estructurada","",
      "~~~json",JSON.stringify(r,null,2),"~~~","",
      "## Obligaciones de producción para ChatGPT","",
      "1. Verificar en GitHub las biblias indicadas, el canon del territorio y las referencias visuales aplicables. No inventar canon.",
      "2. Crear un prompt de generación completo y la imagen PNG maestra con proporción exacta y realismo cinematográfico naturalista.",
      "3. Si se pide variante, mantener los rasgos fijos del recurso de referencia; no reutilizar su asset_id.",
      "4. Taberna NO es posada: la primera no tiene habitaciones para huéspedes; la segunda sí puede ofrecer alojamiento.",
      "5. Comprobar que el asset_id final cumple Naming v1 y no existe ya en el catálogo de NAP.",
      "6. Crear manifest v2 con sus seis propiedades raíz exactas: schema_version, universe_id, asset_id, asset_type, production_profile y classification.",
      "7. ZIP PLANO con cinco ficheros exactos, con stem común: asset_id.png; asset_id_manifest.json; asset_id_prompt.md; asset_id_info.md; asset_id_visual_identity.json.",
      "8. PNG de "+r.nap_output.master_size.join(" × ")+" píxeles. NO meter WebP en el ZIP; NAP realizará la conversión.",
      "9. Incluir la identidad, referencia y variaciones en los companions de procedencia; el registro SQLite solo ocurrirá tras importar el ZIP en NAP.",
      "10. Validar nombres, PNG, esquema v2, clasificaciones y ZIP antes de entregarlo.","",
      "## Contrato de referencia NAP","",
      "- robdor80/NAP/config/universes/nimroel/profile.json",
      "- robdor80/NAP/docs/MANIFEST_V2.md",
      "- robdor80/NAP/docs/NAMING_V1.md","","Generado con NAF v0.1."
    ];
    return lines.join("\n")+"\n";
  }
  function status(message,error){$("status").textContent=message;$("status").classList.toggle("is-error",!!error);}
  function download(){
    try{
      const text=markdown(),name="naf_"+kind+"_"+$("house").value+"_"+new Date().toISOString().replace(/[:.]/g,"-")+".md";
      const url=URL.createObjectURL(new Blob([text],{type:"text/markdown;charset=utf-8"}));
      const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),10000);status("Solicitud preparada: "+name,false);
    }catch(e){status(e.message||"Error al crear la solicitud.",true);}
  }
  async function copy(){
    try{
      const text=markdown();
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
      else{
        const node=document.createElement("textarea");node.value=text;document.body.appendChild(node);node.select();
        if(!document.execCommand("copy"))throw Error("No se puede copiar en este navegador.");
        node.remove();
      }
      status("Solicitud copiada.",false);
    }catch(e){status(e.message||"Error al copiar.",true);}
  }
  function reset(){
    if(!confirm("¿Borrar el formulario y crear una solicitud nueva?"))return;
    try{localStorage.removeItem("naf_draft_v1");}catch(e){}
    fields.forEach(x=>$(x).value="");
    ["time","weather","season","scale","population","camera"].forEach(x=>$(x).value="auto");
    $("house").value="valrik";$("manualBibles").checked=false;manual.clear();
    setHouse("treskal");setKind("exterior");setMode("new");document.querySelector(".advanced").open=false;sync();
  }
  document.querySelectorAll("[data-kind]").forEach(b=>b.addEventListener("click",()=>setKind(b.dataset.kind)));
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
  $("house").addEventListener("change",()=>setHouse(""));
  $("place").addEventListener("change",()=>{renderBibles();sync();});
  $("subject").addEventListener("change",()=>{renderBibles();sync();});
  $("manualBibles").addEventListener("change",()=>{
    if($("manualBibles").checked&&!manual.size)manual=new Set(autoBibles());
    renderBibles();sync();
  });
  fields.forEach(x=>$(x).addEventListener("input",sync));
  $("downloadBtn").addEventListener("click",download);
  $("copyBtn").addEventListener("click",copy);
  $("resetBtn").addEventListener("click",reset);
  setHouse("treskal");restore();
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("./sw.js").catch(()=>{});
  window.NAF={markdown,request,getState:()=>({kind,mode})};
})();
