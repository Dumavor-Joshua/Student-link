// Configure these two values from your own Supabase project. Never use a service-role key here.
const SUPABASE_URL='https://fpdcetkvxdryogtvldax.supabase.co';const SUPABASE_ANON_KEY='sb_publishable_HMzJqdTbufV4vvJ6QyWl5A_-0PPa0Rs';
const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_URL.includes('YOUR_')&&!SUPABASE_ANON_KEY.includes('YOUR_');const db=configured&&window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const S={session:null,profile:null,schools:[],view:'feed',schoolFilter:'',feedMode:'all',feedOrderIds:[],feedOrderMode:'',friends:[],requests:[],convos:[],chat:null,channel:null,tttChannel:null,tttGameId:null,onlineGameChannel:null,cfGameId:null,rpsGameId:null,rpsMode:'computer',game:'',ttt:Array(9).fill(0),notifiedMessageIds:new Set(),notifiedFriendshipIds:new Set(),};
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function initials(s='S'){return esc(s.trim().split(/\s+/).slice(0,2).map(x=>x[0].toUpperCase()).join(''))}
function schoolKey(s=''){return String(s).normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase()}
const VERIFIED_GHANA_SHS_TVET = [
  "Mim Senior High School","Ahafoman Senior High/Tech School","Kukuom Agric Senior High School","Sankore Senior High School","Acherensua Senior High School","Hwidiem Senior High School","Serwaa Kesse Girls Senior High School","Bechem Presby Senior High School",
  "Prempeh College","Yaa Asantewaa Girls Senior High School","Kumasi Girls Senior High School","Opoku Ware School","St. Louis Senior High School, Kumasi","KNUST Senior High School","T. I. Ahmadiyya Senior High School, Kumasi","Kumasi High School","Kumasi Academy","Konongo Odumase Senior High School","Agogo State College","Juaben Senior High School","Obuasi Senior High/Tech School",
  "St. James Seminary and Senior High School","Sunyani Senior High School","Sacred Heart Senior High School, Nsoatre","Notre Dame Girls Senior High School, Sunyani","Wenchi Methodist Senior High School","Kintampo Senior High School","Atebubu Senior High School","Nkoranza Senior High/Tech School","Osei Bonsu Senior High School",
  "Holy Child School, Cape Coast","Adisadel College","Mfantsipim School","St. Augustine's College, Cape Coast","Winneba Senior High School","Potsin T.I. Ahmadiyya Senior High School","Apam Senior High School","Edinaman Senior High School",
  "Ofori Panin Senior High School","Abuakwa State College","Kibi Senior High/Tech School","Presby Senior High School, Begoro","Kade Senior High/Tech School","Abetifi Presby Senior High School","St. Peter's Senior High School, Nkwatia","Ghana Senior High School, Koforidua","Pope John Senior High and Minor Seminary","Oyoko Methodist Senior High School",
  "Accra Girls Senior High School","St. John's Grammar Senior High School","Accra Senior High School","Labone Senior High School","Achimota Senior High School","West Africa Senior High School","Presby Senior High School, Legon","St. Thomas Aquinas Senior High School","O'Reilly Senior High School","Nungua Senior High School","Tema Methodist Day Senior High School","Presby Senior High School, Tema","Amasaman Senior High/Tech School","Odorgonno Senior High School","Ghanata Senior High School",
  "Tamale Senior High School","Tamale Girls Senior High School","Ghana Senior High School, Tamale","Northern School of Business","Presby Senior High School, Tamale","Dagbon State Senior High/Tech School","Nalerigu Senior High School","Wulugu Senior High School","Nakpanduri Senior High School",
  "Notre Dame Seminary/Senior High School, Navrongo","Navrongo Senior High School","Sandema Senior High School","Bongo Senior High School","Zorkor Senior High School","Tongo Senior High/Tech School","Wa Senior High School","T.I. Ahmadiyya Senior High School, Wa","Nandom Senior High School","Tumu Senior High/Tech School",
  "Buipe Senior High School","Salaga Senior High School","Sawla Senior High School","Tuna Senior High/Tech School","Mawuli School, Ho","OLA Girls Senior High School, Ho","Keta Senior High/Tech School","Anlo Senior High School","Bishop Herman College","Kpando Senior High School",
  "St. John's Senior High School, Sekondi","Fijai Senior High School","Takoradi Senior High School","Ghana Senior High/Tech School, Takoradi","Tarkwa Senior High School","Amenfiman Senior High School","Sefwi-Wiawso Senior High School","Bibiani Senior High/Tech School"
,
  ...["Cambridge Senior High Technical School","City Business Senior High","Cosmos Senior High School, Ejura","Daceland Senior High School","Domaa College","Elite College, Kumasi","Fame Senior High School, Shama","Ideal College, East Legon","Jireh Senior High School, Teshie","Joy Standard College, Kumasi","Ken Hammer Senior High Technical School, Goaso","King David Community College, Kpong","Mount Hebron College, Dunkwa-On-Offin","Otou Memorial Senior High School","Samme Senior High School, Mankessim","Samtet Oxford Senior High School, Atachem","St. Luke Senior High School, Mankessim","St. Richard's Senior High School, Assin Foso","Wallahs Academy Senior High School, Ho","Abakrampa Senior High/Technical","Abeadze State College","Abeaseman Community Day Senior High","Abetifi Presby Senior High","Abor Senior High","Abuakwa State College","Aburaman Senior High","Aburi Girls Senior High","Abutia Senior High/Technical","Academy of Christ the King","Accra Academy","Accra Grammar School","Accra High School","Accra Wesley Girls Senior High","Achinakrom Senior High","Achiase Senior High School","Adaklu Senior High School","Adanwomase Senior High","Adisadel College","Adonten Senior High","Adrobaa Senior High/Technical","Afadjato Senior High/Technical","Afia Kobi Ampem Girls Senior High","Agona Senior High/Technical","Agomeda Senior High/Technical","Ahantaman Girls Senior High","Akim Asafo Senior High","Akim Swedru Senior High","Akontombra Senior High","Akuapem Senior High School","Akwamuman Senior High School","Alavanyo Senior High/Technical","Amankwakrom Fisheries Agricultural Technical Institute","Amanten Senior High","Ameyaw Akumfi Senior High/Technical","Anfoega Senior High","Anfoeta Senior High/Technical","Anlo Afiadenyigba Senior High","Anum Presbyterian Senior High","Asamankese Senior High","Asanteman Senior High","Asawinso Senior High","Asuom Senior High School","Asuogyaman Senior High School","Atebubu Senior High","Atiavi Senior High/Technical","Attafuah Senior High/Technical","Awudome Senior High","Awutu Bawjiase Community Senior High","Awutu Winton Senior High","Axim Girls Senior High","Barekese Senior High School","Banka Community Senior High","Bawku Senior High","Bawku Senior High/Technical","Beposo Senior High","Berekum Senior High","Berekum Presby Senior High","Bisease Senior High School","Bimbilla Senior High School","Bishop Aglionby Senior High","Bodi Senior High","Boa Amponsem Senior High","Bolgatanga Girls Senior High","Bolgatanga Senior High","Bomaa Community Senior High","Bosome Senior High/Technical","Bosomtwe Girls STEM Senior High","Bosomtwe STEM Academy","Breman Asikuma Senior High","Bueman Senior High","Buipe Senior High","Chemu Senior High/Technical","Chiana Senior High","Chiraa Senior High","Christian Methodist Senior High","Dabokpa Senior High","Dadease Agricultural Senior High","Dadieso Senior High","Daffiamah Senior High","Dagbon State Senior High/Technical","Dambai Senior High/Technical","Dansoman Senior High","Diaso Senior High","Dofor Senior High","Dompoase Senior High","Donkorkrom Agricultural Senior High","Dormaa Senior High","Drobo Senior High","Drobonso Senior High","Dwamena Akenten Senior High","Dzodze-Penyi Senior High","E.P. Senior High, Amedzofe","E.P. Agric Senior High/Technical","E.P.C. Mawuko Girls Senior High","Ebenezer Senior High School","Effiduase Senior High","Ejuraman Anglican Senior High","Enyan Denkyira Senior High","Fanteakwa Senior High","Gambaga Girls Senior High","Ghana Muslim Mission Senior High","Ghana Senior High School, Koforidua","Ghana Senior High School, Tamale","Ghana Senior High/Technical School, Takoradi","Gushegu Senior High","Half Assini Senior High","Have Senior High/Technical","Holy Trinity Senior High School","Huni Valley Senior High","Islamic Senior High, Kumasi","Islamic Girls Senior High, Suhum","Jachie-Pramso Senior High","Jema Senior High","Jirapa Senior High","Kaleo Senior High/Technical","Kalpohin Senior High","Kanton Senior High","Keta Senior High/Technical","Klikor Senior High/Technical","Koforidua Senior High/Technical","Krobo Community Senior High","Kumasi Anglican Senior High","Kumasi Senior High/Technical","Kumasi Wesley Girls High School","Kumbungu Senior High","Kwabre Senior High","Kwahu Tafo Senior High","Kwanyako Senior High","Lashibi Community Day Senior High","La Presby Senior High","Lambussie Community Senior High","Lawra Senior High","Mabang Senior High/Technical","Mankessim Senior High/Technical","Mankranso Senior High","Mansen Senior High","Manso-Adubia Senior High","Mansoman Senior High","Mepe St. Kizito Senior High/Technical","Methodist Senior High, Sekondi","Methodist Senior High School, Saltpond","Mfantsiman Girls Senior High","Mint Senior High School, Yeji","Modern Senior High School, Kpong","Moree Community Senior High","Morso Senior High/Technical","Mozano Senior High","Mpohor Senior High","Nalerigu Senior High School","Nana Brentu Senior High/Technical","Nankpanduri Senior High/Technical","Ndewura Jakpa Senior High/Technical","New Abirem Senior High","New Juaben Senior High/Commercial","Nifa Senior High","Nkawkaw Senior High","Nkroful Agricultural Senior High/Technical","Nkoranman Senior High","Nkyeraa Senior High School","Nungua Senior High School","Nuru-Ameen Islamic Senior High, Asewase","Nsutaman Catholic Senior High","Nyakrom Senior High/Technical","Nyankumasi Ahenkro Senior High","Nyinahin Catholic Senior High","Obrachire Senior High/Technical","Odomaseman Senior High","Oguaa Senior High/Technical","Ogyeedom Community Senior High/Technical","Okomfo Anokye Senior High","Osudoku Senior High/Technical","Osei Kyeretwie Senior High","Osei Tutu Senior High, Akropong","Our Lady of Fatima Senior High","Our Lady of Mercy Senior High","Our Lady of Mount Carmel Girls Senior High","Our Lady of Providence Senior High","Owerriman Senior High/Technical","Pank Senior High School","Peki Senior High/Technical","Presby Senior High, Bompata","Presby Senior High, Osu","Presby Senior High, Tema","Presby Senior High/Technical, Adukrom","Prang Senior High","Prestea Senior High/Technical","Preset Pacesetters Senior High School","Ramseyer Senior High School","Reputable Senior High School, Wiaga","Rugari College, Bongo","Sakafia Islamic Senior High","Savelugu Senior High","Sawla Senior High School","Sekondi College","Serwaah Nyarko Girls Senior High","Sefwi Bekwai Senior High","Somanya Senior High/Technical","St. Gregory Catholic Senior High School","St. Hubert Seminary/Senior High, Kumasi","St. Jerome Senior High, Abofour","St. John's Integrated Senior High/Technical","St. Joseph Senior High, Sefwi Wiawso","St. Michael's Senior High, Ahenkro","St. Monica's Senior High, Mampong","St. Mary's Senior High, Konongo","St. Rose's Senior High, Akwatia","St. Stephen's Presbyterian Senior High","St. Francis Xavier Senior High School","St. Margaret-Mary Senior High","St. Martins Senior High School","St. Paul's Senior High, Denu","St. Vincent College","Sogakope Senior High","Suhum Senior High","Swedru Senior High","Tamale Business Senior High","Tanyigbe Senior High","Tapaman Senior High/Technical","Taviefe Senior High","Techiman Senior High","Tema Senior High","Terchire Senior High","Teshie Presby Secondary","Toase Senior High","Tongo Senior High/Technical","Tsiame Senior High","Tuna Senior High/Technical","Twifo Hemang Senior High/Technical","Twifo Praso Senior High","Uthman Bin Affan Islamic Senior High","Vakpo Senior High","Vitting Senior High/Technical","Wa Senior High School","Wapuli Community Senior High","Wesley High School, Bekwai","Wenchi Methodist Senior High","Weta Senior High/Technical","Wulensi Senior High","Yamfo Anglican Senior High School","Zabzugu Senior High","Zamse Senior High/Technical","Zorkor Senior High School","Zuarungu Senior High"]
];
// Sort and deduplicate the compiled Ghana school directory alphabetically.
const uniqueSchoolNames=Array.from(new Map(VERIFIED_GHANA_SHS_TVET.map(name=>[schoolKey(name),name])).values()).sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'}));
VERIFIED_GHANA_SHS_TVET.splice(0,VERIFIED_GHANA_SHS_TVET.length,...uniqueSchoolNames);
function verifiedSchoolMatch(name=''){const key=schoolKey(name);return VERIFIED_GHANA_SHS_TVET.find(x=>schoolKey(x)===key)||''}
function canonicalVerifiedSchoolName(name=''){return verifiedSchoolMatch(name)||String(name).trim().replace(/\s+/g,' ')}
function schoolPickerHTML(id,value=''){
  const initial=String(value||'').trim();
  return '<input id="'+esc(id)+'" name="'+esc(id)+'" list="verified-gh-school-options" autocomplete="organization" placeholder="Start typing your school name…" maxlength="120" value="'+esc(initial)+'" required>'+
    '<datalist id="verified-gh-school-options">'+VERIFIED_GHANA_SHS_TVET.map(name=>'<option value="'+esc(name)+'"></option>').join('')+'</datalist>';
}
function wireSchoolPicker(id){
  const input=document.getElementById(id);
  if(!input)return;
  const canonicalize=()=>{const match=verifiedSchoolMatch(input.value);if(match)input.value=match;};
  input.addEventListener('change',canonicalize);
  input.addEventListener('blur',canonicalize);
}

function canonicalSchoolName(s=''){const key=schoolKey(s);return S.schools.find(x=>schoolKey(x)===key)||String(s).trim().replace(/\s+/g,' ')}
function authHTML(tab='signup',message=''){return `<div class="auth"><div class="auth-layout"><section class="auth-intro"><div class="brand"><span class="brandicon" aria-hidden="true">🔗</span><span>StudentLink</span></div><h1>Connect with classmates and your school community.</h1><p>One place to share updates, meet classmates, find school communities, and learn together.</p><div class="auth-intro-note"><span aria-hidden="true">✓</span> Made for students. Built for connection.</div></section><section class="auth-panel"><div class="hero"><div class="auth-card-heading"><h2>${tab==='signup'?'Create an account':'Welcome back'}</h2><p>${tab==='signup'?'It’s quick and easy.':'Log in to continue to StudentLink.'}</p></div><div class="tab-buttons" role="group" aria-label="Account access"><button type="button" data-tab="signup" class="${tab==='signup'?'active':''}" aria-pressed="${tab==='signup'}">Sign up</button><button type="button" data-tab="login" class="${tab==='login'?'active':''}" aria-pressed="${tab==='login'}">Log in</button></div><form id="authform" novalidate>${tab==='signup'? `<div class="field"><label for="nick">Nickname</label><input id="nick" name="nickname" autocomplete="nickname" placeholder="What should classmates call you?" minlength="3" required></div><div class="field"><label for="school">School</label>${schoolPickerHTML('school')}</div>`:''}<div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></div><div class="field"><label for="password">Password</label><div class="password-control"><input id="password" name="password" type="password" autocomplete="${tab==='signup'?'new-password':'current-password'}" minlength="6" required><button type="button" class="password-toggle" id="password-toggle" aria-controls="password" aria-pressed="false">Show</button></div>${tab==='signup'?'<p class="auth-help">Use at least 6 characters.</p>':''}</div>${tab==='login'?'<button type="button" class="auth-text-link" id="forgot-password">Forgot password?</button>':''}<button type="submit" class="btn auth-submit">${tab==='signup'?'Create account':'Log in'}</button><div class="auth-divider" aria-hidden="true"><span>or</span></div><button type="button" class="btn btn-secondary auth-google" id="google-signin"><svg aria-hidden="true" viewBox="0 0 48 48" width="18" height="18" focusable="false"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44z"/><path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12z"/></svg><span>Continue with Google</span></button></form><p id="auth-message" class="auth-message" role="status" aria-live="polite" ${message?'':'hidden'}>${esc(message)}</p></div><p class="auth-footer">StudentLink helps students connect with their school community.</p></section></div></div>`}function renderAuth(tab='signup', msg='') {
  $('#app').innerHTML = authHTML(tab, msg);
  wireSchoolPicker('school');
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => { sessionStorage.removeItem('studentlink-google-signup-profile'); renderAuth(b.dataset.tab); }));
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('password-toggle');
  if (passwordInput && passwordToggle) passwordToggle.onclick = () => {
    const reveal = passwordInput.type === 'password';
    passwordInput.type = reveal ? 'text' : 'password';
    passwordToggle.textContent = reveal ? 'Hide' : 'Show';
    passwordToggle.setAttribute('aria-pressed', String(reveal));
  };
  document.getElementById('forgot-password')?.addEventListener('click', () => toast('Password recovery is not connected yet.'));
  const googleButton = document.getElementById('google-signin');
  googleButton?.addEventListener('click', async () => {
    if (!db) { toast('Google sign-in is not configured right now.'); return; }
    const pendingKey = 'studentlink-google-signup-profile';
    if (tab === 'signup') {
      const nickname = document.getElementById('nick')?.value.trim() || '';
      const school = canonicalVerifiedSchoolName(document.getElementById('school')?.value.trim() || '');
      if (nickname.length < 3) {
        const status = document.getElementById('auth-message');
        if (status) { status.textContent = 'Nickname needs at least 3 characters before continuing with Google.'; status.hidden = false; }
        document.getElementById('nick')?.focus();
        return;
      }
      if (!school) {
        const status = document.getElementById('auth-message');
        if (status) { status.textContent = 'Please enter your school name before continuing with Google.'; status.hidden = false; }
        document.getElementById('school')?.focus();
        return;
      }
      sessionStorage.setItem(pendingKey, JSON.stringify({ nickname, school, createdAt: Date.now() }));
    } else {
      sessionStorage.removeItem(pendingKey);
    }
    const originalMarkup = googleButton.innerHTML;
    googleButton.disabled = true;
    googleButton.innerHTML = 'Connecting to Google…';
    try {
      const { error } = await db.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
      if (error) throw error;
    } catch (err) {
      sessionStorage.removeItem(pendingKey);
      console.error(err);
      const status = document.getElementById('auth-message');
      if (status) {
        status.textContent = 'Google sign-in could not start. Make sure Google is enabled in Supabase Authentication settings.';
        status.hidden = false;
      }
      googleButton.disabled = false;
      googleButton.innerHTML = originalMarkup;
    }
  });


  const authForm = document.getElementById('authform');
  if (authForm) authForm.noValidate = true;

  if (authForm) {
    authForm.addEventListener('submit', async e => {
      e.preventDefault();

      if (authForm.dataset.submitting === 'true') return;

      const email = document.getElementById('email')?.value.trim() || '';
      const password = document.getElementById('password')?.value || '';
      const nickname = document.getElementById('nick')?.value.trim() || '';
      const school = canonicalVerifiedSchoolName(document.getElementById('school')?.value.trim() || '');

      const showAuthError = (message, fieldId) => {
        const status = document.getElementById('auth-message');
        if (status) { status.textContent = message; status.hidden = false; }
        const field = fieldId ? document.getElementById(fieldId) : null;
        if (field) field.focus();
      };
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (tab === 'signup' && (!nickname || nickname.length < 3)) {
        showAuthError('Nickname needs at least 3 characters.', 'nick');
        return;
      }
      if (tab === 'signup' && !school) {
        showAuthError('Please enter your school name.', 'school');
        return;
      }
      if (!email) {
        showAuthError('Please enter your email address.', 'email');
        return;
      }
      if (!validEmail) {
        showAuthError('Enter a valid email address, such as you@example.com.', 'email');
        return;
      }
      if (!password) {
        showAuthError('Please enter your password.', 'password');
        return;
      }
      if (tab === 'signup' && password.length < 6) {
        showAuthError('Your password must be at least 6 characters.', 'password');
        return;
      }
      if (!db) {
        showAuthError('Sign-in is not configured right now. Please try again later.');
        return;
      }

      authForm.dataset.submitting = 'true';
      const submitButton = authForm.querySelector('button[type="submit"]');
      if (submitButton) { submitButton.disabled = true; submitButton.textContent = tab === 'signup' ? 'Creating account…' : 'Logging in…'; }
      try {
        if (tab === 'signup') {
          const { data, error } = await db.auth.signUp({
            email,
            password,
            options: {
              data: {
                nickname,
                school
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
        const rawMessage = String(err?.message || '');
        const code = String(err?.code || '');
        const combined = (rawMessage + ' ' + code).toLowerCase();
        let friendlyMessage = rawMessage || 'Could not complete that action. Please try again.';
        if (combined.includes('email rate limit') || combined.includes('over_email_send_rate_limit') || combined.includes('email rate limit exceeded')) {
          friendlyMessage = 'StudentLink has temporarily reached its email sending limit. Please wait before trying again and avoid repeatedly submitting the form. If this keeps happening, the project owner needs to configure a custom SMTP email provider in Supabase Auth settings.';
        } else if (combined.includes('over_request_rate_limit') || combined.includes('too many requests')) {
          friendlyMessage = 'Too many attempts were made in a short time. Please wait a few minutes before trying again.';
        } else if (combined.includes('email_address_not_authorized')) {
          friendlyMessage = 'This Supabase project is still using its restricted test email service. The project owner must configure custom SMTP before public users can receive confirmation emails.';
        } else if (combined.includes('user_already_exists')) {
          friendlyMessage = 'An account may already exist for this email. Try logging in instead.';
        }
        const status = document.getElementById('auth-message');
        if (status) { status.textContent = friendlyMessage; status.hidden = false; }
      } finally {
        if (submitButton && submitButton.isConnected) {
          submitButton.disabled = false;
          submitButton.textContent = tab === 'signup' ? 'Create account' : 'Log in';
        }
        delete authForm.dataset.submitting;
      }
    });
  }
}
function nav(v,ico,label){const selected=S.view===v||(S.view==='game'&&v==='games');return `<button type="button" class="navitem ${selected?'active':''}" data-view="${v}" aria-current="${selected?'page':'false'}" aria-pressed="${selected}"><span aria-hidden="true">${ico}</span><span>${label}</span></button>`}function shell(){return `<header class="header"><div style="display:flex;gap:16px;flex:1;align-items:center"><span style="font-weight:600;font-size:16px">StudentLink</span><div class="search-wrap"><input type="text" class="search" id="search" placeholder="Search students or schools…"><div id="search-results" class="search-results" hidden></div></div></div><div style="display:flex;align-items:center;gap:8px"><button class="btn btn-secondary" id="logout">Log out</button><button class="btn btn-secondary" id="notifications-toggle" type="button" aria-label="Enable browser notifications">🔔 Enable</button></div></header><section class="trending-mobile-wrap"><h3>Trending schools</h3><div id="trending-mobile" class="trending-mobile"></div></section><div class="layout"><div class="leftside">${nav('feed','📰','Feed')}${nav('friends','👥','Friends')}${nav('messages','💬','Messages')}${nav('games','🎮','Games')}${nav('profile','👤','Profile')}${nav('suggestions','💡','Feedback')}</div><div class="main" id="main"></div><aside class="rightside"><h3 style="margin:0 0 16px 0">Trending schools</h3><div id="trending"></div></aside></div>`}
async function boot(){if(!db){renderAuth('signup','Setup needed: create a Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.');return}let {data:{session},error}=await db.auth.getSession();if(error||!session){renderAuth();return}S.session=session;await loadProfile();const pendingGoogleProfileKey='studentlink-google-signup-profile';const pendingGoogleProfileRaw=sessionStorage.getItem(pendingGoogleProfileKey);if(pendingGoogleProfileRaw){sessionStorage.removeItem(pendingGoogleProfileKey);try{const pending=JSON.parse(pendingGoogleProfileRaw);if(Date.now()-Number(pending.createdAt)<10*60*1000&&S.profile?.school===''&&String(S.profile?.nickname||'').startsWith('Student_')&&pending.nickname&&pending.school){const {error:profileError}=await db.from('profiles').update({nickname:pending.nickname,school:pending.school}).eq('id',S.session.user.id);if(profileError)throw profileError;await loadProfile()}}catch(profileError){console.warn('Google signup profile details could not be saved:',profileError);toast('Google sign-in worked, but your profile details could not be saved. You can update them from Profile.')}}if(S.profile?.deleted_at){renderDeletedProfile();return}$('#app').innerHTML=shell();const invite=location.hash.match(/^#(ttt|cf|rps)=([0-9a-f-]{36})$/i);if(invite){S.view='game';if(invite[1].toLowerCase()==='ttt'){S.game='ttt';S.tttGameId=invite[2]}else if(invite[1].toLowerCase()==='cf'){S.game='connect';S.cfGameId=invite[2]}else{S.game='rps';S.rpsMode='online';S.rpsGameId=invite[2]}}setupNotificationControl();setUpRealtime();renderView();wireActions();$('#logout').onclick=()=>{db.auth.signOut();renderAuth()};const search=$('#search'),results=$('#search-results');let searchTimer;if(search&&results){search.oninput=()=>{clearTimeout(searchTimer);const term=search.value.trim();if(term.length<2){results.hidden=true;results.innerHTML='';return}searchTimer=setTimeout(async()=>{const safeTerm=term.replace(/[^\p{L}\p{N} '\-]/gu,'').trim();if(!safeTerm){results.hidden=true;results.innerHTML='';return}const [studentResult,schoolResult]=await Promise.all([db.from('profiles').select('id,nickname,school,avatar_url').neq('id',S.session.user.id).or('nickname.ilike.%'+safeTerm+'%,school.ilike.%'+safeTerm+'%').order('nickname').limit(20),db.from('profiles').select('school').not('school','is',null).ilike('school','%'+safeTerm+'%').limit(500)]);if(studentResult.error||schoolResult.error){results.innerHTML='<div class="search-result">Search unavailable</div>';results.hidden=false;return}const schoolMap=new Map();(schoolResult.data||[]).forEach(p=>{const name=(p.school||'').trim();const key=schoolKey(name);if(key&&!schoolMap.has(key))schoolMap.set(key,canonicalSchoolName(name))});const schoolButtons=Array.from(schoolMap.values()).slice(0,5).map(name=>'<button type="button" class="search-school-option" data-school="'+esc(name)+'"><span>🏫</span><span>View all students at <b>'+esc(name)+'</b></span></button>').join('');const studentRows=(studentResult.data||[]).map(p=>'<div class="search-result"><div style="display:flex;align-items:center;gap:8px">'+profileAvatarMarkup(p.nickname,p.avatar_url,'avatar')+'<div><b>'+esc(p.nickname)+'</b><div class="tiny">'+esc(p.school||'No school')+'</div></div></div><button class="btn btn-secondary" data-search-add="'+p.id+'">Add</button></div>').join('');results.innerHTML=(schoolButtons?'<div class="search-section-label">Schools</div>'+schoolButtons:'')+(studentRows?'<div class="search-section-label">Students</div>'+studentRows:'')||'<div class="search-result">No students or schools found</div>';results.hidden=false},250);}}}function updateNotificationButton(){
  const button=document.getElementById('notifications-toggle');
  if(!button)return;
  if(!('Notification' in window)){
    button.textContent='🔔 Unavailable';
    button.title='This browser does not support browser notifications.';
    button.disabled=true;
    return;
  }
  const permission=Notification.permission;
  button.disabled=permission==='denied';
  button.textContent=permission==='granted'?'🔔 On':permission==='denied'?'🔔 Blocked':'🔔 Enable';
  button.title=permission==='granted'?'Browser notifications are enabled.':permission==='denied'?'Allow notifications for this site in your browser settings.':'Enable browser notifications for new messages and friend requests.';
  button.setAttribute('aria-label',button.title);
}
function setupNotificationControl(){
  const button=document.getElementById('notifications-toggle');
  if(!button)return;
  updateNotificationButton();
  button.addEventListener('click',async()=>{
    if(!('Notification' in window)){toast('This browser does not support browser notifications.');return;}
    if(Notification.permission==='denied'){toast('Notifications are blocked by your browser. Allow them in the site settings, then reload StudentLink.');return;}
    if(Notification.permission==='granted'){toast('Browser notifications are already enabled.');return;}
    try{
      const permission=await Notification.requestPermission();
      updateNotificationButton();
      if(permission==='granted')toast('Notifications enabled for new messages and friend requests.');
      else toast('Notifications were not enabled. You can enable them later in your browser settings.');
    }catch(error){console.warn('Could not request notification permission:',error);toast('Could not enable notifications in this browser.');}
  });
}
function sendBrowserNotification(title,body,tag){
  try{
    if(!('Notification' in window)||Notification.permission!=='granted')return;
    const notification=new Notification(title,{body,tag,icon:'favicon.ico',renotify:false});
    notification.onclick=()=>{try{window.focus()}catch(_){};notification.close()};
  }catch(error){console.warn('StudentLink browser notification failed:',error);}
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
    sendBrowserNotification('New friend request',((person?.nickname||'A student')+' sent you a friend request.'),'friend-request-'+id);
  }catch(error){console.warn('Could not process friend-request notification:',error);}
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
    const {data:person,error:profileError}=await db.from('profiles').select('nickname').eq('id',row.sender_id).maybeSingle();
    if(profileError)console.warn('Could not load message notification sender:',profileError);
    const sender=person?.nickname||'A student';
    const body=String(row.body||'').trim();
    sendBrowserNotification('New message from '+sender,body.length>140?body.slice(0,137)+'…':body||'You received a new message.','message-'+id);
  }catch(error){console.warn('Could not process message notification:',error);}
}
async function setUpRealtime(){
  if(!db||!S.session)return;
  if(S.channel){await db.removeChannel(S.channel);S.channel=null}
  const refreshFeed=()=>{if(S.view==='feed')renderView()};
  const refreshPosts=()=>{S.feedOrderIds=[];S.feedOrderMode='';if(S.view==='feed')renderView()};
  const refreshFriends=()=>{if(S.view==='friends')renderView()};
  const refreshMessages=()=>{if(S.view==='messages'){if(S.chat)openConversation(S.chat).catch(e=>console.warn('Could not refresh conversation:',e));else renderView()}};
  const onFriendshipChange=payload=>{refreshFriends();notifyFriendRequest(payload)};
  const onMessageChange=payload=>{refreshMessages();notifyIncomingMessage(payload)};
  S.channel=db.channel('studentlink-live-updates')
    .on('postgres_changes',{event:'*',schema:'public',table:'posts'},refreshPosts)
    .on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},refreshFeed)
    .on('postgres_changes',{event:'*',schema:'public',table:'friendships'},onFriendshipChange)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},onMessageChange)
    .subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('StudentLink realtime status:',status)});
}
async function loadProfile(){let {data,error}=await db.from('profiles').select('*').eq('id',S.session.user.id).maybeSingle();if(error)console.warn(error);S.profile=data||{id:S.session.user.id,nickname:'Student',school:''}}
async function renderView(){let m=$('#main');if(!m)return;m.setAttribute('aria-live','polite');m.setAttribute('aria-busy','true');m.innerHTML='<div class="card state-message" role="status"><span class="state-icon" aria-hidden="true">⏳</span><div><b>Loading this page…</b><p class="tiny">Please wait a moment.</p></div></div>';try{if(S.view==='feed')await viewFeed();if(S.view==='friends')await viewFriends();if(S.view==='messages')await viewMessages();if(S.view==='games')viewGames();if(S.view==='game')await viewGame();if(S.view==='profile')viewProfile();if(S.view==='suggestions')viewSuggestions();if(S.view==='school')await viewSchoolStudents(S.schoolFilter);try{await viewSchools()}catch(schoolError){console.warn('Trending schools could not be loaded:',schoolError);const fallback='<p class="tiny">Trending schools are temporarily unavailable.</p>';const desktop=$('#trending'),mobile=$('#trending-mobile');if(desktop)desktop.innerHTML=fallback;if(mobile)mobile.innerHTML=fallback}}catch(e){console.error(e);m.innerHTML=`<div class="card state-message error-state" role="alert"><span class="state-icon" aria-hidden="true">!</span><div><b>This page couldn't be loaded</b><p>${esc(e?.message||'Something went wrong. Please try again.')}</p><p class="tiny">Check your connection and try opening this page again.</p></div></div>`}finally{m.setAttribute('aria-busy','false')}}
async function viewFeed(){
 const mode=S.feedMode==='school'?'school':'all';let data=[];
 if(S.feedOrderMode!==mode||!S.feedOrderIds.length){const result=await db.rpc('get_studentlink_feed',{p_school_only:mode==='school',p_limit:40});if(result.error)throw result.error;data=result.data||[];S.feedOrderMode=mode;S.feedOrderIds=data.map(p=>p.id)}
 else{const result=await db.from('posts').select('id,user_id,body,created_at,post_type,poll_question,poll_options').in('id',S.feedOrderIds);if(result.error)throw result.error;const byId=new Map((result.data||[]).map(p=>[p.id,p]));data=S.feedOrderIds.map(id=>byId.get(id)).filter(Boolean);S.feedOrderIds=data.map(p=>p.id)}
 const schoolName=S.profile?.school||'';let html='<div class="head feed-head"><div><h1 class="title">Feed</h1><p class="tiny">Posts are shuffled by default.</p></div><div class="feed-controls"><label for="feed-filter" class="tiny">Show</label><select id="feed-filter" aria-label="Filter posts"><option value="all" '+(mode==='all'?'selected':'')+'>All schools</option><option value="school" '+(mode==='school'?'selected':'')+(schoolName?'':' disabled')+'>My school</option></select><button class="btn" id="new-post">New post</button></div></div>';
 if(mode==='school'&&!schoolName)html+='<div class="card"><b>Add your school first</b><p class="tiny">Open Profile and choose your school to filter posts.</p></div>';else if(!data.length)html+='<div class="card"><b>No posts found</b></div>';
 if(data.length){const ids=[...new Set(data.map(p=>p.user_id))],postIds=data.map(p=>p.id);const results=await Promise.all([db.from('profiles').select('id,nickname,school,avatar_url').in('id',ids),db.from('post_likes').select('post_id').in('post_id',postIds),db.from('post_likes').select('post_id').in('post_id',postIds).eq('user_id',S.session.user.id),db.from('comments').select('post_id').in('post_id',postIds)]);results.forEach(r=>{if(r.error)throw r.error});const users=new Map((results[0].data||[]).map(p=>[p.id,p])),likeMap={},commentMap={},likedSet=new Set((results[2].data||[]).map(x=>x.post_id));(results[1].data||[]).forEach(x=>likeMap[x.post_id]=(likeMap[x.post_id]||0)+1);(results[3].data||[]).forEach(x=>commentMap[x.post_id]=(commentMap[x.post_id]||0)+1);data=data.filter(p=>users.has(p.user_id));const pollIds=data.filter(p=>p.post_type==='poll').map(p=>p.id),voteResult=pollIds.length?await db.from('poll_votes').select('post_id,user_id,option_index').in('post_id',pollIds):{data:[],error:null};if(voteResult.error)throw voteResult.error;const voteMap={};(voteResult.data||[]).forEach(v=>{(voteMap[v.post_id]||(voteMap[v.post_id]=[])).push(v)});html+=data.map(p=>postCard(p,users.get(p.user_id),likedSet.has(p.id),likeMap[p.id]||0,commentMap[p.id]||0,voteMap[p.id]||[])).join('')}
 $('#main').innerHTML=html;$('#feed-filter')?.addEventListener('change',e=>{S.feedMode=e.target.value;S.feedOrderIds=[];S.feedOrderMode='';renderView()});
 $('#new-post')?.addEventListener('click',()=>{modal('Create a post','<form id="postform"><div class="field"><label>What&#39;s on your mind?</label><textarea id="pb" maxlength="280" required></textarea></div><div class="field"><label><input type="radio" name="pt" value="text" checked> Text</label><label><input type="radio" name="pt" value="poll"> Poll</label></div><div id="pollopts" style="display:none"><div class="field"><label>Question</label><input id="pq" maxlength="180"></div>'+[1,2,3,4].map(n=>'<div class="field"><label>Option '+n+'</label><input id="po'+n+'" maxlength="100"></div>').join('')+'</div><button type="submit" class="btn">Post</button></form>');$('[value="poll"]').onchange=()=>$('#pollopts').style.display='block';$('[value="text"]').onchange=()=>$('#pollopts').style.display='none';$('#postform').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,submit=form.querySelector('button[type="submit"]'),pt=$('[name="pt"]:checked')?.value||'text',body=$('#pb').value.trim();let payload;if(pt==='poll'){const q=$('#pq').value.trim(),opts=[1,2,3,4].map(n=>$('#po'+n).value.trim()).filter(Boolean);if(!q||opts.length<2){toast('Add a poll question and at least 2 options.');return}payload={user_id:S.session.user.id,body:body||q,post_type:'poll',poll_question:q,poll_options:opts}}else{if(!body){toast('Post cannot be empty.');return}payload={user_id:S.session.user.id,body,post_type:'text'}}if(submit){submit.disabled=true;submit.textContent='Posting…'}try{const {error}=await db.from('posts').insert(payload);if(error)throw error;S.feedOrderIds=[];S.feedOrderMode='';closeModal();await renderView();toast(pt==='poll'?'Poll published.':'Post published.')}catch(err){console.error(err);toast('Could not publish your post. Please check your connection and try again.');if(submit){submit.disabled=false;submit.textContent='Post'}}}});
 $$('[data-like]').forEach(b=>b.onclick=()=>toggleLike(b.dataset.like,b.classList.contains('liked')));$$('[data-comments]').forEach(b=>b.onclick=()=>openComments(b.dataset.comments));$$('[data-vote]').forEach(b=>b.onclick=()=>votePoll(b.dataset.vote,Number(b.dataset.option)));$$('[data-delete-post]').forEach(b=>b.onclick=()=>deleteOwnPost(b.dataset.deletePost));
}
async function deleteOwnPost(postId){if(!window.confirm('Delete this post? This cannot be undone.'))return;const {data,error}=await db.from('posts').delete().eq('id',postId).eq('user_id',S.session.user.id).select('id').maybeSingle();if(error){console.error(error);toast('Could not delete this post.');return}if(!data){toast('Post not found or you cannot delete it.');return}S.feedOrderIds=S.feedOrderIds.filter(id=>id!==postId);toast('Your post was deleted.');await renderView()}
async function votePoll(postId,optionIndex){const {data:existing,error:checkError}=await db.from('poll_votes').select('post_id').eq('post_id',postId).eq('user_id',S.session.user.id).maybeSingle();if(checkError){toast(checkError.message);return}if(existing){toast('You have already voted in this poll.');return}const {error}=await db.from('poll_votes').insert({post_id:postId,user_id:S.session.user.id,option_index:optionIndex});if(error){toast(error.message);return}toast('Vote recorded.');await renderView()}
function postCard(p,profile,liked,count,comments,votes=[]){const myVote=votes.find(v=>v.user_id===S.session.user.id);const total=votes.length;return `<article class="card"><div class="post-top"><button type="button" class="profile-open" data-public-profile="${esc(p.user_id)}" aria-label="View ${esc(profile?.nickname||'Student')}'s profile">${profileAvatarMarkup(profile?.nickname,profile?.avatar_url,'avatar')}</button><div style="flex:1"><button type="button" class="profile-name-link" data-public-profile="${esc(p.user_id)}">${esc(profile?.nickname||'Student')}</button> <span class="tiny">${new Date(p.created_at).toLocaleDateString()}</span></div>${p.user_id===S.session.user.id?'<button type="button" class="btn btn-secondary post-delete" data-delete-post="'+p.id+'" aria-label="Delete your post">Delete</button>':''}</div>${p.post_type==='poll'?`<div><b>${esc(p.poll_question)}</b><div style="margin-top:8px">${(p.poll_options||[]).map((o,i)=>{const n=votes.filter(v=>v.option_index===i).length;return `<button data-vote="${p.id}" data-option="${i}" class="btn btn-secondary" style="display:flex;justify-content:space-between;gap:12px;margin-bottom:4px;text-align:left;width:100%" ${myVote?'disabled':''}><span>${esc(o)}${myVote&&myVote.option_index===i?' ✓':''}</span><span>${myVote?`${n} vote${n===1?'':'s'}`:''}</span></button>`}).join('')}</div><div class="tiny">${total} vote${total===1?'':'s'}${myVote?' · You voted':''}</div></div>`:`<p>${esc(p.body)}</p>`}<div style="display:flex;gap:12px;margin-top:12px"><button data-like="${p.id}" class="btn btn-secondary ${liked?'liked':''}" style="flex:1">❤️ ${count}</button><button data-comments="${p.id}" class="btn btn-secondary" style="flex:1">💬 Comment (${comments})</button></div></article>`}
async function openComments(postId){
  const closeButton='<div style="display:flex;justify-content:flex-end;margin-bottom:10px"><button type="button" id="closecomments" class="btn btn-secondary" aria-label="Close comments">Close comments ✕</button></div>';
  modal('Comments',closeButton+'<div class="tiny">Loading comments…</div>');
  $('#closecomments').onclick=closeModal;
  const {data:rows,error}=await db.from('comments').select('id,user_id,body,created_at').eq('post_id',postId).order('created_at',{ascending:true});
  if(error){$('#modalcontent').innerHTML=closeButton+'<p>Could not load comments. Please try again.</p>';$('#closecomments').onclick=closeModal;toast(error.message);return}
  const people=await Promise.all((rows||[]).map(c=>db.from('profiles').select('nickname').eq('id',c.user_id).maybeSingle()));
  const commentsHtml=(rows||[]).map((c,i)=>`<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>${esc(people[i].data?.nickname||'Student')}</b><div style="white-space:pre-wrap;overflow-wrap:anywhere;margin-top:4px;color:#000">${esc(c.body)}</div><div class="tiny" style="margin-top:4px">${new Date(c.created_at).toLocaleString()}</div></div>`).join('');
  $('#modalcontent').innerHTML=closeButton+`<div style="max-height:42vh;overflow-y:auto;margin-bottom:16px">${commentsHtml||'<p class="tiny">No comments yet. Start the conversation.</p>'}</div><form id="commentform"><div class="field"><label for="commentbody">Write a comment (max 600 characters)</label><textarea id="commentbody" maxlength="600" rows="3" required placeholder="Add a helpful comment…"></textarea></div><button type="submit" class="btn">Submit comment</button></form>`;
  $('#closecomments').onclick=closeModal;
  $('#commentform').onsubmit=async e=>{e.preventDefault();const body=$('#commentbody').value.trim();if(!body){toast('Comment cannot be empty.');return}if(body.length>600){toast('Comments are limited to 600 characters.');return}const submit=$('#commentform button[type="submit"]');submit.disabled=true;submit.textContent='Submitting…';const {error:insertError}=await db.from('comments').insert({post_id:postId,user_id:S.session.user.id,body});if(insertError){toast(insertError.message);submit.disabled=false;submit.textContent='Submit comment';return}toast('Comment added.');await renderView();await openComments(postId)};
}
async function toggleLike(id,liked){try{const q=liked?db.from('post_likes').delete().eq('post_id',id).eq('user_id',S.session.user.id):db.from('post_likes').insert({post_id:id,user_id:S.session.user.id});const {error}=await q;if(error){toast(error.message||'Could not update your like. Please try again.');return}await renderView()}catch(error){console.error(error);toast('Could not update your like. Check your connection and try again.')}}
async function viewFriends(){
  const {data:people,error:peopleError}=await db.from('profiles').select('id,nickname,school,avatar_url').neq('id',S.session.user.id).order('nickname').limit(100);
  if(peopleError)throw peopleError;
  const {data:rows,error}=await db.from('friendships').select('user_id,friend_id,status').or(`user_id.eq.${S.session.user.id},friend_id.eq.${S.session.user.id}`);
  if(error)throw error;
  const sent=new Set((rows||[]).filter(r=>r.status==='pending'&&r.user_id===S.session.user.id).map(r=>r.friend_id));
  const received=new Set((rows||[]).filter(r=>r.status==='pending'&&r.friend_id===S.session.user.id).map(r=>r.user_id));
  const friendIds=new Set((rows||[]).filter(r=>r.status==='accepted').map(r=>r.user_id===S.session.user.id?r.friend_id:r.user_id));
  S.friends=(people||[]).filter(p=>friendIds.has(p.id));
  let html=`<div class='head'><h1 class='title'>Friends</h1><span class='tiny'>${S.friends.length} friends</span></div>`;
  html+=(people||[]).map(p=>`<div class='card'><div style='display:flex;justify-content:space-between;align-items:center;gap:12px'><div style='display:flex;align-items:center;gap:10px;min-width:0'><button type="button" class="profile-open" data-public-profile="${esc(p.id)}" aria-label="View ${esc(p.nickname)}'s profile">${profileAvatarMarkup(p.nickname,p.avatar_url,'avatar')}</button><div><button type="button" class="profile-name-link" data-public-profile="${esc(p.id)}">${esc(p.nickname)}</button><div class='tiny'>${esc(p.school||'No school')}</div></div></div><div style='display:flex;gap:8px;flex-wrap:wrap'>${friendIds.has(p.id)?`<button class='btn btn-secondary' data-messagefriend='${p.id}'>Message</button>`:received.has(p.id)?`<button class='btn' data-accept='${p.id}'>Accept</button><button class='btn btn-secondary' data-decline='${p.id}'>Decline</button>`:sent.has(p.id)?`<button class='btn btn-secondary' disabled>Requested</button>`:`<button class='btn' data-add='${p.id}'>Add friend</button>`}</div></div></div>`).join('');
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
function viewGames(){let gs=[['⭕❌','Tic-Tac-Toe','Online multiplayer — play from anywhere','ttt'],['🧠','Student Quiz','General knowledge','quiz'],['🔵🟡','Connect Four','Connect four in a row','connect'],['✊✋✌️','Rock Paper Scissors','Play a quick round against the computer','rps'],['🔢','Number Guess','Find the secret number from 1 to 100','guess'],['🔤','Word Scramble','Unscramble words and build your score','scramble']];$('#main').innerHTML='<div class="head"><h1 class="title">Games</h1><p class="tiny">Choose a game to play.</p></div>'+gs.map(g=>'<div class="card" data-game="'+g[3]+'" style="cursor:pointer"><span style="font-size:24px">'+g[0]+'</span> <b>'+g[1]+'</b><div class="tiny">'+g[2]+'</div></div>').join('');$$('[data-game]').forEach(el=>{el.onclick=()=>{S.game=el.dataset.game;S.view='game';renderView()}})}


function scrambleWord(word){let chars=word.split(''),mixed=word;for(let i=0;i<12&&mixed===word;i++){for(let j=chars.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[chars[j],chars[k]]=[chars[k],chars[j]]}mixed=chars.join('')}return mixed===word?word.split('').reverse().join(''):mixed}
const STUDENT_QUIZ_QUESTIONS=[
{q:'Which planet is known as the Red Planet?',options:['Venus','Mars','Jupiter','Mercury'],answer:1,why:'Iron-rich dust gives Mars its reddish appearance.'},
{q:'What is the chemical formula for water?',options:['CO₂','O₂','H₂O','NaCl'],answer:2,why:'A water molecule contains two hydrogen atoms and one oxygen atom.'},
{q:'Which organ pumps blood around the human body?',options:['Lungs','Heart','Liver','Kidneys'],answer:1,why:'The heart contracts to circulate blood through the body.'},
{q:'What is 15% of 200?',options:['15','20','30','45'],answer:2,why:'0.15 × 200 = 30.'},
{q:'What is the SI unit of force?',options:['Joule','Watt','Pascal','Newton'],answer:3,why:'Force is measured in newtons (N).'},
{q:'Which is the largest ocean on Earth?',options:['Atlantic','Indian','Pacific','Arctic'],answer:2,why:'The Pacific Ocean is the largest ocean.'},
{q:'What is the capital city of Ghana?',options:['Kumasi','Accra','Tamale','Cape Coast'],answer:1,why:'Accra is the capital of Ghana.'},
{q:'Which gas do plants absorb for photosynthesis?',options:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'],answer:2,why:'Plants use carbon dioxide and water to make sugars using light energy.'},
{q:'In computing, what does CPU stand for?',options:['Central Processing Unit','Computer Power Utility','Core Program Upload','Central Print Unit'],answer:0,why:'The CPU executes instructions and coordinates computer operations.'},
{q:'What is the square root of 144?',options:['10','11','12','14'],answer:2,why:'12 × 12 = 144.'},
{q:'Which instrument measures atmospheric pressure?',options:['Thermometer','Barometer','Ammeter','Hygrometer'],answer:1,why:'A barometer measures atmospheric pressure.'},
{q:'Which branch of government interprets laws?',options:['Executive','Legislature','Judiciary','Electoral commission'],answer:2,why:'The judiciary interprets and applies the law in cases.'}
];
function scrambleWord(word){let chars=word.split(''),mixed=word;for(let i=0;i<12&&mixed===word;i++){for(let j=chars.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[chars[j],chars[k]]=[chars[k],chars[j]]}mixed=chars.join('')}return mixed===word?word.split('').reverse().join(''):mixed}
function renderLocalGame(){
  const game=S.game;
  const titles={quiz:'Student Quiz',rps:'Rock Paper Scissors',guess:'Number Guess',scramble:'Word Scramble'};
  let html='<div class="head"><button type="button" class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">'+titles[game]+'</h1></div>';
  if(game==='quiz'){
    if(!S.quizState)S.quizState={index:0,score:0,selected:null,finished:false};
    const st=S.quizState;
    if(st.finished||st.index>=STUDENT_QUIZ_QUESTIONS.length){
      html+='<div class="card"><h2>Quiz complete!</h2><p>You scored <b>'+st.score+' / '+STUDENT_QUIZ_QUESTIONS.length+'</b>.</p><p>'+(st.score>=10?'Excellent work!':st.score>=7?'Good job — keep practising.':'Keep learning and try again.')+'</p><button type="button" class="btn" id="quiz-restart">Play again</button></div>';
      $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');$('#quiz-restart').onclick=()=>{S.quizState={index:0,score:0,selected:null,finished:false};renderLocalGame()};return;
    }
    const q=STUDENT_QUIZ_QUESTIONS[st.index];
    html+='<div class="card"><p class="tiny">Question '+(st.index+1)+' of '+STUDENT_QUIZ_QUESTIONS.length+' · Score: '+st.score+'</p><div style="height:6px;background:#d6dfec;border-radius:6px;margin:10px 0 18px"><div style="height:6px;width:'+((st.index/STUDENT_QUIZ_QUESTIONS.length)*100)+'%;background:#315fce;border-radius:6px"></div></div><h2 style="font-size:20px">'+q.q+'</h2><div style="display:grid;gap:9px;margin-top:16px">'+q.options.map((option,i)=>'<button type="button" class="btn '+(st.selected===i?'':'btn-secondary')+'" data-quiz-answer="'+i+'" '+(st.selected!==null?'disabled':'')+' style="text-align:left;white-space:normal">'+String.fromCharCode(65+i)+'. '+esc(option)+'</button>').join('')+'</div>';
    if(st.selected!==null)html+='<p><b>'+(st.selected===q.answer?'Correct!':'Not quite.')+'</b> '+esc(q.why)+'</p><button type="button" class="btn" id="quiz-next">'+(st.index===STUDENT_QUIZ_QUESTIONS.length-1?'See results':'Next question')+'</button>';
    html+='</div>';
    $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');
    $$('[data-quiz-answer]').forEach(b=>b.onclick=()=>{if(st.selected!==null)return;st.selected=Number(b.dataset.quizAnswer);if(st.selected===q.answer)st.score++;renderLocalGame()});
    const next=$('#quiz-next');if(next)next.onclick=()=>{st.index++;st.selected=null;if(st.index>=STUDENT_QUIZ_QUESTIONS.length)st.finished=true;renderLocalGame()};return;
  }
  if(game==='rps'){
    html+='<div class="card"><p>Choose how you want to play.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn '+(S.rpsMode==='computer'?'':'btn-secondary')+'" id="rps-computer-mode">Play computer</button><button type="button" class="btn '+(S.rpsMode==='online'?'':'btn-secondary')+'" id="rps-online-mode">Play online multiplayer</button></div></div>';
    if(S.rpsMode==='online'){ $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');$('#rps-computer-mode').onclick=()=>{S.rpsMode='computer';renderLocalGame()};$('#rps-online-mode').onclick=()=>{S.rpsMode='online';S.rpsGameId=null;viewGame()};viewOnlineGame('rps');return; }
    if(!S.rpsState)S.rpsState={wins:0,losses:0,draws:0,last:'Choose rock, paper, or scissors to start.'};
    const st=S.rpsState;
    html+='<div class="card"><p>'+esc(st.last)+'</p><p class="tiny">Your score — Wins: '+st.wins+' · Losses: '+st.losses+' · Draws: '+st.draws+'</p><div style="display:flex;flex-wrap:wrap;gap:8px">'+[['rock','✊ Rock'],['paper','✋ Paper'],['scissors','✌️ Scissors']].map(x=>'<button type="button" class="btn" data-rps="'+x[0]+'">'+x[1]+'</button>').join('')+'</div><p class="tiny">Computer mode works offline. Online multiplayer lets you play another StudentLink user.</p><button type="button" class="btn btn-secondary" id="rps-reset">Reset score</button></div>';
    $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');$('#rps-computer-mode').onclick=()=>{S.rpsMode='computer';renderLocalGame()};$('#rps-online-mode').onclick=()=>{S.rpsMode='online';S.rpsGameId=null;viewGame()};
    $$('[data-rps]').forEach(b=>b.onclick=()=>{const you=b.dataset.rps,choices=['rock','paper','scissors'],cpu=choices[Math.floor(Math.random()*3)];if(you===cpu){st.draws++;st.last='You chose '+you+'; computer chose '+cpu+'. It is a draw.'}else if((you==='rock'&&cpu==='scissors')||(you==='paper'&&cpu==='rock')||(you==='scissors'&&cpu==='paper')){st.wins++;st.last='You chose '+you+'; computer chose '+cpu+'. You win this round!'}else{st.losses++;st.last='You chose '+you+'; computer chose '+cpu+'. Computer wins this round.'}renderLocalGame()});
    $('#rps-reset').onclick=()=>{S.rpsState={wins:0,losses:0,draws:0,last:'Score reset. Choose your move.'};renderLocalGame()};return;
  }
  if(game==='guess'){
    if(!S.guessState)S.guessState={target:Math.floor(Math.random()*100)+1,attempts:0,message:'Guess a whole number from 1 to 100.',finished:false};
    const st=S.guessState;
    html+='<div class="card"><p>'+esc(st.message)+'</p><p class="tiny">Attempts: '+st.attempts+'</p><form id="guess-form"><div class="field"><label for="guess-input">Your guess</label><input id="guess-input" type="number" min="1" max="100" step="1" required '+(st.finished?'disabled':'')+' placeholder="Enter 1–100"></div><button type="submit" class="btn" '+(st.finished?'disabled':'')+'>Check guess</button></form><button type="button" class="btn btn-secondary" id="guess-reset">New number</button></div>';
    $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');
    $('#guess-form').onsubmit=e=>{e.preventDefault();if(st.finished)return;const input=$('#guess-input'),n=Number(input.value);if(!Number.isInteger(n)||n<1||n>100){st.message='Enter a whole number between 1 and 100.';renderLocalGame();return}st.attempts++;if(n===st.target){st.message='Correct! You found the number in '+st.attempts+' attempt'+(st.attempts===1?'':'s')+'.';st.finished=true}else st.message=n<st.target?'Too low. Try a higher number.':'Too high. Try a lower number.';renderLocalGame()};
    $('#guess-reset').onclick=()=>{S.guessState={target:Math.floor(Math.random()*100)+1,attempts:0,message:'New number ready. Guess from 1 to 100.',finished:false};renderLocalGame()};return;
  }
  if(game==='scramble'){
    const words=['planet','school','friend','science','puzzle','laptop','garden','energy','bridge','rocket'];
    if(!S.scrambleState){const word=words[Math.floor(Math.random()*words.length)];S.scrambleState={word:word,scrambled:scrambleWord(word),solved:0,attempts:0,message:'Unscramble the letters to find the word.',solvedCurrent:false}}
    const st=S.scrambleState;
    html+='<div class="card"><p>Scrambled word</p><h2 style="font-size:30px;letter-spacing:.18em">'+st.scrambled.toUpperCase()+'</h2><p>'+esc(st.message)+'</p><p class="tiny">Solved: '+st.solved+' · Attempts: '+st.attempts+'</p><form id="scramble-form"><div class="field"><label for="scramble-input">Your answer</label><input id="scramble-input" maxlength="20" autocomplete="off" required '+(st.solvedCurrent?'disabled':'')+' placeholder="Type the word"></div><button type="submit" class="btn" '+(st.solvedCurrent?'disabled':'')+'>Check word</button></form><button type="button" class="btn btn-secondary" id="scramble-next">Next word</button><button type="button" class="btn btn-secondary" id="scramble-reset">Reset score</button></div>';
    $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');
    $('#scramble-form').onsubmit=e=>{e.preventDefault();if(st.solvedCurrent)return;st.attempts++;if($('#scramble-input').value.trim().toLowerCase()===st.word){st.solved++;st.solvedCurrent=true;st.message='Correct! The word was '+st.word+'. Choose Next word to continue.'}else st.message='Not quite. Try again!';renderLocalGame()};
    $('#scramble-next').onclick=()=>{let word=st.word;while(words.length>1&&word===st.word)word=words[Math.floor(Math.random()*words.length)];S.scrambleState={word:word,scrambled:scrambleWord(word),solved:st.solved,attempts:st.attempts,message:'New word. You can do it!',solvedCurrent:false};renderLocalGame()};
    $('#scramble-reset').onclick=()=>{S.scrambleState=null;renderLocalGame()};return;
  }
}



async function stopOnlineGameChannel(){if(S.onlineGameChannel){const channel=S.onlineGameChannel;S.onlineGameChannel=null;await db.removeChannel(channel)}}
async function watchOnlineGameChannel(game,gameId=null){
  await stopOnlineGameChannel();
  if(!db||!S.session||S.view!=='game')return;
  const table=game==='connect'?'connect_four_games':'rps_games';
  const filter={event:'*',schema:'public',table};
  if(gameId)filter.filter='id=eq.'+gameId;
  const channel=db.channel((game==='connect'?'connect-four':'rps')+'-'+(gameId||'lobby'));
  channel.on('postgres_changes',filter,()=>{if(S.view==='game'&&S.game===game&&((game==='connect'?S.cfGameId:S.rpsGameId)===gameId))viewGame()}).subscribe();
  S.onlineGameChannel=channel;
}
async function startOnlineGame(game){
  const prefix=game==='connect'?'cf':'rps';
  const {data,error}=await db.rpc(prefix+'_create_game');
  if(error){console.error(error);toast('Could not create the online game. Run the StudentLink multiplayer games SQL setup in Supabase first.');return}
  if(game==='connect')S.cfGameId=data;else S.rpsGameId=data;
  await watchOnlineGameChannel(game,data);await viewOnlineGame(game);
}
async function joinOnlineGame(game,id){
  const prefix=game==='connect'?'cf':'rps';
  const {error}=await db.rpc(prefix+'_join_game',{p_game_id:id});
  if(error){toast(error.message||'Could not join that game.');return}
  if(game==='connect')S.cfGameId=id;else S.rpsGameId=id;
  await watchOnlineGameChannel(game,id);await viewOnlineGame(game);
}
async function playOnlineMove(game,move){
  const id=game==='connect'?S.cfGameId:S.rpsGameId;
  if(!id)return;
  const prefix=game==='connect'?'cf':'rps';
  const args=game==='connect'?{p_game_id:id,p_column:move}:{p_game_id:id,p_move:move};
  const {error}=await db.rpc(prefix+'_make_move',args);
  if(error){toast(error.message||'Your move could not be made.');return}
  await viewOnlineGame(game);
}
async function leaveOnlineGame(game){
  const id=game==='connect'?S.cfGameId:S.rpsGameId;
  if(id&&db){
    const prefix=game==='connect'?'cf':'rps';
    const {error}=await db.rpc(prefix+'_leave_game',{p_game_id:id});
    if(error)console.warn('Could not mark online game as left:',error.message);
  }
  if(game==='connect')S.cfGameId=null;else S.rpsGameId=null;
  await stopOnlineGameChannel();await viewOnlineGame(game);
}
async function viewOnlineGame(game){
  if(!db||!S.session){$('#main').innerHTML='<div class="head"><button type="button" class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">'+(game==='connect'?'Connect Four':'Rock Paper Scissors · Online')+'</h1></div><div class="card">Please sign in to play online.</div>';$('#games-back').onclick=()=>setView('games');return}
  const isConnect=game==='connect',table=isConnect?'connect_four_games':'rps_games',prefix=isConnect?'cf':'rps',id=isConnect?S.cfGameId:S.rpsGameId;
  if(!id){
    const {data:games,error}=await db.from(table).select('id,player_one,created_at').eq('status','waiting').is('player_two',null).order('created_at',{ascending:true}).limit(30);
    if(error){$('#main').innerHTML='<div class="head"><button type="button" class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">'+(isConnect?'Connect Four':'Rock Paper Scissors · Online')+'</h1></div><div class="card"><b>Multiplayer setup required</b><p>Run <code>studentlink_multiplayer_games.sql</code> in your Supabase SQL Editor, then reopen this game.</p><p class="tiny">'+esc(error.message)+'</p></div>';$('#games-back').onclick=()=>setView('games');return}
    const ids=[...new Set((games||[]).map(g=>g.player_one))];let profiles=[];
    if(ids.length){const p=await db.from('profiles').select('id,nickname').in('id',ids);profiles=p.data||[]}
    const names=new Map(profiles.map(p=>[p.id,p.nickname]));
    const title=isConnect?'Connect Four':'Rock Paper Scissors · Online';
    $('#main').innerHTML='<div class="head"><button type="button" class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">'+title+'</h1></div><div class="card"><p>Play online with another StudentLink user.</p><button type="button" class="btn" id="online-create">＋ Create online game</button></div><div class="head"><h2 class="title" style="font-size:18px">Open games</h2><button type="button" class="btn btn-secondary" id="online-refresh">Refresh</button></div>'+
      ((games||[]).length?(games||[]).map(g=>'<div class="card"><b>'+esc(names.get(g.player_one)||'Student')+(g.player_one===S.session.user.id?' (You)':'')+'</b><div class="tiny">Waiting for an opponent · '+new Date(g.created_at).toLocaleString()+'</div><button type="button" class="btn" '+(g.player_one===S.session.user.id?'data-online-open="'+g.id+'"':'data-online-join="'+g.id+'"')+'>'+(g.player_one===S.session.user.id?'Resume game':'Join game')+'</button></div>').join(''):'<div class="card tiny">No open games. Create one and invite another student.</div>');
    $('#games-back').onclick=()=>{stopOnlineGameChannel();setView('games')};$('#online-create').onclick=()=>startOnlineGame(game);$('#online-refresh').onclick=()=>viewOnlineGame(game);
    $$('[data-online-join]').forEach(b=>b.onclick=()=>joinOnlineGame(game,b.dataset.onlineJoin));
    $$('[data-online-open]').forEach(b=>b.onclick=async()=>{if(isConnect)S.cfGameId=b.dataset.onlineOpen;else S.rpsGameId=b.dataset.onlineOpen;await watchOnlineGameChannel(game,b.dataset.onlineOpen);await viewOnlineGame(game)});
    if(!S.onlineGameChannel)await watchOnlineGameChannel(game,null);return;
  }
  if(!S.onlineGameChannel)await watchOnlineGameChannel(game,id);
  const gameResult=isConnect?await db.from(table).select('*').eq('id',id).maybeSingle():await db.rpc('rps_get_game',{p_game_id:id});const g=gameResult.data,error=gameResult.error;
  if(error||!g){$('#main').innerHTML='<div class="card">Could not load this online game. Return to the game lobby and try again.</div><button type="button" class="btn btn-secondary" id="online-back">Back to lobby</button>';$('#online-back').onclick=async()=>{if(isConnect)S.cfGameId=null;else S.rpsGameId=null;await stopOnlineGameChannel();viewOnlineGame(game)};return}
  const playerIds=[g.player_one,g.player_two].filter(Boolean);let profiles=[];
  if(playerIds.length){const p=await db.from('profiles').select('id,nickname').in('id',playerIds);profiles=p.data||[]}
  const names=new Map(profiles.map(p=>[p.id,p.nickname]));const me=S.session.user.id;const role=g.player_one===me?1:g.player_two===me?2:0;const opponentId=g.player_one===me?g.player_two:g.player_one;const opponent=opponentId?(names.get(opponentId)||'Student'):'Waiting for opponent';const canJoin=g.status==='waiting'&&g.player_one!==me&&!g.player_two;
  let status='',boardHTML='';
  if(isConnect){
    const board=Array.isArray(g.board)?g.board:Array(42).fill(0),myTurn=g.status==='playing'&&g.current_turn===me;
    status=canJoin?'This game is open. Join to play as yellow.':g.status==='waiting'?'Waiting for an opponent to join.':g.status==='cancelled'?'The creator cancelled this game.':g.status==='won'?(g.winner_id===me?'You won Connect Four! 🎉':g.winner_id?'You lost this game.':'Game finished.'):g.status==='draw'?'It is a draw.':myTurn?'Your turn.':'Waiting for '+esc(opponent)+' to move.';
    boardHTML='<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;max-width:490px;margin:14px auto 0">'+Array.from({length:6},(_,displayRow)=>5-displayRow).map(row=>Array.from({length:7},(_,col)=>{const v=board[row*7+col]||0;return '<div aria-label="'+(v===1?'Red disc':v===2?'Yellow disc':'Empty')+'" style="aspect-ratio:1;min-width:0;border-radius:50%;background:'+(v===1?'#e14b55':v===2?'#f2c94c':'#d9e3f2')+';border:2px solid #9aabc4;box-shadow:inset 0 1px 3px #0002"></div>'}).join('')).join('')+'</div>';
    const columns=Array.from({length:7},(_,col)=>{let full=true;for(let row=0;row<6;row++)if(!(board[row*7+col]||0)){full=false;break}return '<button type="button" class="btn" data-cf-column="'+col+'" '+(!myTurn||full?'disabled':'')+' aria-label="Drop disc in column '+(col+1)+'">'+(col+1)+'</button>'}).join('');
    $('#main').innerHTML='<div class="head"><button type="button" class="btn btn-secondary" id="online-back">← Games</button><h1 class="title">Connect Four · Online</h1></div><div class="card"><div style="display:flex;justify-content:space-around;gap:12px;flex-wrap:wrap"><div><span class="tiny">You are</span><h2 class="title">'+(role===1?'Red':role===2?'Yellow':'Spectator')+'</h2></div><div><span class="tiny">Opponent</span><h2 class="title">'+esc(opponent)+'</h2></div></div><p>'+status+'</p><div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;max-width:490px;margin:auto">'+columns+'</div>'+boardHTML+(canJoin?'<button type="button" class="btn" id="online-join-current">Join this game</button>':'')+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button type="button" class="btn btn-secondary" id="online-copy">Copy invite link</button><button type="button" class="btn btn-secondary" id="online-lobby">Back to lobby</button>'+(g.status==='playing'||g.status==='waiting'?'<button type="button" class="btn btn-secondary" id="online-leave">Leave game</button>':'')+'</div><p class="tiny">Red moves first. Board updates automatically for both players.</p></div>';
    $$('[data-cf-column]').forEach(b=>b.onclick=()=>playOnlineMove('connect',Number(b.dataset.cfColumn)));
  }else{
    const myMove=role===1?g.move_one:role===2?g.move_two:null;
    status=canJoin?'This game is open. Join to play.':g.status==='waiting'?'Waiting for an opponent to join.':g.status==='cancelled'?'The creator cancelled this game.':g.status==='won'?(g.winner_id===me?'You won! 🎉':g.winner_id?'You lost this game.':'Game finished.'):role===0?'You are viewing this game. Join the lobby to play.':myMove?'Move submitted. Waiting for your opponent.':'Choose rock, paper, or scissors for this round.';
    $('#main').innerHTML='<div class="head"><button type="button" class="btn btn-secondary" id="online-back">← Games</button><h1 class="title">Rock Paper Scissors · Online</h1></div><div class="card"><button type="button" class="btn btn-secondary" id="rps-computer-mode">Play against computer instead</button><div style="display:flex;justify-content:space-around;gap:12px;flex-wrap:wrap"><div><span class="tiny">You</span><h2 class="title">'+esc(role===1?(names.get(me)||'Player 1'):role===2?(names.get(me)||'Player 2'):'Spectator')+'</h2><p class="tiny">Score: '+(role===1?g.score_one:role===2?g.score_two:'—')+'</p></div><div><span class="tiny">Opponent</span><h2 class="title">'+esc(opponent)+'</h2><p class="tiny">Score: '+(role===1?g.score_two:role===2?g.score_one:'—')+'</p></div></div><p>Round '+(g.round_no||1)+' · '+esc(status)+'</p>'+(g.last_result?'<p class="state-message">'+esc(g.last_result)+'</p>':'')+(canJoin?'<button type="button" class="btn" id="online-join-current">Join this game</button>':'')+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">'+[['rock','✊ Rock'],['paper','✋ Paper'],['scissors','✌️ Scissors']].map(x=>'<button type="button" class="btn" data-rps-online="'+x[0]+'" '+(g.status!=='playing'||!role||!!myMove?'disabled':'')+'>'+x[1]+'</button>').join('')+'</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-secondary" id="online-copy">Copy invite link</button><button type="button" class="btn btn-secondary" id="online-lobby">Back to lobby</button>'+(g.status==='playing'||g.status==='waiting'?'<button type="button" class="btn btn-secondary" id="online-leave">Leave game</button>':'')+'</div><p class="tiny">Both moves are evaluated on the server after both players submit for the round.</p></div>';
    $$('[data-rps-online]').forEach(b=>b.onclick=()=>playOnlineMove('rps',b.dataset.rpsOnline));
  }
  $('#online-back').onclick=async()=>{if(isConnect)S.cfGameId=null;else S.rpsGameId=null;await stopOnlineGameChannel();setView('games')};
  const computerMode=$('#rps-computer-mode');if(computerMode)computerMode.onclick=async()=>{S.rpsMode='computer';await leaveOnlineGame('rps');renderLocalGame()};
  const joinCurrent=$('#online-join-current');if(joinCurrent)joinCurrent.onclick=()=>joinOnlineGame(game,id);
  $('#online-lobby').onclick=async()=>{if(isConnect)S.cfGameId=null;else S.rpsGameId=null;await stopOnlineGameChannel();await viewOnlineGame(game)};
  $('#online-copy').onclick=()=>{const token=isConnect?'cf':'rps';const link=location.href.split('#')[0]+'#'+token+'='+id;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(link).then(()=>toast('Game invite link copied. Share it with a StudentLink user.')).catch(()=>toast('Copy failed. Game ID: '+id));else toast('Share this game ID with your opponent: '+id)};
  const leave=$('#online-leave');if(leave)leave.onclick=()=>leaveOnlineGame(game);
}

async function stopTttChannel(){if(S.tttChannel){const oldChannel=S.tttChannel;S.tttChannel=null;await db.removeChannel(oldChannel)}}
async function watchTttChannel(gameId=null){await stopTttChannel();if(!db||!S.session||S.view!=='game')return;const filter={event:'*',schema:'public',table:'ttt_games'};if(gameId)filter.filter='id=eq.'+gameId;const channel=db.channel(gameId?'ttt-game-'+gameId:'ttt-lobby');channel.on('postgres_changes',filter,()=>{if(S.view==='game'&&S.game==='ttt'&&S.tttGameId===gameId)viewGame()}).subscribe();S.tttChannel=channel}
async function startTttGame(){const {data,error}=await db.rpc('ttt_create_game');if(error){toast('Could not create an online game. Make sure the multiplayer SQL setup has been run.');console.error(error);return}S.tttGameId=data;await watchTttChannel(data);await viewGame()}
async function joinTttGame(id){const {error}=await db.rpc('ttt_join_game',{p_game_id:id});if(error){toast(error.message||'Could not join that game.');return}S.tttGameId=id;await watchTttChannel(id);await viewGame()}
async function makeTttMove(cell){if(!S.tttGameId)return;const {error}=await db.rpc('ttt_make_move',{p_game_id:S.tttGameId,p_cell:cell});if(error){toast(error.message||'Move could not be made.');return}await viewGame()}
async function viewGame(){
  const game=S.game;
  if(game==='quiz'||game==='guess'||game==='scramble'||(game==='rps'&&S.rpsMode==='computer')){renderLocalGame();return}
  if(game==='connect'||game==='rps'){viewOnlineGame(game);return}
  if(game!=='ttt'){$('#main').innerHTML='<div class="head"><button class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">'+(game==='quiz'?'Student Quiz':'Connect Four')+'</h1></div><div class="card">This game is not implemented yet. You can return to the games list.</div>';$('#games-back').onclick=()=>setView('games');return}
  if(!S.tttGameId){
    const {data:games,error}=await db.from('ttt_games').select('id,player_x,created_at').eq('status','waiting').is('player_o',null).order('created_at',{ascending:true}).limit(30);
    if(error){$('#main').innerHTML='<div class="head"><button class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">Online Tic-Tac-Toe</h1></div><div class="card"><b>Multiplayer setup required</b><p>Run <code>supabase_tictactoe_multiplayer.sql</code> in your Supabase SQL Editor, then reopen this game.</p><p class="tiny">'+esc(error.message)+'</p></div>';$('#games-back').onclick=()=>setView('games');return}
    const ids=[...new Set((games||[]).map(g=>g.player_x))];let profiles=[];
    if(ids.length){const p=await db.from('profiles').select('id,nickname,school').in('id',ids);profiles=p.data||[]}
    const names=new Map(profiles.map(p=>[p.id,p.nickname]));
    $('#main').innerHTML='<div class="head"><button class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">Online Tic-Tac-Toe</h1></div><div class="card"><p>Play with another StudentLink user anywhere. Create a game and wait for an opponent, or join an open game.</p><button class="btn" id="ttt-create">＋ Create online game</button></div><div class="head"><h2 class="title" style="font-size:18px">Open games</h2><button class="btn btn-secondary" id="ttt-refresh">Refresh</button></div>'+
    ((games||[]).length?(games||[]).map(g=>'<div class="card ttt-lobby-row"><div><b>'+esc(names.get(g.player_x)||'Student')+(g.player_x===S.session.user.id?' (You)':'')+'</b><div class="tiny">Waiting for an opponent · '+new Date(g.created_at).toLocaleString()+'</div></div><button class="btn" '+(g.player_x===S.session.user.id?'data-ttt-open="'+g.id+'"':'data-ttt-join="'+g.id+'"')+'>'+(g.player_x===S.session.user.id?'Resume game':'Join game')+'</button></div>').join(''):'<div class="card tiny">No open games right now. Create one and invite another student to open the Games section.</div>');
    $('#games-back').onclick=()=>setView('games');$('#ttt-create').onclick=startTttGame;$('#ttt-refresh').onclick=viewGame;$$('[data-ttt-join]').forEach(b=>b.onclick=()=>joinTttGame(b.dataset.tttJoin));$$('[data-ttt-open]').forEach(b=>b.onclick=async()=>{S.tttGameId=b.dataset.tttOpen;await watchTttChannel(S.tttGameId);await viewGame()});if(!S.tttChannel)await watchTttChannel(null);return
  }
  if(!S.tttChannel)await watchTttChannel(S.tttGameId);
  const {data:g,error}=await db.from('ttt_games').select('*').eq('id',S.tttGameId).maybeSingle();
  if(error||!g){$('#main').innerHTML='<div class="card">Could not load this online game. Return to the games list and try again.</div>';return}
  const playerIds=[g.player_x,g.player_o].filter(Boolean);let profiles=[];if(playerIds.length){const result=await db.from('profiles').select('id,nickname').in('id',playerIds);profiles=result.data||[]}
  const names=new Map(profiles.map(p=>[p.id,p.nickname]));const me=S.session.user.id;const mySymbol=g.player_x===me?'X':g.player_o===me?'O':null;const opponentId=g.player_x===me?g.player_o:g.player_x;const opponent=opponentId?(names.get(opponentId)||'Student'):'Waiting for opponent';const isMyTurn=g.status==='playing'&&g.current_turn===me;const canJoin=g.status==='waiting'&&g.player_x!==me&&!g.player_o;const board=Array.isArray(g.board)?g.board:Array(9).fill('');
  let status=canJoin?'This game is open. Join to play as O.':g.status==='waiting'?'Waiting for an opponent. Share the game link or wait for someone to join.':g.status==='cancelled'?'The creator cancelled this game.':g.status==='won'?(g.winner_id===me?'You won! 🎉':'You lost this round.'):g.status==='draw'?'It is a draw.':isMyTurn?'Your turn ('+mySymbol+').':'Waiting for '+opponent+' to move.';
  $('#main').innerHTML='<div class="head"><button class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">Online Tic-Tac-Toe</h1></div><div class="card"><div class="ttt-playerline"><div><span class="tiny">You play as</span><h2 class="title">'+(mySymbol||'Not joined')+'</h2></div><div class="ttt-vs">VS</div><div><span class="tiny">Opponent</span><h2 class="title">'+esc(opponent)+'</h2></div></div><p id="ttt-status">'+status+'</p>'+
    (canJoin?'<button id="ttt-accept-invite" class="btn">Join this game</button>':'')+
    '<div class="ttt-board">'+board.map((v,i)=>'<button type="button" class="btn btn-secondary ttt-cell" data-cell="'+i+'" '+(v||!isMyTurn?'disabled':'')+' aria-label="Cell '+(i+1)+' '+(v?'occupied by '+v:'empty')+'">'+(v?esc(v):'')+'</button>').join('')+'</div><div class="ttt-actions"><button id="ttt-copy-invite" class="btn btn-secondary">Copy game link</button><button id="ttt-new" class="btn" '+(g.status==='playing'||g.status==='waiting'?'disabled':'')+'>Back to online games</button>'+(g.status==='playing'||g.status==='waiting'?'<button id="ttt-cancel" class="btn btn-secondary">Leave game</button>':'')+'</div><p class="tiny">Game ID: '+esc(g.id)+'</p></div>';
  $('#games-back').onclick=()=>{S.tttGameId=null;stopTttChannel();setView('games')};$$('[data-cell]').forEach(b=>b.onclick=()=>makeTttMove(Number(b.dataset.cell)));
  $('#ttt-accept-invite')?.addEventListener('click',()=>joinTttGame(g.id));
  $('#ttt-copy-invite').onclick=()=>{const link=location.href.split('#')[0]+'#ttt='+g.id;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(link).then(()=>toast('Game link copied. Share it with a StudentLink user.')).catch(()=>toast('Copy failed. Game ID: '+g.id));else toast('Share this game ID with your opponent: '+g.id)};
  $('#ttt-new').onclick=()=>{S.tttGameId=null;stopTttChannel();viewGame()};const leaveButton=$('#ttt-cancel');if(leaveButton)leaveButton.onclick=async()=>{const {error:leaveError}=await db.rpc('ttt_leave_game',{p_game_id:S.tttGameId});if(leaveError){toast(leaveError.message||'Could not leave game.');return}S.tttGameId=null;await stopTttChannel();await viewGame()};
}
function profileDraftKey(){return 'studentlink-profile-draft-'+(S.session?.user?.id||'guest')}
function readProfileDraft(){try{return JSON.parse(localStorage.getItem(profileDraftKey())||'{}')}catch(_){return {}}}
async function viewPublicProfile(userId){
 if(!userId||userId===S.session.user.id){setView('profile');return}
 const {data:p,error}=await db.from('profiles').select('id,nickname,school,avatar_url').eq('id',userId).maybeSingle();
 if(error)throw error;
 if(!p){$('#main').innerHTML='<section class="card"><h2>Profile unavailable</h2><p class="tiny">This profile may be hidden or no longer available.</p><button class="btn btn-secondary" type="button" data-public-back>Back</button></section>';return}
 const html='<div class="head"><div class="tiny">STUDENTLINK MEMBER</div><h1 class="title">Student profile</h1><p class="tiny">Public information shared with signed-in students.</p></div><section class="profile-hero card"><div>'+profileAvatarMarkup(p.nickname,p.avatar_url,'avatar profile-public-avatar')+'</div><div class="profile-hero-copy"><h2>'+esc(p.nickname||'Student')+'</h2><div class="profile-school-line">🎓 '+esc(p.school||'School not provided')+'</div></div></section><div class="card" style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn btn-secondary" data-public-back>Back</button>'+S.friends.some(f=>f.id===p.id)?'<button type="button" class="btn" data-messagefriend="'+esc(p.id)+'">Message</button>':'<button type="button" class="btn" data-add="'+esc(p.id)+'">Add friend</button>'+'</div>';
 $('#main').innerHTML=html;
}
function viewProfile(){
 const p=S.profile||{},draft=readProfileDraft(),nickname=p.nickname||'',school=p.school||'',bio=draft.bio||'',year=draft.year||'',interests=draft.interests||'',photo=p.avatar_url||'';
 const percent=Math.round([nickname,school,bio,year,interests].filter(Boolean).length/5*100);
 $('#main').innerHTML='<div class="head"><div class="tiny">YOUR SPACE</div><h1 class="title">My profile</h1><p class="tiny">Manage your profile, profile picture and account visibility.</p></div>'+
 '<section class="profile-hero card"><div id="profile-hero-avatar">'+profileAvatarMarkup(nickname,photo)+'</div><div class="profile-hero-copy"><div class="tiny">STUDENTLINK MEMBER</div><h2>'+esc(nickname||'Your nickname')+'</h2><div class="profile-school-line">🎓 '+esc(school||'Add your school')+'</div><p>'+esc(bio||'Add a short bio so classmates can get to know you.')+'</p></div><div class="profile-completion"><strong id="profile-completion-value">'+percent+'%</strong><span class="tiny">profile details</span><div class="completion-track" role="progressbar" aria-label="Profile details completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'" id="profile-completion-track"><span style="width:'+percent+'%"></span></div></div></section>'+
 '<div class="profile-grid"><section class="card"><div class="section-heading"><div><h2>Edit profile</h2><p class="tiny">Your nickname, school and photo are shared with signed-in students.</p></div><span class="profile-step">01</span></div><form id="pf">'+
 '<div class="field"><label for="profile-photo">Profile photo</label><div class="photo-picker-row"><div id="profile-photo-current">'+profileAvatarMarkup(nickname,photo,'avatar photo-avatar')+'</div><div class="photo-picker-actions"><input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp"><p class="tiny">JPG, PNG or WebP; maximum 5 MB.</p><button type="button" id="remove-profile-photo" class="btn btn-secondary" '+(photo?'':'hidden')+'>Remove photo</button></div></div><p class="profile-note">Photos are uploaded to StudentLink storage and appear across your profile and posts.</p></div>'+
 '<div class="field"><label for="pn">Nickname *</label><input id="pn" maxlength="24" minlength="3" value="'+esc(nickname)+'" required></div><div class="field"><label for="ps">School *</label>'+schoolPickerHTML('ps',school)+'</div>'+
 '<div class="field"><label for="pyear">Class / year</label><select id="pyear"><option value="">Choose your level</option>'+['SHS 1','SHS 2','SHS 3','University — Year 1','University — Year 2','University — Year 3','University — Year 4','Other'].map(v=>'<option value="'+v+'" '+(year===v?'selected':'')+'>'+v+'</option>').join('')+'</select></div>'+
 '<div class="field"><label for="pbio">About me</label><textarea id="pbio" rows="4" maxlength="240">'+esc(bio)+'</textarea><div class="tiny">Up to 240 characters.</div></div><div class="field"><label for="pinterests">Interests</label><input id="pinterests" maxlength="160" value="'+esc(interests)+'" placeholder="e.g. coding, science, football"></div>'+
 '<button type="submit" class="btn" id="save-profile">Save profile</button></form></section><aside class="profile-side"><section class="card"><h2>Profile preview</h2><div class="preview-person"><span id="preview-avatar-wrap">'+profileAvatarMarkup(nickname,photo,'avatar')+'</span><div><b id="preview-name">'+esc(nickname||'Your nickname')+'</b><div class="tiny" id="preview-school">'+esc(school||'Your school')+'</div></div></div><p id="preview-bio" class="preview-bio">'+esc(bio||'Your bio will appear here.')+'</p><div class="interest-list" id="preview-interests">'+(interests?interests.split(',').map(x=>x.trim()).filter(Boolean).map(x=>'<span class="interest-chip">'+esc(x)+'</span>').join(''):'<span class="tiny">Add interests to show them here.</span>')+'</div></section><section class="card profile-tip"><h3>Keep your account safe</h3><p class="tiny">Use a nickname you are comfortable sharing. Do not post private contact details or passwords.</p></section></aside></div>'+
 '<section class="card profile-danger-zone"><div><h2>Delete or restore your profile</h2><p class="tiny">Delete hides your profile and posts from other students. You can restore your account later by signing in again. This is reversible deactivation, not permanent erasure.</p></div><button type="button" class="btn btn-danger" id="delete-profile">Delete profile</button></section>';
 const live=()=>{const n=$('#pn').value.trim()||'Your nickname',sc=$('#ps').value.trim()||'Your school';$('#preview-name').textContent=n;$('#preview-school').textContent=sc;$('#preview-bio').textContent=$('#pbio').value.trim()||'Your bio will appear here.';const vals=$('#pinterests').value.split(',').map(x=>x.trim()).filter(Boolean);$('#preview-interests').innerHTML=vals.map(x=>'<span class="interest-chip">'+esc(x)+'</span>').join('')||'<span class="tiny">Add interests to show them here.</span>';const pc=Math.round([$('#pn').value.trim(),sc==='Your school'?'':sc,$('#pbio').value.trim(),$('#pyear').value,$('#pinterests').value.trim()].filter(Boolean).length/5*100);$('#profile-completion-value').textContent=pc+'%';$('#profile-completion-track').setAttribute('aria-valuenow',String(pc));$('#profile-completion-track span').style.width=pc+'%'};
 wireSchoolPicker('ps');['pn','ps','pyear','pbio','pinterests'].forEach(id=>{const el=$('#'+id);if(el){el.addEventListener('input',live);el.addEventListener('change',live)}});
 $('#profile-photo')?.addEventListener('change',()=>{
  const input=$('#profile-photo'),file=input.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('Choose a JPG, PNG or WebP image.');input.value='';return}
  if(file.size>5*1024*1024){toast('That image is over 5 MB. Choose a smaller file.');input.value='';return}
  const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const scale=Math.min(1,640/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');if(!ctx){toast('Image editing is unavailable.');return}ctx.drawImage(image,0,0,canvas.width,canvas.height);canvas.toBlob(async blob=>{if(!blob){toast('Could not prepare the image.');return}const save=$('#save-profile');input.disabled=true;if(save)save.disabled=true;const oldUrl=S.profile?.avatar_url||'',path=S.session.user.id+'/avatar-'+Date.now()+'.jpg';try{const {error:uploadError}=await db.storage.from('profile-photos').upload(path,blob,{contentType:'image/jpeg',cacheControl:'3600',upsert:false});if(uploadError)throw uploadError;const {data:publicData}=db.storage.from('profile-photos').getPublicUrl(path);const {error:updateError}=await db.from('profiles').update({avatar_url:publicData.publicUrl}).eq('id',S.session.user.id);if(updateError){await db.storage.from('profile-photos').remove([path]);throw updateError}await loadProfile();await removeStoredProfilePhoto(oldUrl);toast('Profile photo saved.');viewProfile()}catch(err){console.error(err);toast('Could not save the photo. Please try again.')}finally{input.disabled=false;if(save)save.disabled=false}},'image/jpeg',0.84)};image.onerror=()=>toast('Could not read that image.');image.src=String(reader.result)};reader.onerror=()=>toast('Could not open that image.');reader.readAsDataURL(file);
 });
 $('#remove-profile-photo')?.addEventListener('click',async()=>{const oldUrl=S.profile?.avatar_url||'',button=$('#remove-profile-photo');button.disabled=true;const {error}=await db.from('profiles').update({avatar_url:null}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not remove the photo.');button.disabled=false;return}S.profile.avatar_url=null;await removeStoredProfilePhoto(oldUrl);toast('Profile photo removed.');viewProfile()});
 $('#pf').onsubmit=async e=>{e.preventDefault();const n=$('#pn').value.trim(),schoolName=canonicalVerifiedSchoolName($('#ps').value.trim());if(n.length<3||n.length>24){toast('Nickname must be 3–24 characters.');return}if(!schoolName){toast('Please choose your school.');$('#ps').focus();return}const save=$('#save-profile'),extra={bio:$('#pbio').value.trim(),year:$('#pyear').value,interests:$('#pinterests').value.trim()};save.disabled=true;save.textContent='Saving…';try{const {error}=await db.from('profiles').update({nickname:n,school:schoolName}).eq('id',S.session.user.id);if(error)throw error;localStorage.setItem(profileDraftKey(),JSON.stringify(extra));await loadProfile();toast('Profile saved.');viewProfile()}catch(err){console.error(err);toast('Could not save your profile. Check the nickname and try again.');save.disabled=false;save.textContent='Save profile'}};
 $('#delete-profile')?.addEventListener('click',async()=>{if(!window.confirm('Hide your profile and posts? You can restore them later by signing in again.'))return;const button=$('#delete-profile');button.disabled=true;button.textContent='Hiding profile…';const {error}=await db.from('profiles').update({deleted_at:new Date().toISOString()}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not hide your profile. Please try again.');button.disabled=false;button.textContent='Delete profile';return}await db.auth.signOut();S.session=null;renderAuth('login','Your profile is hidden. Log in again to restore it.');});
}
function profileAvatarMarkup(name,photo,className='profile-avatar'){return photo?'<span class="'+className+' has-photo"><img src="'+esc(photo)+'" alt="Profile photo" loading="lazy" /></span>':'<span class="'+className+'">'+initials(name||'Student')+'</span>'}
function profilePhotoStoragePath(url){try{const marker='/storage/v1/object/public/profile-photos/';const i=String(url||'').indexOf(marker);return i<0?'':decodeURIComponent(String(url).slice(i+marker.length))}catch(_){return ''}}
async function removeStoredProfilePhoto(url){const path=profilePhotoStoragePath(url);if(path&&path.startsWith(S.session.user.id+'/')){const {error}=await db.storage.from('profile-photos').remove([path]);if(error)console.warn('Old profile photo could not be removed:',error.message)}}
function renderDeletedProfile(){const root=$('#app');if(!root)return;root.innerHTML='<main class="restore-profile-wrap"><section class="card restore-profile-card"><div class="restore-profile-icon">↩</div><div class="tiny">STUDENTLINK ACCOUNT</div><h1 class="title">Your profile is currently hidden</h1><p>Your profile and posts are hidden from other students. Restore your profile to continue where you left off.</p><p class="tiny">This is a recoverable deactivation, not permanent erasure. Your data is retained so you can restore it.</p><button type="button" class="btn" id="restore-profile">Restore my profile</button><button type="button" class="btn btn-secondary" id="restore-logout">Log out</button></section></main>';$('#restore-profile').onclick=async()=>{const b=$('#restore-profile');b.disabled=true;b.textContent='Restoring…';const {error}=await db.from('profiles').update({deleted_at:null}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not restore your profile. Please try again.');b.disabled=false;b.textContent='Restore my profile';return}await boot();toast('Your profile has been restored.');};$('#restore-logout').onclick=async()=>{await db.auth.signOut();S.session=null;renderAuth('login')};}
async function viewSuggestions(){
  const userId=S.session?.user?.id;
  if(!userId){$('#main').innerHTML='<div class="card">Please sign in to submit feedback.</div>';return}
  const {data:reports,error}=await db.from('student_feedback').select('id,type,title,area,details,priority,status,created_at').eq('user_id',userId).order('created_at',{ascending:false}).limit(100);
  if(error)throw error;
  const list=reports||[];
  const counts={all:list.length,bug:list.filter(r=>r.type==='bug').length,feature:list.filter(r=>r.type==='feature').length,feedback:list.filter(r=>r.type==='feedback').length};
  $('#main').innerHTML=`<div class="head"><div class="tiny">HELP US BUILD STUDENTLINK</div><h1 class="title">Suggestions & bug reports</h1><span class="tiny">Found something broken or have an idea? Tell us what happened and help shape the next version.</span></div>
  <div class="feedback-banner"><div class="feedback-banner-icon">✦</div><div><strong>Early tester feedback matters.</strong><p class="tiny">Be specific and kind. Please don’t include passwords, private messages, or sensitive personal information.</p></div></div>
  <div class="feedback-layout"><section class="card feedback-form-card"><div class="section-heading"><div><h2>Send feedback</h2><p class="tiny">Your report will be sent to the StudentLink database.</p></div><span class="profile-step">01</span></div>
  <form id="suggestion-form">
  <div class="field"><label for="feedback-type">What would you like to report? *</label><select id="feedback-type" required><option value="bug">🐛 Report a bug</option><option value="feature">💡 Suggest a feature</option><option value="feedback">💬 General feedback</option></select></div>
  <div class="field"><label for="feedback-title">Short title *</label><input id="feedback-title" maxlength="100" required placeholder="e.g. Profile save button does nothing"></div>
  <div class="field"><label for="feedback-area">Where did it happen?</label><select id="feedback-area"><option>Not sure</option><option>Sign in / sign up</option><option>Feed and posts</option><option>Profile</option><option>Friends</option><option>Messages</option><option>Schools and search</option><option>Games</option><option>Mobile layout</option><option>Other</option></select></div>
  <div class="field"><label for="feedback-details">Describe it *</label><textarea id="feedback-details" rows="5" maxlength="2000" required placeholder="What happened? What did you expect to happen?"></textarea><div class="tiny">For bugs, include the steps to reproduce the problem if you can.</div></div>
  <div class="field"><label for="feedback-priority">How serious is it?</label><select id="feedback-priority"><option value="normal">Normal — feature idea or minor issue</option><option value="low">Low — small inconvenience</option><option value="high">High — blocks an important task</option></select></div>
  <button type="submit" class="btn">Submit feedback</button></form></section>
  <aside class="feedback-side"><section class="card"><div class="section-heading"><div><h2>Your feedback</h2><p class="tiny">Saved reports follow their review status.</p></div></div><div class="feedback-stats"><div><strong>${counts.all}</strong><span class="tiny">All</span></div><div><strong>${counts.bug}</strong><span class="tiny">Bugs</span></div><div><strong>${counts.feature}</strong><span class="tiny">Ideas</span></div></div><div class="feedback-list" id="feedback-list">${list.length?list.map(r=>'<article class="feedback-item"><div class="feedback-item-top"><span class="feedback-type-pill '+esc(r.type)+'">'+(r.type==='bug'?'Bug report':r.type==='feature'?'Feature idea':'General feedback')+'</span><span class="tiny">'+esc(new Date(r.created_at).toLocaleDateString())+'</span></div><strong>'+esc(r.title)+'</strong><p class="tiny">'+esc(r.area||'Not specified')+' · '+esc(r.priority||'normal')+'</p><p>'+esc(r.details)+'</p><span class="feedback-status">'+esc(r.status||'open')+'</span></article>').join(''):'<div class="feedback-empty"><span>📝</span><b>No feedback submitted yet</b><p class="tiny">Your reports will appear here after you submit them.</p></div>'}</div></section>
  <section class="card feedback-tip"><h3>What makes a useful bug report?</h3><ul><li>What you clicked or tried</li><li>What you expected to happen</li><li>What actually happened</li><li>Your device or browser, if relevant</li></ul></section></aside></div>`;
  $('#suggestion-form').onsubmit=async e=>{
    e.preventDefault();
    const type=$('#feedback-type').value,title=$('#feedback-title').value.trim(),details=$('#feedback-details').value.trim();
    if(!title||!details){toast('Please add a title and description.');return}
    const submit=$('#suggestion-form button[type="submit"]');if(submit){submit.disabled=true;submit.textContent='Submitting…'}
    const {error:saveError}=await db.from('student_feedback').insert({user_id:userId,type,title,area:$('#feedback-area').value,details,priority:$('#feedback-priority').value});
    if(saveError){console.error(saveError);toast('Feedback could not be submitted. Please try again.');if(submit){submit.disabled=false;submit.textContent='Submit feedback'}return}
    toast('Feedback sent to StudentLink. Thank you.');
    await viewSuggestions();
  };
}async function viewSchools(){let {data,error}=await db.from('profiles').select('school').not('school','is',null).neq('school','').order('school').limit(1000);if(error)throw error;let c={};(data||[]).forEach(p=>{const name=canonicalSchoolName((p.school||'').trim());const key=schoolKey(name);if(key){if(!c[key])c[key]={name,count:0};c[key].count++}});let top=Object.values(c).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name)).slice(0,5);const cards=top.map(({name,count})=>'<button type="button" class="card trending-school" data-school="'+esc(name)+'"><b>'+esc(name)+'</b><span class="tiny">'+count+' students</span></button>').join('')||'<p class="tiny">Schools will appear as students join.</p>';const desktop=$('#trending'),mobile=$('#trending-mobile');if(desktop)desktop.innerHTML=cards;if(mobile)mobile.innerHTML=cards;}async function viewSchoolStudents(school){const chosen=canonicalSchoolName(school||'');if(!chosen){S.view='feed';await renderView();return}$('#main').innerHTML='<div class="card">Loading students from '+esc(chosen)+'…</div>';const {data,error}=await db.from('profiles').select('id,nickname,school').ilike('school',chosen).order('nickname').limit(1000);if(error)throw error;const people=(data||[]).filter(p=>schoolKey(canonicalSchoolName(p.school||''))===schoolKey(chosen));let html='<div class="head"><button type="button" class="btn btn-secondary" id="back-to-feed">← Back</button><h1 class="title" style="margin-top:12px">'+esc(chosen)+'</h1><span class="tiny">'+people.length+' student'+(people.length===1?'':'s')+'</span></div>';if(!people.length)html+='<div class="card">No other students from this school have joined yet.</div>';else html+=people.map(p=>'<div class="card school-student"><div class="school-student-info"><span class="avatar">'+initials(p.nickname)+'</span><div><b>'+esc(p.nickname)+(p.id===S.session.user.id?' (You)':'')+'</b><div class="tiny">'+esc(p.school||chosen)+'</div></div></div>'+(p.id===S.session.user.id?'<span class="tiny">Your profile</span>':'<button type="button" class="btn" data-add="'+p.id+'">Add friend</button>')+'</div>').join('');$('#main').innerHTML=html;$('#back-to-feed').onclick=()=>setView('feed');wireActions();}async function addFriend(id){if(id===S.session.user.id)return;const {error}=await db.from('friendships').insert({user_id:S.session.user.id,friend_id:id,status:'pending'});if(error){toast(error.code==='23505'?'A request already exists.':error.message);return}toast('Friend request sent.');renderView()}
async function acceptFriend(id){const {error}=await db.from('friendships').update({status:'accepted'}).eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}toast('Friend request accepted.');renderView()}
async function declineFriend(id){const {error}=await db.from('friendships').delete().eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}renderView()}
function syncNavigationState(){ document.querySelectorAll('[data-view]').forEach(link=>{const selected=link.dataset.view===S.view||(S.view==='game'&&link.dataset.view==='games');link.classList.toggle('active',selected);link.setAttribute('aria-current',selected?'page':'false');link.setAttribute('aria-pressed',String(selected));}); }
function setView(v){if(v!=='game'&&S.view==='game'){stopTttChannel();S.tttGameId=null}S.view=v;if(v!=='school')S.schoolFilter='';syncNavigationState();renderView()}
function modal(title,content){$('#modaltitle').textContent=title;$('#modalcontent').innerHTML=content;$('#modalbg').classList.add('show')}
function closeModal(){$('#modalbg').classList.remove('show')}
document.addEventListener('click',e=>{if(e.target.closest('#modalclose')){e.preventDefault();closeModal()}});
function toast(msg){
  let el=document.getElementById('studentlink-toast');
  if(!el){el=document.createElement('div');el.id='studentlink-toast';el.setAttribute('role','status');el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2000;max-width:calc(100% - 32px);padding:12px 16px;border:1px solid var(--line);border-radius:8px;background:var(--p2);color:var(--txt);box-shadow:0 8px 24px rgba(0,0,0,.25)';document.body.appendChild(el)}
  el.textContent=String(msg);el.style.display='block';clearTimeout(el._hideTimer);el._hideTimer=setTimeout(()=>{el.style.display='none'},3500);
}
function wireActions(){$$('[data-messagefriend]').forEach(b=>b.onclick=()=>startConversation(b.dataset.messagefriend).catch(error=>{console.error(error);toast('Could not open this conversation. Please try again.')}));$$('[data-add]').forEach(b=>b.onclick=()=>addFriend(b.dataset.add).catch(error=>{console.error(error);toast('Could not send the friend request. Please try again.')}));$$('[data-accept]').forEach(b=>b.onclick=()=>acceptFriend(b.dataset.accept).catch(error=>{console.error(error);toast('Could not accept the friend request. Please try again.')}));$$('[data-decline]').forEach(b=>b.onclick=()=>declineFriend(b.dataset.decline).catch(error=>{console.error(error);toast('Could not decline the friend request. Please try again.')}))}
document.addEventListener('click',e=>{const publicProfile=e.target.closest('[data-public-profile]');if(publicProfile){e.preventDefault();viewPublicProfile(publicProfile.dataset.publicProfile).catch(error=>{console.error(error);toast('Could not load this profile. Please try again.')});return}if(e.target.closest('[data-public-back]')){setView('friends');return}const sr=$('#search-results');if(sr&&!e.target.closest('.search-wrap'))sr.hidden=true;const school=e.target.closest('[data-school]');if(school){e.preventDefault();S.schoolFilter=school.dataset.school;S.view='school';syncNavigationState();if(sr)sr.hidden=true;renderView();return}let v=e.target.closest('[data-view]');if(v){e.preventDefault();setView(v.dataset.view);return}let add=e.target.closest('[data-search-add]');if(add){addFriend(add.dataset.searchAdd).catch(error=>{console.error(error);toast('Could not send the friend request. Please try again.')});if(sr)sr.hidden=true}});
async function startStudentLink(){
  const app=document.getElementById('app');
  try{
    if(!configured){
      renderAuth('signup','Setup needed: create Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.');
      return;
    }
    await boot();
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
startStudentLink();
