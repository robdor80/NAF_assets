import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";

const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const js=readFileSync(new URL("../app.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");

function fakeElement(id){
  const handlers={};
  return {
    id,value:"",textContent:"",checked:false,disabled:false,src:"",
    dataset:{},options:[],children:[],files:[],style:{},
    classList:{toggle(){},add(){},remove(){}},
    setAttribute(){},addEventListener(event,fn){handlers[event]=fn;},
    dispatch(event){handlers[event]?.();},
    append(...nodes){this.children.push(...nodes);},
    replaceChildren(...nodes){this.children=nodes;this.options=nodes;if(["place","subject"].includes(id))this.value=nodes[0]?.value||"";},
    remove(){},click(){this.dispatch("click");},select(){},
    get selectedOptions(){return this.options.filter(item=>item.value===this.value);}
  };
}
class MockBlob{
  constructor(parts,options={}){this.parts=parts;this.type=options.type||"";}
}
function app(storageOverride){
  const ids=[...new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]))];
  const nodes=Object.fromEntries(ids.map(id=>[id,fakeElement(id)]));
  for(const match of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
    const opts=[...match[2].matchAll(/<option(?: value="([^"]*)")?([^>]*)>([\s\S]*?)<\/option>/g)];
    nodes[match[1]].options=opts.map(m=>({value:m[1]??m[3],textContent:m[3]}));
    const selected=opts.find(m=>/\bselected\b/.test(m[2]));
    nodes[match[1]].value=(selected?.[1]||nodes[match[1]].options[0]?.value)||"";
  }
  nodes.house.value="valrik";
  const kinds=["exterior","interior","portrait"].map(id=>{const b=fakeElement(id);b.dataset.kind=id;return b;});
  const workflows=["single","variant","lot"].map(id=>{const b=fakeElement(id);b.dataset.workflow=id;return b;});
  const lotTypes=["independent","views"].map(id=>{const b=fakeElement(id);b.dataset.lotType=id;return b;});
  const advanced={open:false};
  const document={
    getElementById:id=>nodes[id],
    createElement:tag=>fakeElement(tag),
    querySelectorAll:selector=>selector==="[data-kind]"?kinds:selector==="[data-workflow]"?workflows:lotTypes,
    querySelector:()=>advanced,
    body:{appendChild(){}},
    execCommand:()=>true
  };
  const storage=storageOverride||new Map();
  const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val),removeItem:key=>storage.delete(key)};
  const window={};
  const context={
    window,document,localStorage,navigator:{clipboard:{writeText:async()=>{}}},location:{protocol:"file:"},
    URL:{createObjectURL:()=> "blob:naf-test",revokeObjectURL(){}},
    Blob:MockBlob,TextEncoder,Date,Math,setTimeout(){},confirm:()=>true
  };
  vm.runInNewContext(js,context,{filename:"app.js"});
  return {api:window.NAF,nodes,kinds,workflows,lotTypes,storage};
}
function load(data){return "# NAF\n~~~json\n"+JSON.stringify(data,null,2)+"\n~~~\n";}

test("3 modos sencillos sin estados de producción v0.4",()=>{
  assert.equal((html.match(/data-workflow=/g)||[]).length,3);
  assert.doesNotMatch(html,/id="batchProgress"|id="batchItems"|data-batch=/);
  assert.match(html,/data-lot-type="independent"/);
  assert.match(html,/data-lot-type="views"/);
  assert.match(html,/id="referenceImageFile"/);
  assert.match(html,/id="loadFile"[^>]*hidden/);
});
test("diseño responsive conserva tablet, móvil y paisaje",()=>{
  assert.match(html,/viewport-fit=cover/);
  assert.match(css,/@media \(max-width:699px\)/);
  assert.match(css,/@media \(min-width:700px\) and \(max-width:1059px\) and \(orientation:portrait\)/);
  assert.match(css,/orientation:landscape.*max-height:560px/);
  assert.match(css,/\.workflow-mode.is-active/);
});
test("imagen única exterior: clasificación territorial y PNG 1920x1080",()=>{
  const a=app(),req=a.api.request();
  assert.equal(a.api.getState().workflow,"single");
  assert.equal(req.identity_mode,"new");
  assert.equal(req.nap_output.classification.location,"valrik");
  assert.equal(req.geography.naming_authority,"CoreRPG");
  assert.deepEqual(Array.from(req.nap_output.master_size),[1920,1080]);
  assert.equal(req.nap_output.zip_contents.length,5);
  assert.match(a.api.markdown(),/SOLO UNA IMAGEN/);
  assert.match(a.api.markdown(),/ID CANDIDATO copiable/);
});
test("retratos con sexo y edad, 4:5 y biblia de retratos",()=>{
  const a=app();a.kinds[2].dispatch("click");
  assert.throws(()=>a.api.request(),/sexo/);
  a.nodes.portraitSex.value="female";a.nodes.portraitAge.value="25-30";
  const q=a.api.request();
  assert.equal(q.asset_type,"portrait");
  assert.equal(q.nap_output.classification.sex,"female");
  assert.deepEqual(Array.from(q.nap_output.master_size),[768,960]);
  assert.ok(q.visual_bibles.paths.some(p=>p.includes("NPC_PORTRAIT")));
});
test("interiores de taberna, posada, herrería, tienda y carpintería",()=>{
  const a=app();a.kinds[1].dispatch("click");
  for(const name of ["taberna","posada","herrería","tienda","carpintería"]){
    // Los identificadores son ASCII snake_case incluso con acentos.
    a.nodes.subject.value=name==="herrería"?"herreria":name==="carpintería"?"carpinteria":name;
    const q=a.api.request();assert.equal(q.category,"interior");assert.equal(q.asset_type,"scene");
  }
});
test("las variantes importan .md, aceptan ID original y conservan relación estructurada",async()=>{
  const initial=app(),md=initial.api.markdown();
  const a=app();
  assert.equal(await a.api.loadMDFile({name:"origen.md",size:md.length,text:async()=>md}),true);
  a.workflows[1].dispatch("click");
  a.nodes.referenceId.value="scene_valrik_village_001";
  a.nodes.weather.value="lluvia_intensa";
  const q=a.api.request();
  assert.equal(q.identity_mode,"variant");
  assert.equal(q.reference_asset_id,"scene_valrik_village_001");
  assert.equal(q.visual_production.relationship.base_asset_id,"scene_valrik_village_001");
  assert.equal(q.visual_production.original_png_required,true);
  assert.match(a.api.markdown(),/PNG original/);
});
test("variante sin ID o con el mismo ID propuesto se rechaza",()=>{
  const a=app();a.workflows[1].dispatch("click");
  assert.throws(()=>a.api.request(),/ID de referencia/);
  a.nodes.referenceId.value="scene_valrik_entrada_001";
  a.nodes.preferredId.value="scene_valrik_entrada_001";
  assert.throws(()=>a.api.request(),/ID nuevo/);
});
test("lluvia fuerte y nieve no conservan NPC y animales trabajando",()=>{
  const a=app();a.nodes.weather.value="lluvia_intensa";
  assert.match(a.api.request().visual_production.activity_coherence,/SIN NPC ni animales/);
  a.nodes.weather.value="nieve";
  assert.match(a.api.request().visual_production.activity_coherence,/SIN NPC ni animales/);
  a.kinds[1].dispatch("click");
  assert.match(a.api.request().visual_production.activity_coherence,/NO vaciar automáticamente/);
});
test("solo tras aprobar PNG se permite ZIP; rechazo exige nuevo PNG y nuevo ID",()=>{
  const md=app().api.markdown();
  assert.match(md,/RECHAZA el PNG/);
  assert.match(md,/OTRO PNG con OTRO ID CANDIDATO/);
  assert.match(md,/ÚNICAMENTE con aprobación explícita/);
  assert.match(md,/ZIP individual de NAP/);
  assert.match(md,/NO incluir WebP/);
});
test("lote de 5 posadas: cinco archivos independientes, mismo tema, diferencias lógicas",()=>{
  const a=app();a.kinds[1].dispatch("click");
  a.nodes.subject.value="posada";a.nodes.place.value="treskal";
  a.workflows[2].dispatch("click");
  const result=a.api.lotRequests();
  assert.equal(result.items.length,5);
  assert.equal(result.batch_type,"independent");
  assert.ok(result.items.every(q=>q.focus.label==="Posada"));
  assert.ok(result.items.every(q=>q.identity_mode==="new"&&q.reference_asset_id===null));
  assert.ok(result.items.every(q=>q.visual_production.visual_family_id===null));
  assert.equal(new Set(result.items.map(q=>q.free_description)).size,5);
  assert.match(a.api.lotMarkdown(0),/TEMÁTICO/);
  assert.match(a.api.lotMarkdown(1),/IMAGEN INDEPENDIENTE 2/);
});
test("lote de vistas: primera panorámica aérea 45 grados, entrada, centro y puntos posteriores",()=>{
  const a=app();a.workflows[2].dispatch("click");a.lotTypes[1].dispatch("click");
  const result=a.api.lotRequests();
  assert.equal(result.batch_type,"views");
  assert.equal(result.items.length,5);
  assert.match(result.items[0].appearance.camera,/45°/);
  assert.match(result.items[0].appearance.camera,/NUNCA cenital/);
  assert.match(result.items[1].appearance.camera,/Entrada/);
  assert.match(result.items[2].appearance.camera,/Centro/);
  assert.equal(new Set(result.items.map(q=>q.visual_production.shared_location_visual_id)).size,1);
  assert.equal(result.items[0].visual_production.coherence.reference_image_position,null);
  assert.equal(result.items[1].visual_production.coherence.reference_image_position,1);
  assert.match(a.api.lotMarkdown(1),/PNG de la primera vista aprobada/);
});
test("lote mismo interior conserva arquitectura y no exige vuelo de 45 grados",()=>{
  const a=app();a.kinds[1].dispatch("click");a.workflows[2].dispatch("click");a.lotTypes[1].dispatch("click");
  assert.match(a.api.lotRequests().items[0].appearance.camera,/Vista general amplia/);
  assert.doesNotMatch(a.api.lotRequests().items[0].appearance.camera,/aérea/);
});
test("lote de retratos mantiene persona diferente cuando son independientes",()=>{
  const a=app();a.kinds[2].dispatch("click");a.nodes.portraitSex.value="male";
  a.workflows[2].dispatch("click");
  const q=a.api.lotRequests().items;
  assert.ok(q.every(x=>x.nap_output.classification.sex==="male"));
  assert.ok(q.every(x=>x.visual_production.coherence.same_physical_place===false));
  assert.equal(new Set(q.map(x=>x.free_description)).size,5);
});
test("cada solicitud de lote es una imagen y lleva índice temático",()=>{
  const a=app();a.workflows[2].dispatch("click");
  const md=a.api.lotMarkdown(3);
  assert.match(md,/Imagen 4 de 5/);
  assert.match(md,/"batch_index": 4/);
  assert.match(md,/"batch_total": 5/);
  assert.match(md,/SOLO UNA IMAGEN/);
  assert.doesNotMatch(md,/### Imagen 05/);
});
test("cantidad de lote personalizable y límites 2 a 12",()=>{
  const a=app();a.workflows[2].dispatch("click");
  a.nodes.lotCount.value="2";assert.equal(a.api.lotRequests().items.length,2);
  a.nodes.lotCount.value="12";assert.equal(a.api.lotRequests().items.length,12);
  a.nodes.lotCount.value="13";assert.throws(()=>a.api.lotRequests(),/2 y 12/);
});
test("ZIP de cinco .md con 5 entradas, local headers y directorio central",()=>{
  const a=app();a.workflows[2].dispatch("click");
  const q=a.api.lotRequests();
  const zip=a.api.zipMarkdowns(q.items.map((item,i)=>({name:"lote_"+(i+1)+".md",text:a.api.makeMarkdown(item)})));
  const bytes=Buffer.concat(zip.parts.map(p=>Buffer.from(p)));
  assert.equal(bytes.readUInt32LE(0),0x04034b50);
  const end=bytes.length-22;assert.equal(bytes.readUInt32LE(end),0x06054b50);
  assert.equal(bytes.readUInt16LE(end+10),5);
  assert.equal(bytes.readUInt16LE(end+8),5);
  assert.equal(bytes.readUInt32LE(end+12)>0,true);
});
test("cargar solicitud antigua NAF v0.3-v0.4 sigue funcionando",async()=>{
  const a=app(),base=a.api.request();
  delete base.visual_production;
  const b=app(),md=load(base);
  assert.equal(await b.api.loadMDFile({name:"naf_older.md",size:md.length,text:async()=>md}),true);
  assert.equal(b.api.request().geography.house,"valrik");
});
test("cargar lote NAF v0.4 recupera campos comunes sin reactivar seguimiento",async()=>{
  const a=app();const base=a.api.request();
  const legacy={naf_batch_schema_version:1,kind:"lote_de_solicitudes_no_paquete_nap",universe_id:"nimroel",
    batch:{mode:"distinct",title:"Viejo lote"},base,items:[{request:base},{request:base}]};
  const b=app(),md=load(legacy);
  assert.equal(await b.api.loadMDFile({name:"antiguo_lote.md",size:md.length,text:async()=>md}),true);
  assert.equal(b.api.getState().workflow,"lot");
  assert.equal(b.api.lotRequests().items.length,2);
});
test("borrador conserva modo de trabajo y datos en el mismo dispositivo",()=>{
  const storage=new Map(),a=app(storage);
  a.kinds[1].dispatch("click");a.nodes.subject.value="posada";
  a.nodes.lotCount.value="6";a.nodes.lotTitle.value="Posadas de Treskal";
  a.workflows[2].dispatch("click");a.lotTypes[1].dispatch("click");
  a.nodes.lotTitle.dispatch("input");
  const b=app(storage);
  assert.equal(b.api.getState().workflow,"lot");
  assert.equal(b.api.getState().lotType,"views");
  assert.equal(b.api.lotRequests().items.length,6);
});
test("markdown de un lote se puede recargar como imagen individual",async()=>{
  const a=app();a.workflows[2].dispatch("click");
  const md=a.api.lotMarkdown(0),b=app();
  assert.equal(await b.api.loadMDFile({name:"lote_01.md",size:md.length,text:async()=>md}),true);
  assert.equal(b.api.getState().workflow,"single");
  assert.equal(b.api.request().asset_type,"scene");
});
test("markdown variante se puede recargar conservando ID",async()=>{
  const a=app();a.workflows[1].dispatch("click");a.nodes.referenceId.value="scene_valrik_village_001";
  const md=a.api.markdown(),b=app();
  assert.equal(await b.api.loadMDFile({name:"variante.md",size:md.length,text:async()=>md}),true);
  assert.equal(b.api.getState().workflow,"variant");
  assert.equal(b.api.request().reference_asset_id,"scene_valrik_village_001");
});
test("el .md no incluye píxeles ni necesita comunicación con servidor",()=>{
  const a=app();a.workflows[1].dispatch("click");a.nodes.referenceId.value="scene_valrik_village_001";
  const md=a.api.markdown();
  assert.doesNotMatch(md,/data:image\/png;base64/);
  assert.match(md,/Si no está accesible, solicitar/);
  assert.doesNotMatch(js,/fetch\(|XMLHttpRequest/);
});
test("rechazo de .md no NAF no destruye el borrador",async()=>{
  const a=app();a.nodes.notes.value="Mi descripción";
  assert.equal(await a.api.loadMDFile({name:"otro.md",size:2,text:async()=>"# hola"}),false);
  assert.equal(a.nodes.notes.value,"Mi descripción");
});
