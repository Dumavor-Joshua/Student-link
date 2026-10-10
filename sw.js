const CACHE_NAME='studentlink-shell-v29';
const BASE=new URL('./',self.location.href);
const APP_SHELL=[new URL('./',BASE).href,new URL('./manifest.json',BASE).href,new URL('./assets/app.css?v=studentlink-school-directory-29',BASE).href,new URL('./assets/app.js?v=studentlink-school-directory-29',BASE).href,new URL('./assets/favicon.svg',BASE).href,new URL('./assets/icon-192.svg',BASE).href,new URL('./assets/icon-512.svg',BASE).href];
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
    silent:false,
    vibrate:[120,60,120],
    data:{
      url:typeof payload.url==='string'?payload.url:'?openMessages=1',
      notificationId:typeof payload.notificationId==='string'?payload.notificationId:''
    },
    actions:typeof payload.notificationId==='string'&&payload.notificationId?[
      {action:'reply',title:'Reply'}
    ]:[]
  };
  const tasks=[self.registration.showNotification(title,options)];
  const badgeCount=Number(payload.badgeCount);
  if(typeof self.navigator?.setAppBadge==='function'&&Number.isFinite(badgeCount)){
    tasks.push(badgeCount>0?self.navigator.setAppBadge(badgeCount):self.navigator.clearAppBadge());
  }
  event.waitUntil(Promise.allSettled(tasks));
});
async function openStudentLinkDestination(destination){
  const scopeURL=new URL(self.registration.scope);
  let target;
  try{
    target=new URL(destination||'?openMessages=1',scopeURL);
  }catch(_){
    target=new URL('?openMessages=1',scopeURL);
  }
  // Never let notification payloads send a click outside the StudentLink app scope.
  if(target.origin!==scopeURL.origin||!target.pathname.startsWith(scopeURL.pathname)){
    target=new URL('?openMessages=1',scopeURL);
  }
  const targetURL=target.href;
  let clientsList=[];
  try{clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});}catch(error){console.warn('StudentLink could not inspect open windows:',error);}
  for(const client of clientsList){
    if(!('focus' in client))continue;
    try{
      if(typeof client.navigate!=='function')continue;
      await client.navigate(targetURL);
      await client.focus();
      return;
    }catch(error){
      console.warn('StudentLink could not reuse an open window; opening the app instead:',error);
    }
  }
  if(self.clients.openWindow){
    try{return await self.clients.openWindow(targetURL);}
    catch(error){console.error('StudentLink could not open from a notification:',error);}
  }
}
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const data=event.notification.data||{};
  let destination=data.url||'?openMessages=1';
  if(event.action==='reply'){
    // The action opens StudentLink's chat composer; web push actions cannot
    // reliably provide a native text field across supported browsers.
    const replyDestination=new URL(destination,self.registration.scope);
    replyDestination.searchParams.set('openMessages','1');
    replyDestination.searchParams.set('reply','1');
    destination=replyDestination.href;
  }
  event.waitUntil(openStudentLinkDestination(destination));
});
