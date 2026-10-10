const CACHE_NAME='studentlink-shell-v2';
const BASE=new URL('./',self.location.href);
const APP_SHELL=[new URL('./',BASE).href,new URL('./manifest.json',BASE).href,new URL('./assets/app.css?v=studentlink-iphone-compat-2',BASE).href,new URL('./assets/app.js?v=studentlink-iphone-startup-3',BASE).href,new URL('./assets/favicon.svg',BASE).href,new URL('./assets/icon-192.svg',BASE).href,new URL('./assets/icon-512.svg',BASE).href];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('studentlink-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(new URL('./',BASE).href,response.clone()));return response}).catch(async()=>await caches.match(request)||await caches.match(new URL('./',BASE).href)));return}
 if(APP_SHELL.includes(request.url)){event.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));return response}).catch(()=>caches.match(request)))}
});
