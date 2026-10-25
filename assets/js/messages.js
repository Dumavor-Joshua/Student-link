async function viewFriends(){
  const {data:rows,error}=await db.from('friendships').select('user_id,friend_id,status').or(`user_id.eq.${S.session.user.id},friend_id.eq.${S.session.user.id}`);
  if(error)throw error;
  const sent=new Set((rows||[]).filter(r=>r.status==='pending'&&r.user_id===S.session.user.id).map(r=>r.friend_id));
  const received=new Set((rows||[]).filter(r=>r.status==='pending'&&r.friend_id===S.session.user.id).map(r=>r.user_id));
  const friendIds=new Set((rows||[]).filter(r=>r.status==='accepted').map(r=>r.user_id===S.session.user.id?r.friend_id:r.user_id));
  const {data:people,error:peopleError}=await db.from('profiles').select('id,nickname,school,avatar_url').neq('id',S.session.user.id).order('nickname').limit(100);
  if(peopleError)throw peopleError;
  // Keep discovery bounded, but always load all friends and pending-request participants.
  const relatedIds=[...new Set([...friendIds,...sent,...received])].filter(id=>id!==S.session.user.id);
  const relatedResult=relatedIds.length?await db.from('profiles').select('id,nickname,school,avatar_url').in('id',relatedIds):{data:[],error:null};
  if(relatedResult.error)throw relatedResult.error;
  const visibleById=new Map((people||[]).map(p=>[p.id,p]));
  (relatedResult.data||[]).forEach(p=>visibleById.set(p.id,p));
  const visiblePeople=[...visibleById.values()].sort((a,b)=>String(a.nickname||'').localeCompare(String(b.nickname||'')));
  S.friends=visiblePeople.filter(p=>friendIds.has(p.id));
  let html=`<div class='head'><h1 class='title'>Friends</h1><span class='tiny'>${S.friends.length} friends</span></div>`;
  html+=visiblePeople.map(p=>`<div class='card'><div style='display:flex;justify-content:space-between;align-items:center;gap:12px'><div style='display:flex;align-items:center;gap:10px;min-width:0'><button type="button" class="profile-open" data-public-profile="${esc(p.id)}" aria-label="View ${esc(p.nickname)}'s profile">${profileAvatarMarkup(p.nickname,p.avatar_url,'avatar')}</button><div><button type="button" class="profile-name-link" data-public-profile="${esc(p.id)}">${esc(p.nickname)}</button><div class='tiny'>${esc(p.school||'No school')}</div></div></div><div style='display:flex;gap:8px;flex-wrap:wrap'>${friendIds.has(p.id)?`<button type='button' class='btn btn-secondary' data-messagefriend='${esc(p.id)}'>Message</button>`:received.has(p.id)?`<button type='button' class='btn' data-accept='${esc(p.id)}'>Accept</button><button type='button' class='btn btn-secondary' data-decline='${esc(p.id)}'>Decline</button>`:sent.has(p.id)?`<button type='button' class='btn btn-secondary' disabled>Requested</button>`:`<button type='button' class='btn' data-add='${esc(p.id)}'>Add friend</button>`}</div></div></div>`).join('');
  $('#main').innerHTML=html;wireActions();
}
async function startConversation(friendId){if(friendId===S.session?.user?.id)return toast('You cannot message yourself.');if(!S.friends.some(f=>f.id===friendId)){const {data:relationship,error:relationshipError}=await db.from('friendships').select('user_id,friend_id,status').or(`and(user_id.eq.${S.session.user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${S.session.user.id})`).eq('status','accepted').limit(1).maybeSingle();if(relationshipError)throw relationshipError;if(!relationship)return toast('Add this student as a friend first.');const {data:friendProfile,error:profileError}=await db.from('profiles').select('id,nickname,school,avatar_url').eq('id',friendId).maybeSingle();if(profileError)throw profileError;if(friendProfile)S.friends=[...S.friends.filter(f=>f.id!==friendId),friendProfile]}const me=S.session.user.id;const [user_a,user_b]=[me,friendId].sort();let {data,error}=await db.from('conversations').select('id').eq('user_a',user_a).eq('user_b',user_b).maybeSingle();if(error)throw error;if(!data){let {data:newConvo,error:createErr}=await db.from('conversations').insert({user_a,user_b}).select();if(createErr)throw createErr;data=newConvo[0]}S.chat=data.id;S.publicProfileId=null;S.view='messages';syncNavigationState();await renderView()}
async function viewMessages(){
 await loadConvos();
 $('#main').innerHTML='<div class="head messages-page-head"><button type="button" class="btn btn-secondary messages-back-feed" id="messages-back-feed" aria-label="Back to feed">← Feed</button><div class="messages-page-title"><h1 class="title">Messages</h1><p class="tiny">Chat privately with accepted friends.</p></div><div class="messages-status-strip" aria-label="Status updates"><button type="button" class="status-add-button" id="status-add-button" aria-controls="status-form" aria-expanded="false"><span class="status-add-wide">＋ Add status</span><span class="status-add-compact" aria-hidden="true">＋</span></button><details class="status-compose status-compose-inline"><form id="status-form" class="status-form"><input id="status-text" maxlength="240" placeholder="Share a short status…" aria-label="Status text"><input id="status-file" type="file" accept="image/*,video/*" aria-label="Add a status photo or video"><button class="btn" type="submit" id="status-publish">Post status</button></form></details><div id="status-list" class="status-list"><span class="tiny">Loading statuses…</span></div></div></div><section class="status-panel card" aria-label="Student statuses"><div class="status-panel-heading"><h2>Statuses</h2><span class="tiny">Updates disappear after 24 hours</span></div></section><section class="messenger-layout" id="messenger-layout"><aside class="messenger-sidebar"><div class="messenger-sidebar-head"><h2>Chats</h2><input class="messenger-search" id="messenger-search" type="search" placeholder="Search conversations" aria-label="Search conversations"></div><div class="messenger-conversation-list" id="convos"></div></aside><section class="messenger-chat" id="messenger-chat"><div class="messenger-empty">Choose a conversation to start chatting.</div></section></section>';
 const container=$('#convos'),layout=$('#messenger-layout');
 $('#messages-back-feed').onclick=()=>{S.chat=null;setView('feed')};
 setupStatusPanel();
 const statusComposer=$('.status-compose-inline'),statusToggle=$('#status-add-button');
 if(statusComposer&&statusToggle&&!statusToggle.dataset.statusButtonBound){
  statusToggle.dataset.statusButtonBound='1';
  statusToggle.setAttribute('aria-controls','status-form');
  statusToggle.setAttribute('aria-expanded',String(statusComposer.open));
  statusToggle.addEventListener('click',()=>{
   statusComposer.open=!statusComposer.open;
   statusToggle.setAttribute('aria-expanded',String(statusComposer.open));
   if(statusComposer.open)requestAnimationFrame(()=>$('#status-text')?.focus());
  });
  statusComposer.addEventListener('toggle',()=>statusToggle.setAttribute('aria-expanded',String(statusComposer.open)));
 }
 const renderList=(filter='')=>{const q=filter.trim().toLowerCase(),items=S.convos.filter(c=>c.otherNickname.toLowerCase().includes(q)||String(c.lastMessage||'').toLowerCase().includes(q));
 container.innerHTML=items.length?items.map(c=>'<button type="button" class="messenger-conversation '+(S.chat===c.id?'active':'')+'" data-convo="'+esc(c.id)+'">'+profileAvatarMarkup(c.otherNickname,c.otherAvatar||'','avatar',c.otherId)+'<span class="messenger-conversation-copy"><strong>'+esc(c.otherNickname)+'</strong><span class="tiny messenger-preview">'+esc(c.lastMessage||'No messages yet')+'</span></span><span class="messenger-unread-badge"'+(c.unreadCount?'':' hidden')+' aria-label="'+esc(c.unreadCount)+' unread messages">'+esc(c.unreadCount||0)+'</span></button>').join(''):'<div class="messenger-empty">'+(S.convos.length?'No matching conversations.':'No conversations yet. Add a friend to start chatting.')+'</div>';
 container.querySelectorAll('[data-convo]').forEach(el=>el.onclick=()=>openConversation(el.dataset.convo));};
 renderList();updateMessageBadges();$('#messenger-search').oninput=e=>renderList(e.target.value);
 if(S.chat&&S.convos.some(c=>c.id===S.chat))await openConversation(S.chat);
}
async function openConversation(conversationId){
 S.chat=conversationId;const convo=S.convos.find(c=>c.id===conversationId);
 const {data:messages,error}=await db.from('messages').select('id,conversation_id,sender_id,body,created_at,attachment_path,attachment_name,attachment_mime_type,attachment_size').eq('conversation_id',conversationId).order('created_at',{ascending:false}).limit(50);
 if(error)throw error;
 (messages||[]).reverse();
 let displayedMessages=messages||[];
 const isVisibleChat=S.view==='messages'&&S.chat===conversationId&&document.visibilityState==='visible';
 if(isVisibleChat){const latestKnown=(messages||[]).reduce((latest,m)=>!latest||String(m.created_at)>latest?String(m.created_at):latest,'')||new Date().toISOString();try{await updateMessageReadCursor(conversationId,latestKnown);const stateConvo=S.convos.find(c=>c.id===conversationId);if(stateConvo)stateConvo.unreadCount=0;updateMessageBadges()}catch(readError){console.warn('Could not sync this conversation read status:',readError);toast('Messages opened, but read status could not sync. Please try again.')}}
 const chat=$('#messenger-chat'),layout=$('#messenger-layout');
 if(!chat||!layout){await viewMessages();return}layout.classList.add('chat-open');document.querySelector('.layout')?.classList.add('messages-chat-open');
 const renderedMessages=await renderMessageRows(messages||[]);
 chat.innerHTML='<header class="messenger-chat-head"><button type="button" class="btn btn-secondary messenger-back" id="messenger-back" aria-label="Back to conversations">← Chats</button>'+profileAvatarMarkup(convo?.otherNickname||'Student',convo?.otherAvatar||'','avatar',convo?.otherId)+'<div class="messenger-chat-person"><h2>'+esc(convo?.otherNickname||'Conversation')+'</h2><span class="tiny">StudentLink chat</span></div></header><div class="messenger-scroll" id="message-list">'+((messages||[]).length===50?'<button type="button" class="btn btn-secondary" id="load-older-messages">Load older messages</button>':'')+(renderedMessages.join('')||'<div class="messenger-empty">This is the beginning of your conversation.</div>')+'</div><form id="msgform" class="messenger-composer"><input id="message-file" class="message-file-input" type="file" aria-label="Choose a file to attach"><button type="button" class="btn btn-secondary messenger-attach" id="attach-file" aria-label="Attach a file" title="Attach a file">📎</button><button type="button" class="btn btn-secondary messenger-sticker-toggle" id="sticker-toggle" aria-label="Choose a sticker" title="Stickers">☺</button><textarea id="msgtext" maxlength="1500" rows="1" placeholder="Message…" aria-label="Message text"></textarea><label class="view-once-toggle"><input id="view-once-toggle" type="checkbox"> View once</label><button type="submit" class="btn" id="send-message">Send</button><div id="sticker-picker" class="sticker-picker" hidden aria-label="Sticker picker"><button type="button" class="sticker-choice" data-sticker="😀" aria-label="Send 😀 sticker">😀</button><button type="button" class="sticker-choice" data-sticker="😂" aria-label="Send 😂 sticker">😂</button><button type="button" class="sticker-choice" data-sticker="🥹" aria-label="Send 🥹 sticker">🥹</button><button type="button" class="sticker-choice" data-sticker="😍" aria-label="Send 😍 sticker">😍</button><button type="button" class="sticker-choice" data-sticker="😎" aria-label="Send 😎 sticker">😎</button><button type="button" class="sticker-choice" data-sticker="🤔" aria-label="Send 🤔 sticker">🤔</button><button type="button" class="sticker-choice" data-sticker="😭" aria-label="Send 😭 sticker">😭</button><button type="button" class="sticker-choice" data-sticker="🔥" aria-label="Send 🔥 sticker">🔥</button><button type="button" class="sticker-choice" data-sticker="❤️" aria-label="Send ❤️ sticker">❤️</button><button type="button" class="sticker-choice" data-sticker="💯" aria-label="Send 💯 sticker">💯</button><button type="button" class="sticker-choice" data-sticker="👏" aria-label="Send 👏 sticker">👏</button><button type="button" class="sticker-choice" data-sticker="🎉" aria-label="Send 🎉 sticker">🎉</button><button type="button" class="sticker-choice" data-sticker="✨" aria-label="Send ✨ sticker">✨</button><button type="button" class="sticker-choice" data-sticker="🙌" aria-label="Send 🙌 sticker">🙌</button><button type="button" class="sticker-choice" data-sticker="🤝" aria-label="Send 🤝 sticker">🤝</button><button type="button" class="sticker-choice" data-sticker="💪" aria-label="Send 💪 sticker">💪</button><button type="button" class="sticker-choice" data-sticker="🌟" aria-label="Send 🌟 sticker">🌟</button><button type="button" class="sticker-choice" data-sticker="🫶" aria-label="Send 🫶 sticker">🫶</button></div></form><div id="attachment-status" class="messenger-attachment-status" hidden></div>';
 if(S.replyOnOpen){S.replyOnOpen=false;const composer=$('#msgtext');if(composer){composer.placeholder='Write your reply…';composer.focus();}}
 const list=$('#message-list');if(list)list.scrollTop=list.scrollHeight;
 if(!chat.dataset.viewOnceHandler){chat.dataset.viewOnceHandler='bound';chat.addEventListener('click',e=>{const onceButton=e.target.closest('[data-view-once]');if(onceButton){onceButton.disabled=true;openViewOnceMessage(onceButton.dataset.viewOnce).finally(()=>{if(onceButton.isConnected)onceButton.disabled=false})}})}
 const olderButton=$('#load-older-messages');
 if(olderButton)olderButton.onclick=async()=>{
   const oldest=displayedMessages[0];if(!oldest)return;
   olderButton.disabled=true;
   try{
     const {data:olderRows,error:olderError}=await db.from('messages').select('id,conversation_id,sender_id,body,created_at,attachment_path,attachment_name,attachment_mime_type,attachment_size').eq('conversation_id',conversationId).lt('created_at',oldest.created_at).order('created_at',{ascending:false}).limit(50);
     if(olderError)throw olderError;
     const older=(olderRows||[]).reverse();
     if(!older.length){olderButton.remove();return;}
     const markup=await renderMessageRows(older);
     const previousHeight=list.scrollHeight,previousTop=list.scrollTop;
     olderButton.insertAdjacentHTML('afterend',markup.join(''));
     displayedMessages=[...older,...displayedMessages];
     list.scrollTop=previousTop+(list.scrollHeight-previousHeight);
     if(older.length<50)olderButton.remove();
   }catch(error){console.warn('Could not load older messages:',error);toast('Older messages could not be loaded. Try again.');}
   finally{if(olderButton.isConnected)olderButton.disabled=false;}
 };
 $('#messenger-back').onclick=()=>{layout.classList.remove('chat-open');document.querySelector('.layout')?.classList.remove('messages-chat-open');S.chat=null};
 const fileInput=$('#message-file'),attachButton=$('#attach-file'),attachmentStatus=$('#attachment-status');
 const stickerPicker=$('#sticker-picker'),stickerToggle=$('#sticker-toggle');stickerToggle.setAttribute('aria-expanded','false');stickerToggle.onclick=()=>{stickerPicker.hidden=!stickerPicker.hidden;stickerToggle.setAttribute('aria-expanded',String(!stickerPicker.hidden))};stickerPicker.querySelectorAll('[data-sticker]').forEach(b=>b.onclick=async()=>{stickerPicker.hidden=true;stickerToggle.setAttribute('aria-expanded','false');b.disabled=true;try{await sendStickerMessage(conversationId,b.dataset.sticker)}finally{b.disabled=false}});if(!document.documentElement.dataset.stickerDismissBound){document.documentElement.dataset.stickerDismissBound='1';document.addEventListener('click',event=>{const picker=$('#sticker-picker'),toggle=$('#sticker-toggle');if(picker&&!picker.hidden&&!event.target.closest('#sticker-picker')&&!event.target.closest('#sticker-toggle')){picker.hidden=true;toggle?.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',event=>{if(event.key==='Escape'){const picker=$('#sticker-picker'),toggle=$('#sticker-toggle');if(picker&&!picker.hidden){picker.hidden=true;toggle?.setAttribute('aria-expanded','false')}}})}
 attachButton.onclick=()=>fileInput.click();
 fileInput.onchange=()=>{const file=fileInput.files?.[0];if(!file){attachmentStatus.hidden=true;attachmentStatus.textContent='';return;}if(file.size<=0||file.size>=5*1024*1024){toast('Choose a non-empty file smaller than 5 MB.');fileInput.value='';attachmentStatus.hidden=true;attachmentStatus.textContent='';return;}attachmentStatus.textContent='📎 '+file.name+' · '+formatAttachmentSize(file.size)+' · ready to send';attachmentStatus.hidden=false;};
 $('#msgtext').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#msgform').requestSubmit()}});
 $('#msgform').onsubmit=async e=>{e.preventDefault();const input=$('#msgtext'),body=input.value.trim(),send=$('#send-message'),file=fileInput.files?.[0];if(!body&&!file)return;if(file&&(file.size<=0||file.size>=5*1024*1024)){toast('Choose a non-empty file smaller than 5 MB.');return;}if(file&&$('#view-once-toggle')?.checked&&!file.type.startsWith('image/')){toast('View once is only available for image attachments.');return;}send.disabled=true;attachButton.disabled=true;let uploadedPath=null;try{if(file){const extension=(file.name.match(/\.([a-zA-Z0-9]{1,12})$/)||[])[1]||'bin';uploadedPath=conversationId+'/'+S.session.user.id+'/'+makeRandomId()+'.'+extension.toLowerCase();const {error:uploadError}=await db.storage.from('message-files').upload(uploadedPath,file,{cacheControl:'3600',upsert:false,contentType:file.type||'application/octet-stream'});if(uploadError)throw uploadError;}const once=Boolean(file&&$('#view-once-toggle')?.checked);const messageBody=(once?'[[view-once]] ':'')+(body||(file?'📎 File attached':'Message'));const {error:sendError}=await db.from('messages').insert({conversation_id:conversationId,sender_id:S.session.user.id,body:messageBody,attachment_path:uploadedPath,attachment_name:file?.name||null,attachment_mime_type:file?.type||null,attachment_size:file?.size||null});if(sendError)throw sendError;input.value='';fileInput.value='';if($('#view-once-toggle'))$('#view-once-toggle').checked=false;attachmentStatus.hidden=true;attachmentStatus.textContent='';await loadConvos();await openConversation(conversationId)}catch(err){console.error(err);if(uploadedPath){const {error:cleanupError}=await db.storage.from('message-files').remove([uploadedPath]);if(cleanupError)console.warn('Could not clean up an unsent attachment:',cleanupError)}toast(file?'The message or attachment could not be sent. Please try again.':'Message could not be sent. Please try again.')}finally{if($('#send-message'))$('#send-message').disabled=false;if($('#attach-file'))$('#attach-file').disabled=false}};

}
async function sendStickerMessage(conversationId,sticker){
 try{const {error}=await db.from('messages').insert({conversation_id:conversationId,sender_id:S.session.user.id,body:'[[sticker]]'+sticker});if(error)throw error;await loadConvos();await openConversation(conversationId)}
 catch(error){console.error('Sticker send failed:',error);toast('Sticker could not be sent. Try again.')}
}
function showViewOnceImagePreview(url){
 const overlay=document.createElement('div');overlay.className='studentlink-image-viewer view-once-image-viewer';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','View-once image preview');
 overlay.innerHTML='<button type="button" class="image-viewer-close" aria-label="Close view-once image">×</button><img class="image-viewer-full" alt="View-once image"><div class="image-viewer-caption">This image is view-once. Close the preview when finished.</div>';
 const image=overlay.querySelector('img');image.src=url;
 const close=()=>{image.removeAttribute('src');overlay.remove();document.body.classList.remove('image-viewer-open');document.removeEventListener('keydown',onKey);};
 const onKey=event=>{if(event.key==='Escape'){event.preventDefault();close();}};
 overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('.image-viewer-close'))close();});
 document.body.appendChild(overlay);document.body.classList.add('image-viewer-open');document.addEventListener('keydown',onKey);overlay.querySelector('.image-viewer-close').focus();
}
async function openViewOnceMessage(messageId){
 try{
  const conversationId=S.chat;
  const {data:path,error}=await db.rpc('studentlink_consume_view_once',{p_message_id:messageId});
  if(error)throw error;
  if(!path){toast('This view-once photo has already been opened or is unavailable.');return;}
  const {data,error:signedError}=await db.storage.from('message-files').createSignedUrl(path,60);
  if(signedError)throw signedError;
  if(conversationId&&S.chat===conversationId)await openConversation(conversationId);
  showViewOnceImagePreview(data.signedUrl);
 }catch(error){console.error('View-once open failed:',error);toast('This photo could not be opened. It may already have been viewed.')}
}
async function renderMessageRows(rows){
 const messages=rows||[];
 const onceMessages=messages.filter(m=>String(m.body||'').startsWith('[[view-once]] '));
 const onceIds=onceMessages.map(m=>m.id);
 let openedOnceIds=new Set();
 if(onceIds.length&&S.session?.user?.id){try{const {data,error}=await db.from('message_view_once_opens').select('message_id').in('message_id',onceIds);if(!error)openedOnceIds=new Set((data||[]).map(r=>r.message_id))}catch(_){}}
 // Batch signed URL creation: one Storage request instead of one request per attachment.
 // View-once media is deliberately excluded so it cannot be previewed before consumption.
 const regularPaths=[...new Set(messages.filter(m=>m.attachment_path&&!String(m.body||'').startsWith('[[view-once]] ')).map(m=>m.attachment_path))];
 const signedByPath=new Map();
 if(regularPaths.length){try{const {data,error}=await db.storage.from('message-files').createSignedUrls(regularPaths,3600);if(!error)(data||[]).forEach(item=>{if(item.path&&item.signedUrl)signedByPath.set(item.path,item.signedUrl)})}catch(error){console.warn('Could not sign message attachments:',error)}}
 return messages.map(m=>{
   let attachmentHTML='';
   const rawBody=String(m.body||''),isOnce=rawBody.startsWith('[[view-once]] '),isSticker=rawBody.startsWith('[[sticker]]'),displayBody=isOnce?rawBody.slice(14):isSticker?'':rawBody;
   if(m.attachment_path&&!isOnce){
     const signedUrl=signedByPath.get(m.attachment_path);
     if(signedUrl){
       const fileName=esc(m.attachment_name||'attachment');
       const fileSize=esc(formatAttachmentSize(m.attachment_size));
       const isImage=String(m.attachment_mime_type||'').toLowerCase().startsWith('image/');
       const imagePreview=isImage?'<img class="message-attachment-image" data-message-image-preview src="'+esc(signedUrl)+'" alt="'+fileName+'" loading="lazy" decoding="async">':'';
       attachmentHTML=(imagePreview?'<div class="message-attachment-image-wrap">'+imagePreview+'</div>':'')+'<a class="message-attachment" href="'+esc(signedUrl)+'" target="_blank" rel="noopener noreferrer" download="'+fileName+'">'+(isImage?'⬇️ Download image':'📎 '+fileName)+' <span class="message-attachment-size">'+fileSize+'</span></a>';
     }else attachmentHTML='<span class="message-attachment-unavailable">📎 Attachment unavailable</span>';
   }
   let finalAttachment=attachmentHTML;
   if(isOnce&&m.attachment_path)finalAttachment=m.sender_id===S.session.user.id?'<span class="view-once-label">◉ View-once photo sent</span>':openedOnceIds.has(m.id)?'<span class="view-once-label">✓ Photo already viewed</span>':'<button type="button" class="view-once-open" data-view-once="'+esc(m.id)+'">◉ Tap to view photo once</button>';
   const stickerHTML=isSticker?'<div class="message-sticker" role="img" aria-label="Sticker">'+esc(rawBody.slice(11))+'</div>':'';
   return '<div class="message-row '+(m.sender_id===S.session.user.id?'mine':'')+'"><div class="message-bubble">'+stickerHTML+(displayBody?messageBodyHTML(displayBody):'')+(finalAttachment?'<div class="message-attachment-wrap">'+finalAttachment+'</div>':'')+'</div><time class="message-time" datetime="'+esc(m.created_at)+'">'+esc(new Date(m.created_at).toLocaleString())+'</time></div>';
 });
}
function messageBodyHTML(value=''){
 const text=String(value),urlPattern=/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|org|net|edu|gov|gh|io|co|uk|app|dev|info|biz|me|ai|tech|online|site|store|school)(?:\/[^\s<>"']*)?)/gi;
 let html='',lastIndex=0,match;
 while((match=urlPattern.exec(text))){
   let raw=match[0],trailing='';
   while(/[.,!?;:)}\]]$/.test(raw)){trailing=raw.slice(-1)+trailing;raw=raw.slice(0,-1)}
   html+=esc(text.slice(lastIndex,match.index));
   if(raw){
     const href=/^www\./i.test(raw)?'https://'+raw:raw;
     try{const parsed=new URL(href);if(parsed.protocol==='http:'||parsed.protocol==='https:')html+='<a class="message-link" href="'+esc(parsed.href)+'" target="_blank" rel="noopener noreferrer">'+esc(raw)+'</a>';else html+=esc(raw)}
     catch(_){html+=esc(raw)}
   }
   html+=esc(trailing);lastIndex=match.index+match[0].length;
 }
 return html+esc(text.slice(lastIndex));
}
function formatAttachmentSize(bytes){const size=Number(bytes)||0;return size<1024*1024?Math.max(1,Math.round(size/1024))+' KB':(size/(1024*1024)).toFixed(2)+' MB'}
async function updateMessageReadCursor(conversationId,timestamp){if(!conversationId||!timestamp||!S.session?.user?.id)return;const {error}=await db.from('conversation_reads').upsert({conversation_id:conversationId,user_id:S.session.user.id,last_read_at:timestamp},{onConflict:'conversation_id,user_id'});if(error)throw error;S.messageReadAt[conversationId]=timestamp}
function updateMessageBadges(){
  const unreadChats=(S.convos||[]).filter(c=>Number(c.unreadCount)>0).length;
  document.querySelectorAll('[data-message-nav-badge],[data-home-unread-badge]').forEach(badge=>{badge.textContent=String(unreadChats);badge.hidden=unreadChats===0;badge.setAttribute('aria-label',unreadChats+' chats with unread messages')});
  
  // On supported installed PWAs, mirror the unread-chat count on the phone's home-screen app icon.
  try{if('setAppBadge' in navigator){if(unreadChats>0)navigator.setAppBadge(unreadChats).catch(()=>{});else if('clearAppBadge' in navigator)navigator.clearAppBadge().catch(()=>{});}}catch(_){}
  document.querySelectorAll('[data-convo]').forEach(button=>{const convo=(S.convos||[]).find(c=>c.id===button.dataset.convo);const badge=button.querySelector('.messenger-unread-badge');if(!badge)return;const count=Number(convo?.unreadCount)||0;badge.textContent=String(count);badge.hidden=count===0;badge.setAttribute('aria-label',count+' unread messages')});
}
// Realtime is the fast path; periodic and foreground refreshes keep badges correct if a mobile browser drops a socket event.
let unreadBadgeRefreshInFlight=false;
async function refreshUnreadMessageBadges(){
  if(!db||!S.session?.user?.id||unreadBadgeRefreshInFlight)return;
  unreadBadgeRefreshInFlight=true;
  try{await loadConvos()}catch(error){console.warn('Could not refresh unread message badges:',error)}
  finally{unreadBadgeRefreshInFlight=false}
}
function startUnreadBadgeSync(){
  if(window.studentLinkUnreadBadgeSyncStarted)return;
  window.studentLinkUnreadBadgeSyncStarted=true;
  window.setInterval(()=>{if(document.visibilityState==='visible')refreshUnreadMessageBadges()},15000);
  window.addEventListener('focus',refreshUnreadMessageBadges);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshUnreadMessageBadges()});
}
async function loadConvos(){
  const {data:rows,error}=await db.rpc('studentlink_conversation_summaries');
  if(error)throw error;
  const conversations=rows||[];
  const otherIds=[...new Set(conversations.map(c=>c.user_a===S.session.user.id?c.user_b:c.user_a))];
  const {data:profiles,error:profileError}=otherIds.length?await db.from('profiles').select('id,nickname,avatar_url').in('id',otherIds):{data:[],error:null};
  if(profileError)throw profileError;
  const profilesById=Object.fromEntries((profiles||[]).map(p=>[p.id,p]));
  S.messageReadAt=Object.fromEntries(conversations.map(c=>[c.conversation_id,c.last_read_at]).filter(r=>r[1]));
  S.convos=conversations.map(c=>{
    const otherId=c.user_a===S.session.user.id?c.user_b:c.user_a,person=profilesById[otherId]||{};
    return{id:c.conversation_id,otherId,otherNickname:person.nickname||'Student',otherAvatar:person.avatar_url||'',lastMessage:c.last_message_body||'',lastMessageAt:c.last_message_at||c.updated_at,unreadCount:Number(c.unread_count)||0};
  });
  S.convos.sort((a,b)=>new Date(b.lastMessageAt||0)-new Date(a.lastMessageAt||0));
  updateMessageBadges();
}