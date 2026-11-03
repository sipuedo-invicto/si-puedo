// Pruebas de impuestos trimestrales (130 IRPF y 303 IVA): plazos, trimestre por defecto y totales.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={Intl,Date,Math,Number,String,JSON,Array,Object,document:{addEventListener(){}},state:{transactions:[]}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('taxes.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
const D=s=>`new Date(${s.split('-').map((n,i)=>i===1?Number(n)-1:Number(n)).join(',')})`;
const nd=s=>run(`(()=>{const n=nextTaxDeadline(${D(s)});return {q:n.quarter,y:n.year,open:n.open,days:n.daysLeft,end:n.end.getMonth()+1+'-'+n.end.getDate()}})()`);
assert.deepEqual(nd('2026-11-03'),{q:4,y:2026,open:false,days:88,end:'1-30'});
assert.deepEqual(nd('2027-01-10'),{q:4,y:2026,open:true,days:20,end:'1-30'});
assert.deepEqual(nd('2027-01-30'),{q:4,y:2026,open:true,days:0,end:'1-30'});
assert.deepEqual(nd('2027-01-31'),{q:1,y:2027,open:false,days:79,end:'4-20'});
assert.deepEqual(nd('2026-10-05'),{q:3,y:2026,open:true,days:15,end:'10-20'});
assert.deepEqual(nd('2026-07-21'),{q:3,y:2026,open:false,days:91,end:'10-20'});
const lc=s=>run(`(()=>{const q=lastClosedQuarter(${D(s)});return q.quarter+'T'+q.year})()`);
assert.equal(lc('2026-11-03'),'3T2026');assert.equal(lc('2027-01-15'),'4T2026');assert.equal(lc('2026-04-02'),'1T2026');assert.equal(lc('2026-06-30'),'1T2026');
ctx.list=[{amount:300,taxModel:'130',quarter:1,taxYear:2026},{amount:120.5,taxModel:'303',quarter:1,taxYear:2026},{amount:50,taxModel:'130',quarter:1,taxYear:2026},{amount:410,taxModel:'303',quarter:3,taxYear:2026},{amount:999,taxModel:'130',quarter:4,taxYear:2025},{amount:20,title:'Otro gasto'}];
const s=run('taxYearSummary(2026,list)');
assert.equal(s.rows[0].m130,350);assert.equal(s.rows[0].m303,120.5);assert.equal(s.rows[2].m303,410);assert.equal(s.rows[3].m130,0);
assert.equal(s.total130,350);assert.equal(s.total303,530.5);
assert.equal(run('taxYearSummary(2025,list)').total130,999);
console.log('PASS: tax deadlines (incl. 4T in January), last closed quarter, per-quarter and yearly totals for 130 and 303.');

// Lectura de texto de PDFs del asesor
const P=x=>run(`parseTaxText(${JSON.stringify(x)})`);
let r=P('Agencia Tributaria Justificante de presentación Modelo 130 IRPF. Pago fraccionado Ejercicio: 2026 Período: 3T Rendimiento neto 03 3.120,40 Resultado de la autoliquidación 19 412,36 Tipo de declaración: Ingreso Fecha de presentación: 14/10/2026 NRC: 1234 Importe: 412,36 €');
assert.equal(r.model,'130');assert.equal(r.quarter,3);assert.equal(r.year,2026);assert.equal(r.amount,412.36);assert.equal(r.date,'2026-10-14');assert.equal(r.result,'ingresar');
r=P('AGENCIA TRIBUTARIA IVA. Autoliquidación. Modelo 303 Ejercicio 2026 Periodo 2T Base imponible 01 4.500,00 Cuota 03 945,00 Total cuota devengada 27 1.180,25 Total a deducir 45 200,25 Resultado de la liquidación 71 980,00 Resultado: A ingresar Fecha: 18-07-2026');
assert.equal(r.model,'303');assert.equal(r.quarter,2);assert.equal(r.amount,980);assert.equal(r.date,'2026-07-18');
r=P('Modelo 303 Impuesto sobre el Valor Añadido Ejercicio 2026 Período 1T Resultado de la liquidación 71 -150,00 Resultado: A compensar');assert.equal(r.result,'compensar');
r=P('Pago fraccionado IRPF actividades económicas 130 cuarto trimestre ejercicio 2025 a ingresar 1.234,56');assert.equal(r.model,'130');assert.equal(r.quarter,4);assert.equal(r.year,2025);assert.equal(r.amount,1234.56);
r=P('Factura nº 23 Cliente: Ejemplo SL Total: 121,00 €');assert.equal(r.model,null);
console.log('PASS: PDF text parsing (130 justificante, 303 form with many boxes, a compensar, text without "Modelo", unrelated PDF).');

// Justificante real de la AEAT (texto anonimizado): importe total, fecha de presentación y aplazamiento.
r=P('INFORMACIÓN DE LA PRESENTACIÓN DE LA DECLARACIÓN Modelo 303 Registro Presentación realizada el: 10-07-2026 a las 10:00:00 SOLICITUD DE APLAZAMIENTO O FRACCIONAMIENTO Declaración presentada con: IMPORTES PENDIENTES DE INGRESO. Importe total de la declaración: 3.111,22 euros Importe pendiente de ingreso: 3.111,22 euros Ha manifestado su intención de solicitar un aplazamiento de pago. Impuesto sobre el Valor Añadido Autoliquidación Ejercicio Período Modelo 303 Declaración sin actividad 69 resultado a ingresar correspondiente a la anterior autoliquidación 71 rectificaciones 2026 2T 4.500,00 945,00');
assert.equal(r.model,'303');assert.equal(r.quarter,2);assert.equal(r.year,2026);assert.equal(r.amount,3111.22);assert.equal(r.date,'2026-07-10');assert.equal(r.result,'ingresar');assert.equal(r.pending,true);
r=P('Modelo 130 Presentación realizada el: 20-01-2026 Importe total de la declaración: 1.444,33 euros Impuesto sobre la Renta de las Personas Físicas Pago fraccionado Período ... Ejercicio ... 2025 4T');
assert.equal(r.model,'130');assert.equal(r.quarter,4);assert.equal(r.year,2025);assert.equal(r.amount,1444.33);assert.equal(r.date,'2026-01-20');assert.equal(r.pending,false);
// Resumen de texto del asesor
ctx.parseEuro=undefined;const items=run(`parseTaxSummary('MODELOS 2026-3T:\\n- MODELO 111 2026-3T...........17,5\\n- MODELO 303 2026-3T...........1.234,6\\n- MODELO 130 2026-3T............512,07')`);
assert.deepEqual(items.map(i=>[i.code,i.quarter,i.taxYear,i.amount]),[['111',3,2026,17.5],['303',3,2026,1234.6],['130',3,2026,512.07]]);
// Deudas con Hacienda en el resumen anual
const s2=run("taxYearSummary(2026,[{amount:100,taxModel:'303',quarter:2,taxYear:2026}],[{amount:3111.22,taxModel:'303',quarter:2,taxYear:2026},{amount:17.5,taxModel:'111',quarter:3,taxYear:2026}])");
assert.equal(s2.rows[1].m303,100);assert.equal(s2.rows[1].owed303,3111.22);assert.equal(s2.owedTotal111,17.5);assert.equal(s2.total303,100);
console.log('PASS: real AEAT receipt format (total amount, filing date, deferral), advisor text summary (111/130/303), owed amounts per quarter.');

// Relación de deudas de la AEAT (cifras inventadas) y conciliación con la app
const LIST='Relación de deudas con importes calculados * Clave de liquidación: A000 * Objeto tributario: 3T 2026 303-I.V.A. EJER:2026 PER:3T * Importe pendiente: 1.002,40 * Situación: Aplazada * Objeto tributario: 2T 2026 130-IRPF PAGO FRA EJER:2026 PER:2T * Importe pendiente: 800,00 * Objeto tributario: 1T 2026 303-I.V.A. EJER:2026 PER:1T * Importe pendiente: 300,50';
ctx.LIST=LIST;const parsed=run('parseAeatDebtList(LIST)');assert.deepEqual(parsed.map(i=>[i.code,i.quarter,i.taxYear,i.amount]),[['303',3,2026,1002.4],['130',2,2026,800],['303',1,2026,300.5]]);
assert.equal(run("parseAeatDebtList('MODELO 303 2026-3T....10,00')"),null);
ctx.state.debts=[{id:'a',taxModel:'303',quarter:3,taxYear:2026,amount:1000},{id:'b',taxModel:'130',quarter:2,taxYear:2026,amount:1000},{id:'c',taxModel:'130',quarter:4,taxYear:2025,amount:500},{id:'x',title:'Préstamo',amount:50}];
const plan=run('planReconcile(parseAeatDebtList(LIST))');
assert.deepEqual(plan.map(p=>[p.code,p.quarter,p.taxYear,p.type,p.amount]),[['130',4,2025,'paid',500],['303',1,2026,'new',300.5],['130',2,2026,'partial',200],['303',3,2026,'increase',2.4]]);
ctx.uid=()=>Math.random().toString(36);ctx.today=()=>'2026-11-03';ctx.applyTx=()=>{};ctx.state.transactions=[];
run('applyReconcile(planReconcile(parseAeatDebtList(LIST)))');
assert.deepEqual(run("state.debts.map(d=>(d.taxModel||'-')+':'+d.amount).sort()"),['-:50','130:800','303:1002.4','303:300.5'].sort());
assert.deepEqual(run("state.transactions.map(t=>t.taxModel+' '+t.quarter+'T '+t.amount)"),['130 4T 500','130 2T 200']);
console.log('PASS: AEAT debt list parsing and reconciliation (paid, partial, interest increase, new debt; other debts untouched).');
