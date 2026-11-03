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
const pick=c=>({have:c.have,income:c.income,expense:c.expense,diff:c.diff});
ctx.tx=[{kind:'income',amount:1210,area:'Profesional',date:'2026-11-02'},{kind:'expense',amount:412.36,area:'Profesional',date:'2026-11-03'},{kind:'expense',amount:50,area:'Personal',date:'2026-11-01'},{kind:'income',amount:300,area:'Personal',date:'2026-10-15'},{kind:'expense',amount:20,area:'Sin separar',date:'2026-11-03'},{kind:'expense',amount:99,area:'Personal',date:'2025-12-31'}];
ctx.acc=[{name:'Caixa',area:'Personal',amount:1000,updatedAt:1},{name:'Sabadell',area:'Profesional',amount:2500.5,updatedAt:1},{name:'Efectivo',amount:40,updatedAt:1}];
const NOW=`new Date(2026,10,3)`;
let g=run(`globalBalance(tx,acc,'mes',${NOW})`);
assert.deepEqual(pick(g.total),{have:3540.5,income:1210,expense:482.36,diff:727.64});
assert.deepEqual(pick(g.personal),{have:1000,income:0,expense:50,diff:-50});
assert.deepEqual(pick(g.profesional),{have:2500.5,income:1210,expense:412.36,diff:797.64});
assert.equal(g.unsepCount,1);assert.equal(g.unsepAmount,-20);assert.equal(g.accountsNoArea,1);
g=run(`globalBalance(tx,acc,'año',${NOW})`);assert.equal(g.personal.income,300);assert.equal(g.personal.expense,50);
g=run(`globalBalance(tx,acc,'todo',${NOW})`);assert.equal(g.personal.expense,149);assert.equal(g.total.expense,581.36);
console.log('PASS: global balance by period (month/year/all), totals and personal/professional split, unseparated and unassigned accounts.');

// Cuentas mixtas
ctx.acc2=[{name:'Caixa',area:'Mixta',proAmount:700,amount:1000,updatedAt:1},{name:'Sabadell',area:'Mixta',amount:2000,updatedAt:1},{name:'Efectivo',area:'Personal',amount:50,updatedAt:1},{name:'Trade',amount:300,updatedAt:1}];
g=run(`globalBalance([],acc2,'mes',${NOW})`);
assert.equal(g.total.have,3350);assert.equal(g.profesional.have,700);assert.equal(g.personal.have,350);
assert.equal(g.unsplitAmount,2300);assert.equal(g.unsplitCount,2);
assert.equal(run("validBalances([{id:'a',name:'C',kind:'Banco',area:'Mixta',proAmount:5,amount:10,updatedAt:1}])"),true);
console.log('PASS: mixed accounts with optional professional share; unsplit amount counted only in total.');

// Deudas: lo que tengo − lo que debo
ctx.state={debts:[{area:'Personal',amount:200},{area:'Profesional',amount:1000},{area:'Sin separar',amount:50}]};
g=run(`globalBalance([],acc2,'mes',${NOW})`);
assert.equal(g.total.owed,1250);assert.equal(g.total.net,2100);assert.equal(g.personal.net,150);assert.equal(g.profesional.net,-300);assert.equal(g.debtUnsep,50);
// Saldos automáticos: gasto resta, ingreso suma, borrar deshace; parte profesional en cuentas mixtas
ctx.state={balances:[{id:'c',name:'Caixa',kind:'Banco',area:'Mixta',proAmount:700,amount:1000,updatedAt:1},{id:'e',name:'Efectivo',kind:'Efectivo',area:'Personal',amount:50,updatedAt:1}],balancesSeeded:1};
run("applyTx({accountId:'e',kind:'expense',amount:4.5,area:'Personal'})");assert.equal(run("state.balances[1].amount"),45.5);assert.equal(run('state.lastAccountId'),'e');
run("applyTx({accountId:'c',kind:'income',amount:1210,area:'Profesional'})");assert.equal(run("state.balances[0].amount"),2210);assert.equal(run("state.balances[0].proAmount"),1910);
run("applyTx({accountId:'c',kind:'expense',amount:30,area:'Personal'})");assert.equal(run("state.balances[0].amount"),2180);assert.equal(run("state.balances[0].proAmount"),1910);
run("applyTx({accountId:'c',kind:'income',amount:1210,area:'Profesional'},-1)");assert.equal(run("state.balances[0].amount"),970);assert.equal(run("state.balances[0].proAmount"),700);
run("applyTx({accountId:'',kind:'expense',amount:99})");run("applyTx({accountId:'nope',kind:'expense',amount:99})");assert.equal(run("state.balances[0].amount+state.balances[1].amount"),1015.5);
console.log('PASS: debts subtracted (total/personal/professional), automatic balance updates with undo and mixed-account professional share.');
