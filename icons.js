// Iconos de línea, mismo grosor y en negro (heredan el color del texto).
const ICONS={
hoy:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
animo:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
agenda:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
tareas:'<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
casa:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>',
tiempo:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
finanzas:'<path d="M4 10h12M4 14h9M19 6a7.7 8 0 0 0-5.2-2A7.9 8 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
luna:'<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"/>',
banco:'<path d="M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M12 3l9 5H3Z"/>',
efectivo:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
guia:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2ZM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z"/>'};
const FACE_MOUTHS={1:'<path d="M8 17c1.2-1.6 2.5-2.3 4-2.3s2.8.7 4 2.3M7.5 7.8l2.3.9M16.5 7.8l-2.3.9"/>',2:'<path d="M8.5 16.2c1-1 2.2-1.5 3.5-1.5s2.5.5 3.5 1.5"/>',3:'<path d="M8.5 15.2h7"/>',4:'<path d="M8.5 14.2c1 1.3 2.2 1.9 3.5 1.9s2.5-.6 3.5-1.9"/>',5:'<path d="M7.8 13.5h8.4a4.2 4.2 0 0 1-8.4 0Z"/>'};
function svgIcon(name,cls=''){return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`}
function face(n,cls=''){const k=Math.min(5,Math.max(1,Math.round(n)||3));return `<svg class="ico face ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r=".6" fill="currentColor"/><circle cx="15" cy="10" r=".6" fill="currentColor"/>${FACE_MOUTHS[k]}</svg>`}
