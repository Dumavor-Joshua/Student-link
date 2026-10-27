const CACHE_NAME='studentlink-shell-v89';
const BASE=new URL('./',self.location.href);
const APP_SHELL=[new URL('./',BASE).href,new URL('./manifest.json?v=studentlink-install-62',BASE).href,new URL('./data/ghana-shs-master.json',BASE).href,new URL('./assets/css/base.css?v=studentlink-refactor-80',BASE).href,new URL('./assets/css/feed.css?v=studentlink-refactor-80',BASE).href,new URL('./assets/css/messages.css?v=studentlink-status-whatsapp-5',BASE).href,new URL('./assets/css/profile.css?v=studentlink-refactor-80',BASE).href,new URL('./assets/css/notifications.css?v=studentlink-refactor-80',BASE).href,new URL('./assets/css/games.css?v=studentlink-refactor-80',BASE).href,new URL('./assets/startup.css?v=studentlink-split-65',BASE).href,new URL('./assets/bootstrap.js?v=studentlink-status-whatsapp-5',BASE).href,new URL('./assets/js/core.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/js/notifications.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/js/feed.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/js/messages.js?v=studentlink-status-whatsapp-5',BASE).href,new URL('./assets/js/status.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/js/games.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/js/profile.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/js/main.js?v=studentlink-refactor-80',BASE).href,new URL('./assets/favicon.svg',BASE).href,new URL('./assets/icon-192.png?v=studentlink-install-62',BASE).href,new URL('./assets/icon-192.svg?v=studentlink-install-62',BASE).href,new URL('./assets/icon-512.svg?v=studentlink-install-62',BASE).href];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('studentlink-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  const rootURL=new URL('./',BASE).href;
  const refresh=fetch(request).then(response=>response.ok?caches.open(CACHE_NAME).then(cache=>cache.put(rootURL,response.clone()).then(()=>response)):response).catch(()=>null);
  event.waitUntil(refresh.then(()=>{}));
  event.respondWith((async()=>await caches.match(rootURL)||await caches.match(request)||await refresh||Response.error())());
  return;
 }
 if(APP_SHELL.includes(request.url)){
  const refresh=fetch(request).then(response=>response.ok?caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()).then(()=>response)):response).catch(()=>null);
  event.waitUntil(refresh.then(()=>{}));
  event.respondWith((async()=>await caches.match(request)||await refresh||Response.error())());
 }
});


const NOTIFICATION_DB_NAME='studentlink-notification-queue';
const NOTIFICATION_DB_VERSION=1;
const NOTIFICATION_STORE='state';
const NOTIFICATION_SUMMARY_KEY='summary';
const NOTIFICATION_SUMMARY_TAG='studentlink-notification-summary-v1';
const NOTIFICATION_QUEUE_LIMIT=5;
const NOTIFICATION_MAX_AGE=24*60*60*1000;
let fallbackNotificationQueue=[];
function openNotificationQueueDB(){
 return new Promise((resolve,reject)=>{
  if(!self.indexedDB){reject(new Error('IndexedDB unavailable'));return}
  const request=self.indexedDB.open(NOTIFICATION_DB_NAME,NOTIFICATION_DB_VERSION);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(NOTIFICATION_STORE))db.createObjectStore(NOTIFICATION_STORE,{keyPath:'key'})};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||new Error('Could not open notification queue'));
 });
}
function cleanNotificationQueue(items){
 const cutoff=Date.now()-NOTIFICATION_MAX_AGE;
 return items.filter(entry=>entry&&Number(entry.timestamp)>=cutoff).slice(-NOTIFICATION_QUEUE_LIMIT);
}
async function rememberNotification(item){
 try{
  const db=await openNotificationQueueDB();
  const items=await new Promise((resolve,reject)=>{
   const tx=db.transaction(NOTIFICATION_STORE,'readwrite');
   const store=tx.objectStore(NOTIFICATION_STORE);
   let nextItems=[];
   const request=store.get(NOTIFICATION_SUMMARY_KEY);
   request.onsuccess=()=>{
    const previous=Array.isArray(request.result?.items)?request.result.items:[];
    nextItems=cleanNotificationQueue([...previous,item]);
    store.put({key:NOTIFICATION_SUMMARY_KEY,items:nextItems});
   };
   request.onerror=()=>reject(request.error||new Error('Could not read notification queue'));
   tx.oncomplete=()=>resolve(nextItems);
   tx.onerror=()=>reject(tx.error||new Error('Could not save notification queue'));
   tx.onabort=()=>reject(tx.error||new Error('Notification queue update aborted'));
  });
  db.close();
  fallbackNotificationQueue=items;
  return items;
 }catch(error){
  console.warn('StudentLink notification queue persistence unavailable:',error);
  fallbackNotificationQueue=cleanNotificationQueue([...fallbackNotificationQueue,item]);
  return fallbackNotificationQueue;
 }
}
async function clearNotificationQueue(){
 try{
  const db=await openNotificationQueueDB();
  await new Promise((resolve,reject)=>{
   const tx=db.transaction(NOTIFICATION_STORE,'readwrite');
   tx.objectStore(NOTIFICATION_STORE).delete(NOTIFICATION_SUMMARY_KEY);
   tx.oncomplete=resolve;
   tx.onerror=()=>reject(tx.error||new Error('Could not clear notification queue'));
   tx.onabort=()=>reject(tx.error||new Error('Notification queue clear aborted'));
  });
  db.close();
 }catch(error){console.warn('StudentLink could not clear notification queue:',error)}
 fallbackNotificationQueue=[];
}
function notificationLine(item){
 const heading=String(item.title||'StudentLink').trim();
 const message=String(item.body||'').replace(/\s+/g,' ').trim();
 const shortened=message.length>110?message.slice(0,107)+'…':message;
 return shortened?heading+': '+shortened:heading;
}
async function showGroupedStudentLinkNotification(title,options={}){
 const now=Date.now();
 const item={
  id:now.toString(36)+'-'+Math.random().toString(36).slice(2,8),
  timestamp:now,
  title:String(title||'StudentLink notification'),
  body:String(options.body||''),
  data:options.data&&typeof options.data==='object'?options.data:{},
  actions:Array.isArray(options.actions)?options.actions:[]
 };
 const items=await rememberNotification(item);
 const latest=items[items.length-1]||item;
 const count=items.length;
 const summaryTitle=count===1?'StudentLink · 1 notification':`StudentLink · ${count} notifications`;
 const summaryBody=items.map(notificationLine).join('\n');
 const summaryOptions={
  ...options,
  body:summaryBody,
  tag:NOTIFICATION_SUMMARY_TAG,
  renotify:true,
  silent:options.silent===true,
  data:{...latest.data,notificationCount:count,summary:true},
  actions:latest.actions
 };
 await self.registration.showNotification(summaryTitle,summaryOptions);
 const badgeCount=Number(options.badgeCount);
 if(typeof self.navigator?.setAppBadge==='function'&&Number.isFinite(badgeCount)){
  try{await (badgeCount>0?self.navigator.setAppBadge(badgeCount):self.navigator.clearAppBadge())}catch(error){console.warn('StudentLink app badge update failed:',error)}
 }
}
self.addEventListener('message',event=>{
 const message=event.data;
 if(!message||message.type!=='STUDENTLINK_SHOW_NOTIFICATION')return;
 const title=typeof message.title==='string'?message.title:'StudentLink';
 const options=message.options&&typeof message.options==='object'?message.options:{};
 event.waitUntil(showGroupedStudentLinkNotification(title,options).catch(error=>console.error('StudentLink grouped notification failed:',error)));
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
   url:typeof payload.url==='string'?payload.url:(typeof payload.target_url==='string'?payload.target_url:'?openMessages=1'),
   type:typeof payload.type==='string'?payload.type:(typeof payload.notification_type==='string'?payload.notification_type:(String(payload.url||payload.target_url||'').includes('openFriends=1')?'friend_request':String(payload.url||payload.target_url||'').includes('openProfile=')?'album':'message')),
   conversationId:typeof payload.conversationId==='string'?payload.conversationId:(typeof payload.conversation_id==='string'?payload.conversation_id:''),
   profileId:typeof payload.profileId==='string'?payload.profileId:(typeof payload.actorId==='string'?payload.actorId:(typeof payload.actor_id==='string'?payload.actor_id:'')),
   notificationId:typeof payload.notificationId==='string'?payload.notificationId:''
  },
  actions:typeof payload.notificationId==='string'&&payload.notificationId?[{action:'reply',title:'Reply'}]:[]
 };
 event.waitUntil(showGroupedStudentLinkNotification(title,options));
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
    // Only reuse StudentLink windows; do not navigate another page on the same origin.
    let clientURL;
    try{clientURL=new URL(client.url)}catch(_){continue}
    if(clientURL.origin!==scopeURL.origin||!clientURL.pathname.startsWith(scopeURL.pathname))continue;
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
  event.waitUntil(clearNotificationQueue());
  const data=event.notification.data||{};
  const scopeURL=new URL(self.registration.scope);
  let destination;
  try{
    destination=new URL(data.url||'?openMessages=1',scopeURL);
  }catch(_){
    destination=new URL('?openMessages=1',scopeURL);
  }
  // Normalize untrusted push payload URLs before manipulating their query strings.
  if(destination.origin!==scopeURL.origin||!destination.pathname.startsWith(scopeURL.pathname)){
    destination=new URL('?openMessages=1',scopeURL);
  }
  if(data.type==='message'){
    destination.searchParams.set('openMessages','1');
    if(data.conversationId&&!destination.searchParams.has('conversation'))destination.searchParams.set('conversation',String(data.conversationId));
  }else if(['album','photo','profile_photo','profile_picture','profile'].includes(data.type)&&data.profileId){
    destination.searchParams.set('openProfile',String(data.profileId));
  }
  if(event.action==='reply'){
    // The action opens StudentLink's chat composer; web push actions cannot
    // reliably provide a native text field across supported browsers.
    destination.searchParams.set('openMessages','1');
    destination.searchParams.set('reply','1');
  }
  event.waitUntil(openStudentLinkDestination(destination.href));
});
