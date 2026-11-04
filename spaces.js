// Dos espacios: Corazón (lo emocional y personal) y Cerebro (lo práctico y profesional).
// Cada espacio muestra tarjetas grandes con un dato del momento.
const SPACES={
corazon:{title:'Corazón',sub:'Cuidarte por dentro y por fuera',items:[['animo','Cómo me siento'],['casa','Casa'],['guia','Guía']]},
cerebro:{title:'Cerebro',sub:'Organizar lo práctico',items:[['agenda','Agenda'],['tareas','Tareas'],['finanzas','Finanzas'],['tiempo','Tiempo']]}};
function tileInfo(id){try{const t=today();switch(id){
case 'animo':{const f=(state.feelings||[]).filter(x=>x.date===t).at(-1);return f?`Hoy: ${moodLabel(f.mood).toLowerCase()}`:'Aún no lo has anotado hoy'}
case 'casa':{const n=state.tasks.filter(x=>x.area==='Casa'&&!x.done).length;return n?`${n} ${n===1?'paso pendiente':'pasos pendientes'}`:'Nada pendiente'}
case 'guia':return 'Ideas para cuando te bloqueas';
case 'agenda':{const e=(typeof agenda==='function'?agenda():[]).filter(x=>!x.done&&x.end>=Date.now()).sort((a,b)=>a.start-b.start)[0];return e?`${new Intl.DateTimeFormat('es-ES',{weekday:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(e.start))} · ${e.title}`:'Sin citas próximas'}
case 'tareas':{const n=state.tasks.filter(x=>!x.done).length;return n?`${n} ${n===1?'pendiente':'pendientes'}`:'Todo hecho'}
case 'finanzas':{const have=balanceTotal(),owed=(state.debts||[]).reduce((s,d)=>s+d.amount,0);return `Tienes ${euro(have)}${owed?` · debes ${euro(owed)}`:''}`}
case 'tiempo':{const a=state.tracking?.active;return a?`En marcha: ${a.activity}`:'Mide cuánto te lleva algo'}}}catch{return ''}return ''}
function spaceHTML(id){const s=SPACES[id];return `<div class="space-head space-${id}"><span class="space-icon">${svgIcon(id)}</span><div><h1>${s.title}</h1><p>${s.sub}</p></div></div><div class="tiles">${s.items.map(([k,name])=>`<a class="tile" href="#${k}"><span class="tile-icon">${svgIcon(k)}</span><b>${name}</b><small>${esc(tileInfo(k))}</small></a>`).join('')}</div>`}
