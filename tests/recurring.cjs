// Pruebas de gastos fijos mensuales (datos inventados).
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={Intl,Date,Math,Number,String,JSON,Array,Object,setTimeout:()=>0,document:{addEventListener(){},body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);for(const f of ['balances.js','recurring.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
vm.runInContext("var TODAY='2026-11-04';var state={transactions:[],balances:[{id:'s',name:'Banco',kind:'Banco',amount:1000,updatedAt:1}],balancesSeeded:1,recurring:[{id:'r1',title:'Alquiler',amount:400,day:1,area:'Personal',category:'Casa',accountId:'s',lastMonth:'2026-11'},{id:'r2',title:'Seguro',amount:50,day:31,area:'Personal',accountId:'s',lastMonth:'2026-11'},{id:'r3',title:'Agencia',amount:242,day:10,area:'Profesional',accountId:'s',lastMonth:'2026-10'}]};var uid=()=>Math.random().toString(36).slice(2);var today=()=>TODAY;var save=()=>{};var render=()=>{};",ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('pendingFixed()'),242);assert.equal(run("pendingFixed('Personal')"),0);
assert.equal(run('syncRecurring()'),false);
run("TODAY='2026-11-10'");assert.equal(run('syncRecurring()'),true);assert.equal(run('state.balances[0].amount'),758);assert.equal(run("state.transactions[0].date"),'2026-11-10');
run("TODAY='2026-12-31'");run('syncRecurring()');assert.deepEqual(run("state.transactions.map(t=>t.title+' '+t.date)"),['Agencia 2026-11-10','Alquiler 2026-12-01','Seguro 2026-12-31','Agencia 2026-12-10']);
run("TODAY='2027-02-28'");run('syncRecurring()');assert.ok(run("state.transactions.some(t=>t.title==='Seguro'&&t.date==='2027-02-28')"));// día 31 → último día del mes
assert.equal(run('syncRecurring()'),false);// idempotente
console.log('PASS: recurring expenses: charged on their day, balance updated, month-end clamp, pending fixed for daily allowance, idempotent.');
