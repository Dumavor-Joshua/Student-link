function profileDraftKey(){return 'studentlink-profile-draft-'+(S.session?.user?.id||'guest')}
function readProfileDraft(){try{return JSON.parse(localStorage.getItem(profileDraftKey())||'{}')}catch(_){return {}}}
function openPublicProfile(userId){
 if(!userId)return;
 if(userId===S.session?.user?.id){setView('profile');return}
 S.publicProfileId=userId;
 S.view='public-profile';
 syncNavigationState();
 renderView();
}
async function viewPublicProfile(userId){
 if(!userId)throw new Error('No student profile was selected.');
 const {data:p,error}=await db.from('profiles').select('id,nickname,school,avatar_url,bio,class_year,interests').eq('id',userId).maybeSingle();
 if(error)throw error;
 if(!p){$('#main').innerHTML='<section class="card"><h2>Profile unavailable</h2><p class="tiny">This profile may be hidden or no longer available.</p><button class="btn btn-secondary" type="button" data-public-back>Back</button></section>';return}
 const {data:friendshipRows,error:friendshipError}=await db.from('friendships').select('user_id,friend_id,status').or(`user_id.eq.${S.session.user.id},friend_id.eq.${S.session.user.id}`);
 if(friendshipError)console.warn('Could not determine this profile relationship:',friendshipError);
 const relation=(friendshipRows||[]).find(r=>(r.user_id===p.id&&r.friend_id===S.session.user.id)||(r.friend_id===p.id&&r.user_id===S.session.user.id));
 const isFriend=relation?.status==='accepted'||S.friends.some(f=>f.id===p.id);
 const action=isFriend?'<button type="button" class="btn" data-messagefriend="'+esc(p.id)+'">Message</button>':relation?.status==='pending'&&relation.user_id===S.session.user.id?'<button type="button" class="btn btn-secondary" disabled>Requested</button>':relation?.status==='pending'&&relation.friend_id===S.session.user.id?'<button type="button" class="btn" data-accept="'+esc(p.id)+'">Accept request</button><button type="button" class="btn btn-secondary" data-decline="'+esc(p.id)+'">Decline</button>':'<button type="button" class="btn" data-add="'+esc(p.id)+'">Add friend</button>';
 const interests=String(p.interests||'').split(',').map(x=>x.trim()).filter(Boolean);
 const {data:posts,error:postsError}=await db.from('posts').select('id,body,created_at,image_url').eq('user_id',p.id).order('created_at',{ascending:false}).limit(10);
 if(postsError)console.warn('Could not load public profile posts:',postsError);
 const html='<div class="head"><div class="tiny">STUDENTLINK MEMBER</div><h1 class="title">Student profile</h1><p class="tiny">Public information shared with signed-in students.</p></div>'+
 '<section class="profile-hero card"><div>'+profileAvatarMarkup(p.nickname,p.avatar_url,'avatar profile-public-avatar',p.id)+'</div><div class="profile-hero-copy"><h2>'+esc(p.nickname||'Student')+'</h2><div class="profile-school-line">🎓 '+esc(p.school||'School not provided')+'</div><p class="profile-public-bio">'+esc(p.bio||'This student has not added a bio yet.')+'</p>'+(p.class_year?'<div class="tiny">Class / year: '+esc(p.class_year)+'</div>':'')+'</div></section>'+
 '<div class="card" style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn btn-secondary" data-public-back>Back</button>'+action+'</div>'+
 '<div class="profile-public-details"><section class="card"><h2>About</h2><p class="profile-public-bio">'+esc(p.bio||'No bio provided yet.')+'</p>'+(p.class_year?'<p><b>Class / year:</b> '+esc(p.class_year)+'</p>':'')+'<div class="profile-public-interests">'+(interests.length?interests.map(x=>'<span class="interest-chip">'+esc(x)+'</span>').join(''):'<span class="tiny">No interests added yet.</span>')+'</div></section>'+
 '<section class="card"><h2>Posts</h2>'+(posts?.length?posts.map(post=>'<article class="card profile-public-post"><p>'+esc(post.body||'')+'</p>'+(post.image_url?'<img class="post-image" src="'+esc(post.image_url)+'" alt="Post image" loading="lazy">':'')+'<div class="tiny">'+esc(new Date(post.created_at).toLocaleString())+'</div></article>').join(''):'<p class="tiny">No posts to show yet.</p>')+'</section></div>';
 $('#main').innerHTML=html;
 wireActions();
}
function viewProfile(){
 const p=S.profile||{},draft=readProfileDraft(),nickname=p.nickname||'',school=p.school||'',bio=p.bio??draft.bio??'',year=p.class_year??draft.year??'',interests=p.interests??draft.interests??'',photo=p.avatar_url||'';
 const percent=Math.round([nickname,school,bio,year,interests].filter(Boolean).length/5*100);
 $('#main').innerHTML='<div class="head"><div class="tiny">YOUR SPACE</div><h1 class="title">My profile</h1><p class="tiny">Manage your profile, profile picture and account visibility.</p></div>'+
 '<section class="profile-hero card"><div id="profile-hero-avatar">'+profileAvatarMarkup(nickname,photo)+'</div><div class="profile-hero-copy"><div class="tiny">STUDENTLINK MEMBER</div><h2>'+esc(nickname||'Your nickname')+'</h2><div class="profile-school-line">🎓 '+esc(school||'Add your school')+'</div><p>'+esc(bio||'Add a short bio so classmates can get to know you.')+'</p></div><div class="profile-completion"><strong id="profile-completion-value">'+percent+'%</strong><span class="tiny">profile details</span><div class="completion-track" role="progressbar" aria-label="Profile details completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'" id="profile-completion-track"><span style="width:'+percent+'%"></span></div></div></section>'+
 '<div class="profile-grid"><section class="card"><div class="section-heading"><div><h2>Edit profile</h2><p class="tiny">Your nickname, school and photo are shared with signed-in students.</p></div><span class="profile-step">01</span></div><form id="pf">'+
 '<div class="field"><label for="profile-photo">Profile photo</label><div class="photo-picker-row"><div id="profile-photo-current">'+profileAvatarMarkup(nickname,photo,'avatar photo-avatar')+'</div><div class="photo-picker-actions"><input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp"><p class="tiny">JPG, PNG or WebP; maximum 5 MB.</p><button type="button" id="remove-profile-photo" class="btn btn-secondary" '+(photo?'':'hidden')+'>Remove photo</button></div></div><p class="profile-note">Photos are uploaded to StudentLink storage and appear across your profile and posts.</p></div>'+
 '<div class="field"><label for="pn">Nickname *</label><input id="pn" maxlength="24" minlength="3" value="'+esc(nickname)+'" required></div><div class="field"><label for="ps">School *</label>'+schoolPickerHTML('ps',school)+'</div>'+
 '<div class="field"><label for="pyear">Class / year</label><select id="pyear"><option value="">Choose your level</option>'+['SHS 1','SHS 2','SHS 3','University — Year 1','University — Year 2','University — Year 3','University — Year 4','Other'].map(v=>'<option value="'+v+'" '+(year===v?'selected':'')+'>'+v+'</option>').join('')+'</select></div>'+
 '<div class="field"><label for="pbio">About me</label><textarea id="pbio" rows="4" maxlength="240">'+esc(bio)+'</textarea><div class="tiny">Up to 240 characters.</div></div><div class="field"><label for="pinterests">Interests</label><input id="pinterests" maxlength="160" value="'+esc(interests)+'" placeholder="e.g. coding, science, football"></div>'+
 '<button type="submit" class="btn" id="save-profile">Save profile</button></form></section><aside class="profile-side"><section class="card profile-notification-settings"><div class="section-heading"><div><h2>Notifications</h2><p class="tiny">Manage background message alerts and review unread activity on this device.</p></div><span class="profile-step">02</span></div><div class="profile-notification-actions"><button class="btn btn-secondary" id="notifications-toggle" type="button" aria-label="Enable browser notifications">🔔 Enable</button><button class="btn btn-secondary" id="notifications-history-toggle" type="button" aria-label="Open notification history">🔔 Notifications <span id="notifications-history-count" hidden></span></button></div><p class="tiny">Push notifications require browser permission. If blocked, change this site’s notification permission in your browser settings.</p></section><section class="card"><h2>Profile preview</h2><div class="preview-person"><span id="preview-avatar-wrap">'+profileAvatarMarkup(nickname,photo,'avatar')+'</span><div><b id="preview-name">'+esc(nickname||'Your nickname')+'</b><div class="tiny" id="preview-school">'+esc(school||'Your school')+'</div></div></div><p id="preview-bio" class="preview-bio">'+esc(bio||'Your bio will appear here.')+'</p><div class="interest-list" id="preview-interests">'+(interests?interests.split(',').map(x=>x.trim()).filter(Boolean).map(x=>'<span class="interest-chip">'+esc(x)+'</span>').join(''):'<span class="tiny">Add interests to show them here.</span>')+'</div></section><section class="card profile-tip"><h3>Keep your account safe</h3><p class="tiny">Use a nickname you are comfortable sharing. Do not post private contact details or passwords.</p></section></aside></div>'+
 '<section class="card profile-danger-zone"><div><h2>Delete or restore your profile</h2><p class="tiny">Delete hides your profile and posts from other students. You can restore your account later by signing in again. This is reversible deactivation, not permanent erasure.</p></div><div class="profile-account-actions"><button type="button" class="btn btn-secondary" id="profile-logout">Log out</button><button type="button" class="btn btn-danger" id="delete-profile">Delete profile</button></div></section>';
 setupNotificationControl();setupNotificationHistoryControl();
 const live=()=>{const n=$('#pn').value.trim()||'Your nickname',sc=$('#ps').value.trim()||'Your school';$('#preview-name').textContent=n;$('#preview-school').textContent=sc;$('#preview-bio').textContent=$('#pbio').value.trim()||'Your bio will appear here.';const vals=$('#pinterests').value.split(',').map(x=>x.trim()).filter(Boolean);$('#preview-interests').innerHTML=vals.map(x=>'<span class="interest-chip">'+esc(x)+'</span>').join('')||'<span class="tiny">Add interests to show them here.</span>';const pc=Math.round([$('#pn').value.trim(),sc==='Your school'?'':sc,$('#pbio').value.trim(),$('#pyear').value,$('#pinterests').value.trim()].filter(Boolean).length/5*100);$('#profile-completion-value').textContent=pc+'%';$('#profile-completion-track').setAttribute('aria-valuenow',String(pc));$('#profile-completion-track span').style.width=pc+'%'};
 wireSchoolPicker('ps');['pn','ps','pyear','pbio','pinterests'].forEach(id=>{const el=$('#'+id);if(el){el.addEventListener('input',live);el.addEventListener('change',live)}});
 $('#profile-photo')?.addEventListener('change',()=>{
  const input=$('#profile-photo'),file=input.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('Choose a JPG, PNG or WebP image.');input.value='';return}
  if(file.size>5*1024*1024){toast('That image is over 5 MB. Choose a smaller file.');input.value='';return}
  const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const scale=Math.min(1,640/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');if(!ctx){toast('Image editing is unavailable.');return}ctx.drawImage(image,0,0,canvas.width,canvas.height);canvas.toBlob(async blob=>{if(!blob){toast('Could not prepare the image.');return}const save=$('#save-profile');input.disabled=true;if(save)save.disabled=true;const oldUrl=S.profile?.avatar_url||'',path=S.session.user.id+'/avatar-'+Date.now()+'.jpg';try{const {error:uploadError}=await db.storage.from('profile-photos').upload(path,blob,{contentType:'image/jpeg',cacheControl:'3600',upsert:false});if(uploadError)throw uploadError;const {data:publicData}=db.storage.from('profile-photos').getPublicUrl(path);const {error:updateError}=await db.from('profiles').update({avatar_url:publicData.publicUrl}).eq('id',S.session.user.id);if(updateError){await db.storage.from('profile-photos').remove([path]);throw updateError}await loadProfile();await removeStoredProfilePhoto(oldUrl);toast('Profile photo saved.');viewProfile()}catch(err){console.error(err);toast('Could not save the photo. Please try again.')}finally{input.disabled=false;if(save)save.disabled=false}},'image/jpeg',0.84)};image.onerror=()=>toast('Could not read that image.');image.src=String(reader.result)};reader.onerror=()=>toast('Could not open that image.');reader.readAsDataURL(file);
 });
 $('#remove-profile-photo')?.addEventListener('click',async()=>{const oldUrl=S.profile?.avatar_url||'',button=$('#remove-profile-photo');button.disabled=true;const {error}=await db.from('profiles').update({avatar_url:null}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not remove the photo.');button.disabled=false;return}S.profile.avatar_url=null;await removeStoredProfilePhoto(oldUrl);toast('Profile photo removed.');viewProfile()});
 $('#pf').onsubmit=async e=>{e.preventDefault();const n=$('#pn').value.trim(),schoolName=canonicalVerifiedSchoolName($('#ps').value.trim());if(n.length<3||n.length>24){toast('Nickname must be 3–24 characters.');return}if(!schoolName){toast('Please choose your school.');$('#ps').focus();return}const save=$('#save-profile'),extra={bio:$('#pbio').value.trim(),year:$('#pyear').value,interests:$('#pinterests').value.trim()};save.disabled=true;save.textContent='Saving…';try{const {error}=await db.from('profiles').update({nickname:n,school:schoolName,bio:extra.bio,class_year:extra.year,interests:extra.interests}).eq('id',S.session.user.id);if(error)throw error;localStorage.setItem(profileDraftKey(),JSON.stringify(extra));await loadProfile();toast('Profile saved.');viewProfile()}catch(err){console.error(err);toast('Could not save your profile. Check the nickname and try again.');save.disabled=false;save.textContent='Save profile'}};
 $('#profile-logout')?.addEventListener('click',async()=>{if(!window.confirm('Log out of StudentLink?'))return;await db.auth.signOut();S.session=null;renderAuth('login')});$('#delete-profile')?.addEventListener('click',async()=>{if(!window.confirm('Hide your profile and posts? You can restore them later by signing in again.'))return;const button=$('#delete-profile');button.disabled=true;button.textContent='Hiding profile…';const {error}=await db.from('profiles').update({deleted_at:new Date().toISOString()}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not hide your profile. Please try again.');button.disabled=false;button.textContent='Delete profile';return}await db.auth.signOut();S.session=null;renderAuth('login','Your profile is hidden. Log in again to restore it.');});
}
function profileAvatarMarkup(name,photo,className='profile-avatar',userId=''){const active=!!userId&&activeStatusUserIds.has(userId);const cls=className+(active?' has-active-status':'');const attrs=userId?' data-avatar-user="'+esc(userId)+'"':'';return photo?'<span class="'+cls+' has-photo"'+attrs+'><img src="'+esc(photo)+'" alt="Profile photo" loading="lazy" /></span>':'<span class="'+cls+'"'+attrs+'>'+initials(name||'Student')+'</span>'}
function profilePhotoStoragePath(url){try{const marker='/storage/v1/object/public/profile-photos/';const i=String(url||'').indexOf(marker);return i<0?'':decodeURIComponent(String(url).slice(i+marker.length))}catch(_){return ''}}
async function removeStoredProfilePhoto(url){const path=profilePhotoStoragePath(url);if(path&&path.startsWith(S.session.user.id+'/')){const {error}=await db.storage.from('profile-photos').remove([path]);if(error)console.warn('Old profile photo could not be removed:',error.message)}}
function renderDeletedProfile(){const root=$('#app');if(!root)return;root.innerHTML='<main class="restore-profile-wrap"><section class="card restore-profile-card"><div class="restore-profile-icon">↩</div><div class="tiny">STUDENTLINK ACCOUNT</div><h1 class="title">Your profile is currently hidden</h1><p>Your profile and posts are hidden from other students. Restore your profile to continue where you left off.</p><p class="tiny">This is a recoverable deactivation, not permanent erasure. Your data is retained so you can restore it.</p><button type="button" class="btn" id="restore-profile">Restore my profile</button><button type="button" class="btn btn-secondary" id="restore-logout">Log out</button></section></main>';$('#restore-profile').onclick=async()=>{const b=$('#restore-profile');b.disabled=true;b.textContent='Restoring…';const {error}=await db.from('profiles').update({deleted_at:null}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not restore your profile. Please try again.');b.disabled=false;b.textContent='Restore my profile';return}await boot();toast('Your profile has been restored.');};$('#restore-logout').onclick=async()=>{await db.auth.signOut();S.session=null;renderAuth('login')};}
async function viewSuggestions(){
  const userId=S.session?.user?.id;
  if(!userId){$('#main').innerHTML='<div class="card">Please sign in to submit feedback.</div>';return}
  let list=[],historyError=false;
  try{
    const {data,error}=await db.from('student_feedback').select('id,type,title,area,details,priority,status,created_at').eq('user_id',userId).order('created_at',{ascending:false}).limit(100);
    if(error)throw error;
    list=data||[];
  }catch(error){
    console.error('Feedback history could not load:',error);
    historyError=true;
  }
  const counts={all:list.length,bug:list.filter(r=>r.type==='bug').length,feature:list.filter(r=>r.type==='feature').length,feedback:list.filter(r=>r.type==='feedback').length};
  const typeLabel=type=>type==='bug'?'Bug report':type==='feature'?'Feature idea':'General feedback';
  const statusLabel=status=>({'open':'Open','in_review':'In review','reviewing':'In review','planned':'Planned','resolved':'Resolved','closed':'Closed','rejected':'Closed'}[String(status||'open').toLowerCase()]||'Open');
  const dateLabel=value=>{const date=value?new Date(value):null;return date&&!Number.isNaN(date.getTime())?date.toLocaleDateString():'Date unavailable'};
  $('#main').innerHTML=`<div class="head"><div class="tiny">HELP US BUILD STUDENTLINK</div><h1 class="title">Suggestions & bug reports</h1><span class="tiny">Found something broken or have an idea? Tell us what happened and help shape the next version.</span></div>
  <div class="feedback-banner"><div class="feedback-banner-icon" aria-hidden="true">✦</div><div><strong>Early tester feedback matters.</strong><p class="tiny">Be specific and kind. Please don’t include passwords, private messages, or sensitive personal information.</p></div></div>
  <div class="feedback-layout"><section class="card feedback-form-card"><div class="section-heading"><div><h2>Send feedback</h2><p class="tiny">Submissions are saved to StudentLink when the feedback service is available. You’ll see a clear message if saving fails.</p></div><span class="profile-step" aria-hidden="true">01</span></div>
  <div id="feedback-submit-status" class="feedback-inline-status" role="status" aria-live="polite" hidden></div>
  <form id="suggestion-form">
  <div class="field"><label for="feedback-type">What would you like to report? *</label><select id="feedback-type" required><option value="bug">🐛 Report a bug</option><option value="feature">💡 Suggest a feature</option><option value="feedback">💬 General feedback</option></select></div>
  <div class="field"><label for="feedback-title">Short title *</label><input id="feedback-title" maxlength="100" required placeholder="e.g. Profile save button does nothing" autocomplete="off"><div class="tiny feedback-counter" id="feedback-title-count">0 / 100</div></div>
  <div class="field"><label for="feedback-area">Where did it happen?</label><select id="feedback-area"><option>Not sure</option><option>Sign in / sign up</option><option>Feed and posts</option><option>Profile</option><option>Friends</option><option>Messages</option><option>Schools and search</option><option>Games</option><option>Mobile layout</option><option>Other</option></select></div>
  <div class="field"><label for="feedback-details">Describe it *</label><textarea id="feedback-details" rows="5" maxlength="2000" required placeholder="What happened? What did you expect to happen?"></textarea><div class="feedback-counter-row"><span class="tiny">For bugs, include the steps to reproduce the problem if you can.</span><span class="tiny feedback-counter" id="feedback-details-count">0 / 2000</span></div></div>
  <div class="field"><label for="feedback-priority">How serious is it?</label><select id="feedback-priority"><option value="normal">Normal — feature idea or minor issue</option><option value="low">Low — small inconvenience</option><option value="high">High — blocks an important task</option></select></div>
  <button type="submit" class="btn">Submit feedback</button>
  <p class="tiny feedback-storage-note">Only your own submitted reports are shown in the history panel.</p></form></section>
  <aside class="feedback-side"><section class="card"><div class="section-heading"><div><h2>Your feedback</h2><p class="tiny">Track the reports associated with your account.</p></div></div>
  ${historyError?'<div class="feedback-inline-status is-warning" id="feedback-history-notice" role="status">Your report history could not load. You can still try submitting, but saving depends on the feedback service being available.</div>':''}
  <div class="feedback-stats"><div><strong>${counts.all}</strong><span class="tiny">All loaded</span></div><div><strong>${counts.bug}</strong><span class="tiny">Bugs</span></div><div><strong>${counts.feature}</strong><span class="tiny">Ideas</span></div></div><div class="feedback-list" id="feedback-list">${list.length?list.map(r=>'<article class="feedback-item"><div class="feedback-item-top"><span class="feedback-type-pill '+esc(r.type)+'">'+esc(typeLabel(r.type))+'</span><span class="tiny">'+esc(dateLabel(r.created_at))+'</span></div><strong>'+esc(r.title)+'</strong><p class="tiny">'+esc(r.area||'Not specified')+' · '+esc(r.priority||'normal')+'</p><p class="feedback-item-details">'+esc(r.details)+'</p><span class="feedback-status status-'+esc(String(r.status||'open').toLowerCase().replace(/[^a-z0-9_-]/g,''))+'">'+esc(statusLabel(r.status))+'</span></article>').join(''):'<div class="feedback-empty"><span aria-hidden="true">📝</span><b>No feedback submitted yet</b><p class="tiny">Once a report is saved, it will appear here.</p></div>'}</div></section>
  <section class="card feedback-tip"><h3>What makes a useful bug report?</h3><ul><li>What you clicked or tried</li><li>What you expected to happen</li><li>What actually happened</li><li>Your device or browser, if relevant</li></ul></section></aside></div>`;
  const form=$('#suggestion-form'),titleInput=$('#feedback-title'),detailsInput=$('#feedback-details');
  const titleCount=$('#feedback-title-count'),detailsCount=$('#feedback-details-count'),submitStatus=$('#feedback-submit-status');
  const updateCount=(input,output,max)=>{if(input&&output)output.textContent=input.value.length+' / '+max};
  titleInput?.addEventListener('input',()=>updateCount(titleInput,titleCount,100));
  detailsInput?.addEventListener('input',()=>updateCount(detailsInput,detailsCount,2000));
  updateCount(titleInput,titleCount,100);updateCount(detailsInput,detailsCount,2000);
  const showFeedbackStatus=(message,kind='success')=>{if(!submitStatus)return;submitStatus.textContent=message;submitStatus.className='feedback-inline-status'+(kind==='warning'?' is-warning':'');submitStatus.hidden=false};
  form.onsubmit=async e=>{
    e.preventDefault();
    const type=$('#feedback-type').value,title=titleInput.value.trim(),details=detailsInput.value.trim();
    if(!title||!details){showFeedbackStatus('Add a short title and a description before submitting.','warning');return}
    const submit=form.querySelector('button[type="submit"]');
    if(submit){submit.disabled=true;submit.textContent='Submitting…'}
    if(submitStatus)submitStatus.hidden=true;
    try{
      const {error:saveError}=await db.from('student_feedback').insert({user_id:userId,type,title,area:$('#feedback-area').value,details,priority:$('#feedback-priority').value});
      if(saveError)throw saveError;
      form.reset();
      updateCount(titleInput,titleCount,100);updateCount(detailsInput,detailsCount,2000);
      showFeedbackStatus('Your feedback was saved successfully. Thank you for helping improve StudentLink.');
      toast('Feedback saved successfully.');
      await viewSuggestions();
      const refreshedStatus=$('#feedback-submit-status');
      if(refreshedStatus){refreshedStatus.textContent='Your feedback was saved successfully. Thank you for helping improve StudentLink.';refreshedStatus.hidden=false}
    }catch(error){
      console.error('Feedback submission failed:',error);
      showFeedbackStatus('Your feedback could not be saved. Nothing was confirmed as submitted. Please check your connection and try again later.','warning');
    }finally{
      const currentSubmit=form.querySelector('button[type="submit"]');
      if(currentSubmit){currentSubmit.disabled=false;currentSubmit.textContent='Submit feedback'}
    }
  };
}async function viewSchools(){
  const renderTop=top=>{
    const cards=top.map(({name,count})=>'<button type="button" class="card trending-school" data-school="'+esc(name)+'"><b>'+esc(name)+'</b><span class="tiny">'+count+' students</span></button>').join('')||'<p class="tiny">Schools will appear as students join.</p>';
    const desktop=$('#trending'),mobile=$('#trending-mobile');
    if(desktop)desktop.innerHTML=cards;
    if(mobile)mobile.innerHTML=cards;
  };
  if(S.schoolStatsCache&&Date.now()-S.schoolStatsLoadedAt<300000){renderTop(S.schoolStatsCache);return}
  if(!S.schoolStatsPromise){
    S.schoolStatsPromise=(async()=>{
      const {data,error}=await db.from('profiles').select('school').not('school','is',null).neq('school','').order('school').limit(1000);
      if(error)throw error;
      S.schoolVariants=Array.from(new Set((data||[]).map(p=>String(p.school||'').trim()).filter(Boolean)));
      const counts={};
      (data||[]).forEach(p=>{
        const name=canonicalSchoolName((p.school||'').trim()),key=schoolKey(name);
        if(key){if(!counts[key])counts[key]={name,count:0};counts[key].count++}
      });
      return Object.values(counts).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name)).slice(0,5);
    })();
  }
  try{
    const top=await S.schoolStatsPromise;
    S.schoolStatsCache=top;S.schoolStatsLoadedAt=Date.now();
    renderTop(top);
  }finally{S.schoolStatsPromise=null}
}async function viewSchoolStudents(school){const chosen=canonicalSchoolName(school||'');if(!chosen){S.view='feed';await renderView();return}$('#main').innerHTML='<div class="card">Loading students from '+esc(chosen)+'…</div>';const {data,error}=await db.from('profiles').select('id,nickname,school').not('school','is',null).neq('school','').order('nickname').limit(2000);if(error)throw error;S.schoolVariants=Array.from(new Set((data||[]).map(p=>String(p.school||'').trim()).filter(Boolean)));const people=(data||[]).filter(p=>schoolKey(canonicalSchoolName(p.school||''))===schoolKey(chosen));let html='<div class="head"><button type="button" class="btn btn-secondary" id="back-to-feed">← Back</button><h1 class="title" style="margin-top:12px">'+esc(chosen)+'</h1><span class="tiny">'+people.length+' student'+(people.length===1?'':'s')+'</span></div>';if(!people.length)html+='<div class="card">No other students from this school have joined yet.</div>';else html+=people.map(p=>'<div class="card school-student"><div class="school-student-info"><span class="avatar">'+initials(p.nickname)+'</span><div><b>'+esc(p.nickname)+(p.id===S.session.user.id?' (You)':'')+'</b><div class="tiny">'+esc(p.school||chosen)+'</div></div></div>'+(p.id===S.session.user.id?'<span class="tiny">Your profile</span>':'<button type="button" class="btn" data-add="'+p.id+'">Add friend</button>')+'</div>').join('');$('#main').innerHTML=html;$('#back-to-feed').onclick=()=>setView('feed');wireActions();}async function addFriend(id){if(id===S.session.user.id)return;const {error}=await db.from('friendships').insert({user_id:S.session.user.id,friend_id:id,status:'pending'});if(error){toast(error.code==='23505'?'A request already exists.':error.message);return}toast('Friend request sent.');renderView()}
async function acceptFriend(id){const {error}=await db.from('friendships').update({status:'accepted'}).eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}toast('Friend request accepted.');renderView()}
async function declineFriend(id){const {error}=await db.from('friendships').delete().eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}renderView()}