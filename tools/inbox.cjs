// Deja un paquete cifrado en el buzón (inbox.json) para que la app lo recoja.
// Uso: INBOX_CODE=XXXX-XXXX-XXXX-XXXX node tools/inbox.cjs paquete.json
// paquete.json: { "title": "...", "summary": ["..."], "ops": [ { "type": "addDebt", ... } ] }
// La clave NUNCA se guarda en el repositorio.
const fs=require('fs'),path=require('path'),{webcrypto:crypto}=require('crypto');
const root=path.join(__dirname,'..'),file=process.env.INBOX_FILE||path.join(root,'inbox.json'),ITER=Number(process.env.INBOX_ITER)||310000;
const norm=c=>String(c||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
const b64=u=>Buffer.from(u).toString('base64'),unb64=s=>new Uint8Array(Buffer.from(s,'base64'));
async function key(code,salt,iter){const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(norm(code)),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
(async()=>{const code=process.env.INBOX_CODE;if(norm(code).length<12)throw Error('Falta INBOX_CODE');const pkg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));if(!Array.isArray(pkg.ops)||!pkg.ops.length)throw Error('El paquete no tiene operaciones');
let inbox=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{v:1,iter:ITER,salt:b64(crypto.getRandomValues(new Uint8Array(16))),packages:[]};
const k=await key(code,unb64(inbox.salt),inbox.iter);
// Comprueba que la clave es la misma que la de los paquetes ya publicados.
if(inbox.packages.length){const p=inbox.packages[0];await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(p.iv)},k,unb64(p.ct)).catch(()=>{throw Error('La clave no coincide con la del buzón')})}
const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(JSON.stringify({...pkg,created:new Date().toISOString()})));
const id=Buffer.from(crypto.getRandomValues(new Uint8Array(8))).toString('hex');inbox.packages.push({id,iv:b64(iv),ct:b64(ct)});
fs.writeFileSync(file,JSON.stringify(inbox,null,1)+'\n');console.log('Paquete',id,'añadido. Total:',inbox.packages.length)})().catch(e=>{console.error(e.message);process.exit(1)});
