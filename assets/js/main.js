function setupInstallControl(){
 const button=$('#install-app');if(!button)return;
 const prompt=()=>window.studentLinkInstallPrompt;
 const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.navigator.standalone;
 if(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone){button.hidden=true;return}
 button.hidden=!(prompt()||isIOS);
 button.onclick=async()=>{
  const installPrompt=prompt();
  if(installPrompt){
   button.disabled=true;
   try{await installPrompt.prompt();const choice=await installPrompt.userChoice;if(choice?.outcome==='accepted')button.hidden=true}
   catch(error){console.warn('Install prompt could not be shown:',error);toast('Use your browser menu to install StudentLink.')}
   finally{button.disabled=false;window.studentLinkInstallPrompt=null;button.hidden=isIOS?false:true}
   return;
  }
  if(isIOS){
   modal('Install StudentLink on iPhone','<ol><li>Open StudentLink in Safari.</li><li>Tap the Share button.</li><li>Choose <b>Add to Home Screen</b>.</li><li>Tap Add to finish.</li></ol><p class="tiny">If Add to Home Screen is not shown, check Safari’s share-sheet options.</p>');
   return;
  }
  toast('Open your browser menu and choose Install app or Add to Home Screen.');
 };
}
function setupMessagesStatusCollapse(){const root=document.querySelector('.layout.messages-mode');if(!root)return;const main=root.querySelector('.main');const status=root.querySelector('.status-panel');const list=root.querySelector('#convos');if(root.dataset.statusCollapseBound==='1')return;root.dataset.statusCollapseBound='1';const collapse=()=>root.classList.add('messages-status-collapsed');const expand=()=>root.classList.remove('messages-status-collapsed');const syncList=()=>{if(list&&list.scrollTop<=2)expand();else collapse();};if(list){list.addEventListener('scroll',syncList,{passive:true});list.addEventListener('wheel',e=>{if(e.deltaY>0)collapse();else if(list.scrollTop<=2)expand();},{passive:true});list.addEventListener('touchmove',()=>{if(list.scrollTop>2)collapse();},{passive:true});}const chatScroll=root.querySelector('#messenger-chat');if(chatScroll)chatScroll.addEventListener('scroll',()=>{if(chatScroll.scrollTop>2)collapse();},{passive:true});const messagesScroll=root.querySelector('.messenger-scroll');if(messagesScroll)messagesScroll.addEventListener('scroll',()=>{if(messagesScroll.scrollTop>2)collapse();},{passive:true});if(main)main.addEventListener('scroll',()=>{if(main.scrollTop>2)collapse();else if(!list||list.scrollTop<=2)expand();},{passive:true});status?.addEventListener('click',expand);syncList();}
function syncNavigationState(){ document.querySelectorAll('[data-view]').forEach(link=>{const selected=link.dataset.view===S.view||(S.view==='game'&&link.dataset.view==='games');link.classList.toggle('active',selected);link.setAttribute('aria-current',selected?'page':'false');link.setAttribute('aria-pressed',String(selected));});const layout=document.querySelector('.layout');if(layout){layout.classList.toggle('messages-mode',S.view==='messages');if(S.view!=='messages')layout.classList.remove('messages-chat-open','messages-status-collapsed');else requestAnimationFrame(()=>setupMessagesStatusCollapse())}document.querySelector('.trending-mobile-wrap')?.classList.toggle('messages-view',S.view==='messages');}
/* Mobile Trending Schools: remain hidden on upward scroll until the header is reached. */
if(!window.__studentLinkTrendingScrollBound){
 window.__studentLinkTrendingScrollBound=true;
 let lastY=0;
 let framePending=false;
 const headerTop=()=>{
  const header=document.querySelector('.header')||document.querySelector('header')||document.querySelector('.topbar');
  return header?Math.max(0,header.getBoundingClientRect().bottom):0;
 };
 const syncTrendingVisibility=()=>{
  framePending=false;
  const strip=document.querySelector('.trending-mobile-wrap');
  if(!strip||!window.matchMedia('(max-width:760px)').matches)return;
  if(strip.classList.contains('messages-view'))return;
  const y=window.scrollY||document.documentElement.scrollTop||0;
  const main=document.querySelector('.main');
  const mainY=main?.scrollTop||0;
  const position=Math.max(y,mainY);
  /* Re-show only when the scroll position is back at the very top/header. */
  if(position<=3||headerTop()>=window.innerHeight-5)strip.classList.remove('scroll-collapsed');
  else strip.classList.add('scroll-collapsed');
  lastY=position;
 };
 const scheduleTrendingSync=()=>{
  if(framePending)return;
  framePending=true;
  window.requestAnimationFrame(syncTrendingVisibility);
 };
 window.addEventListener('scroll',scheduleTrendingSync,{passive:true});
 document.addEventListener('scroll',scheduleTrendingSync,{passive:true,capture:true});
 window.addEventListener('resize',scheduleTrendingSync,{passive:true});
 document.addEventListener('touchmove',scheduleTrendingSync,{passive:true});
 document.addEventListener('click',event=>{
  if(event.target.closest('#header-brand-home')){
   document.querySelector('.trending-mobile-wrap')?.classList.remove('scroll-collapsed');
   window.requestAnimationFrame(syncTrendingVisibility);
  }
 });
}
/* Global delegated controls: survive rerenders and notification panel content replacement. */
if(!window.__studentLinkGlobalControlsBound){
 window.__studentLinkGlobalControlsBound=true;
 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;
  if(!target)return;
  const close=target.closest('#studentlink-notification-close');
  if(close){event.preventDefault();event.stopPropagation();document.getElementById('studentlink-notification-history')?.remove();return}
  const brand=target.closest('#header-brand-home');
  if(brand){event.preventDefault();event.stopPropagation();if(typeof setView==='function')setView('feed');document.querySelector('.trending-mobile-wrap')?.classList.remove('scroll-collapsed');window.scrollTo({top:0,behavior:'auto'});document.querySelector('.main')?.scrollTo({top:0,behavior:'auto'});}
 },true);
}
/* Header brand is a reliable, direct shortcut back to the Feed. */
if(!window.__studentLinkBrandShortcutBound){
 window.__studentLinkBrandShortcutBound=true;
 document.addEventListener('click',event=>{
  const brand=event.target instanceof Element?event.target.closest('#header-brand-home'):null;
  if(!brand)return;
  event.preventDefault();
  event.stopPropagation();
  if(typeof setView==='function')setView('feed');
  const strip=document.querySelector('.trending-mobile-wrap');
  strip?.classList.remove('scroll-collapsed');
  window.scrollTo({top:0,behavior:'auto'});
  const main=document.querySelector('.main');
  if(main)main.scrollTo({top:0,behavior:'auto'});
 },true);
}
function setView(v){if(v!=='game'&&S.view==='game'){stopTttChannel();stopOnlineGameChannel();S.tttGameId=null;S.cfGameId=null;S.rpsGameId=null}S.view=v;if(v!=='school')S.schoolFilter='';if(v!=='public-profile')S.publicProfileId=null;syncNavigationState();renderView()}
function modal(title,content){$('#modaltitle').textContent=title;$('#modalcontent').innerHTML=content;$('#modalbg').classList.add('show')}
function closeModal(){$('#modalbg').classList.remove('show')}
document.addEventListener('click',e=>{if(e.target.closest('#modalclose')){e.preventDefault();closeModal()}});
function toast(msg){
  let el=document.getElementById('studentlink-toast');
  if(!el){el=document.createElement('div');el.id='studentlink-toast';el.setAttribute('role','status');el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2000;max-width:calc(100% - 32px);padding:12px 16px;border:1px solid var(--line);border-radius:8px;background:var(--p2);color:var(--txt);box-shadow:0 8px 24px rgba(0,0,0,.25)';document.body.appendChild(el)}
  el.textContent=String(msg);el.style.display='block';clearTimeout(el._hideTimer);el._hideTimer=setTimeout(()=>{el.style.display='none'},3500);
}
function wireActions(){$$('[data-messagefriend]').forEach(b=>b.onclick=()=>startConversation(b.dataset.messagefriend).catch(error=>{console.error(error);toast('Could not open this conversation. Please try again.')}));$$('[data-add]').forEach(b=>b.onclick=()=>addFriend(b.dataset.add).catch(error=>{console.error(error);toast('Could not send the friend request. Please try again.')}));$$('[data-accept]').forEach(b=>b.onclick=()=>acceptFriend(b.dataset.accept).catch(error=>{console.error(error);toast('Could not accept the friend request. Please try again.')}));$$('[data-decline]').forEach(b=>b.onclick=()=>declineFriend(b.dataset.decline).catch(error=>{console.error(error);toast('Could not decline the friend request. Please try again.')}))}
document.addEventListener('click',e=>{if(e.target.closest('#header-brand-home')){e.preventDefault();document.querySelector('.trending-mobile-wrap')?.classList.remove('scroll-collapsed');setView('feed');window.scrollTo({top:0,behavior:'smooth'});requestAnimationFrame(()=>document.querySelector('.main')?.scrollTo({top:0,behavior:'smooth'}));return}if(e.target.closest('#theme-toggle')){applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');return}const publicProfile=e.target.closest('[data-public-profile]');if(publicProfile){e.preventDefault();openPublicProfile(publicProfile.dataset.publicProfile);return}if(e.target.closest('[data-public-back]')){setView('friends');return}const sr=$('#search-results');if(sr&&!e.target.closest('.search-wrap'))sr.hidden=true;const school=e.target.closest('[data-school]');if(school){e.preventDefault();S.schoolFilter=school.dataset.school;S.view='school';syncNavigationState();if(sr)sr.hidden=true;renderView();return}let v=e.target.closest('[data-view]');if(v){e.preventDefault();setView(v.dataset.view);return}let add=e.target.closest('[data-search-add]');if(add){addFriend(add.dataset.searchAdd).catch(error=>{console.error(error);toast('Could not send the friend request. Please try again.')});if(sr)sr.hidden=true}});
async function startStudentLink(){
  const app=document.getElementById('app');
  try{
    if(!configured){
      renderAuth('signup','Setup needed: create Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.');
      return;
    }
    // Fetch the school directory while Supabase restores the session instead of blocking it first.
    const directoryReady=loadCanonicalSchoolDirectory();
    await boot(directoryReady);
  }catch(error){
    console.error('StudentLink startup failed:',error);
    if(!app)return;
    app.innerHTML='';
    const panel=document.createElement('section');
    panel.className='card state-message error-state';
    panel.style.cssText='max-width:620px;margin:24px auto;padding:24px;text-align:left';
    const heading=document.createElement('h2');
    heading.textContent='StudentLink could not finish loading';
    const message=document.createElement('p');
    message.textContent='A startup request failed. Check your connection and try again. This error handler does not change your account or saved data.';
    const detail=document.createElement('p');
    detail.className='tiny';
    detail.style.cssText='overflow-wrap:anywhere';
    detail.textContent='Error: '+String(error&&error.message||error||'Unknown startup error');
    const retry=document.createElement('button');
    retry.className='btn btn-primary';
    retry.type='button';
    retry.textContent='Try loading again';
    retry.addEventListener('click',()=>{app.textContent='Loading StudentLink…';startStudentLink()});
    panel.append(heading,message,detail,retry);
    app.appendChild(panel);
  }
}
// Last-resort diagnostics for unexpected errors. Feature-level handlers should catch expected failures first.
window.addEventListener('unhandledrejection',event=>{
  console.error('Unhandled StudentLink async error:',event.reason);
});
window.addEventListener('error',event=>{
  console.error('Unexpected StudentLink runtime error:',event.error||event.message);
});

startStudentLink();


/* In-app image viewer: delegated so feed, profile and status images work after rerenders. */
(function setupStudentLinkImageViewer(){
 if(typeof document==='undefined'||document.documentElement.dataset.studentlinkImageViewer==='ready')return;
 document.documentElement.dataset.studentlinkImageViewer='ready';
 let overlay=null,previousFocus=null;
 function close(){if(!overlay)return;overlay.remove();overlay=null;document.body.classList.remove('image-viewer-open');if(previousFocus&&previousFocus.isConnected)previousFocus.focus();previousFocus=null;}
 function open(img){
  const source=img.currentSrc||img.src;if(!source)return;
  if(!overlay){overlay=document.createElement('div');overlay.className='studentlink-image-viewer';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Image preview');overlay.innerHTML='<button type="button" class="image-viewer-close" aria-label="Close image preview">×</button><button type="button" class="image-viewer-prev" aria-label="Previous image" hidden>‹</button><img class="image-viewer-full" alt="Expanded image preview"><button type="button" class="image-viewer-next" aria-label="Next image" hidden>›</button><div class="image-viewer-caption" aria-live="polite"></div>';document.body.appendChild(overlay);overlay.addEventListener('click',e=>{if(e.target===overlay||e.target.closest('.image-viewer-close'))close();});overlay.querySelector('.image-viewer-prev').addEventListener('click',()=>step(-1));overlay.querySelector('.image-viewer-next').addEventListener('click',()=>step(1));}
  const candidates=[...document.querySelectorAll('.post-image, .profile-public-post img, .status-panel img, .message-bubble img, .status-preview-image')].filter(node=>node.complete&&node.naturalWidth>0&&node.offsetParent!==null);
  const index=Math.max(0,candidates.indexOf(img));overlay._images=candidates;overlay._index=index;previousFocus=document.activeElement;overlay.querySelector('.image-viewer-full').src=source;overlay.querySelector('.image-viewer-full').alt=img.alt||'Expanded image preview';overlay.querySelector('.image-viewer-caption').textContent=(img.alt||'Image preview')+' · Tap outside or press Escape to close';const multi=candidates.length>1;overlay.querySelector('.image-viewer-prev').hidden=!multi;overlay.querySelector('.image-viewer-next').hidden=!multi;document.body.classList.add('image-viewer-open');overlay.querySelector('.image-viewer-close').focus();
 }
 function step(delta){if(!overlay||!overlay._images?.length)return;overlay._index=(overlay._index+delta+overlay._images.length)%overlay._images.length;const img=overlay._images[overlay._index];overlay.querySelector('.image-viewer-full').src=img.currentSrc||img.src;overlay.querySelector('.image-viewer-full').alt=img.alt||'Expanded image preview';overlay.querySelector('.image-viewer-caption').textContent=(img.alt||'Image preview')+' · '+(overlay._index+1)+' of '+overlay._images.length;}
 document.addEventListener('click',e=>{const img=e.target.closest('img.post-image, .profile-public-post img, .status-panel img, .message-bubble img');if(!img||e.target.closest('a'))return;if(img.complete&&img.naturalWidth>0)open(img);});
 document.addEventListener('keydown',e=>{if(!overlay)return;if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='ArrowLeft')step(-1);else if(e.key==='ArrowRight')step(1);});
})();