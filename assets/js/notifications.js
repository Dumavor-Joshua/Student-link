function base64UrlToUint8Array(value){
  const padding='='.repeat((4-value.length%4)%4);
  const base64=(value+padding).replaceAll('-','+').replaceAll('_','/');
  const raw=atob(base64);
  return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
function arrayBufferToBase64Url(value){
  const bytes=new Uint8Array(value);
  let binary='';
  for(let i=0;i<bytes.length;i++)binary+=String.fromCharCode(bytes[i]);
  return btoa(binary).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
async function subscribeToPushNotifications(){
  if(!window.isSecureContext)throw new Error('Push notifications require a secure HTTPS connection.');
  if(!('serviceWorker' in navigator)||!('PushManager' in window))throw new Error('This browser does not support background push. On iPhone, add StudentLink to the Home Screen and open the installed app.');
  if(!S.session?.user?.id||!db)throw new Error('Sign in to StudentLink before enabling notifications.');
  const {data:pushConfig,error:keyError}=await db.from('push_public_config').select('vapid_public_key').eq('id',true).maybeSingle();
  const applicationServerKey=pushConfig?.vapid_public_key;
  if(keyError||typeof applicationServerKey!=='string'||!applicationServerKey)throw new Error('StudentLink push setup is unavailable. Please try again later.');
  const registration=await navigator.serviceWorker.ready;
  let subscription=await registration.pushManager.getSubscription();
  if(!subscription){
    subscription=await registration.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:base64UrlToUint8Array(applicationServerKey)
    });
  }
  const p256dh=subscription.getKey('p256dh');
  const authKey=subscription.getKey('auth');
  if(!p256dh||!authKey)throw new Error('The browser did not provide a valid push subscription.');
  const {error}=await db.from('push_subscriptions').upsert({
    endpoint:subscription.endpoint,
    user_id:S.session.user.id,
    p256dh:arrayBufferToBase64Url(p256dh),
    auth:arrayBufferToBase64Url(authKey),
    updated_at:new Date().toISOString()
  },{onConflict:'endpoint'});
  if(error)throw error;
  return true;
}
async function syncStudentLinkDeviceBadge(count){
  try{
    if(!('setAppBadge' in navigator)&&!('clearAppBadge' in navigator))return;
    if(Number(count)>0&&typeof navigator.setAppBadge==='function')await navigator.setAppBadge(Math.min(999,Number(count)));
    else if(typeof navigator.clearAppBadge==='function')await navigator.clearAppBadge();
  }catch(error){console.debug('StudentLink device app badge is unavailable on this platform:',error);}
}
async function refreshNotificationHistoryBadge(){
  if(!db||!S.session?.user?.id)return;
  const {count,error}=await db.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',S.session.user.id).is('read_at',null);
  if(error){console.warn('Notification history count could not load:',error);return}
  const badge=document.getElementById('notifications-history-count');
  if(!badge)return;
  badge.textContent=Number(count||0)>99?'99+':String(count||0);
  badge.hidden=!(count>0);
  await syncStudentLinkDeviceBadge(count||0);
  badge.style.cssText='display:'+(count>0?'inline-flex':'none')+';align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 4px;border-radius:999px;background:#dc2626;color:#fff;font-size:11px;font-weight:700;margin-left:4px';
}
async function openNotificationHistory(){
  const button=document.getElementById('notifications-history-toggle');
  if(!db||!S.session?.user?.id){toast('Sign in to view your notifications.');return}
  let panel=document.getElementById('studentlink-notification-history');
  if(panel){panel.remove();return}
  panel=document.createElement('section');
  panel.id='studentlink-notification-history';
  panel.setAttribute('aria-label','Notification history');
  panel.style.cssText='position:fixed;z-index:2147483000;top:72px;right:12px;width:min(390px,calc(100vw - 24px));max-height:min(70vh,560px);overflow:auto;overscroll-behavior:contain;padding:0 14px 14px;border:1px solid var(--line);border-radius:14px;background:var(--p);color:var(--txt);box-shadow:0 12px 36px rgba(0,0,0,.32);isolation:isolate;box-sizing:border-box';
  panel.innerHTML='<div style="position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 -14px 10px;padding:12px 14px;background:var(--p);border-bottom:1px solid var(--line);border-radius:14px 14px 0 0"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close" aria-label="Close notifications" style="position:relative;z-index:21;display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;flex:0 0 auto;min-height:38px;padding:8px 14px;background:var(--p2);color:var(--txt);border:1px solid var(--line);border-radius:9px">Close</button></div><div class="tiny">Loading notification history…</div>';
  document.body.appendChild(panel);
  
  const {data,error}=await db.from('notifications').select('id,type,title,body,target_url,related_id,actor_id,created_at,read_at').eq('user_id',S.session.user.id).is('read_at',null).order('created_at',{ascending:false}).limit(5);
  if(!panel.isConnected)return;
  if(error){panel.innerHTML='<div class="notification-panel-heading"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close" aria-label="Close notifications">Close ✕</button></div><p class="tiny">Notification history could not load. Please try again.</p>';console.warn('Notification history could not load:',error);return}
  if(!data?.length){panel.innerHTML='<div class="notification-panel-heading"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close" aria-label="Close notifications">Close ✕</button></div><p class="tiny notification-empty-state">No new notifications.</p>';return}
  panel.innerHTML='<div class="notification-panel-heading"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close" aria-label="Close notifications">Close ✕</button></div>'+data.map(item=>'<article data-notification-card="'+esc(item.id)+'" style="padding:10px 8px;border-bottom:1px solid var(--line);border-radius:8px;background:'+(item.read_at?'var(--p)':'var(--p2)')+'"><div class="notification-card-actions"><button type="button" data-notification-id="'+esc(item.id)+'" data-notification-type="'+esc(item.type)+'" class="notification-open" style="display:block;flex:1;min-width:0;text-align:left;padding:0;border:0;background:transparent;color:var(--txt);cursor:pointer"><strong>'+esc(item.title)+'</strong><div style="font-size:13px;margin-top:3px">'+esc(item.body||'')+'</div><div class="tiny" style="margin-top:5px">'+esc(new Date(item.created_at).toLocaleString())+(item.read_at?'':' · New')+'</div></button><button type="button" class="notification-dismiss" data-dismiss-notification="'+esc(item.id)+'" aria-label="Dismiss '+esc(item.title)+'" title="Dismiss notification">✕</button></div>'+(item.type==='message'?'<form data-quick-reply="'+esc(item.id)+'" style="display:flex;gap:6px;margin-top:9px"><input name="reply" maxlength="1500" aria-label="Reply to '+esc(item.title)+'" placeholder="Reply…" style="min-width:0;flex:1;width:0;padding:9px 11px;border:1px solid var(--line);border-radius:18px;background:var(--p);color:var(--txt);font:inherit;font-size:14px" required><button type="submit" class="btn" style="padding:8px 12px;border-radius:18px;white-space:nowrap">Send</button></form>':'')+'</article>').join('');
  
  /* Delegate dismiss clicks from the panel itself and remove the card immediately.
     The database delete then persists the dismissal for the signed-in user. */
  if(!panel.dataset.dismissHandlerBound){
    panel.dataset.dismissHandlerBound='true';
    panel.addEventListener('click',async event=>{
      const dismissButton=event.target instanceof Element?event.target.closest('[data-dismiss-notification]'):null;
      if(!dismissButton||!panel.contains(dismissButton))return;
      event.preventDefault();event.stopPropagation();
      if(dismissButton.dataset.busy==='true')return;
      const id=dismissButton.dataset.dismissNotification;
      const card=dismissButton.closest('[data-notification-card]');
      if(!id||!card)return;
      dismissButton.dataset.busy='true';
      dismissButton.disabled=true;
      card.classList.add('notification-dismissing');
      card.setAttribute('aria-busy','true');
      /* Remove it from the visible list immediately so the control always responds. */
      card.remove();
      if(!panel.querySelector('[data-notification-card]')&&!panel.querySelector('.notification-empty-state')){
        panel.insertAdjacentHTML('beforeend','<p class="tiny notification-empty-state">No notifications left in this panel.</p>');
      }
      try{
        const {data:deleted,error:dismissError}=await db.from('notifications')
          .delete().eq('id',id).eq('user_id',S.session.user.id).select('id').maybeSingle();
        if(dismissError)throw dismissError;
        if(!deleted?.id)throw new Error('The server did not confirm this notification was deleted.');
        const index=data.findIndex(row=>String(row.id)===String(id));
        if(index>=0)data.splice(index,1);
        await refreshNotificationHistoryBadge();
      }catch(error){
        console.error('StudentLink notification dismissal failed:',error);
        toast('Hidden for now, but could not save dismissal. Check your connection and try again.');
      }
    });
  }
  panel.querySelectorAll('[data-notification-id]').forEach(itemButton=>itemButton.onclick=async()=>{
    const item=data.find(row=>row.id===itemButton.dataset.notificationId);
    if(item&&!item.read_at){const {error:readError}=await db.from('notifications').update({read_at:new Date().toISOString()}).eq('id',item.id);if(readError){console.warn('Could not mark notification read:',readError);return}item.read_at=new Date().toISOString()}
    panel.remove();await refreshNotificationHistoryBadge();
    if(!item){setView('profile');return}
    if(item.type==='friend_request'){setView('friends');return}
    if(item.type==='message'){
      let conversationId='';
      try{const target=new URL(item.target_url||location.href,document.baseURI);conversationId=target.searchParams.get('conversation')||''}catch(_){}
      if(!conversationId&&item.related_id){
        const {data:message,error:messageError}=await db.from('messages').select('conversation_id').eq('id',item.related_id).maybeSingle();
        if(messageError)console.warn('Could not resolve notification conversation:',messageError);
        conversationId=message?.conversation_id||'';
      }
      S.chat=conversationId||null;S.replyOnOpen=false;S.view='messages';syncNavigationState();await renderView();return;
    }
    // Photo/album and other activity notifications should open the person who caused them.
    if(item.actor_id){S.publicProfileId=item.actor_id;setView('public-profile');return}
    setView('profile');
  });
  panel.querySelectorAll('[data-quick-reply]').forEach(form=>form.onsubmit=async event=>{
    event.preventDefault();
    const item=data.find(row=>row.id===form.dataset.quickReply);
    const input=form.elements.reply;
    const body=String(input?.value||'').trim();
    const send=form.querySelector('button[type="submit"]');
    if(!item||item.type!=='message'||!item.related_id||!body)return;
    send.disabled=true;send.textContent='Sending…';
    try{
      const {data:original,error:originalError}=await db.from('messages').select('id,conversation_id').eq('id',item.related_id).maybeSingle();
      if(originalError)throw originalError;
      if(!original?.conversation_id)throw new Error('The original conversation is unavailable.');
      const {data:conversation,error:conversationError}=await db.from('conversations').select('id,user_a,user_b').eq('id',original.conversation_id).maybeSingle();
      if(conversationError)throw conversationError;
      if(!conversation||(conversation.user_a!==S.session.user.id&&conversation.user_b!==S.session.user.id))throw new Error('You no longer have access to this conversation.');
      const {error:sendError}=await db.from('messages').insert({conversation_id:original.conversation_id,sender_id:S.session.user.id,body});
      if(sendError)throw sendError;
      input.value='';
      item.body='You: '+body;
      const article=form.closest('article');
      const preview=article?.querySelector('[data-notification-id] div');
      if(preview)preview.textContent=item.body;
      toast('Reply sent.');
      await loadConvos();
    }catch(error){console.error('Notification quick reply failed:',error);toast(error?.message||'Could not send reply. Please try again.')}
    finally{if(send.isConnected){send.disabled=false;send.textContent='Send'}}
  });
  const unread=data.filter(item=>!item.read_at).map(item=>item.id);
  if(unread.length){const {error:markReadError}=await db.from('notifications').update({read_at:new Date().toISOString()}).eq('user_id',S.session.user.id).in('id',unread);if(markReadError)console.warn('Could not mark notifications as seen:',markReadError)}
  await refreshNotificationHistoryBadge();
  panel.querySelectorAll('[data-notification-id]').forEach(b=>{b.style.background='transparent';const meta=b.querySelector('.tiny');if(meta)meta.textContent=meta.textContent.replace(' · New','')});
}
function setupNotificationHistoryControl(){
  const button=document.getElementById('notifications-history-toggle');
  if(!button)return;
  button.addEventListener('click',()=>openNotificationHistory().catch(error=>{console.warn('Notification history failed:',error);toast('Could not open notification history.')}));
  refreshNotificationHistoryBadge();
}
function setupNotificationControl(){
  const button=document.getElementById('notifications-toggle');
  if(!button)return;
  updateNotificationButton();
  button.addEventListener('click',async()=>{
    if(!('Notification' in window)){toast('This browser does not support notifications.');return;}
    if(Notification.permission==='denied'){toast('Notifications are blocked. Allow them in your browser site settings, then reload StudentLink.');return;}
    button.disabled=true;
    try{
      let permission=Notification.permission;
      if(permission!=='granted')permission=await Notification.requestPermission();
      updateNotificationButton();
      if(permission!=='granted'){toast('Notifications were not enabled. You can enable them later in browser settings.');return;}
      await subscribeToPushNotifications();
      toast('Background message notifications are enabled on this device.');
    }catch(error){
      console.warn('Could not enable StudentLink push notifications:',error);
      toast(error?.message||'Could not enable background notifications. Check browser permissions and try again.');
    }finally{button.disabled=Notification.permission==='denied';updateNotificationButton();}
  });
}
async function sendBrowserNotification(title,body,tag,destination='?openMessages=1'){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const options={body:String(body||''),tag:String(tag||'studentlink-alert'),icon:new URL('./assets/icon-192.svg',document.baseURI).href,badge:new URL('./assets/icon-192.svg',document.baseURI).href,renotify:true,silent:false,data:{url:new URL(destination,document.baseURI).href}};
  try{
    // Route notifications through the service worker so foreground and background
    // alerts share one grouped notification instead of creating a new card per event.
    if('serviceWorker' in navigator){
      const registration=await navigator.serviceWorker.ready;
      const worker=registration.active||registration.waiting||registration.installing;
      if(worker){
        worker.postMessage({type:'STUDENTLINK_SHOW_NOTIFICATION',title:String(title||'StudentLink'),options});
        return;
      }
      if(typeof registration.showNotification==='function'){
        await registration.showNotification(title,options);
        return;
      }
    }
    const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.matchMedia?.('(display-mode: standalone)').matches;
    if(mobile)return;
    const notification=new Notification(title,options);
    notification.onclick=()=>{try{window.focus()}catch(_){};notification.close()};
  }catch(error){
    console.warn('StudentLink persistent browser notification failed:',error);
  }
}
async function notifyFriendRequest(payload){
  try{
    const row=payload?.new;
    if(!row||payload.eventType!=='INSERT'||row.status!=='pending'||row.friend_id!==S.session?.user?.id||!row.user_id)return;
    const id=String(row.id||row.user_id);
    if(S.notifiedFriendshipIds.has(id))return;
    S.notifiedFriendshipIds.add(id);
    const {data:person,error}=await db.from('profiles').select('nickname').eq('id',row.user_id).maybeSingle();
    if(error)console.warn('Could not load friend-request notification sender:',error);
    sendBrowserNotification('New friend request',((person?.nickname||'A student')+' sent you a friend request.'),'friend-request-'+id,'?openFriends=1');
  }catch(error){console.warn('Could not process friend-request notification:',error);}
}
// A short, unobtrusive incoming-message tone. Browsers require a user gesture before audio can play.
let studentLinkAudioContext=null;
function primeMessageSound(){
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    if(!studentLinkAudioContext)studentLinkAudioContext=new AudioContextClass();
    if(studentLinkAudioContext.state==='suspended')studentLinkAudioContext.resume().catch(()=>{});
  }catch(_){}
}
document.addEventListener('pointerdown',primeMessageSound,{passive:true});
document.addEventListener('keydown',primeMessageSound);
function playMessageSound(){
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    if(!studentLinkAudioContext)studentLinkAudioContext=new AudioContextClass();
    const ctx=studentLinkAudioContext;
    if(ctx.state==='suspended'){ctx.resume().then(()=>playMessageSound()).catch(()=>{});return;}
    const now=ctx.currentTime;
    const gain=ctx.createGain();gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(0.12,now+0.025);gain.gain.exponentialRampToValueAtTime(0.0001,now+0.22);gain.connect(ctx.destination);
    const oscillator=ctx.createOscillator();oscillator.type='sine';oscillator.frequency.setValueAtTime(880,now);oscillator.frequency.setValueAtTime(1175,now+0.09);oscillator.connect(gain);oscillator.start(now);oscillator.stop(now+0.23);
  }catch(error){console.warn('Message sound is unavailable in this browser:',error);}
}
async function notifyIncomingMessage(payload){
  try{
    const row=payload?.new;
    if(!row||!row.id||!row.conversation_id||row.sender_id===S.session?.user?.id)return;
    const id=String(row.id);
    if(S.notifiedMessageIds.has(id))return;
    S.notifiedMessageIds.add(id);
    const {data:conversation,error}=await db.from('conversations').select('user_a,user_b').eq('id',row.conversation_id).maybeSingle();
    if(error){console.warn('Could not verify message conversation for notification:',error);return;}
    if(!conversation||![conversation.user_a,conversation.user_b].includes(S.session?.user?.id))return;
    if(S.view==='messages'&&S.chat===row.conversation_id&&document.visibilityState==='visible')return;
    playMessageSound();
    const {data:person,error:profileError}=await db.from('profiles').select('nickname').eq('id',row.sender_id).maybeSingle();
    if(profileError)console.warn('Could not load message notification sender:',profileError);
    const sender=person?.nickname||'A student';
    const body=String(row.body||'').trim();
    sendBrowserNotification('New message from '+sender,body.length>140?body.slice(0,137)+'…':body||'You received a new message.','message-'+id,'?openMessages=1&conversation='+encodeURIComponent(row.conversation_id));
  }catch(error){console.warn('Could not process message notification:',error);}
}
async function setUpRealtime(){
  if(!db||!S.session)return;
  if(S.channel){await db.removeChannel(S.channel);S.channel=null}
  const refreshPosts=()=>{S.feedOrderIds=[];S.feedOrderMode='';if(S.view==='feed')renderView()};
  const refreshFriends=()=>{if(S.view==='friends')renderView()};
  const refreshMessages=()=>{(async()=>{await loadConvos();if(S.view==='messages'){if(S.chat)await openConversation(S.chat);else await viewMessages()}else updateMessageBadges()})().catch(e=>console.warn('Could not refresh message badges:',e))};
  const refreshLikeCount=payload=>{
    const row=payload.eventType==='DELETE'?payload.old:payload.new;
    if(!row||!row.post_id)return;
    // The active tab already updates its own Like button after Supabase confirms the request.
    // Ignore this user's event to avoid double-counting; update other users' visible buttons only.
    if(row.user_id===S.session.user.id)return;
    const delta=payload.eventType==='INSERT'?1:payload.eventType==='DELETE'?-1:0;
    if(!delta)return;
    $$('[data-like]').filter(button=>button.dataset.like===String(row.post_id)).forEach(button=>{
      const match=(button.textContent||'').match(/(\d+)\s*$/);
      const current=match?Number(match[1]):0;
      const next=Math.max(0,current+delta);
      button.textContent='❤️ '+next;
      button.setAttribute('aria-label',(button.classList.contains('liked')?'Unlike':'Like')+' post; '+next+' likes');
    });
  };
  const onFriendshipChange=payload=>{refreshFriends();notifyFriendRequest(payload)};
  const onMessageChange=payload=>{refreshMessages();notifyIncomingMessage(payload)};
  const onNotificationChange=payload=>{refreshNotificationHistoryBadge();if(payload.eventType==='INSERT'&&payload.new?.type==='friend_request')playMessageSound();if(payload.eventType==='INSERT'&&payload.new?.type==='message'&&document.visibilityState!=='visible')refreshNotificationHistoryBadge()};
  S.channel=db.channel('studentlink-live-updates')
    .on('postgres_changes',{event:'*',schema:'public',table:'posts'},refreshPosts)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+S.session.user.id},onNotificationChange)
    .on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},refreshLikeCount)
    .on('postgres_changes',{event:'*',schema:'public',table:'friendships'},onFriendshipChange)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},onMessageChange)
    .subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('StudentLink realtime status:',status)});
}