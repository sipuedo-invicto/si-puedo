// Marca una versión nueva: version.json, update.js y ?v= en index.html (evita la caché del iPhone).
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
const d=new Date(),p=n=>String(n).padStart(2,'0');const v=`${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
fs.writeFileSync(path.join(root,'version.json'),JSON.stringify({version:v})+'\n');
const up=path.join(root,'update.js');fs.writeFileSync(up,fs.readFileSync(up,'utf8').replace(/const APP_VERSION='[^']*'/,`const APP_VERSION='${v}'`));
const ix=path.join(root,'index.html');let h=fs.readFileSync(ix,'utf8');h=h.replace(/(src|href)="([a-z0-9_-]+\.(?:js|css))(?:\?v=[^"]*)?"/gi,(m,a,f)=>`${a}="${f}?v=${v}"`);fs.writeFileSync(ix,h);
console.log('versión',v);
