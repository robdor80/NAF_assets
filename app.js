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
  let batchMode="single",batchItems=[],batchId="",sourceMode="new",externalPngAvailable=false;
  const progressStates=["pending","in_preparation","png_generated","approved","rejected","zip_delivered"];
  const progressLabels={pending:"Pendiente",in_preparation:"En preparación",png_generated:"PNG generado",
    approved:"Aprobada",rejected:"Descartada",zip_delivered:"ZIP entregado"};
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
    $("summaryBatch").textContent=batchMode==="single"?"1 imagen":batchItems.length+(batchMode==="variants"?" variantes":" imágenes distintas");
    $("downloadLabel").textContent=batchMode==="single"?"Descargar solicitud .md":"Guardar lote y seguimiento .md";
    $("summaryFormat").textContent=kind==="portrait"?"4:5 · 768 × 960":"16:9 · 1920 × 1080";
    $("previewType").textContent=kind==="portrait"?"RETRATO":kind==="interior"?"ESCENA INTERIOR":"ESCENA EXTERIOR";
    $("previewGlyph").textContent=kind==="portrait"?"◉":kind==="interior"?"▣":"◇";
    $("status").textContent="";$("status").classList.remove("is-error");save();
  }
  function save(){
    const o={kind,mode,manualOn:$("manualBibles").checked,manual:[...manual],
      batchMode,sourceMode,externalPngAvailable,batchItems:batchItems.map(i=>({...i,progress:{...i.progress}})),batchId,batchTitle:$("batchTitle").value,familyName:$("familyName").value};
    fields.forEach(x=>o[x]=$(x).value);
    try{localStorage.setItem("naf_draft_v1",JSON.stringify(o));}catch(e){}
  }
  function restore(o){
    if(!o||!houses[o.house]){setKind("exterior");return;}
    $("house").value=o.house;setHouse(o.place);
    setKind(subjects[o.kind]?o.kind:"exterior",o.subject);
    fields.filter(x=>!["house","place","subject"].includes(x)).forEach(x=>{if(typeof o[x]==="string")$(x).value=o[x];});
    if(o.mode==="variant")setMode("variant");
    $("manualBibles").checked=!!o.manualOn;manual=new Set(Array.isArray(o.manual)?o.manual.filter(x=>bib.some(b=>b[0]===x)):[]);
    $("batchTitle").value=String(o.batchTitle||"").slice(0,100);
    $("familyName").value=String(o.familyName||"").slice(0,80);
    batchId=typeof o.batchId==="string"&&/^naf_batch_[a-z0-9_]{6,80}$/.test(o.batchId)?o.batchId:"";
    batchItems=Array.isArray(o.batchItems)?o.batchItems.slice(0,12).map(normalizeBatchItem):[];
    sourceMode=o.sourceMode==="existing"?"existing":"new";
    externalPngAvailable=o.externalPngAvailable===true;
    $("externalPngAvailable").checked=externalPngAvailable;
    setBatchMode(["variants","distinct"].includes(o.batchMode)?o.batchMode:"single",false);
    renderBibles();sync();
  }

  // Importación exclusivamente de solicitudes NAF v1: no interpreta prompts ni paquetes de NAP.
  function parseNAFMarkdown(text){
    if(typeof text!=="string"||text.length>512000)throw Error("El archivo .md supera el límite de 500 KB.");
    const match=text.match(/~~~json\s*\r?\n([\s\S]*?)\r?\n~~~/i);
    if(!match)throw Error("No encuentro el bloque JSON de una solicitud NAF. Selecciona el .md descargado desde NAF.");
    let data;
    try{data=JSON.parse(match[1]);}catch(e){throw Error("El JSON de la solicitud NAF está dañado.");}
    if(data?.naf_batch_schema_version===1&&data.kind==="lote_de_solicitudes_no_paquete_nap"){
      if(data.universe_id!=="nimroel"||!["variants","distinct"].includes(data.batch?.mode)||
        !Array.isArray(data.items)||data.items.length<2||data.items.length>12||
        data.base?.kind!=="solicitud_no_paquete_nap"||!houses[data.base?.geography?.house]||
        !data.base?.appearance||!data.base?.focus||!data.base?.nap_output||
        (data.batch.mode==="variants"&&data.batch.source_mode!=="new"&&!validId.test(data.base.reference_asset_id||"")))
        throw Error("El lote NAF no es válido (máximo 12 imágenes).");
      return data;
    }
    if(!data||data.naf_schema_version!==1||data.kind!=="solicitud_no_paquete_nap"||data.universe_id!=="nimroel"||
       !["exterior","interior","portrait"].includes(data.category)||!houses[data.geography?.house]||
       !data.focus||typeof data.focus.key!=="string"||!data.appearance||!data.nap_output)
      throw Error("Solo pueden cargarse solicitudes .md válidas de NAF para Nimroel (versión 1).");
    if(data.identity_mode==="variant" && !validId.test(data.reference_asset_id||""))
      throw Error("El .md indica una variante, pero carece de un ID de imagen NAP válido.");
    return data;
  }
  function selectByLabel(id,value){
    if(typeof value!=="string")return;
    const el=$(id);
    const target=Array.from(el.options).find(o=>o.textContent===value);
    if(target)el.value=target.value;
  }
  function applyNAFRequest(data){
    if(data.naf_batch_schema_version===1){
      applyNAFRequest(data.base);
      $("batchTitle").value=String(data.batch.title||"").slice(0,100);
      $("familyName").value=String(data.batch.family_label||"").slice(0,80);
      batchId=typeof data.batch.id==="string"&&/^naf_batch_[a-z0-9_]{6,80}$/.test(data.batch.id)?data.batch.id:"";
      batchItems=data.items.map(i=>normalizeBatchItem(i)).slice(0,12);
      sourceMode=data.batch.source_mode==="new"?"new":"existing";
      externalPngAvailable=data.batch.external_png_available===true;
      $("externalPngAvailable").checked=externalPngAvailable;
      setBatchMode(data.batch.mode,false);sync();
      return;
    }
    // Validado antes de tocar el borrador visible. Los campos desconocidos no se ejecutan.
    const geo=data.geography;
    const house=geo.house;
    const procedural=geo.procedural_template===true||
      ["plantilla_generica_no_instanciada","pendiente_concretar"].includes(geo.canonical_status)||
      geo.place_name==="Por decidir";
    $("house").value=house;
    const known=houses[house][1].some(x=>slug(x)===geo.location);
    const geoChoice=procedural?"procedural":known?geo.location:"other";
    setHouse(geoChoice);
    $("customPlace").value=geoChoice==="other"?
      String(geo.place_name||geo.location||"").slice(0,180):"";
    const type=data.category;
    const focusKey=data.focus.key;
    const available=subjects[type].split("|").some(x=>slug(x)===focusKey);
    setKind(type,available?focusKey:"other");
    $("customSubject").value=available?"":String(data.focus.label||"").slice(0,180);
    const info=data.appearance;
    for(const [element,key] of Object.entries({
      time:"time",weather:"weather",season:"season",scale:"scale",
      population:"occupancy",camera:"camera"
    }))selectByLabel(element,info[key]);
    $("notes").value=String(data.free_description||"").slice(0,12000);
    $("portraitAge").value=String(info.portrait_age||"").slice(0,80);
    const portraitSex=String(info.portrait_sex||"");
    if(type==="portrait"){
      selectByLabel("portraitSex",portraitSex);
      if(!["female","male"].includes($("portraitSex").value)){
        if(portraitSex==="Femenino")$("portraitSex").value="female";
        else if(portraitSex==="Masculino")$("portraitSex").value="male";
        else if(portraitSex){$("portraitSex").value="other";$("customSex").value=portraitSex;}
      }
    }
    $("preferredId").value=typeof data.asset_id_proposed==="string"?data.asset_id_proposed.slice(0,96):"";
    $("referenceId").value=String(data.reference_asset_id||"").slice(0,180);
    setMode(data.identity_mode==="variant"?"variant":"new");
    const paths=Array.isArray(data.visual_bibles?.paths)?data.visual_bibles.paths:[];
    manual=new Set(bib.filter(b=>paths.includes(root+b[2])).map(b=>b[0]));
    $("manualBibles").checked=data.visual_bibles?.mode==="seleccion_manual_aditiva";
    setBatchMode("single",false);
    renderBibles();
    sync(); // Actualiza resumen y guarda el borrador importado.
  }
  async function loadMDFile(file){
    if(!file)return false;
    try{
      if(!/\.md$/i.test(file.name||""))throw Error("Selecciona un archivo con extensión .md.");
      if(file.size>512000)throw Error("El archivo es demasiado grande (máximo 500 KB).");
      const text=await file.text();
      const data=parseNAFMarkdown(text);
      applyNAFRequest(data);
      status("Solicitud cargada: "+file.name+". Ya puedes editarla y descargar otro .md.",false);
      return true;
    }catch(e){
      status(e.message||"No se ha podido cargar el archivo .md.",true);
      return false;
    }
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
  function newBatchId(){
    return "naf_batch_"+new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14)+"_"+Math.random().toString(36).slice(2,8);
  }
  function defaultBatchItem(index,kindOfBatch){
    return {weather:kindOfBatch==="variants"?(sourceMode==="new"?["despejado","lluvia_intensa","nieve"][index%3]:["lluvia_suave","lluvia_intensa","nieve"][index%3]):"auto",
      time:"auto",season:"auto",notes:"",progress:{status:"pending",asset_id:"",png_available:false}};
  }
  function normalizeBatchItem(item){
    const pick=(id,v)=>Array.from($(id).options).some(o=>o.value===v)?v:"auto";
    const progress=item?.progress||{};
    return {weather:pick("weather",item?.weather),time:pick("time",item?.time),
      season:pick("season",item?.season),notes:typeof item?.notes==="string"?item.notes.slice(0,400):"",
      progress:{status:progressStates.includes(progress.status)?progress.status:"pending",
        asset_id:typeof progress.asset_id==="string"?progress.asset_id.slice(0,96):"",
        png_available:progress.png_available===true}};
  }
  function renderBatch(){
    document.querySelectorAll("[data-batch]").forEach(button=>{
      const selected=button.dataset.batch===batchMode;
      button.classList.toggle("is-active",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    $("batchPanel").classList.toggle("is-hidden",batchMode==="single");
    $("familyWrap").classList.toggle("is-hidden",batchMode!=="variants");
    $("batchSourceWrap").classList.toggle("is-hidden",batchMode!=="variants");
    $("externalPngWrap").classList.toggle("is-hidden",!(batchMode==="variants"&&sourceMode==="existing"));
    $("externalPngAvailable").checked=externalPngAvailable;
    document.querySelectorAll("[data-source]").forEach(button=>{
      const selected=button.dataset.source===sourceMode;
      button.classList.toggle("is-active",selected);button.setAttribute("aria-pressed",String(selected));
    });
    $("batchSourceHint").textContent=sourceMode==="new"?
      "Primero generaré la imagen base y tú la aprobarás. Con su ID y PNG prepararé después las variantes.":
      "Pega en el bloque 01 el ID de la imagen ya aprobada. El PNG original también debe estar accesible.";
    $("batchHelp").textContent=batchMode==="variants"?
      (sourceMode==="new"?"La primera imagen creará la identidad de la aldea. Las restantes se generarán DESPUÉS de que apruebes la primera y exista su ID real.":"Todas partirán del ID de la imagen original que pegues. Se preservará su identidad visual.")+ " No conservar NPC trabajando al aire libre durante un temporal.":
      "Cada elemento representará un lugar o personaje INDEPENDIENTE. Evitaremos repetir la misma taberna o los mismos personajes.";
    $("batchCount").textContent=String(batchItems.length);
    const complete=batchItems.filter(x=>x.progress?.status==="zip_delivered").length;
    $("batchProgress").textContent=complete+" de "+batchItems.length+" con ZIP entregado; "+
      batchItems.filter(x=>["approved","zip_delivered"].includes(x.progress?.status)).length+" aprobadas.";
    $("addBatchBtn").disabled=batchItems.length>=12;
    const container=$("batchItems");
    container.replaceChildren();
    if(batchMode==="single")return;
    batchItems.forEach((item,index)=>{
      const card=document.createElement("div");card.className="batch-item";
      const heading=document.createElement("div");heading.className="batch-item-head";
      const label=document.createElement("strong");
      label.textContent=(batchMode==="variants"&&sourceMode==="new"&&index===0?"Imagen base ":batchMode==="variants"?"Variante ":"Imagen ")+String(index+1).padStart(2,"0");
      const remove=document.createElement("button");remove.type="button";
      remove.className="batch-remove";remove.textContent="Quitar";
      remove.disabled=batchItems.length<=2||(batchMode==="variants"&&sourceMode==="new"&&index===0)||
        ["approved","zip_delivered"].includes(item.progress.status);
      remove.addEventListener("click",()=>{
        if(batchItems.length<=2)return;
        batchItems.splice(index,1);renderBatch();sync();
      });
      heading.append(label,remove);
      const fields=document.createElement("div");fields.className="batch-item-fields";
      for(const [source,key,title] of [["weather","weather","Clima"],["time","time","Hora"],["season","season","Estación"]]){
        const wrapper=document.createElement("div");wrapper.className="field";
        const fieldLabel=document.createElement("label");fieldLabel.textContent=title;
        const select=document.createElement("select");select.setAttribute("aria-label",title+" de imagen "+(index+1));
        select.replaceChildren(...Array.from($(source).options).map(o=>addOpt(o.value,o.textContent)));
        select.value=item[key];select.addEventListener("change",()=>{item[key]=select.value;sync();});
        wrapper.append(fieldLabel,select);fields.append(wrapper);
      }
      const wrapper=document.createElement("div");wrapper.className="field batch-item-notes";
      const fieldLabel=document.createElement("label");fieldLabel.textContent="Detalle particular (opcional)";
      const input=document.createElement("input");input.type="text";input.maxLength=400;
      input.value=item.notes;
      input.placeholder=batchMode==="variants"?"Ej.: camino inundado, nieve sobre los tejados":"Ej.: taberna pequeña, distinto mobiliario";
      input.addEventListener("input",()=>{item.notes=input.value;sync();});
      wrapper.append(fieldLabel,input);fields.append(wrapper);
      card.append(heading,fields);
      const tracker=document.createElement("div");tracker.className="batch-tracker";
      const trackerFields=document.createElement("div");trackerFields.className="batch-tracker-fields";
      const statusField=document.createElement("div");statusField.className="field";
      const statusLabel=document.createElement("label");statusLabel.textContent="Estado de producción";
      const select=document.createElement("select");select.setAttribute("aria-label","Estado imagen "+(index+1));
      select.replaceChildren(...progressStates.map(v=>addOpt(v,progressLabels[v])));
      select.value=item.progress.status;
      select.addEventListener("change",()=>{
        if(!setItemStatus(index,select.value)){select.value=item.progress.status;return;}
        renderBatch();sync();
      });
      statusField.append(statusLabel,select);
      const idField=document.createElement("div");idField.className="field";
      const idLabel=document.createElement("label");idLabel.textContent="ID definitivo tras aprobación";
      const id=document.createElement("input");id.type="text";id.maxLength=96;
      id.setAttribute("aria-label","ID definitivo imagen "+(index+1));
      id.placeholder="Pega el ID entregado por ChatGPT";id.value=item.progress.asset_id;
      id.addEventListener("input",()=>{item.progress.asset_id=id.value.trim();sync();});
      id.addEventListener("change",()=>{
        const next=id.value.trim();
        if(batchMode==="variants"&&sourceMode==="new"&&index===0&&
           batchItems.slice(1).some(x=>x.progress.status!=="pending")&&
           next!==item.progress.asset_id){
          status("La imagen base ya tiene variantes iniciadas; no cambies su identidad.",true);
          id.value=item.progress.asset_id;return;
        }
        renderBatch();sync();
      });
      idField.append(idLabel,id);trackerFields.append(statusField,idField);
      const png=document.createElement("label");png.className="batch-png-confirm";
      const pngCheck=document.createElement("input");pngCheck.type="checkbox";
      pngCheck.setAttribute("aria-label","PNG disponible imagen "+(index+1));
      pngCheck.checked=item.progress.png_available;
      pngCheck.addEventListener("change",()=>{item.progress.png_available=pngCheck.checked;renderBatch();sync();});
      const pngText=document.createElement("span");pngText.textContent="PNG disponible para ChatGPT";
      png.append(pngCheck,pngText);
      const hint=document.createElement("p");hint.className="batch-item-hint";
      const readiness=itemReadiness(index);hint.textContent=readiness.why;
      const actions=document.createElement("div");actions.className="batch-item-actions";
      const downloadOne=document.createElement("button");downloadOne.type="button";
      downloadOne.className="btn btn-secondary btn-small";downloadOne.textContent="Descargar esta imagen .md";
      const copyOne=document.createElement("button");copyOne.type="button";
      copyOne.className="btn btn-quiet btn-small";copyOne.textContent="Copiar solicitud";
      downloadOne.disabled=copyOne.disabled=!readiness.ok;
      downloadOne.addEventListener("click",()=>downloadBatchItem(index));
      copyOne.addEventListener("click",()=>copyBatchItem(index));
      actions.append(downloadOne,copyOne);tracker.append(trackerFields,png,hint,actions);
      card.append(tracker);container.append(card);
    });
  }
  function setBatchMode(value,resetItems=true){
    const chosen=["variants","distinct"].includes(value)?value:"single";
    const changed=chosen!==batchMode;batchMode=chosen;
    if(changed&&batchMode==="variants"&&resetItems)sourceMode=validId.test($("referenceId").value.trim())?"existing":"new";
    if(batchMode!=="single"){
      if(!batchId)batchId=newBatchId();
      if(resetItems&&changed||batchItems.length<2)
        batchItems=[0,1,2].map(i=>defaultBatchItem(i,batchMode));
      setMode(batchMode==="variants"&&sourceMode==="existing"?"variant":"new");
    }
    document.querySelectorAll("[data-mode]").forEach(button=>{
      button.disabled=batchMode==="variants"?(sourceMode==="new"?button.dataset.mode==="variant":button.dataset.mode==="new"):
        batchMode==="distinct"?button.dataset.mode==="variant":false;
    });
    renderBatch();sync();
  }
  function setSourceMode(value){
    if(batchMode!=="variants")return;
    const previous=sourceMode;
    sourceMode=value==="existing"?"existing":"new";
    externalPngAvailable=false;
    const defaults={new:["despejado","lluvia_intensa","nieve"],existing:["lluvia_suave","lluvia_intensa","nieve"]};
    batchItems=batchItems.map((item,i)=>{
      const untouched=item.weather===defaults[previous][i%3]&&item.time==="auto"&&item.season==="auto"&&!item.notes;
      return untouched?{...item,weather:defaults[sourceMode][i%3]}:item;
    });
    setMode(sourceMode==="existing"?"variant":"new");
    document.querySelectorAll("[data-mode]").forEach(button=>{button.disabled=
      sourceMode==="existing"?button.dataset.mode==="new":button.dataset.mode==="variant";});
    renderBatch();sync();
  }
  function addBatchItem(){
    if(batchMode==="single"||batchItems.length>=12)return;
    batchItems.push(defaultBatchItem(batchItems.length,batchMode));renderBatch();sync();
  }

  function setItemStatus(index,value){
    const item=batchItems[index];
    if(!item||!progressStates.includes(value))return false;
    if(value==="approved"&&!item.progress.png_available){
      status("Marca primero que el PNG de esta imagen está disponible.",true);return false;
    }
    if(value==="zip_delivered"&&!(["approved","zip_delivered"].includes(item.progress.status)&&
        item.progress.png_available&&validId.test(item.progress.asset_id))){
      status("Antes del ZIP: aprueba el PNG y pega el ID definitivo válido.",true);return false;
    }
    if(batchMode==="variants"&&sourceMode==="new"&&index===0&&
       !["approved","zip_delivered"].includes(value)&&
       batchItems.slice(1).some(x=>x.progress.status!=="pending")){
      status("La base ya tiene variantes iniciadas. No puedes retirar su aprobación mientras existan.",true);
      return false;
    }
    item.progress.status=value;
    save();
    return true;
  }
  function itemReadiness(index){
    if(batchMode==="single"||index<0||index>=batchItems.length)return {ok:false,why:"No existe esta imagen."};
    const item=batchItems[index],p=item.progress;
    if(p.status==="rejected")return {ok:false,why:"Esta imagen está descartada."};
    if(p.status==="zip_delivered")return {ok:false,why:"Ya tiene su ZIP entregado; cambia el estado para repetir el encargo."};
    if(["approved"].includes(p.status))return {ok:false,why:"Esta imagen ya está aprobada. Solo falta su ID o la entrega del ZIP."};
    if(batchMode==="variants"&&sourceMode==="existing"){
      if(!validId.test($("referenceId").value.trim()))return {ok:false,why:"Pega primero el ID de referencia en el bloque 01."};
      if(!externalPngAvailable)return {ok:false,why:"Confirma que dispones del PNG original para ChatGPT."};
    }
    if(batchMode==="variants"&&sourceMode==="new"&&index>0){
      const base=batchItems[0]?.progress;
      if(!base||!["approved","zip_delivered"].includes(base.status)||
         !validId.test(base.asset_id)||!base.png_available)
        return {ok:false,why:"Bloqueada: aprueba el PNG base, pega su ID definitivo y confirma que está disponible."};
    }
    return {ok:true,why:"Lista para descargar y enviar a ChatGPT."};
  }
  function individualRequest(index){
    const check=itemReadiness(index);
    if(!check.ok)throw Error(check.why);
    const batch=batchRequest(),item=batch.items[index];
    if(!item)throw Error("La imagen no existe.");
    const req=item.request;
    req.visual_production.batch_position=index+1;
    req.visual_production.batch_total=batch.items.length;
    req.visual_production.batch_mode=batchMode;
    req.visual_production.batch_title=batch.batch.title;
    req.visual_production.production_progress={...item.progress};
    req.visual_production.must_generate_one_image_only=true;
    if(batchMode==="variants"){
      const baseRef=sourceMode==="new"?batchItems[0].progress.asset_id.trim():$("referenceId").value.trim();
      if(index===0&&sourceMode==="new"){
        req.identity_mode="new";req.reference_asset_id=null;
        req.visual_production.pending_reference_from_batch_position=null;
        req.visual_production.original_png_required=false;
      }else{
        req.identity_mode="variant";
        req.reference_asset_id=baseRef;
        req.visual_production.reference_asset_id=baseRef;
        req.visual_production.pending_reference_from_batch_position=null;
        req.visual_production.original_png_required=true;
      }
    }
    return req;
  }
  function individualMarkdown(index){
    const req=individualRequest(index),m=req.visual_production;
    return [
      "# NAF — Encargo individual "+String(index+1).padStart(2,"0")+" / "+batchItems.length,"",
      "> Esta solicitud contiene UNA SOLA imagen del lote "+batchId+". No generar el resto del lote.","",
      "## Identidad y dependencias","",
      "- Lote: "+m.batch_title,
      "- Lote ID: "+m.batch_id,
      "- Familia: "+m.visual_family_id,
      "- Identidad: "+(req.identity_mode==="variant"?"VARIANTE de "+req.reference_asset_id:"NUEVA imagen independiente"),
      "- PNG original: "+(req.identity_mode==="variant"?"Necesario; debe estar accesible o adjuntarse":"No necesario"),"",
      "## Imagen solicitada","",
      "- Universo: Nimroel RPG",
      "- Territorio: "+req.geography.house_name,
      "- Lugar: "+req.geography.place_name,
      "- Escenario: "+req.focus.label,
      "- Clima: "+req.appearance.weather,
      "- Hora: "+req.appearance.time,
      "- Estación: "+req.appearance.season,
      "- Descripción: "+(req.free_description||"Aplicar el canon y la diversidad visual."),"",
      "## Coherencia causal","",req.visual_production.activity_coherence,"",
      "## Fuentes a consultar","",...req.visual_bibles.paths.map(x=>"- "+x),"",
      "## Entrega y aprobación","",
      "1. Crear solo este PNG, verificando las biblias del repositorio Nimroel y su coherencia visual.",
      "2. Mostrarlo al autor y esperar su decisión. Si lo rechaza, corregir esta imagen, sin crear ZIP.",
      "3. Tras aprobación expresa, asignar y ofrecer para copiar un asset_id exclusivo, conforme a NAP Naming v1 y a la comprobación de colisiones disponible.",
      "4. Solo después crear un ZIP individual de cinco archivos planos: PNG, manifest v2, prompt.md, info.md y visual_identity.json.",
      "5. En visual_identity.json conservar batch_id, visual_family_id, posición y referencia original; NO añadirlos al manifest v2 de seis campos.",
      "6. NAP clasificará usando culture y location del manifest y convertirá el PNG a WebP. No crear paquetes ni ZIP del lote completo.","",
      "## Solicitud estructurada","",
      "~~~json",JSON.stringify(req,null,2),"~~~","",
      "Generado con NAF v0.4."
    ].join("\n")+"\n";
  }
  function downloadText(text,fileName){
    const url=URL.createObjectURL(new Blob([text],{type:"text/markdown;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=fileName;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  async function copyText(text){
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
    else{
      const node=document.createElement("textarea");node.value=text;
      document.body.appendChild(node);node.select();
      if(!document.execCommand("copy"))throw Error("Este navegador no permite copiar.");
      node.remove();
    }
  }
  function downloadBatchItem(index){
    try{
      const content=individualMarkdown(index);
      const name=batchId+"_imagen_"+String(index+1).padStart(2,"0")+".md";
      downloadText(content,name);status("Solicitud individual "+(index+1)+" descargada. El resto del lote no se ha enviado.",false);
    }catch(e){status(e.message||"No puede descargarse esta imagen.",true);}
  }
  async function copyBatchItem(index){
    try{await copyText(individualMarkdown(index));status("Solicitud individual "+(index+1)+" copiada.",false);}
    catch(e){status(e.message||"No se ha podido copiar.",true);}
  }
  function batchRequest(){
    if(batchMode==="single")throw Error("Selecciona «Misma escena» o «Imágenes distintas».");
    if(batchItems.length<2||batchItems.length>12)throw Error("Un lote admite entre 2 y 12 imágenes.");
    const base=request();
    if(base.asset_id_proposed)throw Error("En un lote, deja vacío «ID nuevo propuesto». Cada imagen aprobada recibirá un ID propio.");
    const title=$("batchTitle").value.trim()||
      (batchMode==="variants"?"Variantes de "+base.focus.label:"Imágenes distintas de "+base.focus.label);
    const familyId=batchMode==="variants"?"family_"+slug($("familyName").value.trim()||base.reference_asset_id||[$("house").value,focusName(),batchId].join("_")).slice(0,80):null;
    const images=batchItems.map((item,index)=>{
      const task=JSON.parse(JSON.stringify(base));
      const choice=(key,source)=>item[key]==="auto"?task.appearance[source]:
        Array.from($(key).options).find(o=>o.value===item[key])?.textContent||task.appearance[source];
      task.appearance.weather=choice("weather","weather");
      task.appearance.time=choice("time","time");
      task.appearance.season=choice("season","season");
      task.free_description=[base.free_description,item.notes].filter(Boolean).join("\nDetalle particular: ");
      const isVariant=batchMode==="variants"&&(sourceMode==="existing"||index>0);
      task.identity_mode=isVariant?"variant":"new";
      task.reference_asset_id=isVariant&&sourceMode==="existing"?base.reference_asset_id:null;
      task.asset_id_proposed=null;
      task.visual_production={
        batch_id:batchId,visual_family_id:isVariant?familyId:batchId+"_independent_"+String(index+1).padStart(2,"0"),
        same_visual_identity:isVariant,reference_asset_id:task.reference_asset_id,
        pending_reference_from_batch_position:isVariant&&sourceMode==="new"?1:null,
        original_png_required:isVariant,
        approval:"author_review_before_definitive_id_and_nap_zip",
        activity_coherence:activityRule(kind,item.weather==="auto"?$("weather").value:item.weather,
          item.time==="auto"?$("time").value:item.time)
      };
      return {position:index+1,weather:item.weather,time:item.time,season:item.season,notes:item.notes,progress:{...item.progress},request:task};
    });
    return {naf_batch_schema_version:1,kind:"lote_de_solicitudes_no_paquete_nap",universe_id:"nimroel",
      batch:{id:batchId,title,mode:batchMode,source_mode:batchMode==="variants"?sourceMode:null,family_label:$("familyName").value.trim(),
        visual_family_id:familyId,item_count:images.length,external_png_available:batchMode==="variants"&&sourceMode==="existing"?externalPngAvailable:false,
        approval_policy:"individual_png_review_before_id_and_zip"},
      base,items:images,
      nap_delivery:{one_zip_per_approved_image:true,zip_flat_five_files:true,
        no_sqlite_registration_in_naf:true,group_metadata_in_visual_identity:true,
        manifest_v2_no_extra_fields:true,routing_by_manifest_classification:true}};
  }
  function batchMarkdown(){
    const data=batchRequest();
    const jobs=data.items.flatMap(item=>[
      "### Imagen "+String(item.position).padStart(2,"0"),
      "- Meteorología: "+item.request.appearance.weather,
      "- Hora: "+item.request.appearance.time,
      "- Estación: "+item.request.appearance.season,
      "- Detalles: "+(item.notes||"Lo indicado en las biblias y la solicitud común"),
      "- Continuidad: "+(item.request.visual_production.same_visual_identity?"MISMO escenario que el PNG original":"NUEVA identidad, distinta de las otras"),
      "- Actividad de NPC y animales: "+item.request.visual_production.activity_coherence,
      "- Seguimiento: "+progressLabels[item.progress.status]+"; ID: "+(item.progress.asset_id||"pendiente")+"; PNG: "+(item.progress.png_available?"disponible":"no confirmado"),""
    ]);
    return [
      "# NAF — Lote: "+data.batch.title,"",
      "> Solicitud para ChatGPT. No es un ZIP listo para NAP.","",
      "## Reglas del lote","",
      "- Comprobar las biblias visuales y el canon territorial de cada imagen.",
      "- MISMA ESCENA CON ID: usar el asset_id original pegado y el PNG original accesible o adjunto; conservar perspectiva, edificios y distribución.",
      "- MISMA ESCENA SIN ID PREVIO: generar PRIMERO la imagen base del lote. Esperar aprobación del autor, asignar su ID y crear su ZIP. Solo entonces usar el PNG y el ID aprobados para las variantes restantes; no inventar un ID ni generar todas las variantes sin la base.",
      "- IMÁGENES DISTINTAS: cada taberna, casa, aldea o NPC debe tener identidad propia y diseño distinto, sin reutilizar edificios/encuadres por defecto.",
      "- NO conservar aldeanos trabajando a la intemperie durante lluvia fuerte, ventisca o nevada; permitir solo actividad justificada y refugios coherentes. En interiores y retratos, no eliminar automáticamente a los protagonistas.",
      "- GENERAR y mostrar cada PNG al autor; esperar su APROBACIÓN antes de entregar el ID definitivo y producir el ZIP de ese asset. Descartes no llegan a NAP.",
      "- Cada imagen aprobada tendrá su propio ID único y su ZIP plano con cinco archivos (PNG, manifest, prompt, info y visual_identity). Nunca importar el lote .md directamente en NAP.",
      "- Conservar batch_id, visual_family_id y reference_asset_id en _visual_identity.json. NO agregar estas claves al manifest v2. NAP archiva mediante classification del manifest, no por palabras del ZIP.",
      "- Las familias visuales no son nombres ni instancias de aldeas CoreRPG.","",
      "## Lista de imágenes","",...jobs,
      "## Datos estructurados","",
      "~~~json",JSON.stringify(data,null,2),"~~~","",
      "## Referencias del contrato NAP","",
      "- robdor80/NAP/config/universes/nimroel/profile.json",
      "- robdor80/NAP/docs/MANIFEST_V2.md",
      "- robdor80/NAP/docs/NAMING_V1.md","",
      "Generado con NAF v0.4."
    ].join("\n")+"\n";
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
  function markdown(){
    if(batchMode!=="single")return batchMarkdown();
    const r=request(),title=r.category==="portrait"?"Retrato":r.category==="interior"?"Escena interior":"Escena exterior";
    const lines=[
      "# NAF — Solicitud de "+title,"","> Solicitud para ChatGPT. NO es un ZIP ni un manifest listo para importar en NAP.","",
      "## Objetivo","",title+" · "+r.geography.house_name+" / "+r.geography.place_name+" · "+r.focus.label+".",
      r.identity_mode==="variant"?"Crear una variante del recurso "+r.reference_asset_id+" con nuevo ID.":"Crear una imagen completamente nueva.",
      ...(r.geography.procedural_template?[
        "Esta imagen es una PLANTILLA VISUAL GENÉRICA DEL TERRITORIO: no tiene nombre de aldea, identificador de instancia ni plano definitivo. Solo CoreRPG decide qué asentamiento procedural existe, cómo se llama y cuándo puede emplearse esta imagen. NAP usa classification.location="+r.geography.location+" como agrupador territorial, no como nombre de aldea."
      ]:[]),"",
      "## Descripción del autor","",r.free_description||"Sin más detalles: escoger una composición variada pero conforme al canon.","",
      "## Ambiente","",
      "- Hora: "+r.appearance.time,"- Meteorología: "+r.appearance.weather,"- Estación: "+r.appearance.season,
      "- Tamaño: "+r.appearance.scale,"- Ocupación: "+r.appearance.occupancy,"- Encuadre: "+r.appearance.camera,
      ...(r.category==="portrait"?["- Sexo: "+r.appearance.portrait_sex,"- Edad aparente: "+(r.appearance.portrait_age||"Por decidir")]:[]),"",
      "## Biblias que deben consultarse en robdor80/Videojuego_Nimroel","",
      ...r.visual_bibles.paths.map(x=>"- "+x),"",
      "## Solicitud estructurada","",
      "~~~json",JSON.stringify(r,null,2),"~~~","",
      "## Continuidad, actividad y aprobación","",
      "- "+r.visual_production.activity_coherence,
      "- Si es variante, el ID original NO contiene la imagen: comprobar que el PNG original está accesible; si no, pedirlo. Mantener edificios, camino y encuadre.",
      "- Primero generar PNG y solicitar valoración del autor. Solo después de aprobación explícita, comunicar ID final copiable y generar un ZIP por imagen.","",
      "## Obligaciones de producción para ChatGPT","",
      "1. Verificar en GitHub las biblias indicadas, el canon del territorio y las referencias visuales aplicables. No inventar canon. En imágenes genéricas, nunca asignar un nombre ni un plano fijo al asentamiento procedural.",
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
      "- robdor80/NAP/docs/NAMING_V1.md","","Generado con NAF v0.4."
    ];
    return lines.join("\n")+"\n";
  }
  function status(message,error){$("status").textContent=message;$("status").classList.toggle("is-error",!!error);}
  function download(){
    try{
      const text=markdown(),name=(batchMode==="single"?"naf_"+kind+"_"+$("house").value:"naf_lote_"+$("house").value)+
        "_"+new Date().toISOString().replace(/[:.]/g,"-")+".md";
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
    batchMode="single";sourceMode="new";externalPngAvailable=false;batchItems=[];batchId="";$("batchTitle").value="";$("familyName").value="";
    setHouse("procedural");setKind("exterior");setMode("new");setBatchMode("single",false);
    document.querySelector(".advanced").open=false;sync();
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
  $("loadBtn").addEventListener("click",()=>$("loadFile").click());
  $("loadFile").addEventListener("change",async()=>{
    const file=$("loadFile").files?.[0];
    await loadMDFile(file);
    $("loadFile").value="";
  });
  document.querySelectorAll("[data-batch]").forEach(b=>b.addEventListener("click",()=>setBatchMode(b.dataset.batch)));
  document.querySelectorAll("[data-source]").forEach(b=>b.addEventListener("click",()=>setSourceMode(b.dataset.source)));
  $("addBatchBtn").addEventListener("click",addBatchItem);
  $("externalPngAvailable").addEventListener("change",()=>{
    externalPngAvailable=$("externalPngAvailable").checked;renderBatch();sync();
  });
  $("batchTitle").addEventListener("input",sync);
  $("familyName").addEventListener("input",sync);
  $("downloadBtn").addEventListener("click",download);
  $("copyBtn").addEventListener("click",copy);
  $("resetBtn").addEventListener("click",reset);
  // Capturar el borrador ANTES de inicializar controles: su inicialización actualiza localStorage.
  let savedDraft=null;
  try{savedDraft=JSON.parse(localStorage.getItem("naf_draft_v1")||"null");}catch(e){}
  setHouse("procedural");restore(savedDraft);
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("./sw.js").catch(()=>{});
  window.NAF={markdown,request,batchRequest,individualRequest,individualMarkdown,setItemStatus,itemReadiness,parseNAFMarkdown,applyNAFRequest,loadMDFile,
    setBatchMode,setSourceMode,activityRule,getState:()=>({kind,mode,batchMode,sourceMode,batchCount:batchItems.length})};
})();
