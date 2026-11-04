// Pruebas de Face ID con una llave de acceso simulada (PRF determinista).
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const store=new Map();const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
let prfSecret=new Uint8Array(32).fill(7),lockHidden=false;
const credentials={
  async create(){return {rawId:new Uint8Array([1,2,3]).buffer,getClientExtensionResults:()=>({prf:{enabled:true}})}},
  async get(){return {getClientExtensionResults:()=>({prf:{results:{first:prfSecret.buffer}}})}}
};
const ctx={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa,atob,Uint8Array,String,JSON,Math,Number,Array,Object,Promise,Error,RegExp,Date,setTimeout,
  localStorage,navigator:{credentials},window:{isSecureContext:true},PublicKeyCredential:function(){},
  MutationObserver:class{observe(){}},document:{addEventListener(){},querySelector:()=>null,body:{classList:{add(){},remove(){}}},documentElement:{}}};
ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`let state={tasks:[]};const KEY='aturitmo-v1';const fresh=()=>({tasks:[]});const valid=d=>!!d&&Array.isArray(d.tasks);function render(){};function notify(){};function openForm(){}`,ctx);
vm.runInContext(fs.readFileSync('security.js','utf8'),ctx);vm.runInContext(fs.readFileSync('faceid.js','utf8'),ctx);
vm.runInContext(`hideLock=function(){globalThis.__hidden=true}`,ctx);
const run=s=>vm.runInContext(s,ctx);
(async()=>{
run(`state={tasks:[{title:'Llamar al médico'}]}`);
await run(`enableProtection('482915')`);
assert.equal(run('faceEnabled()'),false);
const c=await run(`faceCreate()`);ctx.c=c;
assert.equal(c.prf,null,'sin resultado PRF al crear, se pide después');
await run(`(async()=>{const prf=await faceGetPrf(c.credId,c.salt);await faceStore(c.credId,c.salt,prf,'482915')})()`);
assert.equal(run('faceEnabled()'),true);
assert.ok(!store.get('aturitmo-v1-faceid').includes('482915'),'el PIN no debe quedar legible');
// bloquear y abrir con Face ID
run(`secUnlocked=false;secKey=null;state=fresh()`);
await run(`faceUnlock(false)`);
assert.equal(run('secUnlocked'),true);assert.equal(run('state.tasks[0].title'),'Llamar al médico');assert.ok(ctx.__hidden);
// otra llave (otro secreto) no abre
run(`secUnlocked=false;secKey=null;state=fresh()`);prfSecret=new Uint8Array(32).fill(9);
await run(`faceUnlock(true)`);assert.equal(run('secUnlocked'),false,'un secreto distinto no debe abrir');
prfSecret=new Uint8Array(32).fill(7);
// cambiar el PIN invalida Face ID
await run(`(async()=>{await decryptWithPin(JSON.parse(localStorage.getItem(ENC_KEY)),'482915')})()`);
await run(`enableProtection('739104')`);assert.equal(run('faceEnabled()'),false);
// quitar la protección también lo borra
await run(`(async()=>{const c=await faceCreate();const p=await faceGetPrf(c.credId,c.salt);await faceStore(c.credId,c.salt,p,'739104')})()`);
assert.equal(run('faceEnabled()'),true);await run(`disableProtection()`);assert.equal(store.has('aturitmo-v1-faceid'),false);
console.log('PASS: Face ID activa, abre con el secreto correcto, rechaza otro, PIN no legible, se borra al cambiar PIN o quitar protección.');
process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
