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
