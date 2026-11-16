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
         relationship:mode==="variant"?{type:"variant",base_asset_id:ref,visual_group_id:"group_"+ref}:null,
         scene_kind:kind==="portrait"?role:slug(focusName()),
         visual_family_id:mode==="variant"?"group_"+ref:null,
         environment:{weather:$("weather").value,time:$("time").value,season:$("season").value},
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

})();
