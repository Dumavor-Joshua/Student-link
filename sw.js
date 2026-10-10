const CACHE_NAME='studentlink-shell-v13';
const BASE=new URL('./',self.location.href);
const APP_SHELL=[new URL('./',BASE).href,new URL('./manifest.json',BASE).href,new URL('./assets/app.css?v=studentlink-web-push-11',BASE).href,new URL('./assets/app.js?v=studentlink-web-push-11',BASE).href,new URL('./assets/favicon.svg',BASE).href,new URL('./assets/icon-192.svg',BASE).href,new URL('./assets/icon-512.svg',BASE).href];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('studentlink-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(new URL('./',BASE).href,response.clone()));return response}).catch(async()=>await caches.match(request)||await caches.match(new URL('./',BASE).href)));return}
 if(APP_SHELL.includes(request.url)){event.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));return response}).catch(()=>caches.match(request)))}
});


self.addEventListener('push',event=>{
  let payload={};
  try{payload=event.data?event.data.json():{}}catch(_){payload={body:event.data?.text?.()||''}}
  const title=typeof payload.title==='string'&&payload.title?payload.title:'New message on StudentLink';
  const options={
    body:typeof payload.body==='string'?payload.body:'You have a new message.',
    icon:new URL('./assets/icon-192.svg',self.registration.scope).href,
    badge:new URL('./assets/icon-192.svg',self.registration.scope).href,
    tag:typeof payload.tag==='string'?payload.tag:'studentlink-message',
    renotify:true,
    data:{url:typeof payload.url==='string'?payload.url:'?openMessages=1'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const destination=new URL(event.notification.data?.url||'?openMessages=1',self.registration.scope).href;
  event.waitUntil((async()=>{
    const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clientsList){
      if('focus' in client){
        await client.navigate(destination);
        return client.focus();
      }
    }
    if(self.clients.openWindow)return self.clients.openWindow(destination);
  })());
});
