// Pruebas del cifrado: ida y vuelta, PIN incorrecto y que no quede texto legible.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa,atob,Uint8Array,String,JSON,Math,Number,Array,Object,Promise,Error,RegExp,Date,document:{addEventListener(){}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('security.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
(async()=>{
const data={tasks:[{title:'Llamar al asesor'}],feelings:[{note:'Muy cansada'}],balances:[{name:'Caixa',amount:1520.3}]};ctx.data=data;
const blob=await run(`(async()=>{const salt=crypto.getRandomValues(new Uint8Array(16));const key=await deriveKey('482915',salt);return encryptJSON(data,key,salt)})()`);
const text=JSON.stringify(blob);for(const w of ['asesor','cansada','Caixa','1520'])assert.ok(!text.includes(w),'texto visible: '+w);
assert.equal(run('isEncryptedBlob')(blob),true);
ctx.blob=blob;
const ok=await run(`decryptWithPin(blob,'482915')`);assert.deepEqual(ok.data,data);
let failed=false;try{await run(`decryptWithPin(blob,'482916')`)}catch{failed=true}assert.ok(failed,'PIN incorrecto debería fallar');
// cada cifrado usa un IV distinto
const blob2=await run(`(async()=>{const k=(await decryptWithPin(blob,'482915')).key;return encryptJSON(data,k,unb64(blob.salt))})()`);assert.notEqual(blob2.iv,blob.iv);
// datos grandes (b64 por bloques)
ctx.big={x:'a'.repeat(300000)};const bb=await run(`(async()=>{const s=crypto.getRandomValues(new Uint8Array(16));const k=await deriveKey('111222',s,1000);const b=await encryptJSON(big,k,s,1000);return (await decryptWithPin(b,'111222')).data.x.length})()`);assert.equal(bb,300000);
console.log('PASS: AES-GCM round trip, wrong PIN rejected, no readable text in stored data, fresh IV, large data.');
})().catch(e=>{console.error(e);process.exit(1)});
