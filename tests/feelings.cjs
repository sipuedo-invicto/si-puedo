// Pruebas de «Cómo me siento»: validación, resúmenes semanales/mensuales y texto para consulta.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={Intl,Date,Math,Number,String,JSON,Array,Object,Set,document:{addEventListener(){}},state:{}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('icons.js','utf8'),ctx);vm.runInContext(fs.readFileSync('feelings.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
const e=(id,date,o)=>({id,date,ts:+new Date(date+'T10:00:00'),mood:3,energy:null,sleep:null,sleepHours:null,pain:0,emotions:[],sensations:[],painZones:[],painNote:'',note:'',...o});
const list=[
 e('a','2026-11-02',{mood:2,energy:2,pain:6,painZones:['Cabeza'],emotions:['Ansiedad','Agobio'],sensations:['Cansancio'],sleep:2,sleepHours:5,note:'Discusión en el trabajo'}),
 e('b','2026-11-02',{mood:4,energy:3,emotions:['Ansiedad','Alivio']}),
 e('c','2026-11-04',{mood:5,energy:4,emotions:['Alegría'],sleepHours:8,sleep:4}),
 e('d','2026-11-08',{mood:1,pain:8,painZones:['Lumbar','Cabeza'],painNote:'Punzante'}),
 e('z','2026-10-31',{mood:4}),
];
ctx.list=list;
assert.equal(run('validFeelings(undefined)'),true);
assert.equal(run('validFeelings(list)'),true);
assert.equal(run("validFeelings([{id:'x',date:'2026-11-02',ts:1,mood:7}])"),false);
assert.equal(run("validFeelings([{id:'x',date:'2026-11-02',ts:1,mood:null}])"),false);
// Semana lunes 2 – domingo 8 de noviembre
const w=run("(()=>{const b=feelBounds('week',0,'2026-11-05');return feelSummary(list,b.start,b.end)})()");
assert.equal(w.from,'2026-11-02');assert.equal(w.to,'2026-11-08');assert.equal(w.totalDays,7);
assert.equal(w.daysLogged,3);assert.equal(w.entries,4);
assert.equal(w.perDay[0].mood,3);// media de 2 y 4 el mismo día
assert.equal(w.mood,3);// (3+5+1)/3
assert.equal(Object.fromEntries(w.emotions).Ansiedad,1);// dos registros el mismo día = 1 día
assert.equal(w.painDays,2);assert.equal(w.painMax,8);assert.equal(w.painAvg,7);
assert.deepEqual(w.zones[0],['Cabeza',2]);
assert.equal(w.sleepHours,6.5);
assert.equal(w.lowest.date,'2026-11-08');assert.equal(w.highest.date,'2026-11-04');
// Semana anterior incluye 31 de octubre
const prev=run("(()=>{const b=feelBounds('week',-1,'2026-11-05');return feelSummary(list,b.start,b.end)})()");
assert.equal(prev.from,'2026-10-26');assert.equal(prev.daysLogged,1);
// Mes de noviembre
const m=run("(()=>{const b=feelBounds('month',0,'2026-11-20');return feelSummary(list,b.start,b.end)})()");
assert.equal(m.from,'2026-11-01');assert.equal(m.to,'2026-11-30');assert.equal(m.totalDays,30);assert.equal(m.daysLogged,3);
const oct=run("(()=>{const b=feelBounds('month',-1,'2026-11-20');return feelSummary(list,b.start,b.end)})()");
assert.equal(oct.to,'2026-10-31');assert.equal(oct.daysLogged,1);
// Texto para consulta
const text=run("(()=>{const b=feelBounds('week',0,'2026-11-05');return feelReportText(feelSummary(list,b.start,b.end),'week')})()");
for(const s of ['RESUMEN SEMANAL','Días registrados: 3 de 7 (4 registros)','Estado de ánimo medio: 3/5','Dolor: 2 días','máxima 8/10','Cabeza (2 días)','Discusión en el trabajo','(dolor): Punzante','sin registro','no es una valoración clínica'])assert.ok(text.includes(s),'falta: '+s);
const empty=run("(()=>{const b=feelBounds('month',-3,'2026-11-20');return feelReportText(feelSummary(list,b.start,b.end),'month')})()");
assert.ok(empty.includes('No hay registros'));
const cur=run("(()=>{const b=feelBounds('week',0,'2026-11-05');return feelSummary(list,b.start,b.end,'2026-11-05')})()");
assert.equal(cur.totalDays,4);assert.equal(cur.daysLogged,2);
const curText=run("(()=>{const b=feelBounds('week',0,'2026-11-05');return feelReportText(feelSummary(list,b.start,b.end,'2026-11-05'),'week')})()");
assert.ok(curText.includes('Días registrados: 2 de 4'));assert.ok(!curText.includes('vie 6'));
console.log('PASS: feelings validation, daily averaging, weekly/monthly bounds, day-based counts, pain stats, sleep, report text, ongoing period ignores future days.');
