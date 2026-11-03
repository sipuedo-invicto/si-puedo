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
