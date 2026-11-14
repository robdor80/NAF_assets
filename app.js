(() => {
  "use strict";

  const FORM_KEY = "naf_v1_current_request";
  const DRAFT_KEY = "naf_v1_saved_requests";
  const ROOT = "Worldbuilding/Direccion artistica/";
  const REPO = "robdor80/Videojuego_Nimroel";
  const NAP_REPO = "robdor80/NAP";
  const $ = id => document.getElementById(id);

  const HOUSES = {
    valrik: {
      label: "Casa Valrik",
      places: [
        ["treskal", "Treskal (ciudad)", ""],
        ["treskal_v1", "Aldea V1 del territorio de Treskal", "Instancia de prueba; su ubicación, nombre y plano pueden no estar materializados."],
        ["treskal_rural", "Entorno rural de Treskal", "Ámbito de referencia, no una localidad concreta."],
        ["other", "Otro lugar / escribir", "El lugar se deberá contrastar con el canon."]
      ]
    },
    darovan: {
      label: "Casa Darovan",
      places: [
        ["treihord", "Treihord", ""], ["veldora", "Veldora", ""],
        ["taramin", "Taramin", ""], ["syvaris", "Syvaris", ""],
        ["arven", "Isla de Arven", "El perfil local sigue parcialmente sin definir."],
        ["other", "Otro lugar / escribir", ""]
      ]
    },
    edranor: {
      label: "Casa Edranor",
      places: [
        ["dorth", "Dorth", ""], ["lumina", "Lumina", ""],
        ["karsath", "Karsath", ""],
        ["rodas", "Rodas", "Rodas es una aldea de jurisdicción directa de la Corona Aethros, aunque figure en el ámbito geográfico Edranor."],
        ["other", "Otro lugar / escribir", ""]
      ]
    },
    galdren: {
      label: "Casa Galdren",
      places: [
        ["zanthir", "Zanthir (referencia del lore)", "Verificar la naturaleza y el emplazamiento exactos en los documentos Galdren; no se presupone ciudad."],
        ["other", "Otro lugar / escribir", "En Galdren hay documentación territorial, pero no una biblia local de escenas equivalente a Darovan/Edranor."]
      ]
    },
    aethros: {
      label: "Casa Aethros / Corona",
      places: [
        ["hallheim", "Hallheim", "Capital del Reino de Norgard."],
        ["rodas", "Rodas (aldea de la Corona)", "Rodas es de administración Aethros, no Edranor."],
        ["other", "Otro lugar / escribir", ""]
      ]
    }
  };

  const SUBJECTS = {
    exterior: [
      ["aldea", "Aldea"], ["pueblo", "Pueblo"], ["villa", "Villa"],
      ["ciudad", "Ciudad"], ["barrio", "Barrio"], ["calle", "Calle"],
      ["plaza", "Plaza"], ["camino", "Camino"], ["cruce", "Cruce de caminos"],
      ["descampado", "Descampado"], ["pradera", "Pradera"], ["campo", "Campo agrícola"],
      ["granja", "Granja"], ["huerto", "Huerto"], ["viniedo", "Viñedo"],
      ["bosque", "Bosque"], ["claro", "Claro de bosque"], ["rio", "Río"],
      ["ribera", "Ribera"], ["lago", "Lago"], ["costa", "Costa"],
      ["mar", "Mar"], ["playa", "Playa"], ["acantilado", "Acantilado"],
      ["montana", "Montaña"], ["sierra", "Sierra"], ["colina", "Colina"],
      ["mina", "Mina"], ["cantera", "Cantera"], ["cueva", "Cueva"],
      ["puerto", "Puerto"], ["muelle", "Muelle"], ["puente", "Puente"],
      ["fachada", "Fachada de edificio"], ["muralla", "Muralla"],
      ["castillo", "Castillo"], ["fortaleza", "Fortaleza"], ["ruinas", "Ruinas"],
      ["other", "Otra escena exterior / escribir"]
    ],
    interior: [
      ["taberna", "Taberna (sin alojamiento)"], ["posada", "Posada (con alojamiento)"],
      ["vivienda", "Vivienda"], ["salon", "Sala común"],
      ["cocina", "Cocina"], ["comedor", "Comedor"], ["dormitorio", "Dormitorio"],
      ["herrería", "Herrería"], ["taller", "Taller artesanal"],
      ["carpinteria", "Carpintería"], ["almacen", "Almacén"],
      ["bodega", "Bodega"], ["toneleria", "Tonelería"],
      ["establo", "Establo"], ["mercado", "Local comercial"],
      ["biblioteca", "Biblioteca"], ["archivo", "Archivo"],
      ["sala_guardia", "Sala de guardia"], ["cuartel", "Cuartel"],
      ["palacio", "Dependencia palaciega"], ["enfermeria", "Enfermería"],
      ["mina_interior", "Galería de mina"], ["torre", "Interior de torre"],
      ["cripta", "Cripta (solo si existe en canon)"],
      ["other", "Otro interior / escribir"]
    ],
    portrait: [
      ["aldeano", "Habitante / aldeano"], ["agricultor", "Agricultor/a"],
      ["ganadero", "Ganadero/a"], ["herrero", "Herrero/a"],
      ["tabernero", "Tabernero/a"], ["posadero", "Posadero/a"],
      ["carpintero", "Carpintero/a"], ["mercader", "Mercader/a"],
      ["artesano", "Artesano/a"], ["minero", "Minero/a"],
      ["pescador", "Pescador/a"], ["marinero", "Marinero/a"],
      ["soldado", "Soldado/a"], ["guardia", "Guardia"],
      ["noble", "Noble"], ["sanador", "Sanador/a"],
      ["viajero", "Viajero/a"], ["infante", "Niño/a"],
      ["anciano", "Anciano/a"], ["personaje", "Personaje identificado"],
      ["other", "Otra función / escribir"]
    ]
  };

  const BIBLES = {
    global: ["Biblia General de Nimroel v0.5", ROOT + "Biblia visual/General/NIMROEL_GLOBAL_VISUAL_BIBLE_v0.5.md"],
    environment: ["Biblia General de Escenas Ambientales v0.1", ROOT + "Biblia visual/Categorias/Escenas/SCENE_ENVIRONMENT_VISUAL_BIBLE_v0.1.md"],
    settlements: ["Biblia de Asentamientos v0.1", ROOT + "Biblia visual/Categorias/Asentamientos/SETTLEMENT_VISUAL_BIBLE_v0.1.md"],
    npc: ["Biblia de Retratos NPC v0.3", ROOT + "Biblia visual/Categorias/NPC/NPC_PORTRAIT_VISUAL_BIBLE_v0.3.md"],
    norgard: ["Perfil visual de Norgard v0.1", ROOT + "Biblia visual/Culturas/Norgard/NORGARD_VISUAL_PROFILE_v0.1.md"],
    treskalVillage: ["Aldeas interiores de Treskal v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Treskal/Aldeas/TRESKAL_VILLAGE_VISUAL_PROFILE_v0.1.md"],
    treskalCity: ["Ciudad de Treskal v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Treskal/TRESKAL_CITY_VISUAL_PROFILE_v0.1.md"],
    treskalPortrait: ["Retratos de Treskal v0.2", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Treskal/TRESKAL_PORTRAIT_VISUAL_BIBLE_v0.2.md"],
    portraitWorkflow: ["Reglas de producción de retratos", ROOT + "Assets/PORTRAIT_WORKFLOW_RULES.md"],
    portraitRegistry: ["Registro histórico de retratos", ROOT + "Assets/PORTRAIT_REGISTRY.json"],
    darovanEnvironment: ["Darovan: escenas ambientales v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Darovan/DAROVAN_ENVIRONMENT_VISUAL_BIBLE_v0.1.md"],
    darovanLocations: ["Darovan: localizaciones v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Darovan/DAROVAN_LOCATIONS_VISUAL_BIBLE_v0.1.md"],
    darovanPortrait: ["Darovan: retratos v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Darovan/DAROVAN_PORTRAIT_VISUAL_BIBLE_v0.1.md"],
    edranorEnvironment: ["Edranor: escenas ambientales v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Edranor/EDRANOR_ENVIRONMENT_VISUAL_BIBLE_v0.1.md"],
    edranorLocations: ["Edranor: localizaciones v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Edranor/EDRANOR_LOCATIONS_VISUAL_BIBLE_v0.1.md"],
    edranorPortrait: ["Edranor: retratos v0.1", ROOT + "Biblia visual/Culturas/Norgard/Perfiles locales/Edranor/EDRANOR_PORTRAIT_VISUAL_BIBLE_v0.1.md"],
    villageV1: ["Modelo de aldea V1 de Treskal", "Worldbuilding/Reinos/Reinos de los Hombres/Norgard/Territorios/Casa Valrik/Aldeas/01_Modelos/V1_Mixta_maderera_agricola/modelo_v1.md"],
    villageScope: ["Prueba V001: alcance territorial", "Worldbuilding/Reinos/Reinos de los Hombres/Norgard/Territorios/Casa Valrik/Aldeas/03_Prueba_v0.0.1/ALCANCE_LORE_V001_v0.1.md"],
    brokenTool: ["Prueba V001: La herramienta rota", "Worldbuilding/Reinos/Reinos de los Hombres/Norgard/Territorios/Casa Valrik/Aldeas/03_Prueba_v0.0.1/ENCARGO_HERRAMIENTA_ROTA_v0.1.md"],
    treskalMaster: ["Prompt maestro de aldeas de Treskal", ROOT + "Prompts maestros/Asentamientos/Norgard/Treskal/Aldeas/ALDEA_VALRIK_PROMPT_MASTER_v0.1.md"]
  };

  let extraBibles = [];
  let activeDraftId = null;
  let toastTimer = null;

  function selectOptions(node, values) {
    node.replaceChildren();
    values.forEach(pair => node.add(new Option(pair[1], pair[0])));
  }
  function radio(name) {
    const checked = document.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : "";
  }
  function setRadio(name, value) {
    const node = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (node) node.checked = true;
  }
  function placeEntry(house, place) {
    const data = HOUSES[house] || HOUSES.valrik;
    return data.places.find(pair => pair[0] === place);
  }
  function currentPlaceLabel(d) {
    const entry = placeEntry(d.house, d.place);
    if (d.place === "other") return d.placeOther.trim();
    return entry ? entry[1] : d.place;
  }
  function currentSubjectLabel(d) {
    const options = SUBJECTS[d.kind] || SUBJECTS.exterior;
    if (d.subject === "other") return d.subjectOther.trim();
    const option = options.find(pair => pair[0] === d.subject);
    return option ? option[1] : d.subject;
  }
  function requiredBibleKeys(d) {
    const keys = ["global", "norgard"];
    if (d.kind === "portrait") {
      keys.push("npc", "portraitWorkflow", "portraitRegistry");
    } else {
      keys.push("environment", "settlements");
    }
    if (d.house === "valrik") {
      if (d.kind === "portrait") keys.push("treskalPortrait");
      else if (d.place === "treskal") keys.push("treskalCity");
      else if (d.place === "treskal_v1" || d.place === "treskal_rural") keys.push("treskalVillage");
      if (d.place === "treskal_v1") keys.push("villageV1", "villageScope");
    }
    if (d.house === "darovan") {
      keys.push(d.kind === "portrait" ? "darovanPortrait" : "darovanEnvironment");
      if (d.kind !== "portrait") keys.push("darovanLocations");
    }
    if (d.house === "edranor") {
      keys.push(d.kind === "portrait" ? "edranorPortrait" : "edranorEnvironment");
      if (d.kind !== "portrait") keys.push("edranorLocations");
    }
    if (d.house === "aethros" && d.place === "rodas") {
      if (d.kind === "portrait") keys.push("edranorPortrait");
      else keys.push("edranorEnvironment", "edranorLocations");
    }
    return [...new Set(keys)];
  }

  function populatePlaces(selected) {
    const house = $("house").value;
    selectOptions($("place"), HOUSES[house].places);
    const allowed = HOUSES[house].places.some(x => x[0] === selected);
    $("place").value = allowed ? selected : HOUSES[house].places[0][0];
  }
  function populateSubjects(selected) {
    const kind = radio("assetKind");
    selectOptions($("subject"), SUBJECTS[kind]);
    if (SUBJECTS[kind].some(x => x[0] === selected)) $("subject").value = selected;
  }

  function getData() {
    return {
      kind:radio("assetKind"), house:$("house").value, place:$("place").value,
      placeOther:$("placeOther").value, subject:$("subject").value,
      subjectOther:$("subjectOther").value, mode:radio("mode"),
      referenceId:$("referenceId").value.trim(), referenceName:$("referenceName").value.trim(),
      timeOfDay:$("timeOfDay").value, weather:$("weather").value, season:$("season").value,
      sex:$("sex").value, age:$("age").value.trim(), profession:$("profession").value.trim(),
      scale:$("scale").value, people:$("people").value, foodService:$("foodService").value,
      notes:$("notes").value, extraBibles:extraBibles.slice()
    };
  }
  function applyData(d) {
    $("requestForm").reset();
    setRadio("assetKind",d.kind || "exterior");
    $("house").value = HOUSES[d.house] ? d.house : "valrik";
    populatePlaces(d.place);
    populateSubjects(d.subject);
    setRadio("mode",d.mode || "new");
    ["placeOther","subjectOther","referenceId","referenceName","timeOfDay","weather",
     "season","sex","age","profession","scale","people","foodService","notes"].forEach(id => {
      if (d[id] !== undefined && d[id] !== null) {
        const node = $(id);
        if (node.tagName === "SELECT") {
          if (Array.from(node.options).some(o => o.value === d[id])) node.value = d[id];
        } else node.value = d[id];
      }
    });
    extraBibles = Array.isArray(d.extraBibles) ? d.extraBibles.filter(k => BIBLES[k]) : [];
    render();
  }

  function renderBibles(d) {
    const required = requiredBibleKeys(d);
    $("requiredBibles").replaceChildren();
    required.forEach(key => {
      const item = document.createElement("div");
      item.className = "bible-item";
      item.textContent = BIBLES[key][0];
      $("requiredBibles").appendChild(item);
    });
    $("bibleCount").textContent = required.length + " obligatorias";
    const options = [["", "Seleccionar referencia adicional…"]];
    Object.keys(BIBLES).filter(key => !required.includes(key) && !extraBibles.includes(key))
      .forEach(key => options.push([key, BIBLES[key][0]]));
    selectOptions($("extraBible"), options);
    $("addedBibles").replaceChildren();
    extraBibles.filter(key => !required.includes(key)).forEach(key => {
      const chip = document.createElement("span"); chip.className = "bible-chip";
      chip.appendChild(document.createTextNode(BIBLES[key][0]));
      const remove = document.createElement("button");
      remove.type = "button"; remove.textContent = "×";
      remove.setAttribute("aria-label","Quitar " + BIBLES[key][0]);
      remove.addEventListener("click", () => { extraBibles = extraBibles.filter(k => k !== key); render(); });
      chip.appendChild(remove); $("addedBibles").appendChild(chip);
    });
  }

  function renderSummary(d) {
    const target = $("summaryBody");
    target.replaceChildren();
    const addRow = (label,value) => {
      const row=document.createElement("div");row.className="summary-row";
      const small=document.createElement("span");small.className="summary-label";small.textContent=label;
      const val=document.createElement("span");val.className="summary-value";val.textContent=value || "Sin definir";
      row.append(small,val);target.appendChild(row);
    };
    const addTags = tags => {
      const group=document.createElement("div");group.className="summary-tags";
      tags.forEach(s => {
        const chip=document.createElement("span");chip.className="summary-tag";chip.textContent=s;group.append(chip);
      });
      target.append(group);
    };
    addRow("Asset",({exterior:"Escena exterior",interior:"Escena interior",portrait:"Retrato"}[d.kind] || d.kind) + " · " + (currentSubjectLabel(d) || "Personalizado"));
    addRow("Territorio",HOUSES[d.house].label);
    addRow("Lugar",currentPlaceLabel(d) || "Por definir");
    addRow("Modalidad",({new:"Localización / sujeto nuevo",variant:"Variante fiel",inspired:"Inspirado en otra referencia"}[d.mode] || d.mode));
    if (d.mode !== "new") addRow("Referencia",d.referenceId || d.referenceName || "Pendiente");
    addTags([d.timeOfDay,d.weather,d.season].filter(x => x !== "automatico")
      .map(x => x === "otono" ? "Otoño" : x.charAt(0).toUpperCase()+x.slice(1)));
    if (d.kind === "portrait") {
      addRow("Retrato",["Sexo: "+(d.sex || "sin definir"),"Edad: "+(d.age || "libre"),"Rol: "+(d.profession || "a resolver")].join(" · "));
    } else if (d.kind === "interior" && d.subject === "taberna") {
      addRow("Taberna","Sin alojamiento · Comida: "+({automatico:"por definir",si:"sí",no:"no"}[d.foodService] || "por definir"));
    }
    if (d.notes.trim()) {
      const detail=document.createElement("p");detail.className="summary-description";
      detail.textContent=d.notes.trim();target.appendChild(detail);
    }
  }

  function render() {
    const d = getData();
    $("placeOtherWrap").hidden = d.place !== "other";
    $("subjectOtherWrap").hidden = d.subject !== "other";
    $("referenceFields").hidden = d.mode === "new";
    $("portraitFields").hidden = d.kind !== "portrait";
    $("sceneFields").hidden = d.kind === "portrait";
    $("foodWrap").hidden = !(d.kind === "interior" && d.subject === "taberna");
    $("subjectLabel").textContent = d.kind === "portrait" ? "Tipo de personaje" : "Qué quieres representar";
    const place = placeEntry(d.house,d.place);
    $("placeNotice").textContent = place && place[2] ? place[2] : "";
    renderBibles(d);
    renderSummary(d);
    saveCurrent();
  }

  function saveCurrent() {
    try { localStorage.setItem(FORM_KEY,JSON.stringify(getData())); }
    catch(_) { /* navegador restringido; la descarga sigue disponible */ }
  }

  function validate(d) {
    if (d.place === "other" && !d.placeOther.trim()) return "Escribe el lugar o elige uno conocido.";
    if (d.subject === "other" && !d.subjectOther.trim()) return "Escribe qué quieres representar.";
    if (d.mode !== "new" && !d.referenceId && !d.referenceName) return "Indica el asset o PNG que servirá de referencia.";
    if (d.referenceId && !/^(scene|portrait)_[a-z0-9]+(?:_[a-z0-9]+)*_(?!000)[0-9]{3}$/.test(d.referenceId))
      return "El ID de referencia no sigue Naming v1 de NAP (scene_..._001 o portrait_..._001).";
    if (d.age && (!Number.isInteger(Number(d.age)) || Number(d.age)<0 || Number(d.age)>250))
      return "La edad debe ser un entero entre 0 y 250.";
    return "";
  }

  const readable = value => ({
    automatico:"A decidir según canon/contexto; no fijar como hecho",
    otono:"otoño", sin_definir:"sin definir"
  }[value] || value);

  function markdown(d) {
    const kind = {exterior:"Escena exterior",interior:"Escena interior",portrait:"Retrato NPC"}[d.kind];
    const assetType = d.kind === "portrait" ? "portrait" : "scene";
    const production = d.kind === "portrait" ? "portrait_npc" : "scene_environment";
    const dims = d.kind === "portrait" ? "PNG 4:5 exacto; WebP derivado NAP 768×960 Q90" : "PNG 16:9 exacto; WebP derivado NAP 1920×1080 Q90";
    const locationName = currentPlaceLabel(d);
    const name = currentSubjectLabel(d);
    const modeName = {new:"Nueva localización / nuevo sujeto",variant:"Variante fiel de un asset existente",inspired:"Nueva creación inspirada en un asset existente"}[d.mode];
    const bibleKeys = [...new Set(requiredBibleKeys(d).concat(d.extraBibles))].filter(k => BIBLES[k]);
    const requestedDate = new Date().toISOString();
    const encargo = "NAF-" + requestedDate.replace(/[^0-9]/g,"").slice(0,14);
    const lines = [
      "# NAF — Encargo visual para ChatGPT",
      "",
      "> Este .md es una **SOLICITUD DE GENERACIÓN**, no un asset ni un ZIP importable en NAP.",
      "> ChatGPT debe consultar las biblias vigentes, crear el prompt definitivo, generar la imagen, verificarla y entregar el ZIP final NAP.",
      "",
      "## 1. Identidad del encargo",
      "",
      "- **Identificador de solicitud:** "+encargo,
      "- **Generado (UTC):** "+requestedDate,
      "- **Proyecto:** Videojuego Nimroel RPG",
      "- **Repositorio de canon:** https://github.com/"+REPO,
      "- **Repositorio de protocolo NAP:** https://github.com/"+NAP_REPO,
      "- **Tipo solicitado:** "+kind,
      "- **Tema:** "+name,
      "- **Casa / ámbito:** "+HOUSES[d.house].label,
      "- **Lugar:** "+locationName,
      "- **Código local de selección (orientativo):** "+d.place,
      "- **Modalidad:** "+modeName,
      "",
      "## 2. Condiciones visuales solicitadas",
      "",
      "- **Hora:** "+readable(d.timeOfDay),
      "- **Meteorología:** "+readable(d.weather),
      "- **Estación:** "+readable(d.season)
    ];
    if (d.mode !== "new") {
      lines.push("- **Asset de referencia:** "+(d.referenceId||"no indicado"));
      lines.push("- **PNG de referencia:** "+(d.referenceName||"no indicado; solicitar que se adjunte si es necesario"));
      lines.push("- **Continuidad:** "+(d.mode === "variant"
        ? "Conservar la identidad del lugar o persona, geometría, distribución y punto de vista si es la misma vista; cambiar solamente los aspectos pedidos. Utilizar la imagen de referencia, no solo su descripción."
        : "Crear un asset diferente, manteniendo solo las cualidades seleccionadas de la referencia; no clonar."));
    }
    if (d.kind === "portrait") {
      lines.push("- **Sexo solicitado:** "+readable(d.sex));
      lines.push("- **Edad numérica orientativa:** "+(d.age||"no determinada"));
      lines.push("- **Oficio o función:** "+(d.profession||name||"a resolver"));
      lines.push("- **Anatomía y variedad:** cara, ojos, cuello, manos y ropa plausibles; verificar no-clonación y registro de retratos.");
      lines.push("- **Contexto temporal/meteorológico:** solo cuando tenga sentido en ropa, luz o fondo; no reemplazar rasgos individuales.");
    } else {
      lines.push("- **Escala:** "+readable(d.scale));
      lines.push("- **Presencia de gente:** "+readable(d.people));
      if (d.kind === "interior" && d.subject === "taberna") {
        lines.push("- **Función obligatoria de TABERNA:** bebida, convivencia y reunión. **SIN habitaciones para huéspedes ni capacidad de alojamiento**.");
        lines.push("- **Comida:** "+readable(d.foodService)+". Se permitirá servicio de comida solo si esta elección y el contexto lo sostienen.");
      }
      if (d.kind === "interior" && d.subject === "posada") {
        lines.push("- **Función de POSADA:** alojamiento, con posible comida/bebida; conservar espacios y escala autorizados, sin obligar a que se vean habitaciones.");
      }
    }
    lines.push("");
    lines.push("## 3. Descripción libre del autor");
    lines.push("");
    if (d.notes.trim()) {
      d.notes.replace(/\r/g,"").split("\n").forEach(part => lines.push("> "+part));
    } else lines.push("> Sin instrucciones adicionales. Resolver decisiones menores con diversidad, credibilidad y las biblias.");
    lines.push("");
    lines.push("## 4. Biblias y fuentes aplicables");
    lines.push("");
    lines.push("Las siguientes rutas son referencias de lectura **en el repositorio de canon**, no copias incrustadas. Consultar siempre su contenido vigente y fuentes territoriales adicionales antes de generar:");
    lines.push("");
    bibleKeys.forEach(key => lines.push("- **"+BIBLES[key][0]+"** — "+BIBLES[key][1]));
    lines.push("");
    lines.push("Si un perfil local está en desarrollo, los materiales, nombres, geometría y detalles pendientes NO se convertirán en canon por ilustrarlos.");
    if (d.place === "treskal_v1") lines.push("La prueba V001 tiene una taberna/espacio social y capacidad básica de herrería; la posada es OPCIONAL. La misión «La herramienta rota» es opcional, no debe aparecer resuelta por defecto.");
    if (d.house === "edranor" && d.place === "rodas" || d.house === "aethros" && d.place === "rodas") lines.push("Rodas está bajo jurisdicción de Corona Aethros, no de Edranor.");
    if (d.house === "galdren") lines.push("Galdren está en desarrollo territorial; verificar los datos disponibles, no inventar biblias locales inexistentes.");
    lines.push("");
    lines.push("## 5. Instrucciones para la generación y revisión por ChatGPT");
    lines.push("");
    [
      "Resolver la localización real, restricciones del canon y visuales aplicables; si un lugar o edificio es hipotético, etiquetarlo como concepto, no como entidad canónica.",
      "Redactar un PROMPT DEFINITIVO ESPECÍFICO para esta imagen, no una copia literal de este encargo.",
      "Aplicar realismo cinematográfico naturalista de Nimroel: arquitectura viable, escala funcional, materiales realistas, luz motivada y personajes apropiados.",
      "Si es variante fiel, revisar imagen madre o PNG adjunto y conservar identidad del lugar/personaje. Sin referencia gráfica no afirmar fidelidad exacta.",
      "Comprobar diversidad frente a los assets conocidos y rechazar clonación innecesaria.",
      "Inspeccionar anatomía de personas y animales a tamaño ampliado: nada de cabezas/cuello dobles, ovejas fusionadas, patas/manos sobrantes o individuos compartidos.",
      "No inventar heráldica, carteles, topografía, puentes, ríos, servicios, NPC, conocimientos, acontecimientos ni estado de una misión.",
      "No representar como confirmadas la hora, lluvia, nieve o estación si chocan con canon o la ubicación; justificar y señalar cualquier hipótesis de ilustración.",
      "Describir en metadatos únicamente lo que se ve y lo que está probado, distinguiendo preferencias solicitadas de observaciones de la imagen."
    ].forEach((s,i)=>lines.push((i+1)+". "+s));
    lines.push("");
    lines.push("## 6. Contrato NAP 2.0 — obligación estricta");
    lines.push("");
    lines.push("- **Universo:** nimroel");
    lines.push("- **Manifest v2:** seis propiedades raíz exactas: schema_version (número 2), universe_id, asset_id, asset_type, production_profile, classification. No añadir campos adicionales.");
    lines.push("- **asset_type:** "+assetType);
    lines.push("- **production_profile:** "+production);
    lines.push("- **Imagen:** "+dims+". PNG maestro estático sin deformación; NAP realiza la conversión WebP.");
    lines.push("- **Clasificación obligatoria:** "+(d.kind === "portrait" ? "culture, location, role, sex" : "culture, location")+". Valores en lowercase snake_case ASCII y verificados con perfil y canon. culture=norgard para estos territorios.");
    lines.push("- **Asset ID:** elegir identificador NUEVO según Naming v1 (prefijo "+assetType+"_, descriptor, sufijo 001–999), comprobar que no colisione con catálogo y registro; no reutilizar ID de variante.");
    lines.push("- **Destino:** UN ZIP plano con exactamente cinco archivos con el mismo asset_id: <asset_id>.png, <asset_id>_manifest.json, <asset_id>_prompt.md, <asset_id>_info.md y <asset_id>_visual_identity.json. No incluir WebP.");
    lines.push("- **_prompt.md:** prompt definitivo realmente usado, diferencias y procedencia.");
    lines.push("- **_info.md:** contexto, canon, localización, estado de revisión, propuesta frente a canon y vínculo con serie o variante.");
    lines.push("- **_visual_identity.json:** objeto JSON descriptivo, con rasgos escalares consultables por NAP/SQLite (p.ej. scene.kind, scene.time_of_day, scene.weather, scene.season, subject.type, venue.lodging, series.base_asset_id, series.location_key), solo cuando correspondan y estén verificados visualmente. No copiar indiscriminadamente peticiones como hechos.");
    lines.push("- **SQLite:** no escribir directamente. NAP archiva los companions y registra visual_traits después de producción verificada; este .md previo no se cataloga.");
    lines.push("- **Comprobación final:** validar ratio y PNG, Manifest estricto, cinco nombres exactos y ZIP sin subcarpetas, integridad y correspondencia de metadatos; si hay problema, corregir antes de entregar.");
    lines.push("- **Contrato fuente:** https://github.com/"+NAP_REPO+"/blob/main/config/universes/nimroel/profile.json ; docs/NAMING_V1.md ; docs/MANIFEST_V2.md ; docs/NIMROEL_ENVIRONMENT_PACKAGE_V1.md ; docs/SQLITE_CATALOG.md");
    lines.push("");
    lines.push("## 7. Entrega esperada");
    lines.push("");
    lines.push("ChatGPT debe entregar **un enlace descargable al ZIP NAP completo** (y opcionalmente PNG maestro), tras crear realmente los archivos y verificar el paquete. No responder únicamente con el prompt ni con una ruta interna.");
    lines.push("");
    lines.push("---");
    lines.push("_Solicitado mediante NAF v0.1. Archivo de encargo independiente de los cinco archivos de producción._");
    return lines.join("\n")+"\n";
  }

  function filename(d) {
    const stamp=new Date().toISOString().replace(/[-:TZ.]/g,"").slice(0,14);
    const prefix=d.kind === "portrait" ? "retrato" : "escena_"+d.kind;
    return "NAF_encargo_"+prefix+"_"+d.house+"_"+stamp+".md";
  }
  function downloadText(name,content) {
    const blob=new Blob([content],{type:"text/markdown;charset=utf-8"});
    const link=document.createElement("a");
    const url=URL.createObjectURL(blob);
    link.href=url;link.download=name;link.style.display="none";
    document.body.append(link);link.click();link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function toast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    $("toast").textContent=message;$("toast").hidden=false;
    toastTimer=window.setTimeout(()=>{$("toast").hidden=true;},3500);
  }
  function requestContent() {
    const d=getData();
    const error=validate(d);
    if(error){toast(error);return null;}
    return {data:d,text:markdown(d)};
  }
  function safeDrafts() {
    try {
      const v=JSON.parse(localStorage.getItem(DRAFT_KEY)||"[]");
      return Array.isArray(v) ? v.filter(x => x && typeof x.id === "string" && x.data && HOUSES[x.data.house]).slice(0,150) : [];
    } catch(_) {return [];}
  }
  function persistDrafts(rows) {
    try{localStorage.setItem(DRAFT_KEY,JSON.stringify(rows));return true;}
    catch(_){toast("No se pudo guardar en este navegador. Descarga el .md.");return false;}
  }
  function refreshDraftCount() {
    const n=safeDrafts().length;
    $("draftCount").textContent=String(n);
    $("draftCount").hidden=n===0;
  }
  function saveDraft() {
    const d=getData();
    const error=validate(d);
    if(error){toast(error);return;}
    const all=safeDrafts();
    const id=activeDraftId||("draft_"+Date.now()+"_"+Math.floor(Math.random()*10000));
    const row={id,updated:new Date().toISOString(),title:currentSubjectLabel(d)+" · "+currentPlaceLabel(d),data:d};
    const i=all.findIndex(x=>x.id===id);
    if(i>=0) all[i]=row;else all.unshift(row);
    if(persistDrafts(all)){activeDraftId=id;refreshDraftCount();toast("Encargo guardado en este dispositivo.");}
  }
  function renderDrafts() {
    const all=safeDrafts().sort((a,b)=>b.updated.localeCompare(a.updated));
    $("draftsList").replaceChildren();
    if(!all.length) {
      const empty=document.createElement("div");empty.className="empty-state";
      empty.textContent="Todavía no has guardado encargos. Configura el primero y pulsa «Guardar borrador».";
      $("draftsList").append(empty);return;
    }
    all.forEach(row=>{
      const item=document.createElement("article");item.className="draft-item";
      const title=document.createElement("strong");title.textContent=row.title||"Encargo";
      const meta=document.createElement("span");meta.className="meta";
      const date=new Date(row.updated);
      meta.textContent=isNaN(date.getTime())?"Guardado":date.toLocaleString("es-ES");
      const actions=document.createElement("div");actions.className="buttons";
      const open=document.createElement("button");open.type="button";open.className="btn btn-primary";open.textContent="Abrir";
      open.addEventListener("click",()=>{activeDraftId=row.id;applyData(row.data);closeDrafts();toast("Encargo cargado.");});
      const exportBtn=document.createElement("button");exportBtn.type="button";exportBtn.className="btn btn-secondary";exportBtn.textContent="Descargar";
      exportBtn.addEventListener("click",()=>{
        const current=getData();const currentId=activeDraftId;
        applyData(row.data);
        const value=requestContent();
        if(value){downloadText(filename(value.data),value.text);toast(".md descargado.");}
        applyData(current);activeDraftId=currentId;
      });
      const erase=document.createElement("button");erase.type="button";erase.className="btn btn-ghost";erase.textContent="Eliminar";
      erase.setAttribute("aria-label","Eliminar "+(row.title||"encargo"));
      erase.addEventListener("click",()=>{
        const next=safeDrafts().filter(x=>x.id!==row.id);
        if(persistDrafts(next)){if(activeDraftId===row.id)activeDraftId=null;renderDrafts();refreshDraftCount();}
      });
      actions.append(open,exportBtn,erase);item.append(title,meta,actions);$("draftsList").append(item);
    });
  }
  function openDrafts() {
    renderDrafts();$("draftsPanel").hidden=false;$("drawerBackdrop").hidden=false;
    $("closeDrafts").focus();document.body.style.overflow="hidden";
  }
  function closeDrafts() {
    $("draftsPanel").hidden=true;$("drawerBackdrop").hidden=true;
    document.body.style.overflow="";$("openDrafts").focus();
  }
  function setConnectivity() {
    $("connectivity").textContent=navigator.onLine?"Local":"Sin conexión";
  }

  function initialize() {
    selectOptions($("house"),Object.keys(HOUSES).map(key=>[key,HOUSES[key].label]));
    const saved=(()=>{try{return JSON.parse(localStorage.getItem(FORM_KEY)||"null");}catch(_){return null;}})();
    if(saved && HOUSES[saved.house] && SUBJECTS[saved.kind]) applyData(saved);
    else {populatePlaces("treskal");populateSubjects("aldea");render();}
    refreshDraftCount();setConnectivity();

    document.querySelectorAll('input[name="assetKind"]').forEach(node => {
      node.addEventListener("change",()=>{populateSubjects();render();});
    });
    document.querySelectorAll('input[name="mode"]').forEach(node => node.addEventListener("change",render));
    $("house").addEventListener("change",()=>{populatePlaces();render();});
    $("place").addEventListener("change",render);
    $("subject").addEventListener("change",render);
    $("requestForm").addEventListener("input",render);
    $("requestForm").addEventListener("change",render);
    $("extraBible").addEventListener("change",()=>{
      const key=$("extraBible").value;
      if(key && BIBLES[key] && !extraBibles.includes(key)){extraBibles.push(key);render();}
    });

    $("requestForm").addEventListener("submit",e=>{
      e.preventDefault();const value=requestContent();if(!value)return;
      downloadText(filename(value.data),value.text);toast("Encargo .md descargado. Adjunta el archivo en ChatGPT.");
    });
    $("copyBtn").addEventListener("click",async()=>{
      const value=requestContent();if(!value)return;
      try {
        if(!navigator.clipboard || !navigator.clipboard.writeText)throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(value.text);toast("Encargo copiado. Pégalo en ChatGPT.");
      }catch(_){toast("El portapapeles no está disponible. Usa «Descargar encargo .md».");}
    });
    $("saveBtn").addEventListener("click",saveDraft);
    $("openDrafts").addEventListener("click",openDrafts);
    $("closeDrafts").addEventListener("click",closeDrafts);
    $("drawerBackdrop").addEventListener("click",closeDrafts);
    $("newRequest").addEventListener("click",()=>{
      activeDraftId=null;$("requestForm").reset();extraBibles=[];
      $("house").value="valrik";populatePlaces("treskal");setRadio("assetKind","exterior");populateSubjects("aldea");
      render();closeDrafts();toast("Nuevo encargo.");
    });
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape" && !$("draftsPanel").hidden)closeDrafts();
    });
    window.addEventListener("online",setConnectivity);
    window.addEventListener("offline",setConnectivity);

    if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost")) {
      window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
    }
  }

  // Export of deterministic document generator for portable unit tests; no user data is transmitted.
  if(typeof window!=="undefined") window.NAF_TEST_API={markdown,validate,requiredBibleKeys,currentPlaceLabel,currentSubjectLabel};
  initialize();
})();