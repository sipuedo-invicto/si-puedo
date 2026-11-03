// Pruebas de «Tu dinero hoy»: validación, total y antigüedad del saldo.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={Intl,Date,Math,Number,String,JSON,Array,Object,document:{addEventListener(){}},state:{}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('balances.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
assert.equal(run('validBalances(undefined)'),true);
ctx.list=[{id:'a',name:'BBVA',kind:'Banco',amount:1250.1,updatedAt:1},{id:'b',name:'Efectivo',kind:'Efectivo',amount:85.2,updatedAt:1},{id:'c',name:'Tarjeta',kind:'Banco',amount:-40,updatedAt:1}];
assert.equal(run('validBalances(list)'),true);
assert.equal(run("validBalances([{id:'x',name:'X',kind:'Cripto',amount:1,updatedAt:1}])"),false);
assert.equal(run('balanceTotal(list)'),1295.3);
const now=+new Date(2026,10,3,15);
assert.equal(run(`ageLabel(${+new Date(2026,10,3,9)},${now})`),'hoy');
assert.equal(run(`ageLabel(${+new Date(2026,10,2,23)},${now})`),'ayer');
assert.equal(run(`ageLabel(${+new Date(2026,9,27,12)},${now})`),'hace 7 días');
assert.equal(run('ageLabel(0)'),'sin apuntar');
ctx.uid=()=>Math.random().toString(36);ctx.save=()=>{};ctx.state={balances:[{id:'z',name:'caixa',kind:'Banco',amount:500,updatedAt:5}]};
const seeded=run('balances()');assert.deepEqual(seeded.map(a=>a.name),['caixa','Sabadell','Cajamar','Trade','Efectivo']);assert.equal(seeded[0].amount,500);assert.equal(seeded.at(-1).kind,'Efectivo');
run("state.balances=state.balances.filter(a=>a.name!=='Trade')");assert.equal(run('balances()').length,4);// no reaparece
console.log('PASS: balances validation, total with negatives, age labels, default accounts seeded once.');

// Balance global
ctx.tx=[{kind:'income',amount:1210,area:'Profesional',date:'2026-11-02'},{kind:'expense',amount:412.36,area:'Profesional',date:'2026-11-03'},{kind:'expense',amount:50,area:'Personal',date:'2026-11-01'},{kind:'income',amount:300,area:'Personal',date:'2026-10-15'},{kind:'expense',amount:20,area:'Sin separar',date:'2026-11-03'},{kind:'expense',amount:99,area:'Personal',date:'2025-12-31'}];
ctx.acc=[{name:'Caixa',area:'Personal',amount:1000,updatedAt:1},{name:'Sabadell',area:'Profesional',amount:2500.5,updatedAt:1},{name:'Efectivo',amount:40,updatedAt:1}];
const NOW=`new Date(2026,10,3)`;
let g=run(`globalBalance(tx,acc,'mes',${NOW})`);
assert.deepEqual(g.total,{have:3540.5,income:1210,expense:482.36,diff:727.64});
assert.deepEqual(g.personal,{have:1000,income:0,expense:50,diff:-50});
assert.deepEqual(g.profesional,{have:2500.5,income:1210,expense:412.36,diff:797.64});
assert.equal(g.unsepCount,1);assert.equal(g.unsepAmount,-20);assert.equal(g.accountsNoArea,1);
g=run(`globalBalance(tx,acc,'año',${NOW})`);assert.equal(g.personal.income,300);assert.equal(g.personal.expense,50);
g=run(`globalBalance(tx,acc,'todo',${NOW})`);assert.equal(g.personal.expense,149);assert.equal(g.total.expense,581.36);
console.log('PASS: global balance by period (month/year/all), totals and personal/professional split, unseparated and unassigned accounts.');
