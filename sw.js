/* Offline cache. Bump VERSION after editing index.html so phones pick up the new version. */
const VERSION='pa-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/logo-192.png','./icons/logo-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION&&x!=='pa-meta').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
/* Tuni's call: best-effort background reminder (Chrome Android, installed app only) */
async function callKids(){
  let m={kids:[],on:false};
  try{const c=await caches.open('pa-meta');const r=await c.match('meta.json');if(r)m=await r.json()}catch(e){}
  if(!m.on||!m.kids.length)return;
  const h=new Date().getHours();if(h<8||h>=21)return;
  return self.registration.showNotification('টুনি ডাকছে 🐥',{body:m.kids.map(k=>k.n).join(', ')+' — চলো আজ একটু পড়ি!',icon:'icons/logo-192.png',badge:'icons/favicon-32.png',tag:'tuni',renotify:true,vibrate:[120,60,120]});
}
self.addEventListener('periodicsync',e=>{if(e.tag==='tuni-call')e.waitUntil(callKids())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./index.html')))});
