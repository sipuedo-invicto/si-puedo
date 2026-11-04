// Pruebas de aplazamientos: plazos vencidos, deuda pendiente, cargo en cuenta y próximos cargos (datos inventados).
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={Intl,Date,Math,Number,String,JSON,Array,Object,RegExp,Set,setTimeout:()=>0,document:{addEventListener(){},body:{classList:{contains:()=>false}}},location:{hash:'#hoy'}};
vm.createContext(ctx);for(const f of ['taxes.js','balances.js','taxplans.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
vm.runInContext("var TODAY='2026-11-04';var state={transactions:[],debts:[{id:'old',title:'Hacienda',taxModel:'130',quarter:1,taxYear:2026,amount:999}],balances:[{id:'b',name:'Banco',kind:'Banco',amount:1000,updatedAt:1}],balancesSeeded:1};var uid=()=>Math.random().toString(36).slice(2);var today=()=>TODAY;var save=()=>{};var render=()=>{};var esc=s=>s;var euro=n=>n.toFixed(2)+' €';",ctx);
const run=s=>vm.runInContext(s,ctx);
ctx.plan={exp:'E1',code:'130',quarter:1,taxYear:2026,declared:300,plazos:[{due:'2026-10-20',principal:100,interest:1,total:101},{due:'2026-11-20',principal:100,interest:2,total:102},{due:'2026-12-21',principal:100,interest:3,total:103}]};
ctx.plan2={exp:'E2',code:'303',quarter:3,taxYear:2026,declared:200,plazos:[{due:'2026-11-20',principal:100,interest:1,total:101},{due:'2027-01-20',principal:100,interest:2,total:102}]};
run('setTaxPlan(plan);setTaxPlan(plan2);syncTaxPlans()');
let n=run("planNumbers(taxPlanFor('130',1,2026))");assert.deepEqual([n.doneCount,n.paid,n.owed,n.interest],[1,101,205,6]);
assert.deepEqual(run("state.debts.map(d=>d.taxModel+':'+d.amount+':'+d.date).sort()"),['130:205:2026-11-20','303:203:2026-11-20']);// deuda vieja sustituida, sin duplicados
assert.equal(run('state.transactions.length'),0);// los plazos ya vencidos al importar no crean gasto
let st=run("taxStatus('130',1,2026)");assert.deepEqual([st.declared,st.paid,st.owed],[300,101,205]);
let up=run('upcomingCharges()');assert.equal(up[0].due,'2026-11-20');assert.equal(up[0].total,203);assert.equal(up[0].items.length,2);
// Llega el 20 de noviembre con cuenta de domiciliación elegida
run("state.taxPlanAccountId='b';TODAY='2026-11-20'");assert.equal(run('syncTaxPlans()'),true);
assert.equal(run('state.balances[0].amount'),797);assert.equal(run('state.transactions.length'),2);assert.equal(run("state.transactions[0].taxModel"),'130');
n=run("planNumbers(taxPlanFor('130',1,2026))");assert.deepEqual([n.doneCount,n.owed],[2,103]);
assert.equal(run('syncTaxPlans()'),false);// idempotente
// Último plazo: la deuda desaparece
run("TODAY='2026-12-21';syncTaxPlans()");assert.equal(run("state.debts.filter(d=>d.taxModel==='130').length"),0);
// La relación de Hacienda no toca los modelos con plan
ctx.items=[{code:'130',quarter:1,taxYear:2026,amount:50},{code:'111',quarter:2,taxYear:2026,amount:5}];
assert.deepEqual(run('planReconcile(items)').map(p=>p.code+':'+p.type),['111:new']);
console.log('PASS: deferral plans: due installments marked paid, debt = remaining, auto charge to account, upcoming charges, one debt per plan, AEAT list ignores planned models.');
