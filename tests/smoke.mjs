import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

function fakeElement(id) {
  const handlers = {};
  const element = {
    id, value:"", textContent:"", checked:false, disabled:false, dataset:{},
    options:[], children:[], style:{},
    classList:{ toggle(){}, remove(){}, add(){} },
    setAttribute(){}, addEventListener(event,fn){handlers[event]=fn;},
    dispatch(event){handlers[event]?.();},
    append(...x){this.children.push(...x);},
    replaceChildren(...x){
      this.children=x;this.options=x;
      if(["place","subject"].includes(id))this.value=x[0]?.value||"";
    },
    remove(){}, scrollIntoView(){}, click(){}
  };
  Object.defineProperty(element,"selectedOptions",{get(){
    return element.options.filter(option=>option.value===element.value);
  }});
  return element;
}
function app() {
  const ids=[...new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]))];
  const nodes=Object.fromEntries(ids.map(id=>[id,fakeElement(id)]));
  ["time","weather","season","scale","population","camera"].forEach(id=>nodes[id].value="auto");
  nodes.house.value="valrik";
  const kinds=["exterior","interior","portrait"].map(id=>{const b=fakeElement(id);b.dataset.kind=id;return b;});
  const modes=["new","variant"].map(id=>{const b=fakeElement(id);b.dataset.mode=id;return b;});
  const advanced={open:false};
  const document={
    getElementById:id=>nodes[id],createElement:tag=>fakeElement(tag),
    querySelectorAll:selector=>selector==="[data-kind]"?kinds:modes,
    querySelector:()=>advanced,body:{appendChild(){}}
  };
  const storage=new Map();
  const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
  const window={};
  const context={
    document,localStorage,window,navigator:{},location:{protocol:"file:"},
    URL:{createObjectURL:()=> "blob:test",revokeObjectURL(){}},
    Blob:class{constructor(values){this.contents=values.join("");}},
    setTimeout(){},confirm:()=>true,Date
  };
  vm.runInNewContext(js,context,{filename:"app.js"});
  return {api:window.NAF,nodes,kinds,modes};
}
test("interfaz, favicon y media queries para dispositivos",()=>{
  assert.match(html,/favicon\.svg/);
  assert.match(html,/viewport-fit=cover/);
  assert.match(css,/@media \(max-width:699px\)/);
  assert.match(css,/@media \(min-width:700px\) and \(max-width:1059px\) and \(orientation:portrait\)/);
  assert.match(css,/orientation:landscape.*max-height:560px/);
});
test("solicitud exterior Valrik/Treskal: NAP v2 y cinco nombres",()=>{
  const x=app().api.request();
  assert.equal(x.asset_type,"scene");
  assert.equal(x.production_profile,"scene_environment");
  assert.equal(x.nap_output.classification.location,"treskal");
  assert.deepEqual(Array.from(x.nap_output.master_size),[1920,1080]);
  assert.equal(x.nap_output.zip_contents.length,5);
});
test("retratos con rol y sexo obligatorios",()=>{
  const a=app();a.kinds[2].dispatch("click");
  assert.throws(()=>a.api.request(),/sexo/);
  a.nodes.portraitSex.value="female";
  const x=a.api.request();
  assert.equal(x.production_profile,"portrait_npc");
  assert.equal(x.nap_output.classification.sex,"female");
  assert.equal(x.nap_output.classification.role,"villager");
  assert.deepEqual(Array.from(x.nap_output.master_size),[768,960]);
  assert.ok(x.visual_bibles.paths.some(p=>p.includes("NPC_PORTRAIT")));
});
test("taberna en Rodas y biblia local Edranor",()=>{
  const a=app();a.kinds[1].dispatch("click");
  a.nodes.house.value="edranor";a.nodes.house.dispatch("change");
  a.nodes.subject.value="taberna";
  const x=a.api.request();
  assert.equal(x.geography.location,"rodas");
  assert.equal(x.focus.label,"Taberna");
  assert.ok(x.visual_bibles.paths.some(p=>p.includes("EDRANOR_ENVIRONMENT")));
});
test("variante con identidad separada; formato NAP y archivo markdown",()=>{
  const a=app();a.modes[1].dispatch("click");
  a.nodes.referenceId.value="scene_treskal_tavern_001";
  assert.equal(a.api.request().reference_asset_id,"scene_treskal_tavern_001");
  a.nodes.preferredId.value="scene_treskal_tavern_001";
  assert.throws(()=>a.api.request(),/ID nuevo/);
  a.nodes.preferredId.value="scene_treskal_tavern_002";
  assert.match(a.api.markdown(),/~~~json/);
  assert.match(a.api.markdown(),/schema_version/);
});
test("localidad personalizada y límites de NAP",()=>{
  const a=app();a.nodes.place.value="other";
  assert.throws(()=>a.api.request(),/localización/);
  a.nodes.customPlace.value="Villa del Río";
  assert.equal(a.api.request().geography.location,"villa_del_rio");
  a.nodes.customPlace.value="a".repeat(65);
  assert.throws(()=>a.api.request(),/64 caracteres/);
});
