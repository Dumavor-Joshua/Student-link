/* StudentLink status composer, grouped story tray, and navigable story viewer. */
function setupStatusPanel(){
 const form=$('#status-form'),list=$('#status-list');if(!form||!list)return;
 let statusGroups=new Map(),signedByPath=new Map();
 const refresh=async()=>{
  try{
   const {data:rows,error}=await db.from('studentlink_statuses').select('id,user_id,body,media_path,media_mime_type,created_at,expires_at').gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false}).limit(1000);
   if(error)throw error;
   activeStatusUserIds=new Set((rows||[]).map(r=>r.user_id));
   document.querySelectorAll('[data-avatar-user]').forEach(el=>el.classList.toggle('has-active-status',activeStatusUserIds.has(el.dataset.avatarUser)));
   const ids=[...new Set((rows||[]).map(r=>r.user_id))];
   const {data:profiles,error:pe}=ids.length?await db.from('profiles').select('id,nickname,avatar_url').in('id',ids):{data:[],error:null};
   if(pe)throw pe;
   const byId=new Map((profiles||[]).map(p=>[p.id,p]));
   const mediaPaths=[...new Set((rows||[]).map(r=>r.media_path).filter(Boolean))];
   signedByPath=new Map();
   if(mediaPaths.length){
    const {data:signedRows,error:se}=await db.storage.from('status-media').createSignedUrls(mediaPaths,300);
    if(se)console.warn('Could not sign some status media:',se.message);
    else signedByPath=new Map((signedRows||[]).filter(item=>item.signedUrl).map(item=>[item.path,item.signedUrl]));
   }
   statusGroups=new Map();
   (rows||[]).forEach(row=>{if(!statusGroups.has(row.user_id))statusGroups.set(row.user_id,[]);statusGroups.get(row.user_id).push(row)});
   const ringFor=count=>{
    const slice=360/count,gap=Math.min(3,slice*.18),parts=[];
    for(let i=0;i<count;i++){const start=i*slice,end=(i+1)*slice-gap;parts.push('#28c58b '+start+'deg '+end+'deg','transparent '+end+'deg '+(i+1)*slice+'deg')}
    return 'conic-gradient('+parts.join(',')+')';
   };
   const thumbFor=row=>{
    const url=signedByPath.get(row.media_path);
    if(url){const safe=esc(url);return String(row.media_mime_type||'').startsWith('video/')?'<video class="status-thumb-video" src="'+safe+'" muted playsinline preload="metadata" aria-label="Video status thumbnail"></video>':'<img class="status-thumb-image" src="'+safe+'" alt="Status photo" loading="lazy">'}
    return row.body?'<span class="status-thumb-text">Aa</span>':'';
   };
   list.innerHTML=statusGroups.size?[...statusGroups.entries()].map(([userId,userRows])=>{
    const person=byId.get(userId)||{},latest=userRows[0],count=userRows.length;
    const thumb=thumbFor(latest)||profileAvatarMarkup(person.nickname||'Student',person.avatar_url||'','avatar');
    return '<button type="button" class="status-item" data-status-user="'+esc(userId)+'" aria-label="View '+esc(person.nickname||'Student')+' status updates, '+count+' '+(count===1?'status':'statuses')+'"><span class="status-avatar"><span class="status-ring" style="background:'+ringFor(count)+'"><span class="status-avatar-inner">'+thumb+'</span></span></span><span class="status-copy"><strong>'+esc(person.nickname||'Student')+'</strong><span class="status-count">'+count+' '+(count===1?'update':'updates')+'</span></span></button>';
   }).join(''):'<p class="tiny status-empty">No active statuses from your friends yet.</p>';
  }catch(error){console.warn('Could not load statuses:',error);list.innerHTML='<p class="tiny">Statuses are temporarily unavailable. Please try again later.</p>'}
 };
 form.onsubmit=async e=>{
  e.preventDefault();const body=$('#status-text').value.trim(),file=$('#status-file').files?.[0],button=$('#status-publish');
  if(!body&&!file){toast('Add text or a photo/video to your status.');return}
  if(file&&(!['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm','video/quicktime'].includes(file.type)||file.size<=0||file.size>10*1024*1024)){toast('Choose an image or video no larger than 10 MB.');return}
  if(file&&file.type.startsWith('video/')){try{const duration=await new Promise((resolve,reject)=>{const video=document.createElement('video');video.preload='metadata';video.muted=true;video.onloadedmetadata=()=>{URL.revokeObjectURL(video.src);resolve(video.duration)};video.onerror=()=>{URL.revokeObjectURL(video.src);reject(new Error('Could not read video metadata'))};video.src=URL.createObjectURL(file)});if(!Number.isFinite(duration)||duration<=0||duration>30){toast('Videos must be 30 seconds or shorter.');return}}catch(_){toast('This video could not be checked. Try another video file.');return}}
  button.disabled=true;let path=null;
  try{
   if(file){path=S.session.user.id+'/'+makeRandomId()+'.'+((file.name.match(/\.([a-zA-Z0-9]{1,8})$/)||[])[1]||'jpg').toLowerCase();const {error}=await db.storage.from('status-media').upload(path,file,{upsert:false,contentType:file.type,cacheControl:'300'});if(error)throw error}
   const {error}=await db.from('studentlink_statuses').insert({user_id:S.session.user.id,body,media_path:path,media_mime_type:file?.type||null});if(error)throw error;
   $('#status-text').value='';$('#status-file').value='';await refresh();toast('Status posted. It will expire after 24 hours.')
  }catch(error){console.error('Status publish failed:',error);if(path)await db.storage.from('status-media').remove([path]);toast('Status could not be posted. Check your connection and try again.')}
  finally{button.disabled=false}
 };
 list.addEventListener('click',e=>{const item=e.target.closest('[data-status-user]');if(item)openStatusViewer(item.dataset.statusUser)});
 function openStatusViewer(userId){
  const userRows=statusGroups.get(userId);if(!userRows?.length)return;
  const ordered=[...userRows].reverse(),personName=list.querySelector('[data-status-user="'+userId+'"] .status-copy strong')?.textContent||'Student';
  let index=0;
  const viewer=document.createElement('div');viewer.className='status-viewer';viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Status updates from '+personName);
  const progress=document.createElement('div');progress.className='status-viewer-progress';progress.setAttribute('aria-hidden','true');
  const heading=document.createElement('div');heading.className='status-viewer-heading';heading.setAttribute('aria-live','polite');
  const close=document.createElement('button');close.type='button';close.className='status-viewer-close';close.setAttribute('aria-label','Close status');close.textContent='×';
  const content=document.createElement('div');content.className='status-viewer-content';
  const previous=document.createElement('button');previous.type='button';previous.className='status-viewer-nav status-viewer-prev';previous.setAttribute('aria-label','Previous status');previous.textContent='‹';
  const next=document.createElement('button');next.type='button';next.className='status-viewer-nav status-viewer-next';next.setAttribute('aria-label','Next status');next.textContent='›';
  const dismiss=()=>{viewer.remove();document.body.classList.remove('status-viewer-open');document.removeEventListener('keydown',onKey)};
  const render=()=>{
   const row=ordered[index];heading.textContent=personName+' · '+new Date(row.created_at).toLocaleString()+' · '+(index+1)+' of '+ordered.length;
   progress.replaceChildren();ordered.forEach((_,i)=>{const segment=document.createElement('span');segment.className=i<index?'is-viewed':i===index?'is-current':'';progress.append(segment)});
   content.replaceChildren();
   const url=signedByPath.get(row.media_path);
   if(url&&String(row.media_mime_type||'').startsWith('video/')){const video=document.createElement('video');video.className='status-viewer-video';video.src=url;video.controls=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';content.append(video)}
   else if(url){const image=document.createElement('img');image.className='status-viewer-image';image.src=url;image.alt='Status photo from '+personName;content.append(image)}
   if(row.body){const text=document.createElement('p');text.className='status-viewer-text';text.textContent=row.body;content.append(text)}
   if(!url&&!row.body){const unavailable=document.createElement('p');unavailable.className='status-viewer-text';unavailable.textContent='This status media is unavailable.';content.append(unavailable)}
   previous.disabled=index===0;next.disabled=index===ordered.length-1;
  };
  const goPrevious=()=>{if(index>0){index--;render()}};
  const goNext=()=>{if(index<ordered.length-1){index++;render()}};
  const onKey=event=>{if(event.key==='Escape')dismiss();else if(event.key==='ArrowLeft')goPrevious();else if(event.key==='ArrowRight')goNext()};
  previous.addEventListener('click',goPrevious);next.addEventListener('click',goNext);close.addEventListener('click',dismiss);
  viewer.addEventListener('click',event=>{if(event.target===viewer)dismiss()});
  viewer.append(progress,heading,close,previous,content,next);document.body.append(viewer);document.body.classList.add('status-viewer-open');document.addEventListener('keydown',onKey);render();close.focus();
 }
 refresh();
}
