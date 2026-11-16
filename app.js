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
  let workflow="single",lotType="independent",lotId="",referenceImageUrl=null,referenceImageName="";
  const draftKey="naf_draft_v05";
  const cameras={
    exterior:[
      ["aerial_45deg","Panorámica general desde altura y cierta distancia, cámara inclinada aproximadamente 45° hacia abajo (NUNCA cenital), con caminos y edificios reconocibles"],
      ["entrance","Entrada al mismo asentamiento, a nivel de caminante, mostrando la vía principal y las construcciones ya fijadas"],
      ["centre","Centro del mismo asentamiento y referencias arquitectónicas coherentes con la primera vista"],
      ["side_street","Calle secundaria o acceso lateral del mismo asentamiento, materiales y orientación compatibles"],
      ["landmark","Edificio o espacio destacado que YA aparezca en las vistas anteriores, desde una perspectiva distinta"],
      ["edge","Borde del mismo asentamiento, conservando la silueta y la distribución establecidas"],
      ["inside_out","Vistas desde el interior de la entrada hacia la plaza principal"],
      ["secondary_square","Pequeña plaza o ensanchamiento, solo si es coherente con la vista de referencia"],
      ["back_road","Camino posterior o zona de servicio compatible con el asentamiento"],
      ["overview_opposite","Panorámica elevada desde el ángulo opuesto sin cambiar el urbanismo"],
      ["connecting_street","Calle que conecte dos puntos identificados en vistas anteriores"],
      ["closing_view","Panorámica final que confirme los hitos espaciales ya establecidos"]
    ],
    interior:[
      ["establishing","Vista general amplia del MISMO interior, distribución de puertas, columnas, chimenea y mobiliario estable"],
      ["entrance","Vista desde la entrada hacia el interior, manteniendo los elementos de la vista general"],
      ["centre","Perspectiva desde el centro de la sala con los mismos elementos principales"],
      ["side","Vista lateral que muestre otra zona del mismo local sin inventar estancias"],
      ["focal","Detalle o plano del elemento principal visible en las vistas anteriores"],
      ["counter","Zona del mostrador o trabajo, solo si se establece previamente"],
      ["corner","Una esquina del mismo interior, arquitectura coherente"],
      ["rear","Vista hacia la entrada desde el fondo del mismo local"],
      ["seating","Mesas y bancos del mismo interior"],
      ["hearth","Fogón o fuente de calor existente, sin inventar elementos"],
      ["service","Área de servicio compatible con la vista base"],
      ["overview_return","Otro plano general que confirme la distribución"]
    ],
    portrait:[
      ["front","El mismo personaje de frente"],
      ["three_quarters","El mismo personaje a tres cuartos"],
      ["profile","El mismo personaje de perfil"],
      ["environment","El mismo personaje en un contexto laboral coherente"],
      ["closeup","Primer plano del mismo personaje"]
    ]
  };
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
  function placeName(){
    if($("place").value==="other")return $("customPlace").value.trim();
    if($("place").value==="procedural")return "Sin nombre (CoreRPG)";
    if($("place").value==="auto")return "Por decidir";
    return label("place");
  }
  function focusName(){return $("subject").value==="other"?$("customSubject").value.trim():label("subject");}
  function setHouse(want){
    const places=houses[$("house").value][1].map(x=>[slug(x),x]);
    fill("place",[["procedural","Sin nombre · generado por CoreRPG"],...places,["other","Lugar concreto con nombre…"]],want);
    if(want==="auto")$("place").value="procedural";
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

  function setWorkflow(next){
    workflow=["single","variant","lot"].includes(next)?next:"single";
    mode=workflow==="variant"?"variant":"new";
    document.querySelectorAll("[data-workflow]").forEach(b=>{
      const on=b.dataset.workflow===workflow;b.classList.toggle("is-active",on);
      b.setAttribute("aria-pressed",String(on));
    });
    $("variantPanel").classList.toggle("is-hidden",workflow!=="variant");
    $("lotPanel").classList.toggle("is-hidden",workflow!=="lot");
    $("copyBtn").classList.toggle("is-hidden",workflow==="lot");
    sync();
  }
  function setLotType(next){
    lotType=next==="views"?"views":"independent";
    document.querySelectorAll("[data-lot-type]").forEach(b=>{
      const on=b.dataset.lotType===lotType;b.classList.toggle("is-active",on);
      b.setAttribute("aria-pressed",String(on));
    });
    $("lotVariationWrap").classList.toggle("is-hidden",lotType==="views");
    $("lotGuidance").textContent=lotType==="views"?
      "Varias perspectivas del MISMO lugar: primera imagen panorámica elevada a 45°, después entrada, centro y otros puntos. Conserva la panorámica aprobada para adjuntarla en ChatGPT con las siguientes solicitudes.":
      "Recursos DIFERENTES del mismo tipo y cultura (por ejemplo, 5 posadas de Treskal). Cada imagen tendrá arquitectura, distribución y detalles propios, sin ser una variante de otra.";
    renderLot();sync();
  }
  function renderLot(){
    const count=Number($("lotCount").value)||5,host=$("lotItems");
    host.replaceChildren();
    for(let i=0;i<count;i++){
      const entry=document.createElement("div");entry.className="simple-lot-item";
      const info=document.createElement("div");info.className="lot-item-info";
      const h=document.createElement("strong");h.textContent="Imagen "+String(i+1).padStart(2,"0");
      const p=document.createElement("p");p.textContent=lotHint(i);
      info.append(h,p);
      const actions=document.createElement("div");actions.className="lot-item-actions";
      const button=document.createElement("button");button.type="button";button.className="btn btn-secondary btn-small";
      button.textContent="Descargar .md";
      button.addEventListener("click",()=>downloadLotItem(i));
      const copy=document.createElement("button");copy.type="button";copy.className="btn btn-quiet btn-small";
      copy.textContent="Copiar";
      copy.addEventListener("click",()=>copyLotItem(i));
      actions.append(button,copy);entry.append(info,actions);host.append(entry);
    }
  }
  function lotHint(i){
    if(lotType==="views"){
      const list=cameras[kind]||cameras.exterior;
      return list[i%list.length][1];
    }
    return independentDifferences(i);
  }
  function independentDifferences(index){
    const depth=$("lotVariation").value;
    const lists=kind==="portrait"?[
      "Adulto joven, rostro y peinado distinguibles; ropa propia de su oficio",
      "Persona madura, facciones diferentes y atuendo funcional",
      "Persona experimentada, señales de edad y trabajo sin caricatura",
      "Otra constitución y rasgos físicos; pose natural y distinta",
      "Aspecto cotidiano y personalidad visual diferente, sin repetir el rostro",
      "Diferente expresión, complexión, cabello y accesorio justificado",
      "Otra etapa adulta compatible con el oficio",
      "Diferente envejecimiento, peinado y postura",
      "Facciones y fondo discreto claramente diferenciados",
      "Combinación alternativa de ropa y desgaste",
      "Otra personalidad visual sin estereotipos",
      "Contraste facial y de accesorios manteniendo la cultura"
    ]:kind==="interior"?[
      "Local pequeño, sobrio y acogedor; circulación y mobiliario propios",
      "Local de tamaño mediano, planta diferente y mayor espacio central",
      "Local humilde, materiales gastados y mobiliario sencillo",
      "Local mejor cuidado, mesas y asientos organizados de forma distinta",
      "Local activo con distribución propia y detalles útiles a su oficio",
      "Local de estructura compacta y atmósfera más íntima",
      "Local con entrada y mostrador en otra posición plausible",
      "Local amplio sin elementos ostentosos ajenos al canon",
      "Local de uso familiar, con señales de actividad cotidiana",
      "Local rústico, muebles distintos y organización funcional",
      "Local muy trabajado, desgaste coherente con el oficio",
      "Local con luz natural distinta y planta claramente nueva"
    ]:[
      "Lugar compacto y funcional con disposición y edificios propios",
      "Lugar de mayor amplitud relativa, trazado diferente",
      "Lugar humilde y trabajado, composición distinta",
      "Lugar de conservación mejor, materiales canónicos y variedad arquitectónica",
      "Lugar activo con organización propia y vías diferentes",
      "Lugar pequeño de vida cotidiana, encuadre natural",
      "Lugar con acceso principal en otra orientación",
      "Lugar con núcleos y volúmenes diferentes, sin inventar canon",
      "Lugar de densidad variable, coherente con el terreno",
      "Lugar con vegetación o elementos rurales justificados",
      "Lugar con otro trazado de calles y servicios",
      "Lugar de vista y organización distinta dentro de la misma cultura"
    ];
    const base=lists[index%lists.length];
    if(depth==="subtle")return base+"; variación SUAVE";
    if(depth==="high")return base+"; variación marcada pero realista, sin romper el canon";
    return base+"; variación equilibrada";
  }
  function newLotId(){
    return "naf_lot_"+new Date().toISOString().replace(/\D/g,"").slice(0,14)+"_"+Math.random().toString(36).slice(2,8);
  }
  function sync(){
    $("customPlaceWrap").classList.toggle("is-hidden",$("place").value!=="other");
    $("customSubjectWrap").classList.toggle("is-hidden",$("subject").value!=="other");
    $("customSexWrap").classList.toggle("is-hidden",kind!=="portrait"||$("portraitSex").value!=="other");
    $("summaryHouse").textContent=houses[$("house").value][0];
    $("summaryPlace").textContent=placeName()||"Pendiente";
    $("summarySubject").textContent=focusName()||"Pendiente";
    $("summaryMode").textContent=workflow==="variant"?"Variante":"Nueva";
    const count=Number($("lotCount").value)||5;
    $("summaryBatch").textContent=workflow==="lot"?count+(lotType==="views"?" vistas del mismo lugar":" imágenes independientes"):"1 imagen";
    $("summaryFormat").textContent=kind==="portrait"?"4:5 · 768 × 960":"16:9 · 1920 × 1080";
    $("previewType").textContent=kind==="portrait"?"RETRATO":kind==="interior"?"ESCENA INTERIOR":"ESCENA EXTERIOR";
    $("previewGlyph").textContent=kind==="portrait"?"◉":kind==="interior"?"▣":"◇";
    $("downloadLabel").textContent=workflow==="lot"?"Descargar "+count+" solicitudes .md (ZIP)":"Descargar solicitud .md";
    save();
  }
  function save(){
    const data={kind,workflow,lotType,lotId,manualOn:$("manualBibles").checked,manual:[...manual]};
    fields.forEach(x=>{data[x]=$(x).value;});
    data.lotCount=$("lotCount").value;
    data.lotVariation=$("lotVariation").value;
    data.lotTitle=$("lotTitle").value;
    try{localStorage.setItem(draftKey,JSON.stringify(data));}catch(e){}
  }
  function restore(data){
    if(!data||!houses[data.house])return;
    $("house").value=data.house;
    setHouse(data.place||"procedural");
    setKind(subjects[data.kind]?data.kind:"exterior",data.subject);
    fields.filter(x=>!["house","place","subject"].includes(x)).forEach(x=>{
      if(typeof data[x]==="string")$(x).value=data[x];
    });
    if(typeof data.lotCount==="string"&&/^(?:[2-9]|1[0-2])$/.test(data.lotCount))$("lotCount").value=data.lotCount;
    if(["subtle","balanced","high"].includes(data.lotVariation))$("lotVariation").value=data.lotVariation;
    $("lotTitle").value=String(data.lotTitle||data.batchTitle||"").slice(0,100);
    lotId=typeof data.lotId==="string"&&/^naf_lot_[a-z0-9_]{6,80}$/.test(data.lotId)?data.lotId:lotId;
    manual=new Set(Array.isArray(data.manual)?data.manual.filter(x=>bib.some(b=>b[0]===x)):[]);
    $("manualBibles").checked=data.manualOn===true;
    const legacyLot=data.batchMode==="distinct"?"lot":null;
    const target=data.workflow||legacyLot||(data.mode==="variant"?"variant":"single");
    setWorkflow(target);
    setLotType(data.lotType==="views"?"views":"independent");
    renderBibles();sync();
  }
  function parseNAFMarkdown(content){
    if(typeof content!=="string"||content.length>512000)throw Error("El .md supera los 500 KB.");
    const match=content.match(/~~~json\s*\r?\n([\s\S]*?)\r?\n~~~/i);
    if(!match)throw Error("No encuentro un bloque JSON NAF en el .md.");
    let data;try{data=JSON.parse(match[1]);}catch(e){throw Error("El bloque JSON NAF está dañado.");}
    if(data?.naf_batch_schema_version===1&&data.kind==="lote_de_solicitudes_no_paquete_nap"){
      if(data.universe_id!=="nimroel"||!Array.isArray(data.items)||!data.items.length||
         data.base?.naf_schema_version!==1)throw Error("El antiguo lote NAF no es válido.");
      return data;
    }
    if(data?.naf_schema_version!==1||data.kind!=="solicitud_no_paquete_nap"||
       data.universe_id!=="nimroel"||!["exterior","interior","portrait"].includes(data.category)||
       !houses[data.geography?.house]||!data.focus||!data.appearance||!data.nap_output)
      throw Error("Solo se admiten solicitudes NAF de Nimroel.");
    if(data.identity_mode==="variant"&&!validId.test(data.reference_asset_id||""))
      throw Error("La variante no contiene un ID original válido.");
    return data;
  }
  function selectByLabel(id,value){
    if(typeof value!=="string")return;
    const element=$(id),target=Array.from(element.options).find(o=>o.textContent===value);
    if(target)element.value=target.value;
  }
  function applyNAFRequest(data){
    if(data.naf_batch_schema_version===1){
      applyNAFRequest(data.base);
      $("lotCount").value=String(Math.max(2,Math.min(12,data.items.length)));
      $("lotTitle").value=String(data.batch?.title||"").slice(0,100);
      setWorkflow("lot");setLotType(data.batch?.mode==="variants"?"views":"independent");
      renderLot();sync();return;
    }
    const geo=data.geography,info=data.appearance;
    $("house").value=geo.house;
    const procedural=geo.procedural_template===true||
      ["plantilla_generica_no_instanciada","pendiente_concretar"].includes(geo.canonical_status)||
      geo.place_name==="Por decidir";
    const known=houses[geo.house][1].some(x=>slug(x)===geo.location);
    const choice=procedural?"procedural":known?geo.location:"other";
    setHouse(choice);
    $("customPlace").value=choice==="other"?String(geo.place_name||geo.location||"").slice(0,180):"";
    const available=subjects[data.category].split("|").some(x=>slug(x)===data.focus.key);
    setKind(data.category,available?data.focus.key:"other");
    $("customSubject").value=available?"":String(data.focus.label||"").slice(0,180);
    for(const [el,key] of Object.entries({time:"time",weather:"weather",season:"season",
       scale:"scale",population:"occupancy",camera:"camera"}))selectByLabel(el,info[key]);
    $("notes").value=String(data.free_description||"").slice(0,12000);
    $("portraitAge").value=String(info.portrait_age||"").slice(0,80);
    if(data.category==="portrait"){
      selectByLabel("portraitSex",String(info.portrait_sex||""));
      if(info.portrait_sex==="Femenino")$("portraitSex").value="female";
      else if(info.portrait_sex==="Masculino")$("portraitSex").value="male";
      else if(info.portrait_sex&&!["female","male"].includes($("portraitSex").value)){
        $("portraitSex").value="other";$("customSex").value=String(info.portrait_sex).slice(0,80);
      }
    }
    $("preferredId").value=String(data.asset_id_proposed||"").slice(0,96);
    $("referenceId").value=String(data.reference_asset_id||"").slice(0,96);
    manual=new Set(bib.filter(b=>(data.visual_bibles?.paths||[]).includes(root+b[2])).map(b=>b[0]));
    $("manualBibles").checked=data.visual_bibles?.mode==="seleccion_manual_aditiva";
    // Cada .md individual de un lote sigue siendo una imagen, no activa un gestor de lotes.
    setWorkflow(data.identity_mode==="variant"?"variant":"single");
    renderBibles();sync();
  }
  async function loadMDFile(file){
    if(!file)return false;
    try{
      if(!/\.md$/i.test(file.name||""))throw Error("Selecciona un archivo .md.");
      if(file.size>512000)throw Error("Archivo demasiado grande: máximo 500 KB.");
      const data=parseNAFMarkdown(await file.text());
      applyNAFRequest(data);
      status("Solicitud recuperada: "+file.name+".",false);return true;
    }catch(e){status(e.message||"No se pudo cargar el archivo.",true);return false;}
  }
  function activityRule(category,weather,time){
    if(category==="portrait")return "Retrato: NO eliminar al protagonista por lluvia o nieve. Adaptar vestuario, humedad o fondo cuando proceda, conforme al canon.";
    if(category==="interior")return "Interior: NO vaciar automáticamente una taberna o posada porque llueva o nieve fuera. Puede haber clientes refugiados; efectos del clima visibles solo con sentido físico.";
    if(["lluvia_intensa","tormenta","ventisca","nieve"].includes(weather))
      return "Exterior con condiciones adversas: por defecto SIN NPC ni animales realizando actividad normal a la intemperie. Despejar caminos y plazas de vida injustificada; solo admitir personas resguardándose o con tareas urgentes y protección adecuada. Adaptar charcos, escorrentía, barro, nieve, huellas y refugios de forma físicamente coherente. NO conservar las acciones del PNG despejado.";
    if(["lluvia_suave","llovizna"].includes(weather))
      return "Exterior con lluvia suave: menos actividad desprotegida; NPC y animales bajo techo o moviéndose con protección. Evitar repetir las mismas acciones bajo la lluvia.";
    if(["noche","madrugada"].includes(time))
      return "Exterior nocturno: menos actividad cotidiana; presencia de NPC o animales solo por guardias, trabajo necesario u otro motivo plausible; luces coherentes.";
    return "Las variantes mantienen edificios, cámara y disposición, pero la actividad de NPC y animales se adapta siempre a clima, hora y estación.";
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
    const house=$("house").value,procedural=$("place").value==="procedural"||$("place").value==="auto";
    // NAP exige classification.location: en plantillas procedurales se usa el territorio real como
    // contenedor de catálogo, nunca se inventa un nombre de aldea ni un ID de instancia CoreRPG.
    const place=$("place").value==="other"?slug($("customPlace").value):procedural?house:$("place").value;
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
        procedural_template:procedural,instance_id:null,naming_authority:procedural?"CoreRPG":"lore_o_autor",
        canonical_status:procedural?"plantilla_generica_no_instanciada":house==="gldren"&&$("place").value==="halhhei"?"indicada_por_usuario_pendiente_verificacion":"seleccionada"},
      focus:{key:$("subject").value,label:focusName()},appearance:{
        time:label("time"),weather:label("weather"),season:label("season"),scale:label("scale"),
        occupancy:label("population"),camera:label("camera"),
        portrait_sex:portrait?($("portraitSex").value==="other"?$("customSex").value.trim():label("portraitSex")):null,
        portrait_age:portrait?$("portraitAge").value.trim()||null:null},
      free_description:$("notes").value.trim(),
      visual_production:{reference_asset_id:mode==="variant"?ref:null,
         relationship:mode==="variant"?{type:"variant",base_asset_id:ref,visual_group_id:"group_"+ref}:null,
         scene_kind:kind==="portrait"?role:slug(focusName()),
         visual_family_id:mode==="variant"?"group_"+ref:null,
         environment:{weather:$("weather").value,time:$("time").value,season:$("season").value},
        same_visual_identity:mode==="variant",original_png_required:mode==="variant",
        activity_coherence:activityRule(kind,$("weather").value,$("time").value),
        approval:"author_review_before_definitive_id_and_nap_zip"},
      visual_bibles:{mode:$("manualBibles").checked?"seleccion_manual_aditiva":"seleccion_automatica",
        paths:selectedBibles().map(id=>root+bib.find(b=>b[0]===id)[2])},
      nap_output:{manifest_version:2,classification,master_size:portrait?[768,960]:[1920,1080],
        zip_exactly_five_root_files:true,zip_contents:["<asset_id>.png","<asset_id>_manifest.json","<asset_id>_prompt.md","<asset_id>_info.md","<asset_id>_visual_identity.json"],
        webp_by_nap:true,sqlite_only_after_real_import:true}
    };
  }


  function lotRequests(){
    if(workflow!=="lot")throw Error("Selecciona Lote.");
    const count=Number($("lotCount").value);
    if(!Number.isInteger(count)||count<2||count>12)throw Error("Selecciona entre 2 y 12 imágenes.");
    const base=request();
    const id=lotId||newLotId(),title=$("lotTitle").value.trim()||
      (count+" "+focusName()+" · "+houses[$("house").value][0]+"/"+placeName());
    const items=[];
    for(let i=0;i<count;i++){
      const q=JSON.parse(JSON.stringify(base));
      q.identity_mode="new";q.reference_asset_id=null;q.asset_id_proposed=null;
      q.visual_production.reference_asset_id=null;
      q.visual_production.same_visual_identity=false;
      q.visual_production.original_png_required=false;
      q.visual_production.relationship=null;
      q.visual_production.batch={
        batch_id:id,batch_label:title,batch_index:i+1,batch_total:count,
        batch_kind:lotType==="views"?"same_location_views":"independent_same_theme",
        source_asset_id:null
      };
      if(lotType==="views"){
        const chosen=cameras[kind][i%cameras[kind].length];
        const guidance=chosen[1];
        q.appearance.camera=guidance;
        q.visual_production.shared_location_visual_id="location_"+id;
        q.visual_production.visual_family_id="location_"+id;
        q.visual_production.view_role=chosen[0];
        q.visual_production.coherence={
          same_physical_place:true,
          perspective:guidance,
          reference_image_position:i===0?null:1,
          previous_pngs_required_for_best_continuity:i>0,
          preserve_buildings_paths_landmarks:true,
          do_not_invent_core_instance_name:true
        };
        const continuity=i===0?
          "ESTABLECER IDENTIDAD DEL LUGAR: fijar arquitectura, caminos, distribución, hitos y materiales. Esta es la imagen de referencia de las siguientes vistas. No asignar nombre ni instancia procedural a CoreRPG.":
          "MISMO LUGAR QUE LA IMAGEN 01: utilizar su PNG aprobado como referencia visual (y las vistas previas que existan). Conservar edificios, caminos, fachadas, posición relativa de hitos y materiales; cambiar SOLO el punto de vista. No afirmar continuidad espacial exacta si los PNG previos no están disponibles.";
        q.free_description=[base.free_description,"Vista "+(i+1)+": "+guidance,continuity].filter(Boolean).join("\n\n");
      }else{
        const variation=independentDifferences(i);
        q.visual_production.visual_family_id=null;
        q.visual_production.shared_location_visual_id=null;
        q.visual_production.view_role=null;
        q.visual_production.coherence={
          same_physical_place:false,
          independently_generated:true,
          variation_level:$("lotVariation").value,
          no_repeated_layout_or_person:true
        };
        q.free_description=[base.free_description,
          "IMAGEN INDEPENDIENTE "+(i+1)+" DE "+count+". "+variation,
          "Comparte solo tipo, cultura y contexto con el resto del lote. NO es el mismo edificio, aldea ni persona. Variar la distribución, identidad y composición sin romper el canon."].filter(Boolean).join("\n\n");
      }
      items.push(q);
    }
    return {batch_id:id,batch_label:title,batch_type:lotType,items};
  }
  function makeMarkdown(req){
    const variant=req.identity_mode==="variant",visual=req.visual_production||{};
    const batch=visual.batch||null,views=batch?.batch_kind==="same_location_views";
    const overview=[
      "# NAF v0.5 — "+(variant?"Variante de imagen":batch?"Imagen "+batch.batch_index+" de "+batch.batch_total+" · "+batch.batch_label:"Imagen única"),"",
      "> SOLO UNA IMAGEN por solicitud. Este .md no es el ZIP de NAP; la aprobación la decide el autor.","",
      "## Solicitud","",
      "- Recurso: "+(req.category==="portrait"?"Retrato":req.category==="interior"?"Escena interior":"Escena exterior"),
      "- Territorio: "+req.geography.house_name+" · "+req.geography.place_name,
      "- Tipo: "+req.focus.label,
      "- Condiciones: "+req.appearance.time+" · "+req.appearance.weather+" · "+req.appearance.season,
      "- Encuadre: "+req.appearance.camera,
      "- Ocupación: "+req.appearance.occupancy,
      ...(req.category==="portrait"?["- Sexo: "+req.appearance.portrait_sex,"- Edad aparente: "+(req.appearance.portrait_age||"Por determinar")]:[]),
      ...(variant?["- ID ORIGINAL: "+req.reference_asset_id]:[]),
      ...(batch?["- Lote temático: "+batch.batch_id,"- Elemento: "+batch.batch_index+"/"+batch.batch_total,
        "- Tipo de lote: "+(views?"VISTAS DEL MISMO LUGAR":"LUGARES O PERSONAJES DISTINTOS")]:[]),
      "","## Notas e instrucciones de composición","",
      req.free_description||"Composición naturalista de acuerdo con las biblias visuales.","",
      "## Coherencia de mundo y clima","",
      visual.activity_coherence||"Adaptar siempre la actividad exterior al clima y horario.",
      variant?"Es una VARIANTE de la misma imagen original: conservar el encuadre, la arquitectura, el camino y los detalles identificativos. Necesitas consultar el PNG original; el ID solo es una referencia textual. Si no está accesible, solicitar al autor que lo adjunte.":"Mantener la diversidad visual y el canon del territorio.",
      ...(views?[
        "Este conjunto muestra el MISMO LUGAR físico desde distintos puntos. No son cinco aldeas independientes ni cambios meteorológicos de una sola cámara.",
        "Imagen 01: panorámica elevada inclinada a unos 45 grados, desde fuera y con suficiente distancia; jamás vista cenital.",
        "Para las vistas posteriores: examinar el PNG de la primera vista aprobada y, si existen, las intermedias. Reconstruir con prudencia posiciones relativas, accesos, edificios reconocibles, caminos y materiales. No inventar edificios incompatibles.",
        "Si no se dispone de las imágenes previas, indicarlo; no afirmar que la continuidad visual está garantizada."
      ]:[]),
      ...(batch&&!views?[
        "Este lote es TEMÁTICO: cada imagen representa un local, asentamiento o personaje DIFERENTE. No son variantes ni distintas cámaras de un mismo lugar.",
        "Mantener estilo cultural compartido y diferencias lógicas de planta, escala, mobiliario, actividad y composición."
      ]:[]),"",
      ...(req.geography.procedural_template?[
        "Plantilla visual genérica: NO bautizar el asentamiento ni fijar un identificador de instancia. Solo CoreRPG asigna instancias y nombres procedurales."
      ]:[]),
      "## Biblias visuales obligatorias","",
      ...req.visual_bibles.paths.map(p=>"- "+p),"",
      "## Proceso obligatorio en ChatGPT","",
      "1. Verificar las biblias indicadas en robdor80/Videojuego_Nimroel y el canon correspondiente; no inventar canon.",
      "2. GENERAR SOLO UN PNG maestro de "+req.nap_output.master_size.join(" × ")+" px, mostrarlo al autor y proporcionar al mismo tiempo un ID CANDIDATO copiable conforme a Naming v1 de NAP. Comprobar colisiones con IDs disponibles antes de confirmarlo.",
      "3. Si el autor RECHAZA el PNG, crear OTRO PNG con OTRO ID CANDIDATO. No reutilizar ese ID rechazado; todavía NO hacer ZIP.",
      "4. ÚNICAMENTE con aprobación explícita del autor, mantener el ID del PNG aprobado y, cuando el autor solicite el paquete, generar el ZIP individual de NAP. Nunca convertir una propuesta rechazada en definitiva.",
      "5. El ZIP NAP debe contener exactamente cinco ficheros planos: <asset_id>.png, <asset_id>_manifest.json, <asset_id>_prompt.md, <asset_id>_info.md y <asset_id>_visual_identity.json. NO incluir WebP.",
      "6. Manifest v2 con SOLO seis campos raíz: schema_version, universe_id, asset_id, asset_type, production_profile, classification. Las relaciones entre variantes, lotes y vistas van en _visual_identity.json, no en el manifest.",
      "7. La ruta física final de NAP procede de classification del manifest; NAP convertirá a WebP. Posteriormente se copiarán las imágenes aprobadas al juego con un índice de recursos, sin mover originales de NAP.",
      ...(variant?["8. Incluir relationship.type='variant', relationship.base_asset_id y el grupo visual en _visual_identity.json; conservar la clasificación territorial de la base."]:[]),
      ...(batch?["8. Incluir batch_id, batch_label, batch_index, batch_total, batch_kind y, para vistas, shared_location_visual_id y view_role en _visual_identity.json. No clasificar imágenes independientes como variantes."]:[]),
      "","## Datos estructurados","",
      "~~~json",JSON.stringify(req,null,2),"~~~","",
      "## Contratos de referencia","",
      "- robdor80/NAP/docs/NAMING_V1.md",
      "- robdor80/NAP/docs/MANIFEST_V2.md",
      "- robdor80/NAP/config/universes/nimroel/profile.json","",
      "Generado con NAF v0.5."
    ];
    return overview.join("\n")+"\n";
  }
  function markdown(){
    if(workflow==="lot")throw Error("En un lote descarga los .md por separado o todos dentro de un ZIP.");
    return makeMarkdown(request());
  }
  function lotMarkdown(index){
    const all=lotRequests();
    if(!Number.isInteger(index)||index<0||index>=all.items.length)throw Error("Índice de lote fuera de rango.");
    return makeMarkdown(all.items[index]);
  }
  function lotFileName(i){
    if(!lotId)lotId=newLotId();
    return lotId+"_"+String(i+1).padStart(2,"0")+".md";
  }
  function crc32(data){
    let crc=0xFFFFFFFF;
    for(const b of data){
      crc^=b;
      for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);
    }
    return (crc^0xFFFFFFFF)>>>0;
  }
  // ZIP estándar sin compresión, totalmente local: incluye SOLO archivos .md, no paquetes NAP.
  function zipMarkdowns(files){
    const encoder=new TextEncoder(),parts=[],centers=[];
    let offset=0,centerSize=0;
    for(const file of files){
      const name=encoder.encode(file.name),body=encoder.encode(file.text),crc=crc32(body);
      if(name.length>65535||body.length>0xFFFFFFFF)throw Error("El fichero no cabe en ZIP.");
      const local=new Uint8Array(30+name.length),v=new DataView(local.buffer);
      v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x0800,true);
      v.setUint16(8,0,true);v.setUint16(10,0,true);v.setUint16(12,0x0021,true);
      v.setUint32(14,crc,true);v.setUint32(18,body.length,true);v.setUint32(22,body.length,true);
      v.setUint16(26,name.length,true);local.set(name,30);
      parts.push(local,body);
      const central=new Uint8Array(46+name.length),c=new DataView(central.buffer);
      c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);
      c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,0,true);
      c.setUint16(14,0x0021,true);c.setUint32(16,crc,true);
      c.setUint32(20,body.length,true);c.setUint32(24,body.length,true);
      c.setUint16(28,name.length,true);c.setUint32(42,offset,true);
      central.set(name,46);centers.push(central);
      offset+=local.length+body.length;centerSize+=central.length;
    }
    const end=new Uint8Array(22),e=new DataView(end.buffer);
    e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);
    e.setUint32(12,centerSize,true);e.setUint32(16,offset,true);
    return new Blob([...parts,...centers,end],{type:"application/zip"});
  }
  function saveBlob(data,filename){
    const url=URL.createObjectURL(data),a=document.createElement("a");
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function downloadLotItem(index){
    try{
      saveBlob(new Blob([lotMarkdown(index)],{type:"text/markdown;charset=utf-8"}),lotFileName(index));
      status("Descargada solo la solicitud "+(index+1)+".",false);
    }catch(e){status(e.message||"No se pudo descargar.",true);}
  }
  async function copyText(content){
    if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(content);
    const node=document.createElement("textarea");node.value=content;document.body.appendChild(node);
    node.select();const copied=document.execCommand("copy");node.remove();
    if(!copied)throw Error("No se puede copiar.");
  }
  async function copyLotItem(index){
    try{await copyText(lotMarkdown(index));status("Copiada solo la solicitud "+(index+1)+".",false);}
    catch(e){status(e.message||"No se pudo copiar.",true);}
  }
  function download(){
    try{
      if(workflow==="lot"){
        const data=lotRequests();
        const files=data.items.map((item,i)=>({name:lotFileName(i),text:makeMarkdown(item)}));
        saveBlob(zipMarkdowns(files),data.batch_id+".zip");
        status("ZIP con "+files.length+" solicitudes .md preparado. No es un ZIP de NAP.",false);
      }else{
        const name="naf_"+(workflow==="variant"?"variante_":"imagen_")+kind+"_"+$("house").value+"_"+new Date().toISOString().replace(/[:.]/g,"-")+".md";
        saveBlob(new Blob([markdown()],{type:"text/markdown;charset=utf-8"}),name);
        status("Solicitud preparada: "+name,false);
      }
    }catch(e){status(e.message||"No se pudo generar la solicitud.",true);}
  }
  async function copy(){
    try{await copyText(markdown());status("Solicitud copiada.",false);}
    catch(e){status(e.message||"No se pudo copiar.",true);}
  }
  function status(message,error){
    $("status").textContent=message;$("status").classList.toggle("is-error",!!error);
  }
  function reset(){
    if(!confirm("¿Empezar una solicitud nueva y borrar el formulario actual?"))return;
    try{localStorage.removeItem(draftKey);}catch(e){}
    for(const id of fields)$(id).value="";
    for(const id of ["time","weather","season","scale","population","camera"])$(id).value="auto";
    $("portraitSex").value="";$("house").value="valrik";
    $("lotCount").value="5";$("lotVariation").value="balanced";$("lotTitle").value="";
    $("manualBibles").checked=false;manual.clear();lotId=newLotId();
    if(referenceImageUrl){URL.revokeObjectURL(referenceImageUrl);referenceImageUrl=null;}
    referenceImageName="";$("referenceImagePreview").classList.add("is-hidden");
    $("referenceImageStatus").textContent="También tendrás que adjuntar el PNG original en ChatGPT: el .md no contiene sus píxeles.";
    setHouse("procedural");setKind("exterior");setWorkflow("single");setLotType("independent");
    document.querySelector(".advanced").open=false;sync();status("Formulario nuevo.",false);
  }
  function referenceImageChanged(file){
    if(!file)return;
    if(!/\.png$/i.test(file.name||"")||file.type&&file.type!=="image/png"||file.size>30000000){
      status("Selecciona un PNG de hasta 30 MB.",true);return;
    }
    if(referenceImageUrl)URL.revokeObjectURL(referenceImageUrl);
    referenceImageUrl=URL.createObjectURL(file);referenceImageName=file.name;
    $("referenceImagePreview").src=referenceImageUrl;
    $("referenceImagePreview").classList.remove("is-hidden");
    $("referenceImageStatus").textContent="PNG local: "+file.name+". IMPORTANTE: adjúntalo también a ChatGPT; NAF no lo envía.";
    status("PNG cargado para previsualización local; recuerda adjuntarlo a ChatGPT.",false);
  }
  document.querySelectorAll("[data-kind]").forEach(b=>b.addEventListener("click",()=>{setKind(b.dataset.kind);renderLot();}));
  document.querySelectorAll("[data-workflow]").forEach(b=>b.addEventListener("click",()=>setWorkflow(b.dataset.workflow)));
  document.querySelectorAll("[data-lot-type]").forEach(b=>b.addEventListener("click",()=>setLotType(b.dataset.lotType)));
  $("house").addEventListener("change",()=>setHouse(""));
  $("place").addEventListener("change",()=>{renderBibles();sync();});
  $("subject").addEventListener("change",()=>{renderBibles();renderLot();sync();});
  $("manualBibles").addEventListener("change",()=>{
    if($("manualBibles").checked&&!manual.size)manual=new Set(autoBibles());
    renderBibles();sync();
  });
  fields.forEach(id=>$(id).addEventListener("input",sync));
  $("lotCount").addEventListener("change",()=>{renderLot();sync();});
  $("lotVariation").addEventListener("change",()=>{renderLot();sync();});
  $("lotTitle").addEventListener("input",sync);
  $("loadBtn").addEventListener("click",()=>$("loadFile").click());
  $("loadFile").addEventListener("change",async()=>{
    await loadMDFile($("loadFile").files?.[0]);$("loadFile").value="";
  });
  $("referenceImageBtn").addEventListener("click",()=>$("referenceImageFile").click());
  $("referenceImageFile").addEventListener("change",()=>{
    referenceImageChanged($("referenceImageFile").files?.[0]);$("referenceImageFile").value="";
  });
  $("downloadBtn").addEventListener("click",download);
  $("copyBtn").addEventListener("click",copy);
  $("resetBtn").addEventListener("click",reset);
  let stored=null;
  try{stored=JSON.parse(localStorage.getItem(draftKey)||"null")||
    JSON.parse(localStorage.getItem("naf_draft_v1")||"null");}catch(e){}
  lotId=newLotId();setHouse("procedural");setKind("exterior");restore(stored);
  setWorkflow(workflow);setLotType(lotType);renderLot();
  if("serviceWorker" in navigator&&location.protocol==="https:")
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  window.NAF={getState:()=>({workflow,kind,lotType,lotId,mode}),
    request,markdown,lotRequests,lotMarkdown,makeMarkdown,parseNAFMarkdown,applyNAFRequest,loadMDFile,
    setWorkflow,setLotType,zipMarkdowns,activityRule};

})();
