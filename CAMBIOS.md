# Cambios de la revisión (2 de noviembre de 2026)

Basado en la versión publicada `b6eb9c967d93c75038147e070caaa6e370bffd78`. No se ha cambiado la clave de almacenamiento (`aturitmo-v1`) ni el formato de datos: las copias antiguas siguen restaurándose y los datos existentes se conservan **si se publica en la misma URL**.

## Errores corregidos
- **Avisos ocultos detrás de los formularios.** Los mensajes de error (por ejemplo, «El pago supera la cantidad pendiente» o un IVA no válido) se mostraban detrás del diálogo y no se podían leer. Ahora `notify()` coloca el aviso dentro del diálogo abierto.
- Marcar una tarea que ya no existe ya no provoca un error.

## Mejoras
- **Acciones rápidas en Hoy:** botones «＋ Paso», «＋ Gasto» y «＋ Cita» arriba del todo.
- **Gasto rápido:** importe, concepto opcional y categoría. Se guarda como gasto personal de hoy con IVA pendiente de identificar. El formulario completo sigue en Finanzas.
- **Recordatorio de copia:** si hay datos y nunca se ha guardado copia o han pasado 7 días, aparece un aviso en Hoy. Se guarda `state.lastBackup` (campo opcional; `valid()` no lo exige).
- **Guardar copia con la hoja de compartir del iPhone** (`navigator.share` con archivo), para guardarla en Archivos/iCloud Drive. Si no está disponible, descarga como antes.
- Se solicita almacenamiento persistente (`navigator.storage.persist()`).
- Pequeño refuerzo positivo al completar una tarea.
- **Iconos ligeros:** `apple-touch-icon.png` (180 px), `icono-192.png` e `icono-512.png` sustituyen al PNG de 1,7 MB en la página, el manifiesto y los estilos. La carga inicial baja de unos 1,8 MB a unos 0,37 MB. Los archivos de logo antiguos se conservan.

## Archivos modificados o añadidos
`dist/app.js`, `dist/index.html`, `dist/manifest.json`, `dist/style.css`, `dist/theme.css`, `dist/apple-touch-icon.png`, `dist/icono-192.png`, `dist/icono-512.png`, `ARCHIVOS-SHA256.json`, este documento.

## Comprobaciones
- `node tests/finances.cjs`, `node tests/time.cjs` y `node tests/agenda.cjs` pasan sin cambios en las pruebas.
- Probado en Chromium con perfil de iPhone: gasto rápido, aviso de error dentro del diálogo, botón de cita, aviso de copia y su desaparición tras guardar, completar tarea. Sin errores de JavaScript.

## Pendiente (no incluido a propósito)
- No hay service worker / modo sin conexión: el acceso privado del alojamiento podría interferir con la caché y conviene probarlo aparte.
- La prueba real en Safari de iPhone (hoja de compartir, `.ics`, avisos) sigue pendiente.

# Nuevo apartado «Cómo me siento» (3 de noviembre de 2026)

- Pestaña **Me siento** (♡) en la navegación y tarjeta en **Hoy** con cinco caras para registrar el ánimo con un toque.
- Registro: ánimo (1–5, obligatorio), energía, emociones, sensaciones físicas, dolor (0–10 y zonas, descripción opcional), sueño (calidad y horas) y nota libre. Se puede registrar varias veces al día, editar y eliminar.
- Resúmenes **semanales** (lunes a domingo) y **mensuales** con navegación a periodos anteriores: ánimo y energía medios, día más bajo y más alto, gráfico de ánimo por día con marca de dolor, emociones y sensaciones más frecuentes (contadas por días), dolor (días, media, máxima y zonas), sueño y notas. En el periodo en curso no cuentan los días futuros.
- **Compartir resumen**, **Copiar texto** e **Imprimir / PDF** para llevarlo a la psicóloga o al médico.
- Datos en `state.feelings` (opcional; las copias antiguas siguen siendo válidas). Validación en `validFeelings()`.
- Pruebas: `node tests/feelings.cjs`.

# Diseño más despejado (3 de noviembre de 2026)

- Ocultos en todas las pantallas: etiquetas pequeñas en mayúsculas, subtítulos, etiquetas decorativas, notas explicativas largas y el pie de página. Las notas dentro de los formularios se mantienen. El aviso del 024/112 sigue siempre visible.
- **Hoy**: solo título, acciones rápidas, aviso de copia (si toca), ánimo, próximas citas, 3 pasos y temporizador. Se quitan las tarjetas de texto, la de energía (ya está en «Me siento») y el recordatorio.
- **Finanzas**: primero los totales y el registro; «Gastos por categoría» y «Desglose de IVA» plegados; filtros de empresa solo al elegir Profesional; el botón «Separar» solo aparece si hay movimientos sin separar.
- **Agenda**: fuera la tarjeta de explicación y el consejo; «Pasar citas al Calendario» y «¿Cómo funciona?» bajo la lista.
- **Tiempo**: comparación y consejo plegados; menos texto.
- Más espacio entre bloques e interlineado más cómodo. Las pantallas miden entre un 30 % y un 55 % menos.

# Iconos uniformes (3 de noviembre de 2026)

- Nuevo `icons.js`: iconos SVG de línea, mismo grosor, en negro, para la barra de navegación, las caras de ánimo, el botón de agendar tareas y los pasos de la Guía. Sustituyen a símbolos Unicode que el iPhone mostraba como emojis de colores (☀, ✳) o con estilos distintos.

# «Me siento»: escribir con tus palabras y nuevas molestias (3 de noviembre de 2026)

- Nueva sección «Con tus palabras» en el registro: «¿Cómo me siento?» y «¿Por qué creo que me siento así?» (`feelText` y `why`, opcionales).
- Se muestran en el registro de hoy, en el resumen («Lo que escribiste», plegado) y en el texto para consulta («LO QUE ESCRIBÍ»).
- «Dolor y malestar físico» incluye ahora Dolor menstrual, Náuseas y Mareo (Náuseas y Mareo salen de «Cuerpo» para no duplicarlos).
- Arreglado: la etiqueta «Intensidad: X/10» ya no se parte en varias líneas.

# Impuestos trimestrales, lectura de PDFs y títulos en mayúsculas (3 de noviembre de 2026)

- Nuevo `taxes.js`: pagos del **modelo 130 (IRPF)** y **303 (IVA)** como gastos profesionales (`taxModel`, `quarter`, `taxYear`; IVA 0 %).
- Tarjeta «Impuestos trimestrales» en Finanzas (Todas/Profesional): próximo plazo, tabla por trimestres y año con totales, navegación entre años y botones «＋ Pago 130» / «＋ Pago 303». Aviso si ya hay un pago del mismo modelo y trimestre.
- Recordatorio en **Hoy** cuando el plazo está abierto y falta apuntar algún modelo. Plazos generales (Agencia Tributaria): 1T 1–20 abr, 2T 1–20 jul, 3T 1–20 oct, 4T 1–30 ene.
- **Subir PDF del asesor**: la app lee el texto del PDF en el propio móvil con pdf.js (incluido en `vendor/pdfjs`, Apache-2.0), detecta modelo, trimestre, año, importe y fecha, y abre el formulario relleno para revisar. Varios PDFs a la vez. Avisa si sale a compensar/devolver, si no es un 130/303 o si es un escaneado sin texto. El PDF no se guarda ni se envía.
- Títulos en mayúsculas.
- Pruebas: `node tests/taxes.cjs`.

# «Tu dinero hoy» (3 de noviembre de 2026)

- Nuevo `balances.js`: tarjeta destacada al principio de Finanzas con el dinero real que se tiene hoy en bancos y efectivo, y el total. No son ingresos ni movimientos: se apunta y se actualiza a mano.
- Varias cuentas (Banco/Efectivo), admite saldo negativo, muestra cuándo se actualizó cada una y avisa si alguna lleva más de 7 días sin actualizar. Tocar una cuenta para actualizarla o eliminarla.
- Datos en `state.balances` (opcional; copias antiguas siguen siendo válidas). Pruebas: `node tests/balances.cjs`.
- Cuentas creadas por defecto (una sola vez, sin saldo): Caixa, Sabadell, Cajamar, Trade y Efectivo. Aparecen como «sin apuntar» hasta poner su saldo; si se borra una, no vuelve a aparecer (`state.balancesSeeded`).

# Protección con PIN, cifrado y refuerzo de seguridad (3 de noviembre de 2026)

- Nuevo `security.js`: botón del candado (arriba) para activar un **PIN de 6 cifras**. Con la protección activa, los datos se guardan **cifrados** (AES-GCM 256; clave derivada del PIN con PBKDF2-SHA256, 310 000 iteraciones, sal aleatoria). Se elimina la copia sin cifrar.
- Pantalla de bloqueo al abrir, con teclado numérico. Bloqueo automático tras más de 1 minuto fuera de la app; contenido difuminado en la multitarea. Tras 5 intentos fallidos, espera de 30 s.
- «Guardar copia» genera una **copia cifrada** (`-protegida.json`); «Restaurar» pide el PIN de esa copia. Cambiar PIN y quitar protección desde el mismo botón.
- Rechaza PIN triviales (repetidos o seguidos). Si se olvida el PIN, los datos no se pueden recuperar.
- Seguridad web: política CSP (solo código propio, sin conexiones externas, sin `eval`), `no-referrer`, sin Google Fonts (la app ya no se conecta a ningún servidor externo), sin manejadores en línea; pdf.js con `isEvalSupported:false`.
- Pruebas: `node tests/security.cjs`.

# Balance global (3 de noviembre de 2026)

- Tarjeta «Balance global» en Finanzas, tras «Tu dinero hoy»: tabla con **Lo que tengo** (saldos de hoy), **Ingresos**, **Gastos** e **Ingresos − gastos**, en columnas **Total / Personal / Profesional**, con periodo **Mes / Año / Todo**.
- Cada cuenta tiene ahora «Uso»: Personal o Profesional (campo `area`, opcional). Aviso si alguna cuenta no lo tiene indicado; los movimientos «Sin separar» solo cuentan en el total y se avisa de ello.
- Sustituye a los tres totales anteriores, que dependían de los filtros.
- Cuentas **mixtas** (uso por defecto): con un campo opcional «¿cuánto es profesional?». Si se indica, esa parte cuenta como profesional y el resto como personal; si no, la cuenta solo cuenta en el total y se avisa del importe sin repartir (`proAmount`).
- Arreglo general: los elementos con `hidden` se ocultan siempre.

# Deudas en el balance y saldos automáticos (3 de noviembre de 2026)

- **Balance global**: nuevas filas «Lo que debo» (deudas pendientes por área) y **«Me queda»** (tengo − debo), en Total/Personal/Profesional. En «Tu dinero hoy»: «Debes X · te quedan Y».
- **Saldos automáticos**: al apuntar un movimiento, gasto rápido, pago de deuda o pago de 130/303 se elige la cuenta («¿De qué cuenta?»). El saldo se actualiza solo: el gasto resta y el ingreso suma; en cuentas mixtas con parte profesional, los movimientos profesionales ajustan también esa parte. La app recuerda la última cuenta usada.
- Borrar un movimiento deshace su efecto en la cuenta; separar un movimiento «sin separar» recoloca su efecto. El nombre de la cuenta aparece en cada movimiento (`accountId`, `state.lastAccountId`).
- Solo se ofrecen cuentas con saldo apuntado; «Ninguna» no toca saldos.

# Actualización automática (3 de noviembre de 2026)

- `update.js` + `version.json`: al abrir o volver a la app comprueba si hay versión nueva y recarga sin caché (una sola vez por versión). Los scripts y estilos se cargan con `?v=versión`.
- Antes de cada publicación: `node tools/bump.cjs`.
- La versión instalada aparece al final de la Guía.

# Finanzas visual (3 de noviembre de 2026)

- Nuevo `viz.js`. Tarjeta **«Cómo vas este mes»** (Total / Personal / Profesional): semáforo verde/ámbar/rojo comparando gastos con ingresos del mes (si aún no han entrado ingresos, usa la media de los 3 meses anteriores), barra de lo gastado y **«Puedes gastar X € /día»** hasta fin de mes. Gráfico de barras de ingresos y gastos de los **últimos 6 meses** y barras de **en qué gastas** (categorías personales del mes).
- Tarjeta **«Hucha de impuestos»** (Todas/Profesional) para el trimestre en curso: cuánto apartar para IVA (IVA cobrado − IVA de gastos profesionales) e IRPF (20 % del beneficio sin IVA), restando lo ya pagado de 130 y 303. Los pagos de impuestos no cuentan como gasto deducible. Estimación orientativa.
- Pruebas: `node tests/viz.cjs`.

# Modelo 111, aplazamientos y PDFs reales de la AEAT (3 de noviembre de 2026)

- **Modelo 111 (retenciones)** añadido. La tabla de impuestos muestra una columna por modelo en uso.
- **Aplazado o pendiente de pagar**: al apuntar un modelo se elige «Pagado» o «Aplazado o pendiente». Si está aplazado se crea una **deuda con Hacienda** (Profesional) con el modelo, trimestre y año, que cuenta en «Lo que debo». Al registrar un pago de esa deuda, el gasto hereda el modelo y aparece como pagado en la tabla. La tabla muestra «debes X» por trimestre y una fila «Debes».
- **Lector de PDF** ajustado al justificante real de la AEAT: «Importe total de la declaración», «Presentación realizada el», y detección de «importes pendientes de ingreso» / solicitud de aplazamiento (preselecciona «Aplazado»). Ya no confunde la casilla «sin actividad» del formulario con un resultado cero; los resultados negativos se tratan como a compensar/devolver.
- **Pegar resumen del asesor**: se pega un texto como «MODELO 303 2026-3T......1.000,00» y se apuntan todos los modelos de una vez (vista previa antes de guardar).

# Relación de deudas de Hacienda (3 de noviembre de 2026)

- «Pegar resumen» entiende también la **relación de deudas de la AEAT** («Objeto tributario: 2T 2026 130-IRPF … Importe pendiente: …»). Compara con las deudas de impuestos apuntadas y muestra los cambios antes de guardar: **pagado** (deudas que ya no aparecen), **pagado en parte** (baja el pendiente), **intereses** (sube el pendiente) y **deudas nuevas**.
- Los pagos se registran como gastos del modelo y trimestre, sin tocar los saldos de las cuentas (ya están reflejados). Las demás deudas no se modifican.
- «Impuestos trimestrales» y «Hucha de impuestos» van al final de Finanzas (plegado) y se muestran con cualquier filtro.

# Lector de PDF más fiable en iPhone (3 de noviembre de 2026)

- Nuevo lector ligero (sin pdf.js): descomprime el contenido del PDF con `DecompressionStream` y extrae el texto de las órdenes Tj/TJ. Es el lector principal; pdf.js queda de reserva para PDFs que no se puedan leer así.
- Pistas del nombre del archivo («MOD_130_2026-2T…») si falta el modelo o el trimestre.
- Si algo falla, el aviso muestra el motivo exacto (y se guarda en `si-puedo-pdf-error`).

# Buzón de Claude (3 de noviembre de 2026)

- `inbox.js` + `inbox.json`: paquetes de datos **cifrados** (AES-GCM, clave derivada con PBKDF2) que la app recoge al abrirse. La primera vez pide la **clave del buzón** (se guarda en el estado, cifrado con el PIN). Cada paquete se muestra con su resumen en Hoy y solo se aplica al tocar «Añadir»; si algo no cuadra, no se cambia nada.
- Operaciones: `aeatReconcile`, `addDebt`, `addTransaction` (con cuenta por nombre), `addTask`, `setBalance`.
- `tools/inbox.cjs`: añade un paquete (`INBOX_CODE=… node tools/inbox.cjs paquete.json`). La clave nunca se guarda en el repositorio.
- Pruebas: `node tests/inbox.cjs`.
