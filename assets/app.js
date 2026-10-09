// Configure these two values from your own Supabase project. Never use a service-role key here.
const SUPABASE_URL='https://fpdcetkvxdryogtvldax.supabase.co';const SUPABASE_ANON_KEY='sb_publishable_HMzJqdTbufV4vvJ6QyWl5A_-0PPa0Rs';
const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_URL.includes('YOUR_')&&!SUPABASE_ANON_KEY.includes('YOUR_');const db=configured&&window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const S={session:null,profile:null,view:'feed',friends:[],requests:[],convos:[],chat:null,channel:null,game:'',ttt:Array(9).fill(0)};
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function initials(s='S'){return esc(s.trim().split(/\s+/).slice(0,2).map(x=>x[0].toUpperCase()).join(''))}
function authHTML(tab='signup',message=''){return `<div class="auth"><section class="hero"><div class="brand"><span class="brandicon">🎮</span>StudentLink</div><h1>School friends.<br><span style="color:var(--mint)">Play & Learn</span></h1><div class="tab-buttons"><button data-tab="signup" class="active">Sign up</button><button data-tab="login">Log in</button></div><form id="authform">${tab==='signup'?`<div class="field"><label>Nickname</label><input id="nick" placeholder="Your name" required></div><div class="field"><label>School</label><input id="school" placeholder="Your school" required></div>`:''}<div class="field"><label>Email</label><input id="email" type="email" placeholder="you@example.com" required></div><div class="field"><label>Password</label><input id="password" type="password" required></div><button type="submit" class="btn" style="width:100%;margin-top:16px">${tab==='signup'?'Sign up':'Log in'}</button></form>${message?`<p style="color:var(--mint);margin-top:12px;font-size:13px">${esc(message)}</p>`:''}</section></div>`}
function renderAuth(tab='signup', msg='') {
  $('#app').innerHTML = authHTML(tab, msg);
  $$('[data-tab]').forEach(b => b.onclick = () => renderAuth(b.dataset.tab));

  const authForm = document.getElementById('authform');
  if (authForm) authForm.noValidate = true;

  if (authForm) {
    authForm.onsubmit = async e => {
      e.preventDefault();

      const email = document.getElementById('email')?.value.trim() || '';
      const password = document.getElementById('password')?.value || '';
      const nickname = document.getElementById('nick')?.value.trim() || '';

      if (tab === 'signup') {
        if (!nickname || nickname.length < 3) {
          toast('Nickname needs at least 3 characters.');
          return;
        }
        if (!email) {
          toast('Please enter an email address.');
          return;
        }
      }

      if (tab === 'login') {
        if (!email) {
          toast('Please enter your email.');
          return;
        }
      }

      try {
        if (tab === 'signup') {
          const { data, error } = await db.auth.signUp({
            email,
            password,
            options: {
              data: {
                nickname,
                school: document.getElementById('school')?.value.trim() || ''
              }
            }
          });
          if (error) throw error;
          renderAuth('login', 'Check your email for a confirmation link.');
          return;
        }

        if (tab === 'login') {
          const { data, error } = await db.auth.signInWithPassword({ email, password });
          if (error) throw error;
          await boot();
          return;
        }
      } catch (err) {
        console.error(err);
        renderAuth(tab, err.message || 'Could not complete that action.');
      }
    };
  }
}
function nav(v,ico,label){return `<button class="navitem ${S.view===v?'active':''}" data-view="${v}"><span>${ico}</span><span>${label}</span></button>`}function shell(){return `<header class="header"><div style="display:flex;gap:16px;flex:1;align-items:center"><span style="font-weight:600;font-size:16px">StudentLink</span><div class="search-wrap"><input type="text" class="search" id="search" placeholder="Search students…"><div id="search-results" class="search-results" hidden></div></div></div><button class="btn btn-secondary" id="logout">Log out</button></header><div class="layout"><div class="leftside">${nav('feed','📰','Feed')}${nav('friends','👥','Friends')}${nav('messages','💬','Messages')}${nav('games','🎮','Games')}${nav('profile','⚙️','Profile')}</div><div class="main" id="main"></div><div class="rightside"><h3 style="margin:0 0 16px 0">Trending schools</h3><div id="trending"></div></div></div>`}
async function boot(){if(!db){renderAuth('signup','Setup needed: create a Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.');return}let {data:{session},error}=await db.auth.getSession();if(error||!session){renderAuth();return}S.session=session;await loadProfile();$('#app').innerHTML=shell();setUpRealtime();renderView();wireActions();$('#logout').onclick=()=>{db.auth.signOut();renderAuth()};const search=$('#search'),results=$('#search-results');let searchTimer; if(search&&results){search.oninput=()=>{clearTimeout(searchTimer);const term=search.value.trim();if(term.length<2){results.hidden=true;results.innerHTML='';return}searchTimer=setTimeout(async()=>{const {data,error:searchError}=await db.from('profiles').select('id,nickname,school').neq('id',S.session.user.id).ilike('nickname',`%${term.replace(/[%_]/g,'')}%`).order('nickname').limit(8);if(searchError){results.innerHTML='<div class="search-result">Search unavailable</div>';results.hidden=false;return}results.innerHTML=(data||[]).map(p=>`<div class="search-result"><div><b>${esc(p.nickname)}</b><div class="tiny">${esc(p.school||'No school')}</div></div><button class="btn btn-secondary" data-search-add="${p.id}">Add</button></div>`).join('')||'<div class="search-result">No students found</div>';results.hidden=false},250);}}}async function setUpRealtime(){if(!db||!S.session)return;if(S.channel){await S.channel.unsubscribe()}S.channel=db.channel('feed-updates');S.channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},()=>{if(S.view==='feed')renderView()}).on('postgres_changes',{event:'INSERT',schema:'public',table:'post_likes'},()=>{if(S.view==='feed')renderView()}).on('postgres_changes',{event:'INSERT',schema:'public',table:'friendships'},()=>{if(S.view==='friends')renderView()}).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},()=>{if(S.view==='messages'){if(S.chat)openConversation(S.chat);else renderView()}}).subscribe()}
async function loadProfile(){let {data,error}=await db.from('profiles').select('*').eq('id',S.session.user.id).maybeSingle();if(error)console.warn(error);S.profile=data||{id:S.session.user.id,nickname:'Student',school:''}}
async function renderView(){let m=$('#main');if(!m)return;m.innerHTML='<div class="card">Loading…</div>';try{if(S.view==='feed')await viewFeed();if(S.view==='friends')await viewFriends();if(S.view==='messages')await viewMessages();if(S.view==='games')viewGames();if(S.view==='game')await viewGame();if(S.view==='profile')viewProfile();await viewSchools()}catch(e){console.error(e);m.innerHTML=`<div class="card"><b>Error</b><p>${esc(e.message)}</p></div>`}}
async function viewFeed(){let {data,error}=await db.from('posts').select('id,user_id,body,created_at,post_type,poll_question,poll_options').order('created_at',{ascending:false}).limit(40);if(error)throw error;let html=`<div class="head"><h1 class="title">Feed</h1><button class="btn" id="new-post">New post</button></div>`;if(data){let users=await Promise.all(data.map(p=>db.from('profiles').select('*').eq('id',p.user_id).single()));let likes=await db.from('post_likes').select('post_id').in('post_id',data.map(p=>p.id));let likeMap={};likes.data?.forEach(l=>likeMap[l.post_id]=(likeMap[l.post_id]||0)+1);let liked=await db.from('post_likes').select('post_id').in('post_id',data.map(p=>p.id)).eq('user_id',S.session.user.id);let likedSet=new Set(liked.data?.map(l=>l.post_id));let pollIds=data.filter(p=>p.post_type==='poll').map(p=>p.id);let voteRows=pollIds.length?(await db.from('poll_votes').select('post_id,user_id,option_index').in('post_id',pollIds)).data||[]:[];let voteMap={};voteRows.forEach(v=>{(voteMap[v.post_id]||(voteMap[v.post_id]=[])).push(v)});html+=data.map((p,i)=>postCard(p,users[i].data,likedSet.has(p.id),likeMap[p.id]||0,0,voteMap[p.id]||[])).join('')}$('#main').innerHTML=html;document.getElementById('new-post')?.addEventListener('click',()=>{modal('Create a post','<form id="postform"><div class="field"><label>What\'s on your mind?</label><textarea id="pb" maxlength="280" required></textarea></div><div class="field"><label><input type="radio" name="pt" value="text" checked> Text</label><label><input type="radio" name="pt" value="poll"> Poll</label></div><div id="pollopts" style="display:none"><div class="field"><label>Question</label><input id="pq" maxlength="180"></div>'+[1,2,3,4].map(n=>`<div class="field"><label>Option ${n}</label><input id="po${n}" maxlength="100"></div>`).join('')+'</div><button type="submit" class="btn">Post</button></form>');document.querySelector('[value="poll"]').onchange=()=>$('#pollopts').style.display='block';document.querySelector('[value="text"]').onchange=()=>$('#pollopts').style.display='none';document.getElementById('postform').onsubmit=async e=>{e.preventDefault();let pt=document.querySelector('[name="pt"]:checked').value;if(pt==='poll'){let q=$('#pq').value.trim();let opts=[1,2,3,4].map(n=>$(`#po${n}`).value.trim()).filter(o=>o);if(!q||opts.length<2){toast('Need a question and at least 2 options');return}let pollBody=$('#pb').value.trim()||q;let {error:pollError}=await db.from('posts').insert({user_id:S.session.user.id,body:pollBody,post_type:'poll',poll_question:q,poll_options:opts});if(pollError)throw pollError}else{let b=$('#pb').value.trim();if(!b){toast('Post cannot be empty');return}await db.from('posts').insert({user_id:S.session.user.id,body:b,post_type:'text'})}closeModal();renderView()}});$('[data-like]').forEach(b=>b.onclick=()=>toggleLike(b.dataset.like,b.classList.contains('liked')));$('[data-vote]').forEach(b=>b.onclick=()=>votePoll(b.dataset.vote,Number(b.dataset.option)))}
async function votePoll(postId,optionIndex){const {data:existing,error:checkError}=await db.from('poll_votes').select('post_id').eq('post_id',postId).eq('user_id',S.session.user.id).maybeSingle();if(checkError){toast(checkError.message);return}if(existing){toast('You have already voted in this poll.');return}const {error}=await db.from('poll_votes').insert({post_id:postId,user_id:S.session.user.id,option_index:optionIndex});if(error){toast(error.message);return}toast('Vote recorded.');await renderView()}
function postCard(p,profile,liked,count,comments,votes=[]){const myVote=votes.find(v=>v.user_id===S.session.user.id);const total=votes.length;return `<article class="card"><div class="post-top"><span class="avatar">${initials(profile?.nickname)}</span><div style="flex:1"><b>${esc(profile?.nickname)}</b> <span class="tiny">${new Date(p.created_at).toLocaleDateString()}</span></div></div>${p.post_type==='poll'?`<div><b>${esc(p.poll_question)}</b><div style="margin-top:8px">${(p.poll_options||[]).map((o,i)=>{const n=votes.filter(v=>v.option_index===i).length;return `<button data-vote="${p.id}" data-option="${i}" class="btn btn-secondary" style="display:flex;justify-content:space-between;gap:12px;margin-bottom:4px;text-align:left;width:100%" ${myVote?'disabled':''}><span>${esc(o)}${myVote&&myVote.option_index===i?' ✓':''}</span><span>${myVote?`${n} vote${n===1?'':'s'}`:''}</span></button>`}).join('')}</div><div class="tiny">${total} vote${total===1?'':'s'}${myVote?' · You voted':''}</div></div>`:`<p>${esc(p.body)}</p>`}<div style="display:flex;gap:12px;margin-top:12px"><button data-like="${p.id}" class="btn btn-secondary ${liked?'liked':''}" style="flex:1">❤️ ${count}</button></div></article>`}
async function toggleLike(id,liked){let q=liked?db.from('post_likes').delete().eq('post_id',id).eq('user_id',S.session.user.id):db.from('post_likes').insert({post_id:id,user_id:S.session.user.id});let {error}=await q;if(error)console.error(error);renderView()}
async function viewFriends(){
  const {data:people,error:peopleError}=await db.from('profiles').select('id,nickname,school').neq('id',S.session.user.id).order('nickname').limit(100);
  if(peopleError)throw peopleError;
  const {data:rows,error}=await db.from('friendships').select('user_id,friend_id,status').or(`user_id.eq.${S.session.user.id},friend_id.eq.${S.session.user.id}`);
  if(error)throw error;
  const sent=new Set((rows||[]).filter(r=>r.status==='pending'&&r.user_id===S.session.user.id).map(r=>r.friend_id));
  const received=new Set((rows||[]).filter(r=>r.status==='pending'&&r.friend_id===S.session.user.id).map(r=>r.user_id));
  const friendIds=new Set((rows||[]).filter(r=>r.status==='accepted').map(r=>r.user_id===S.session.user.id?r.friend_id:r.user_id));
  S.friends=(people||[]).filter(p=>friendIds.has(p.id));
  let html=`<div class='head'><h1 class='title'>Friends</h1><span class='tiny'>${S.friends.length} friends</span></div>`;
  html+=(people||[]).map(p=>`<div class='card'><div style='display:flex;justify-content:space-between;align-items:center;gap:12px'><div><b>${esc(p.nickname)}</b><div class='tiny'>${esc(p.school||'No school')}</div></div><div style='display:flex;gap:8px;flex-wrap:wrap'>${friendIds.has(p.id)?`<button class='btn btn-secondary' data-messagefriend='${p.id}'>Message</button>`:received.has(p.id)?`<button class='btn' data-accept='${p.id}'>Accept</button><button class='btn btn-secondary' data-decline='${p.id}'>Decline</button>`:sent.has(p.id)?`<button class='btn btn-secondary' disabled>Requested</button>`:`<button class='btn' data-add='${p.id}'>Add friend</button>`}</div></div></div>`).join('');
  $('#main').innerHTML=html;wireActions();
}
async function startConversation(friendId){if(!S.friends.some(f=>f.id===friendId))return toast('Add this student as a friend first.');const me=S.session.user.id;const [user_a,user_b]=[me,friendId].sort();let {data,error}=await db.from('conversations').select('id').eq('user_a',user_a).eq('user_b',user_b).maybeSingle();if(error)throw error;if(!data){let {data:newConvo,error:createErr}=await db.from('conversations').insert({user_a,user_b}).select();if(createErr)throw createErr;data=newConvo[0]}S.chat=data.id;await viewMessages()}
async function viewMessages(){
  await loadConvos();
  $('#main').innerHTML=`<div class='head'><div><h1 class='title'>Private messages</h1><span class='tiny'>Messaging is limited to accepted friends.</span></div></div><div id='convos'></div>`;
  const container=$('#convos');
  if(!S.convos.length){container.innerHTML='<div class="card">No conversations yet. Add a friend to start chatting.</div>';return}
  container.innerHTML=S.convos.map(c=>`<div class='card' data-convo='${c.id}' style='cursor:pointer'><b>${esc(c.otherNickname)}</b><div class='tiny'>${esc(c.lastMessage||'No messages yet')}</div></div>`).join('');
  $$('[data-convo]').forEach(el=>el.onclick=()=>openConversation(el.dataset.convo));
}
async function openConversation(conversationId){
  S.chat=conversationId;
  const {data:messages,error}=await db.from('messages').select('id,conversation_id,sender_id,body,created_at').eq('conversation_id',conversationId).order('created_at');
  if(error)throw error;
  const senderIds=[...new Set((messages||[]).map(m=>m.sender_id))];
  const {data:profiles,error:profileError}=senderIds.length?await db.from('profiles').select('id,nickname').in('id',senderIds):{data:[],error:null};
  if(profileError)throw profileError;
  const names=Object.fromEntries((profiles||[]).map(p=>[p.id,p.nickname]));
  $('#main').innerHTML=`<div class='head'><button id='back' class='btn btn-secondary'>← Back</button><h1 class='title'>Conversation</h1></div><div id='message-list'>${(messages||[]).map(m=>`<div class='card' style='background:${m.sender_id===S.session.user.id?'var(--blue)':'var(--p2)'}'><b>${esc(names[m.sender_id]||'Student')}</b><p>${esc(m.body)}</p><div class='tiny'>${new Date(m.created_at).toLocaleString()}</div></div>`).join('')}</div><form id='msgform' style='padding:8px 0'><input id='msgtext' maxlength='1500' placeholder='Type a message…' required style='margin-bottom:8px'><button type='submit' class='btn'>Send</button></form>`;
  $('#back').onclick=()=>viewMessages();
  $('#msgform').onsubmit=async e=>{e.preventDefault();const body=$('#msgtext').value.trim();if(!body)return;const {error:sendError}=await db.from('messages').insert({conversation_id:conversationId,sender_id:S.session.user.id,body});if(sendError){toast(sendError.message);return}await openConversation(conversationId)};
}
async function loadConvos(){
  const {data,error}=await db.from('conversations').select('id,user_a,user_b,updated_at').or(`user_a.eq.${S.session.user.id},user_b.eq.${S.session.user.id}`).order('updated_at',{ascending:false});
  if(error)throw error;
  const rows=data||[];const otherIds=rows.map(c=>c.user_a===S.session.user.id?c.user_b:c.user_a);
  const {data:profiles,error:profileError}=otherIds.length?await db.from('profiles').select('id,nickname').in('id',otherIds):{data:[],error:null};
  if(profileError)throw profileError;
  const names=Object.fromEntries((profiles||[]).map(p=>[p.id,p.nickname]));
  S.convos=await Promise.all(rows.map(async c=>{const {data:lastMessages,error:messageError}=await db.from('messages').select('body,created_at').eq('conversation_id',c.id).order('created_at',{ascending:false}).limit(1);if(messageError)throw messageError;const otherId=c.user_a===S.session.user.id?c.user_b:c.user_a;return{id:c.id,otherNickname:names[otherId]||'Student',lastMessage:lastMessages?.[0]?.body||''}}));
}
function viewGames(){let gs=[['⭕❌','Tic-Tac-Toe','Two players on one device','ttt'],['🧠','Student Quiz','General knowledge','quiz'],['🔵🟡','Connect Four','Connect four in a row','connect']];$('#main').innerHTML=`<div class="head"><h1 class="title">Games</h1></div>${gs.map(g=>`<div class="card" data-game="${g[3]}" style="cursor:pointer"><span style="font-size:24px">${g[0]}</span> <b>${g[1]}</b><div class="tiny">${g[2]}</div></div>`).join('')}`;$$('[data-game]').forEach(el=>{el.onclick=()=>{S.game=el.dataset.game;S.view='game';renderView()}})}
async function viewGame(){
  const game=S.game;
  if(game!=='ttt'){$('#main').innerHTML=`<div class='head'><button class='btn btn-secondary' id='games-back'>← Games</button><h1 class='title'>${game==='quiz'?'Student Quiz':'Connect Four'}</h1></div><div class='card'>This game is not implemented yet. You can return to the games list.</div>`;$('#games-back').onclick=()=>setView('games');return}
  const winner=()=>{for(const [a,b,c] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]])if(S.ttt[a]&&S.ttt[a]===S.ttt[b]&&S.ttt[a]===S.ttt[c])return S.ttt[a];return S.ttt.every(Boolean)?3:0};
  const w=winner();$('#main').innerHTML=`<div class='head'><button class='btn btn-secondary' id='games-back'>← Games</button><h1 class='title'>Tic-Tac-Toe</h1></div><div class='card'><p>${w?(w===3?'It is a draw.':(w===1?'Player X':'Player O')+' wins!'):'Turn: Player '+(S.ttt.filter(Boolean).length%2===0?'X':'O')}</p><div style='display:grid;grid-template-columns:repeat(3,minmax(60px,90px));gap:8px;justify-content:center'>${S.ttt.map((v,i)=>`<button class='btn btn-secondary' data-cell='${i}' style='height:76px;font-size:28px' ${v||w?'disabled':''}>${v===1?'X':v===2?'O':''}</button>`).join('')}</div><button id='ttt-reset' class='btn' style='margin-top:16px'>Restart</button></div>`;
  $('#games-back').onclick=()=>setView('games');$$('[data-cell]').forEach(b=>b.onclick=()=>{if(S.ttt[Number(b.dataset.cell)]||winner())return;S.ttt[Number(b.dataset.cell)]=S.ttt.filter(Boolean).length%2===0?1:2;viewGame()});$('#ttt-reset').onclick=()=>{S.ttt=Array(9).fill(0);viewGame()};
}
function viewProfile(){let p=S.profile;$('#main').innerHTML=`<div class="head"><h1 class="title">My profile</h1><span class="tiny">Manage your nickname and school</span></div><div class="card"><form id="pf"><div class="field"><label>Nickname</label><input id="pn" value="${esc(p.nickname)}" required></div><div class="field"><label>School</label><input id="ps" value="${esc(p.school||'')}"></div><button type="submit" class="btn">Save</button></form></div>`;document.getElementById('pf').onsubmit=async e=>{e.preventDefault();let {error}=await db.from('profiles').update({nickname:$('#pn').value.trim(),school:$('#ps').value.trim()}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not update profile')}else{await loadProfile();renderView()}}}
async function viewSchools(){let {data,error}=await db.from('profiles').select('school').not('school','is',null).neq('school','').limit(500);if(error)throw error;let c={};(data||[]).forEach(p=>{let s=p.school.trim();c[s]=(c[s]||0)+1});let top=Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,5);$('#trending').innerHTML=top.map(([s,n])=>`<div class="card"><b>${esc(s)}</b><span class="tiny">${n} students</span></div>`).join('')}
async function addFriend(id){if(id===S.session.user.id)return;const {error}=await db.from('friendships').insert({user_id:S.session.user.id,friend_id:id,status:'pending'});if(error){toast(error.code==='23505'?'A request already exists.':error.message);return}toast('Friend request sent.');renderView()}
async function acceptFriend(id){const {error}=await db.from('friendships').update({status:'accepted'}).eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}toast('Friend request accepted.');renderView()}
async function declineFriend(id){const {error}=await db.from('friendships').delete().eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}renderView()}
function setView(v){S.view=v;renderView()}
function modal(title,content){$('#modaltitle').textContent=title;$('#modalcontent').innerHTML=content;$('#modalbg').classList.add('show')}
function closeModal(){$('#modalbg').classList.remove('show')}
function toast(msg){
  let el=document.getElementById('studentlink-toast');
  if(!el){el=document.createElement('div');el.id='studentlink-toast';el.setAttribute('role','status');el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2000;max-width:calc(100% - 32px);padding:12px 16px;border:1px solid var(--line);border-radius:8px;background:var(--p2);color:var(--txt);box-shadow:0 8px 24px rgba(0,0,0,.25)';document.body.appendChild(el)}
  el.textContent=String(msg);el.style.display='block';clearTimeout(el._hideTimer);el._hideTimer=setTimeout(()=>{el.style.display='none'},3500);
}
function wireActions(){$$('[data-messagefriend]').forEach(b=>b.onclick=()=>startConversation(b.dataset.messagefriend));$$('[data-add]').forEach(b=>b.onclick=()=>addFriend(b.dataset.add));$$('[data-accept]').forEach(b=>b.onclick=()=>acceptFriend(b.dataset.accept));$$('[data-decline]').forEach(b=>b.onclick=()=>declineFriend(b.dataset.decline))}
document.addEventListener('click',e=>{const sr=$('#search-results');if(sr&&!e.target.closest('.search-wrap'))sr.hidden=true;let v=e.target.closest('[data-view]');if(v){e.preventDefault();setView(v.dataset.view);return}let add=e.target.closest('[data-search-add]');if(add){addFriend(add.dataset.searchAdd);if(sr)sr.hidden=true}});
(async()=>{if(!configured){renderAuth('signup','Setup needed: create Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.');return}await boot()})();
