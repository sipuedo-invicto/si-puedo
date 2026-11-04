// Actualización automática: al abrir o volver a la app, comprueba si hay una versión nueva
// publicada y recarga sin caché. Así los cambios llegan sin borrar ni reinstalar nada.
const APP_VERSION='2026.11.04-220705';
async function checkForUpdate(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const {version}=await r.json();if(version&&version!==APP_VERSION){const key='si-puedo-updated-to';if(sessionStorage.getItem(key)===version)return;sessionStorage.setItem(key,version);location.replace(location.pathname+'?v='+encodeURIComponent(version)+location.hash)}}catch{}}
checkForUpdate();document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdate()});
