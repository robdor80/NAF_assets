# NAF · Nexus Asset Forge

**NAF v0.5** es una web estática RobStyle para preparar solicitudes de imágenes de **Nimroel RPG**. No genera imágenes: crea archivos Markdown `.md` para entregar a ChatGPT. Funciona sin cuentas, backend ni API, desde Windows, tablet Android y móvil. La página es local-first y guarda el formulario actual en el propio navegador.

**Web:** https://robdor80.github.io/NAF_assets/

## Las tres opciones de la pantalla

### 1. Imagen única

Selecciona **Imagen única**, elige escena exterior, interior o retrato, territorio, lugar, categoría (aldea, posada, taberna, tienda, herrería, carpintería, profesión, etc.), ambiente y notas. Descarga **un único `.md`**.

### 2. Variante de una imagen existente

Selecciona **Variante**, carga si lo deseas el `.md` original para recuperar todas sus opciones, **pega el asset ID original** que ChatGPT facilitó y cambia meteorología, hora, estación y notas. Puedes **elegir un PNG local para previsualizarlo**, pero la página **no lo envía a ChatGPT ni lo introduce en el Markdown**. Para conseguir fidelidad es necesario que el PNG original esté accesible en la conversación o adjuntarlo a ChatGPT al presentar el nuevo `.md`.

La solicitud generada contiene `identity_mode: "variant"`, `reference_asset_id`, `visual_production.relationship.base_asset_id`, grupo visual y reglas ambientales. Debe conservar edificios, caminos, perspectiva e identidad del lugar, adaptando el comportamiento de NPC y animales: tormentas y nevadas intensas vacían de actividad injustificada los exteriores, pero no hacen desaparecer al protagonista del retrato ni los clientes refugiados en un interior.

### 3. Lote

Selecciona **Lote**, elige la cantidad **2–12** (predeterminada: 5), el tipo de recurso y uno de los dos submodos.

- **Lugares diferentes:** por ejemplo, cinco posadas de Treskal, todas diferentes aunque con identidad cultural, profesión y estilo coherentes. La web propone detalles variados de dimensiones, distribución, desgaste, iluminación y actividad. `identity_mode` es `new` en todas, no `variant`. Comparten `batch_id` solo como **grupo temático de producción** y **no** comparten `visual_family_id`.
- **Vistas del mismo lugar:** por ejemplo, cinco imágenes de **una misma aldea** desde perspectivas distintas. La primera es panorámica aérea a 45° (oblicua, no cenital); después entrada, centro, calle lateral y un hito visible, adaptando los ángulos a interiores cuando corresponda. Todas comparten `visual_production.shared_location_visual_id`, y cada `.md` especifica su `view_role`. **No son variantes de meteorología**: cada vista tiene ID propio y `identity_mode: "new"`. A partir de la segunda, ChatGPT necesita la primera imagen aprobada y las vistas previas para mantener coherencia espacial. Sin esos PNG no debe prometer fidelidad exacta.

El botón principal descarga un **ZIP que contiene exactamente N archivos `.md`** (uno por imagen, sin imágenes ni manifest); además, cada elemento tiene botones para **descargar solo su `.md`** o copiarlo. Ese ZIP **NO es un paquete NAP**. Se entregan los Markdown a ChatGPT **de uno en uno**.

## Contrato de producción con ChatGPT

Para cada encargo, **no generar ZIP NAP por adelantado**:

1. Consultar biblias/canon en `robdor80/Videojuego_Nimroel`.
2. Generar **solo un PNG** maestro con dimensiones del perfil NAP, **mostrarlo y dar un ID candidato copiable al mismo tiempo**. Comprobar la no colisión con IDs conocidos; el nombre definitivo debe cumplir Naming v1.
3. Si la imagen **no gusta**, generar **otro PNG con otro ID candidato** y no reutilizar el rechazado.
4. Si se aprueba, **conservar el mismo ID del PNG aprobado**. Solo cuando el autor pida el paquete, preparar un **ZIP NAP individual** con cinco archivos planos:
   `<asset_id>.png`, `<asset_id>_manifest.json`, `<asset_id>_prompt.md`, `<asset_id>_info.md`, `<asset_id>_visual_identity.json`.
5. Manifest v2 tiene **seis claves raíz exactas**. Las relaciones de variantes, vistas y lotes se conservan en el companion `_visual_identity.json`, **no como propiedades raíz del manifest**. NAP archiva el PNG original, genera WebP de producción y registra el recurso al importarlo.

No se alteran rutas físicas de NAP. Más adelante, un proceso controlado **copiará** los WebP aprobados al juego Godot y elaborará un índice de relación para CoreRPG/Godot, sin mover ni borrar los originales.

## Compatibilidad y seguridad

- Los `.md` originales de NAF v0.1–v0.4 y los `.md` individuales v0.5 pueden cargarse en el formulario. Al importar un lote antiguo v0.4 se recuperan su base, cantidad y tipo de lote de manera aproximada; **los estados de seguimiento anteriores no se muestran ni gestionan**. La web no es un gestor de producción.
- El borrador actual se almacena en `localStorage` (`naf_draft_v05`). Para trasladar una solicitud entre dispositivos, guarda su archivo `.md`.
- Los PNG seleccionados en el navegador solo se previsualizan localmente mediante URL temporal: no se suben, ni se guardan como borrador.
- Sin dependencias JavaScript externas; ZIP de Markdown generado localmente con el formato ZIP estándar sin compresión.
- Los formularios utilizan únicamente opciones conocidas de Nimroel y referencias a las biblias visuales en GitHub; no inventan un nombre para una aldea procedural de CoreRPG.

## Pruebas

`node --test tests/smoke.mjs`

Las pruebas incluyen los tres modos, Naming/Manifest NAP, regresión de `.md` antiguos, coherencia de meteorología, lotes independientes, perspectivas de la misma aldea, generación ZIP de Markdown y restauración del formulario. Ninguna prueba simula que NAF genere imágenes.

## Fuentes de los contratos

- `robdor80/NAP/docs/NAMING_V1.md`
- `robdor80/NAP/docs/MANIFEST_V2.md`
- `robdor80/NAP/config/universes/nimroel/profile.json`
- `robdor80/Videojuego_Nimroel/Worldbuilding/Direccion artistica/Biblia visual/`

