// Pruebas del buzón: la herramienta cifra un paquete y la app lo abre y lo aplica (datos inventados).
const vm=require('vm'),fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert'),{execFileSync}=require('child_process');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'inbox-'));const inboxFile=path.join(dir,'inbox.json'),pkgFile=path.join(dir,'p.json');const CODE='TEST-AAAA-BBBB-2345';
fs.writeFileSync(pkgFile,JSON.stringify({title:'Prueba',summary:['x'],ops:[{type:'addDebt',title:'Préstamo',amount:100,area:'Personal'},{type:'addTask',title:'Llamar',area:'Trabajo',minutes:5},{type:'setBalance',account:'caixa',amount:500},{type:'addTransaction',title:'Café',amount:2.5,kind:'expense',area:'Personal',account:'Caixa',date:'2026-11-03'},{type:'aeatReconcile',items:[{code:'303',quarter:3,taxYear:2026,amount:10}]}]}));
execFileSync('node',[path.join(__dirname,'..','tools','inbox.cjs'),pkgFile],{env:{...process.env,INBOX_CODE:CODE,INBOX_FILE:inboxFile,INBOX_ITER:'1000'}});
let threw=false;try{execFileSync('node',[path.join(__dirname,'..','tools','inbox.cjs'),pkgFile],{env:{...process.env,INBOX_CODE:'OTRA-CLAVE-1234-5678',INBOX_FILE:inboxFile,INBOX_ITER:'1000'},stdio:'pipe'})}catch{threw=true}assert.ok(threw,'una clave distinta debe rechazarse');
const inbox=JSON.parse(fs.readFileSync(inboxFile,'utf8'));assert.equal(inbox.packages.length,1);assert.ok(!JSON.stringify(inbox).includes('Préstamo'));
const ctx={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa,atob,Uint8Array,String,JSON,Math,Number,Array,Object,Promise,Error,RegExp,Date,Intl,Set,setTimeout:()=>0,document:{addEventListener(){},body:{classList:{contains:()=>false}}},location:{hash:'#hoy'}};
vm.createContext(ctx);for(const f of ['security.js','taxes.js','balances.js','inbox.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx);
vm.runInContext("var state={tasks:[],transactions:[],debts:[{id:'h',title:'Hacienda',taxModel:'303',quarter:3,taxYear:2026,amount:12}],balances:[{id:'c',name:'Caixa',kind:'Banco',amount:0,updatedAt:0}],balancesSeeded:1};var uid=()=>Math.random().toString(36).slice(2);var today=()=>'2026-11-03';var save=()=>{};var render=()=>{};var esc=s=>s;var euro=n=>n+' €';",ctx);
ctx.inbox=inbox;ctx.CODE=CODE;
(async()=>{const data=await vm.runInContext('(async()=>{const k=await inboxKeyFor(CODE.toLowerCase(),inbox.salt,inbox.iter);return openPackage(inbox.packages[0],k)})()',ctx);assert.equal(data.title,'Prueba');
let bad=false;try{await vm.runInContext("(async()=>{const k=await inboxKeyFor('MALA-CLAV-E000-0000',inbox.salt,inbox.iter);return openPackage(inbox.packages[0],k)})()",ctx)}catch{bad=true}assert.ok(bad);
ctx.ops=data.ops;vm.runInContext('applyInboxOps(ops)',ctx);const st=vm.runInContext('state',ctx);
assert.equal(st.tasks[0].title,'Llamar');assert.equal(st.balances[0].amount,497.5);assert.equal(st.transactions[0].accountId,'c');
assert.deepEqual(st.debts.map(d=>d.title+':'+d.amount).sort(),['Hacienda:10','Préstamo:100']);assert.equal(st.transactions.filter(t=>t.taxModel==='303').length,1);
fs.rmSync(dir,{recursive:true});console.log('PASS: inbox tool encrypts, rejects a different key, app decrypts with key (case-insensitive) and applies debts, tasks, balances, movements and AEAT reconcile.')})().catch(e=>{console.error(e);process.exit(1)});
