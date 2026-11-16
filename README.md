# NAF assets — Nexus Asset Forge

**NAF v0.4** es una web estática RobStyle para preparar **solicitudes de generación de imágenes** del videojuego Nimroel RPG. Funciona en MSI (horizontal), Samsung Galaxy Tab S9+ (vertical y horizontal) y Realme GT Neo 2 (solo vertical). No requiere backend, claves de API ni Python.

## NAF v0.4 — Producción secuencial y seguimiento del lote

NAF sigue siendo un planificador local de solicitudes `.md`, NO genera PNG ni ZIP. Un lote puede contener hasta 12 imágenes, pero la producción se hace **de una en una**.

Cada tarjeta del bloque 05/06 permite:
- **Descargar esta imagen .md** o **Copiar solicitud**: emite un único encargo con su posición, `batch_id`, `visual_family_id`, identidad visual, meteorología e instrucciones de NPC/animales. No solicita imágenes adicionales.
- Cambiar su estado manual: **Pendiente, En preparación, PNG generado, Aprobada, Descartada, ZIP entregado**. Para aprobar se confirma que el PNG está disponible; para marcar ZIP entregado se exige aprobación previa, PNG y un ID definitivo válido y único.
- Pegar **ID definitivo tras aprobación**, proporcionado por ChatGPT. NAF no infiere el ID a partir del nombre del `.md`.
- Marcar **PNG disponible para ChatGPT**, una confirmación del autor, no una subida. Para una variante fiel, el PNG original debe estar accesible en ChatGPT o adjuntarse de nuevo.
- Consultar el progreso de aprobaciones y ZIP entregados. Los estados son declaraciones locales del autor y no implican verificación real de NAP.

**Dependencias:** cuando el lote crea una imagen base nueva, sus variantes quedan bloqueadas hasta que la base esté aprobada, tenga ID real y PNG disponible. Al emitir el `.md` individual de la variante se introduce el ID de la base, sin inventarlo. Si se usa una imagen anterior, se debe pegar su ID y confirmar el PNG original.

**Continuidad:** se conserva el seguimiento al alternar de lote a una imagen individual y regresar. Cambiar tipo de lote o procedencia con producción iniciada requiere confirmación porque puede reiniciar el progreso. Se protege el ID de una base con variantes ya iniciadas.

**Recuperación:** **Guardar lote y seguimiento .md** incluye el plan y los campos `progress.status`, `progress.asset_id`, `progress.png_available` y el indicador del PNG de origen. Puede abrirse con **Cargar solicitud .md** en MSI, tablet o móvil. Los borradores siguen en almacenamiento local por dispositivo. Los `.md` antiguos de NAF siguen siendo compatibles.

Flujo oficial: **PNG individual → revisión del autor → aprobación explícita → ID copiable → ZIP individual de cinco archivos**. Ni NAF ni el nuevo seguimiento modifican Manifest v2, rutas NAP, CoreRPG o canon.

## NAF v0.3 — Lotes, familias y variantes aprobadas

### Trabajo con un asset ya generado

1. Cargar desde **NAF** el archivo `.md` original para recuperar el encargo.
2. Elegir **Variar imagen NAP** y **pegar manualmente el ID real** entregado por ChatGPT tras la aprobación. El nombre del `.md` no sirve como ID del PNG.
3. Ajustar clima, hora, estación o instrucciones. Descargar otro `.md` con `reference_asset_id`. La imagen original PNG debe estar disponible en la conversación o adjuntarse a ChatGPT: el ID no contiene los píxeles.
4. ChatGPT genera primero el **PNG para revisión**. Solo tras la **aprobación expresa del autor** asigna/comunica el nuevo ID (para copiar) y entrega el **ZIP individual de NAP**. Nunca altera el ID de la imagen anterior.

### Coherencia climática (regla de generación)

En exteriores con **lluvia intensa, tormenta, nieve o ventisca**, la acción habitual de NPC y animales a la intemperie **NO** se copia desde una imagen despejada. Por defecto se despejan calles y caminos, salvo actividades imprescindibles, refugios y protecciones físicamente coherentes. Lluvia ligera reduce actividad desprotegida; noche cambia horarios y luces. En un **retrato** NO desaparece el personaje; en un **interior** la lluvia exterior NO vacía automáticamente una taberna. Se incluyen reglas específicas tanto en solicitudes individuales como en las de lote.

### Lotes de hasta 12 imágenes

En el bloque **05 — Producción por lotes**:

- **Una imagen**: exporta una solicitud NAF individual compatible con `.md` antiguos.
- **Misma escena**: es una *familia visual*. Se puede **crear la primera imagen base** y, tras aprobarla, generar las variantes; o **partir de una imagen aprobada**, pegando su ID. Cada variante puede seleccionar clima, hora, estación e instrucciones propias. Un `visual_family_id` solo agrupa visualmente, **no es un nombre de aldea CoreRPG**.
- **Imágenes distintas**: produce escenas independientes (por ejemplo tres tabernas con arquitectura distinta), cada una con su propio `visual_family_id`; el `batch_id` solo relaciona el encargo común.
- El `.md` exporta un **plan de lote completo** (bloque JSON `naf_batch_schema_version: 1`, `base` e `items`). Puede **recargarse y editarse** en NAF. Los lotes y campos se guardan localmente en el navegador.
- **No se produce un ZIP multipaquete**. Cada imagen aprobada se empaqueta por separado con los cinco archivos válidos para NAP. Las pendientes/rechazadas no se importan ni generan registros SQLite.

**Orden con base nueva:** imagen base → revisión del autor → aprobación → ID + ZIP de la base → variantes que referencian el ID y PNG de la base → revisión/ID/ZIP individual de cada variante. No se inventa un `reference_asset_id` provisional: en las variantes dependientes, `pending_reference_from_batch_position: 1` señala la dependencia.

### Qué entiende NAP de los grupos

El perfil vigente `robdor80/NAP/config/universes/nimroel/profile.json` determina el destino de escenas como `scenes/environment/<culture>/<location>/<asset_id>/` y de retratos como `portraits/<culture>/<location>/<role>/<sex>/<asset_id>/`. El nombre del ZIP coincide con el asset ID, pero **la clasificación para el enrutamiento procede del manifest**. Los datos de lote/familia/referencia solo deben ir en `_visual_identity.json` (y documentación auxiliar si procede), **nunca como claves raíz extra del manifest v2**. NAP puede conservar esos campos como rasgos, pero no se presume que implemente por sí mismo deduplicación de familias o jerarquías visuales.

No hay API, sincronización entre dispositivos ni instalación de dependencias. Los borradores se guardan en el dispositivo donde se editan; pasar el `.md` entre dispositivos es explícito. Esta versión no genera imágenes ni ZIP desde el navegador.

## Actualización v0.2 — Nombres de CoreRPG y solicitudes reutilizables

- **Localización procedural sin nombre (opción inicial):** no hay que bautizar aldeas, pueblos ni habitantes. CoreRPG decide nombre, identidad y distribución de cada instancia en el videojuego. El nombre propio solo se solicita cuando el autor elige expresamente «Lugar concreto con nombre».
- Para imágenes genéricas, NAP sigue requiriendo `classification.location`: NAF usa **el ID del territorio** (ej. `valrik`) como contenedor de catálogo. Esto no crea una aldea llamada Valrik ni registra instancia de CoreRPG. El `.md` incluye `procedural_template: true`, `instance_id: null` y `naming_authority: "CoreRPG"`.
- **Cargar solicitud .md:** botón en el bloque 01 para importar un encargo NAF anterior, recuperar sus campos, cambiar ambiente o escenario y guardar otro `.md`. Funciona sin conexión, con archivos del móvil y del PC, incluidos los `.md` de NAF v0.1. Acepta únicamente solicitudes NAF válidas, no cualquier Markdown ni ZIP.
- **Variar imagen NAP:** opción independiente. Exige el ID real del recurso generado (por ejemplo `scene_valrik_aldea_approach_001`). **El nombre del archivo `naf_...md` NO es un asset_id**. Cargar el `.md` restaura la solicitud, pero no inventa el ID del PNG producido después.
- El borrador en `localStorage` se restaura al abrir de nuevo la aplicación (corregida inicialización que lo sobrescribía).

## Qué hace

1. Eliges **exterior**, **interior** o **retrato**.
2. Decides si quieres crear una **imagen nueva** o una **variante de una imagen ya producida en NAP** (con ID real); también puedes **cargar una solicitud .md previa para editarla**, sin ID de imagen.
3. Seleccionas territorio (Valrik, Darovan, Gldren, Edranor, Aethros), **localización sin nombre (por defecto, para material procedural)** o lugar concreto conocido, tipo de escenario o profesión, hora, clima, estación y descripción libre.
4. Opcionalmente ajustas tamaño, ocupación, encuadre, edad, sexo, ID tentativo y biblias visuales. Las biblias básicas no se pueden quitar.
5. Pulsas **Descargar solicitud .md** o **Copiar texto**. La solicitud conserva datos estructurados y referencias canónicas para entregarla a ChatGPT.

La web **NO crea imágenes ni ZIP de NAP**: solo genera el encargo. ChatGPT consulta las biblias, escribe el prompt definitivo, genera la imagen y crea los cinco archivos del ZIP. El usuario descarga el ZIP y lo introduce en NAP. **El registro en SQLite solo es real después de la importación por NAP**.

## Protocolo NAP: contrato comprobado

Referencias en `robdor80/NAP`:

- `config/universes/nimroel/profile.json`
- `docs/MANIFEST_V2.md`
- `docs/NAMING_V1.md`

| Tipo NAF | asset_type | production_profile | PNG maestro |
| --- | --- | --- | --- |
| Escena exterior | scene | scene_environment | 1920 × 1080 |
| Escena interior | scene | scene_environment | 1920 × 1080 |
| Retrato | portrait | portrait_npc | 768 × 960 |

Cada ZIP final generado por ChatGPT deberá contener **cinco archivos en la raíz**, sin carpeta: `<asset_id>.png`, `<asset_id>_manifest.json`, `<asset_id>_prompt.md`, `<asset_id>_info.md` y `<asset_id>_visual_identity.json`. El manifest v2 tiene **seis** claves raíz: `schema_version`, `universe_id`, `asset_id`, `asset_type`, `production_profile`, `classification`. No se incluye WebP; NAP realiza la conversión.

El ID de NAP es único y debe terminar en sufijo `_001`…`_999`. Una variante nunca reutiliza el ID de referencia. La solicitud `.md` contiene propuestas y referencias, **no confirma la existencia ni la aprobación de un asset**.

## Biblias y localidades

La lista inicial de localidades procede de documentación comprobada del repo `robdor80/Videojuego_Nimroel`: Valrik → Treskal; Darovan → Treihord, Syvaris, Taramin y Veldora; Edranor → Rodas, Dorth, Karsath y Lumina. **Halhhei** se incluye en Gldren porque el autor lo ha solicitado, **pendiente de cotejar el canon**. Aethros y todos los territorios permiten introducir otra localización o dejarla por decidir. No se añaden edificios, geografía ni estilo cultural por defecto a la ficción.

Las biblias global y de Norgard son siempre base; se añade la de escenas o retratos según tipo y se seleccionan perfiles locales cuando corresponde. **Manual** significa añadir/ajustar otras fuentes sin retirar la base. Antes de producir, ChatGPT deberá comprobar el contenido real y la pertinencia de todas las biblias.

## Aspecto y dispositivos

Diseño basado en las variables RobStyle comprobadas en `robdor80/NAP/src/NAP.App/Themes/RobStyle.Colors.xaml`: petróleo `#05131A`, hielo `#EAF6F8`, azul claro `#B8D6DB` y verde suave `#9ED9C2`.

- MSI Raider GE78 HX: visualización horizontal con formulario ancho y resumen lateral.
- Galaxy Tab S9+: distribución adaptativa para pantalla horizontal y vertical, con campos grandes y áreas táctiles.
- Realme GT Neo 2: disposición vertical de una columna, campos táctiles y respeto de áreas seguras; en horizontal aparece el aviso para volver a vertical.

Los puntos de ruptura son de **píxeles CSS de viewport y orientación**, no de píxeles físicos, porque Android y Windows pueden aplicar escalado y densidad de pantalla. Incluye favicon SVG vectorial **sin fondo**, PWA instalable y guardado local del borrador mediante `localStorage`. Los datos del usuario no se transmiten a servidores por la aplicación.

## Desarrollo y despliegue

No hay dependencias ni compilación:

- Abre `index.html` en el navegador para una prueba local.
- Para acceder desde los tres dispositivos, publica la raíz de `main` mediante **GitHub Pages**: repositorio → Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
- Una vez activado Pages, la URL prevista es **https://robdor80.github.io/NAF_assets/**. **Esta dirección no se considera publicada hasta comprobar Pages**.
- En Android, una vez abierta la web por HTTPS, puedes instalarla desde el menú del navegador como aplicación web.

No hay llamadas de generación a ChatGPT desde esta web: la entrega del `.md` a la conversación es explícita. Las futuras funciones de historial/lotes/registro deberán respetar ese límite y el contrato NAP.

## Alcance de la primera entrega

Incluido: interfaz responsive, selección de categoría, identidad nueva/variante, importación y edición de solicitudes `.md`, localización procedural sin nombre, territorios/localidades, listas de exteriores/interiores/oficios, parámetros de ambiente, campo libre, selección de biblias, persistencia corregida del borrador, copia y descarga de `.md`.

Fuera de alcance por ahora: generación de imágenes en el navegador, creación automática del ZIP, conexión directa a SQLite, consultas automáticas a repositorios privados, sincronización entre dispositivos y certificado visual físico de los tres dispositivos.
