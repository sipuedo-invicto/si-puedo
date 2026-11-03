// Pruebas de Finanzas visual: series de 6 meses, semáforo, gasto diario, categorías y hucha de impuestos.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={Intl,Date,Math,Number,String,JSON,Array,Object,document:{addEventListener(){}}};
vm.createContext(ctx);
vm.runInContext(`const hasVat=t=>t.vatRate!==undefined&&t.vatRate!==''&&Number.isFinite(Number(t.vatRate));const base=t=>Math.round(t.amount/(1+Number(t.vatRate)/100)*100)/100;const vat=t=>Math.round((t.amount-base(t))*100)/100;const categoryOf=t=>t.category||'Sin categoría';`,ctx);
vm.runInContext(fs.readFileSync('viz.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
const T=(date,kind,amount,area,o={})=>({date,kind,amount,area,...o});
ctx.tx=[T('2026-11-02','income',1210,'Profesional',{vatRate:'21'}),T('2026-11-03','expense',300,'Personal',{category:'Casa'}),T('2026-11-04','expense',121,'Profesional',{vatRate:'21'}),T('2026-11-05','expense',40,'Personal',{category:'Ocio'}),
T('2026-10-10','income',2000,'Personal'),T('2026-10-20','expense',500,'Personal',{category:'Casa'}),T('2026-09-10','income',1000,'Personal'),T('2026-08-10','income',1000,'Personal'),T('2026-05-01','income',999,'Personal'),
T('2026-11-06','expense',412.36,'Profesional',{taxModel:'130',quarter:3,taxYear:2026,vatRate:'0'}),T('2026-10-15','expense',100,'Profesional',{taxModel:'303',quarter:4,taxYear:2026,vatRate:'0'})];
const NOW='new Date(2026,10,10)';
const s=run(`monthSeries(tx,'Total',${NOW})`);assert.deepEqual(s.map(m=>m.key),['2026-06','2026-07','2026-08','2026-09','2026-10','2026-11']);
assert.deepEqual([s[5].income,s[5].expense],[1210,873.36]);assert.deepEqual([s[4].income,s[4].expense],[2000,600]);
assert.equal(run(`monthSeries(tx,'Personal',${NOW})`)[5].expense,340);
// Personal en noviembre: sin ingresos aún → referencia = media 3 meses anteriores (2000+1000+1000)/3
let st=run(`monthStatus(tx,'Personal',${NOW})`);assert.equal(st.reference,1333.33);assert.equal(st.usedAverage,true);assert.equal(st.left,993.33);assert.equal(st.daysLeft,21);assert.equal(st.perDay,47.3);assert.equal(st.light,'verde');
// Profesional en noviembre: ingresos 1210, gastos 533.36 → 44 % el día 10 de 30 (33 %) → verde
st=run(`monthStatus(tx,'Profesional',${NOW})`);assert.equal(st.reference,1210);assert.equal(st.light,'verde');
// Semáforo rojo si se gasta más de lo que entra
st=run(`monthStatus([{date:'2026-11-01',kind:'income',amount:100,area:'Personal'},{date:'2026-11-02',kind:'expense',amount:150,area:'Personal'}],'Personal',${NOW})`);assert.equal(st.light,'rojo');assert.equal(st.perDay,0);assert.equal(st.left,-50);
// Ámbar si va por encima del ritmo del mes
st=run(`monthStatus([{date:'2026-11-01',kind:'income',amount:1000,area:'Personal'},{date:'2026-11-02',kind:'expense',amount:600,area:'Personal'}],'Personal',${NOW})`);assert.equal(st.light,'ambar');
// Sin ingresos nunca → gris
assert.equal(run(`monthStatus([{date:'2026-11-02',kind:'expense',amount:5,area:'Personal'}],'Personal',${NOW})`).light,'gris');
// Categorías del mes (personal)
assert.deepEqual(run(`categoryBreakdown(tx,${NOW})`),[['Casa',300],['Ocio',40]]);
// Hucha 4T 2026: IVA 210 − 21 = 189; beneficio sin IVA (1000 − 100) = 900 → IRPF 180; pagos de impuestos no cuentan como gasto
const p=run(`taxPiggy(tx,${NOW})`);assert.equal(p.quarter,4);assert.equal(p.iva,189);assert.equal(p.irpf,180);assert.equal(p.total,369);assert.equal(p.paid303,100);assert.equal(p.paid130,0);
console.log('PASS: 6-month series, traffic light (green/amber/red/grey), daily allowance with average fallback, categories, tax piggy bank.');
