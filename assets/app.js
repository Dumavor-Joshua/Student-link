// Configure these two values from your own Supabase project. Never use a service-role key here.
const SUPABASE_URL='https://fpdcetkvxdryogtvldax.supabase.co';const SUPABASE_ANON_KEY='sb_publishable_HMzJqdTbufV4vvJ6QyWl5A_-0PPa0Rs';
const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_URL.includes('YOUR_')&&!SUPABASE_ANON_KEY.includes('YOUR_');const db=configured&&window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function safeSessionGet(key){try{return window.sessionStorage.getItem(key)}catch(_){return null}}function safeSessionSet(key,value){try{window.sessionStorage.setItem(key,value);return true}catch(_){return false}}function safeSessionRemove(key){try{window.sessionStorage.removeItem(key)}catch(_){}}const S={session:null,profile:null,schools:[],view:'feed',publicProfileId:null,schoolFilter:'',feedMode:'all',feedOrderIds:[],feedOrderMode:'',friends:[],requests:[],convos:[],chat:null,replyOnOpen:false,channel:null,tttChannel:null,tttGameId:null,onlineGameChannel:null,cfGameId:null,rpsGameId:null,rpsMode:'computer',game:'',ttt:Array(9).fill(0),notifiedMessageIds:new Set(),notifiedFriendshipIds:new Set(),messageReadAt:{},};
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function initials(s='S'){return esc(s.trim().split(/\s+/).slice(0,2).map(x=>x[0].toUpperCase()).join(''))}
function makeRandomId(){if(window.crypto&&typeof window.crypto.randomUUID==='function')return window.crypto.randomUUID();const bytes=new Uint8Array(16);if(window.crypto&&typeof window.crypto.getRandomValues==='function')window.crypto.getRandomValues(bytes);else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const h=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)}
function schoolKey(s=''){
  return String(s??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en')
    .replace(/&/g,' and ')
    .replace(/\b(senior\s+high\s*\/\s*technical|senior\s+high\s*\/\s*tech|senior\s+high\s+technical|shts|shst|shst\.?|senior high tech)\b/g,' shts ')
    .replace(/\b(technical\s+institute|tech\.?\s+inst\.?|tech\.?\s+institute)\b/g,' techinst ')
    .replace(/\b(snr\.?\s*high|senior\s+high(?:\s+school)?|s\.?h\.?s\.?)\b/g,' shs ')\n    .replace(/\b(shs|shts)\s+school\b/g,' $1 ')
    .replace(/\b(comm\.?|community)\b/g,' community ')
    .replace(/\b(presby)\b/g,' presbyterian ')
    .replace(/\b(cath\.?|catholic)\b/g,' catholic ')
    .replace(/\b(sda|s\.?d\.?a\.?)\b/g,' sda ')
    .replace(/\b(st|saint)\.?\s+/g,' saint ')
    .replace(/\bhigh\s+school\b/g,' high ')
    .replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
const VERIFIED_GHANA_SHS_TVET = [
  "Mim Senior High School","Ahafoman Senior High/Tech School","Kukuom Agric Senior High School","Sankore Senior High School","Acherensua Senior High School","Hwidiem Senior High School","Serwaa Kesse Girls Senior High School","Bechem Presby Senior High School",
  "Prempeh College","Yaa Asantewaa Girls Senior High School","Kumasi Girls Senior High School","Opoku Ware School","St. Louis Senior High School, Kumasi","KNUST Senior High School","T. I. Ahmadiyya Senior High School, Kumasi","Kumasi High School","Kumasi Academy","Konongo Odumase Senior High School","Agogo State College","Juaben Senior High School","Obuasi Senior High/Tech School",
  "St. James Seminary and Senior High School","Sunyani Senior High School","Sacred Heart Senior High School, Nsoatre","Notre Dame Girls Senior High School, Sunyani","Wenchi Methodist Senior High School","Kintampo Senior High School","Atebubu Senior High School","Nkoranza Senior High/Tech School","Osei Bonsu Senior High School",
  "Holy Child School, Cape Coast","Adisadel College","Mfantsipim School","St. Augustine's College, Cape Coast","Winneba Senior High School","Potsin T.I. Ahmadiyya Senior High School","Apam Senior High School","Edinaman Senior High School",
  "Ofori Panin Senior High School","Abuakwa State College","Kibi Senior High/Tech School","Presby Senior High School, Begoro","Kade Senior High/Tech School","Abetifi Presby Senior High School","St. Peter's Senior High School, Nkwatia","Ghana Senior High School, Koforidua","Pope John Senior High and Minor Seminary","Oyoko Methodist Senior High School",
  "Accra Girls Senior High School","St. John's Grammar Senior High School","Accra Senior High School","Labone Senior High School","Achimota Senior High School","West Africa Senior High School","St. Thomas Aquinas Senior High School","O'Reilly Senior High School","Nungua Senior High School","Tema Methodist Day Senior High School","Presby Senior High School, Tema","Amasaman Senior High/Tech School","Odorgonno Senior High School","Ghanata Senior High School",
  "Tamale Senior High School","Tamale Girls Senior High School","Ghana Senior High School, Tamale","Northern School of Business","Presby Senior High School, Tamale","Dagbon State Senior High/Tech School","Nalerigu Senior High School","Wulugu Senior High School","Nakpanduri Senior High School",
  "Notre Dame Seminary/Senior High School, Navrongo","Navrongo Senior High School","Sandema Senior High School","Bongo Senior High School","Zorkor Senior High School","Tongo Senior High/Tech School","Wa Senior High School","T.I. Ahmadiyya Senior High School, Wa","Nandom Senior High School","Tumu Senior High/Tech School",
  "Buipe Senior High School","Salaga Senior High School","Sawla Senior High School","Tuna Senior High/Tech School","Mawuli School, Ho","OLA Girls Senior High School, Ho","Keta Senior High/Tech School","Anlo Senior High School","Bishop Herman College","Kpando Senior High School",
  "St. John's Senior High School, Sekondi","Fijai Senior High School","Takoradi Senior High School","Ghana Senior High/Tech School, Takoradi","Tarkwa Senior High School","Amenfiman Senior High School","Sefwi-Wiawso Senior High School","Bibiani Senior High/Tech School"
,
  ...["Cambridge Senior High Technical School","City Business Senior High","Cosmos Senior High School, Ejura","Daceland Senior High School","Domaa College","Elite College, Kumasi","Fame Senior High School, Shama","Ideal College, East Legon","Jireh Senior High School, Teshie","Joy Standard College, Kumasi","Ken Hammer Senior High Technical School, Goaso","King David Community College, Kpong","Mount Hebron College, Dunkwa-On-Offin","Otou Memorial Senior High School","Samme Senior High School, Mankessim","Samtet Oxford Senior High School, Atachem","St. Luke Senior High School, Mankessim","St. Richard's Senior High School, Assin Foso","Wallahs Academy Senior High School, Ho","Abakrampa Senior High/Technical","Abeadze State College","Abeaseman Community Day Senior High","Abetifi Presby Senior High","Abor Senior High","Abuakwa State College","Aburaman Senior High","Aburi Girls Senior High","Abutia Senior High/Technical","Academy of Christ the King","Accra Academy","Accra Grammar School","Accra High School","Accra Wesley Girls Senior High","Wesley Girls' Senior High School, Cape Coast","Achinakrom Senior High","Achiase Senior High School","Adaklu Senior High School","Adanwomase Senior High","Adisadel College","Adonten Senior High","Adrobaa Senior High/Technical","Afadjato Senior High/Technical","Afia Kobi Ampem Girls Senior High","Agona Senior High/Technical","Agomeda Senior High/Technical","Ahantaman Girls Senior High","Akim Asafo Senior High","Akim Swedru Senior High","Akontombra Senior High","Akuapem Senior High School","Akwamuman Senior High School","Alavanyo Senior High/Technical","Amankwakrom Fisheries Agricultural Technical Institute","Amanten Senior High","Ameyaw Akumfi Senior High/Technical","Anfoega Senior High","Anfoeta Senior High/Technical","Anlo Afiadenyigba Senior High","Anum Presbyterian Senior High","Asamankese Senior High","Asanteman Senior High","Asawinso Senior High","Asuom Senior High School","Asuogyaman Senior High School","Atebubu Senior High","Atiavi Senior High/Technical","Attafuah Senior High/Technical","Awudome Senior High","Awutu Bawjiase Community Senior High","Awutu Winton Senior High","Axim Girls Senior High","Barekese Senior High School","Banka Community Senior High","Bawku Senior High","Bawku Senior High/Technical","Beposo Senior High","Berekum Senior High","Berekum Presby Senior High","Bisease Senior High School","Bimbilla Senior High School","Bishop Aglionby Senior High","Bodi Senior High","Boa Amponsem Senior High","Bolgatanga Girls Senior High","Bolgatanga Senior High","Bomaa Community Senior High","Bosome Senior High/Technical","Bosomtwe Girls STEM Senior High","Bosomtwe STEM Academy","Breman Asikuma Senior High","Bueman Senior High","Buipe Senior High","Chemu Senior High/Technical","Chiana Senior High","Chiraa Senior High","Christian Methodist Senior High","Dabokpa Senior High","Dadease Agricultural Senior High","Dadieso Senior High","Daffiamah Senior High","Dagbon State Senior High/Technical","Dambai Senior High/Technical","Dansoman Senior High","Diaso Senior High","Dofor Senior High","Dompoase Senior High","Donkorkrom Agricultural Senior High","Dormaa Senior High","Drobo Senior High","Drobonso Senior High","Dwamena Akenten Senior High","Dzodze-Penyi Senior High","E.P. Senior High, Amedzofe","E.P. Agric Senior High/Technical","E.P.C. Mawuko Girls Senior High","Ebenezer Senior High School","Effiduase Senior High","Ejuraman Anglican Senior High","Enyan Denkyira Senior High","Fanteakwa Senior High","Gambaga Girls Senior High","Ghana Muslim Mission Senior High","Ghana Senior High School, Koforidua","Ghana Senior High School, Tamale","Ghana Senior High/Technical School, Takoradi","Gushegu Senior High","Half Assini Senior High","Have Senior High/Technical","Holy Trinity Senior High School","Huni Valley Senior High","Islamic Senior High, Kumasi","Islamic Girls Senior High, Suhum","Jachie-Pramso Senior High","Jema Senior High","Jirapa Senior High","Kaleo Senior High/Technical","Kalpohin Senior High","Kanton Senior High","Keta Senior High/Technical","Klikor Senior High/Technical","Koforidua Senior High/Technical","Krobo Community Senior High","Kumasi Anglican Senior High","Kumasi Senior High/Technical","Kumasi Wesley Girls High School","Kumbungu Senior High","Kwabre Senior High","Kwahu Tafo Senior High","Kwanyako Senior High","Lashibi Community Day Senior High","La Presby Senior High","Lambussie Community Senior High","Lawra Senior High","Mabang Senior High/Technical","Mankessim Senior High/Technical","Mankranso Senior High","Mansen Senior High","Manso-Adubia Senior High","Mansoman Senior High","Mepe St. Kizito Senior High/Technical","Methodist Senior High, Sekondi","Methodist Senior High School, Saltpond","Mfantsiman Girls Senior High","Mint Senior High School, Yeji","Modern Senior High School, Kpong","Moree Community Senior High","Morso Senior High/Technical","Mozano Senior High","Mpohor Senior High","Nalerigu Senior High School","Nana Brentu Senior High/Technical","Nankpanduri Senior High/Technical","Ndewura Jakpa Senior High/Technical","New Abirem Senior High","New Juaben Senior High/Commercial","Nifa Senior High","Nkawkaw Senior High","Nkroful Agricultural Senior High/Technical","Nkoranman Senior High","Nkyeraa Senior High School","Nungua Senior High School","Nuru-Ameen Islamic Senior High, Asewase","Nsutaman Catholic Senior High","Nyakrom Senior High/Technical","Nyankumasi Ahenkro Senior High","Nyinahin Catholic Senior High","Obrachire Senior High/Technical","Odomaseman Senior High","Oguaa Senior High/Technical","Ogyeedom Community Senior High/Technical","Okomfo Anokye Senior High","Osudoku Senior High/Technical","Osei Kyeretwie Senior High","Osei Tutu Senior High, Akropong","Our Lady of Fatima Senior High","Our Lady of Mercy Senior High","Our Lady of Mount Carmel Girls Senior High","Our Lady of Providence Senior High","Owerriman Senior High/Technical","Pank Senior High School","Peki Senior High/Technical","Presby Senior High, Bompata","Presby Senior High, Osu","Presby Senior High, Tema","Presby Senior High/Technical, Adukrom","Prang Senior High","Prestea Senior High/Technical","Preset Pacesetters Senior High School","Ramseyer Senior High School","Reputable Senior High School, Wiaga","Rugari College, Bongo","Sakafia Islamic Senior High","Savelugu Senior High","Sawla Senior High School","Sekondi College","Serwaah Nyarko Girls Senior High","Sefwi Bekwai Senior High","Somanya Senior High/Technical","St. Gregory Catholic Senior High School","St. Hubert Seminary/Senior High, Kumasi","St. Jerome Senior High, Abofour","St. John's Integrated Senior High/Technical","St. Joseph Senior High, Sefwi Wiawso","St. Michael's Senior High, Ahenkro","St. Monica's Senior High, Mampong","St. Mary's Senior High, Konongo","St. Rose's Senior High, Akwatia","St. Stephen's Presbyterian Senior High","St. Francis Xavier Senior High School","St. Margaret-Mary Senior High","St. Martins Senior High School","St. Paul's Senior High, Denu","St. Vincent College","Sogakope Senior High","Suhum Senior High","Swedru Senior High","Tamale Business Senior High","Tanyigbe Senior High","Tapaman Senior High/Technical","Taviefe Senior High","Techiman Senior High","Tema Senior High","Terchire Senior High","Teshie Presby Secondary","Toase Senior High","Tongo Senior High/Technical","Tsiame Senior High","Tuna Senior High/Technical","Twifo Hemang Senior High/Technical","Twifo Praso Senior High","Uthman Bin Affan Islamic Senior High","Vakpo Senior High","Vitting Senior High/Technical","Wa Senior High School","Wapuli Community Senior High","Wesley High School, Bekwai","Wenchi Methodist Senior High","Weta Senior High/Technical","Wulensi Senior High","Yamfo Anglican Senior High School","Zabzugu Senior High","Zamse Senior High/Technical","Zorkor Senior High School","Zuarungu Senior High"]
,
  "Presbyterian Boys' Senior High School, Legon",
  "Aggrey Memorial A.M.E. Zion Senior High School",
  "Ghana National College, Cape Coast",
  "St. Monica's Senior High School, Mampong",
  "St. Mary's Senior High School, Konongo",
  "Anfoega Senior High School",
  "Vakpo Senior High/Tech School",
  "Vakpo Senior High School",
  "Dabala Senior High/Tech School",
  "Klikor Senior High/Tech School",
  "Kpando Technical Institute",
  "Mepe St. Kizito Senior High/Tech School",
  "Battor Senior High School",
  "Volo Community Senior High School",
  "Kpeve Senior High School",
  "Tongor Senior High Technical School",
  "Peki Senior High School",
  "Peki Senior High/Technical School",
  "St. Catherine Girls Senior High School, Agbakope",
  "Sogakope Senior High School",
  "Asankrangwa Senior High/Tech School",
  "St. Mary's Boys Senior High School, Apowa",
  "Sankor Community Day Senior High School",
  "Bonzo-Kaku Senior High School",
  "Uthman Bin Afam Senior High School",
  "Nkruful Agricultural Senior High School",
  "Esiama Senior High/Tech School",
  "Half Assini Senior High School",
  "Annor Adjaye Senior High School",
  "Mpohor Senior High School",
  "Wassa East Daboase Senior High/Tech School",
  "Gwiraman Community Senior High School",
  "Nsein Senior High School",
  "Axim Girls Senior High School",
  "St. Augustine's Senior High School, Bogoso",
  "Huni Valley Senior High School",
  "Prestea Senior High/Tech School",
  "Diabene Senior High/Tech School",
  "Archbishop Porter Girls Senior High School",
  "Adiembra Senior High School",
  "Methodist Senior High School, Sekondi",
  "Bompeh Senior High/Tech School",
  "Fiase-man Senior High School",
  "Benso Senior High/Tech School",
  "Nana Brentu Senior High/Tech School",
  "Bia Senior High/Tech School",
  "Adjoafua Community Senior High School",
  "Queens Girls Senior High School, Sefwi Awhiaso",
  "Chirano Community Day Senior High School",
  "Sefwi Bekwai Senior High School",
  "Bodi Senior High School",
  "Juaboso Senior High School",
  "Nsawora Edumafah Community Senior High School",
  "Akontombra Senior High School",
  "Asawinso Senior High School",
  "Sefwi-Wiawso Senior High/Tech School",
  "St. Joseph Senior High School, Sefwi Wiawso",
  "Dadieso Senior High School",
  "Manso-Amenfi Community Day Senior High School"];
// Sort and deduplicate the compiled Ghana school directory alphabetically.
const uniqueSchoolNames=Array.from(new Map(VERIFIED_GHANA_SHS_TVET.map(name=>[schoolKey(name),name])).values()).sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'}));
VERIFIED_GHANA_SHS_TVET.splice(0,VERIFIED_GHANA_SHS_TVET.length,...uniqueSchoolNames);
// Known informal names and spelling variants all point to one canonical school.
// Keep location/campus words in the key so genuinely different schools are not merged.
const SCHOOL_ALIASES={
  'presec':"Presbyterian Boys' Senior High School, Legon",
  'presec legon':"Presbyterian Boys' Senior High School, Legon",
  'presby boys':"Presbyterian Boys' Senior High School, Legon",
  'presbyterian boys shs':"Presbyterian Boys' Senior High School, Legon",
  'legon presec':"Presbyterian Boys' Senior High School, Legon",
  'achimota':'Achimota Senior High School',
  'adisco':'Adisadel College',
  'adisco cape coast':'Adisadel College',
  'mfantsipim':'Mfantsipim School',
  'motown':'Mfantsipim School',
  'prempeh':'Prempeh College',
  'opoku ware':'Opoku Ware School',
  'ows':'Opoku Ware School',
  'yagshs':'Yaa Asantewaa Girls Senior High School',
  'yagss':'Yaa Asantewaa Girls Senior High School',
  'st louis kumasi':'St. Louis Senior High School, Kumasi',
  'st louis shs kumasi':'St. Louis Senior High School, Kumasi',
  'knust shs':'KNUST Senior High School',
  'ti ahmadiyya kumasi':'T. I. Ahmadiyya Senior High School, Kumasi',
  't i ahmadiyya shs kumasi':'T. I. Ahmadiyya Senior High School, Kumasi',
  'wesco':"Wesley Girls' Senior High School, Cape Coast",
  'holy child':'Holy Child School, Cape Coast',
  'holico':'Holy Child School, Cape Coast',
  'moh':'Mawuli School, Ho',
  'mawuli':'Mawuli School, Ho',
  'achimota shs':'Achimota Senior High School',
  'ghana national':'Ghana National College, Cape Coast',
  'ghana national college cape coast':'Ghana National College, Cape Coast',
  'aggiss':'Aggrey Memorial A.M.E. Zion Senior High School',
  'aggrey memorial':'Aggrey Memorial A.M.E. Zion Senior High School',
  'wesley grammar':'Wesley Grammar School',
  'presby legon':"Presbyterian Boys' Senior High School, Legon",
  'presec boys':"Presbyterian Boys' Senior High School, Legon",
  'opoku ware school kumasi':'Opoku Ware School',
  'kumasihigh':'Kumasi High School',
  'kumasi high shs':'Kumasi High School',
  'st thomas aquinas':'St. Thomas Aquinas Senior High School',
  'st thomas aquinas shs':'St. Thomas Aquinas Senior High School',
  'tema secondary':'Tema Senior High School',
  'tamale secondary':'Tamale Senior High School',
  'ashanti school':'Ashanti Senior High School',
  'ashantigold':'Obuasi Senior High/Tech School',
  'prempeh college kumasi':'Prempeh College'
};
const SCHOOL_ALIAS_KEYS=new Map(Object.entries(SCHOOL_ALIASES).map(([alias,canonical])=>[schoolKey(alias),canonical]));
function editDistance(a,b){
  if(a===b)return 0;if(!a)return b.length;if(!b)return a.length;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){const row=[i];for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=row}
  return prev[b.length];
}
function schoolSimilarity(a,b){
  const x=schoolKey(a),y=schoolKey(b);if(!x||!y)return 0;if(x===y)return 1;
  const distance=editDistance(x,y),edit=1-distance/Math.max(x.length,y.length);
  const xt=new Set(x.split(' ')),yt=new Set(y.split(' '));const overlap=[...xt].filter(t=>yt.has(t)).length/Math.max(xt.size,yt.size);
  // Stronger token overlap prevents unrelated schools sharing a common word being merged.
  return Math.max(edit,overlap*.96);
}
function verifiedSchoolMatch(name=''){
  const key=schoolKey(name);if(!key)return '';
  const exact=VERIFIED_GHANA_SHS_TVET.find(x=>schoolKey(x)===key);if(exact)return exact;
  const alias=SCHOOL_ALIAS_KEYS.get(key);if(alias){
    const target=VERIFIED_GHANA_SHS_TVET.find(x=>schoolKey(x)===schoolKey(alias));
    if(target)return target;
  }
  // Auto-correct only very clear, unique near-matches; ambiguous school names stay separate.
  if(key.length<6)return '';
  const ranked=VERIFIED_GHANA_SHS_TVET.map(name=>({name,score:schoolSimilarity(key,name)}).sort?null:null);
  const scores=VERIFIED_GHANA_SHS_TVET.map(candidate=>({name:candidate,score:schoolSimilarity(key,candidate)})).sort((a,b)=>b.score-a.score);
  if(!scores.length||scores[0].score<0.91)return '';
  if(scores[1]&&scores[0].score-scores[1].score<0.045)return '';
  return scores[0].name;
}
function canonicalVerifiedSchoolName(name=''){
  const original=String(name??'').trim().replace(/\s+/g,' ');
  if(!original)return '';
  return verifiedSchoolMatch(original)||original;
}
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

function canonicalSchoolName(s=''){return canonicalVerifiedSchoolName(s)}
function authHTML(tab='signup',message=''){return `<div class="auth"><div class="auth-layout"><section class="auth-intro"><div class="brand"><span class="brandicon" aria-hidden="true">🔗</span><span>StudentLink</span></div><h1>Connect with classmates and your school community.</h1><p>One place to share updates, meet classmates, find school communities, and learn together.</p><div class="auth-intro-note"><span aria-hidden="true">✓</span> Made for students. Built for connection.</div></section><section class="auth-panel"><div class="hero"><div class="auth-card-heading"><h2>${tab==='signup'?'Create an account':'Welcome back'}</h2><p>${tab==='signup'?'It’s quick and easy.':'Log in to continue to StudentLink.'}</p></div><div class="tab-buttons" role="group" aria-label="Account access"><button type="button" data-tab="signup" class="${tab==='signup'?'active':''}" aria-pressed="${tab==='signup'}">Sign up</button><button type="button" data-tab="login" class="${tab==='login'?'active':''}" aria-pressed="${tab==='login'}">Log in</button></div><form id="authform" novalidate>${tab==='signup'? `<div class="field"><label for="nick">Nickname</label><input id="nick" name="nickname" autocomplete="nickname" placeholder="What should classmates call you?" minlength="3" required></div><div class="field"><label for="school">School</label>${schoolPickerHTML('school')}</div>`:''}<div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></div><div class="field"><label for="password">Password</label><div class="password-control"><input id="password" name="password" type="password" autocomplete="${tab==='signup'?'new-password':'current-password'}" minlength="6" required><button type="button" class="password-toggle" id="password-toggle" aria-controls="password" aria-pressed="false">Show</button></div>${tab==='signup'?'<p class="auth-help">Use at least 6 characters.</p>':''}</div>${tab==='login'?'<button type="button" class="auth-text-link" id="forgot-password">Forgot password?</button>':''}<button type="submit" class="btn auth-submit">${tab==='signup'?'Create account':'Log in'}</button><div class="auth-divider" aria-hidden="true"><span>or</span></div><button type="button" class="btn btn-secondary auth-google" id="google-signin"><svg aria-hidden="true" viewBox="0 0 48 48" width="18" height="18" focusable="false"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44z"/><path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12z"/></svg><span>Continue with Google</span></button></form><p id="auth-message" class="auth-message" role="status" aria-live="polite" ${message?'':'hidden'}>${esc(message)}</p></div><p class="auth-footer">StudentLink helps students connect with their school community.</p></section></div></div>`}function renderAuth(tab='signup', msg='') {
  $('#app').innerHTML = authHTML(tab, msg);
  wireSchoolPicker('school');
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => { safeSessionRemove('studentlink-google-signup-profile'); renderAuth(b.dataset.tab); }));
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('password-toggle');
  if (passwordInput && passwordToggle) passwordToggle.onclick = () => {
    const reveal = passwordInput.type === 'password';
    passwordInput.type = reveal ? 'text' : 'password';
    passwordToggle.textContent = reveal ? 'Hide' : 'Show';
    passwordToggle.setAttribute('aria-pressed', String(reveal));
  };
  document.getElementById('forgot-password')?.addEventListener('click', async () => {
    const emailInput = document.getElementById('email');
    const email = emailInput?.value.trim() || '';
    const status = document.getElementById('auth-message');
    const showStatus = message => { if (status) { status.textContent = message; status.hidden = false; } else toast(message); };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Enter your account email above first, then select Forgot password again.');
      emailInput?.focus();
      return;
    }
    if (!db) { showStatus('Password recovery is unavailable right now. Please try again later.'); return; }
    const button = document.getElementById('forgot-password');
    if (button) { button.disabled = true; button.textContent = 'Sending reset link…'; }
    try {
      const redirectTo = window.location.origin + window.location.pathname + '?reset-password=1';
      const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      showStatus('If an account exists for this email, a password-reset link has been sent. Check your inbox and spam folder.');
    } catch (err) {
      console.error('Password reset request failed:', err);
      showStatus('Could not send the reset email. Please check your connection and try again.');
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Forgot password?'; }
    }
  });
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
      safeSessionSet(pendingKey, JSON.stringify({ nickname, school, createdAt: Date.now() }));
    } else {
      safeSessionRemove(pendingKey);
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
      safeSessionRemove(pendingKey);
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
function applyTheme(theme){const chosen=theme==='light'?'light':'dark';document.documentElement.dataset.theme=chosen;try{localStorage.setItem('studentlink-theme',chosen)}catch(_){}const b=$('#theme-toggle');if(b){b.textContent=chosen==='dark'?'☀️ Light':'🌙 Dark';b.setAttribute('aria-label',chosen==='dark'?'Switch to light mode':'Switch to dark mode');b.setAttribute('aria-pressed',String(chosen==='light'))}}
function initTheme(){let saved='dark';try{saved=localStorage.getItem('studentlink-theme')||'dark'}catch(_){}document.documentElement.dataset.theme=saved==='light'?'light':'dark'}
initTheme();
function nav(v,ico,label){const selected=S.view===v||(S.view==='game'&&v==='games');const badge=v==='messages'?'<span class="nav-unread-badge" data-message-nav-badge hidden>0</span>':v==='feed'?'<span class="nav-unread-badge" data-home-unread-badge hidden>0</span>':'';return `<button type="button" class="navitem ${selected?'active':''}" data-view="${v}" aria-current="${selected?'page':'false'}" aria-pressed="${selected}"><span aria-hidden="true">${ico}</span><span>${label}</span>${badge}</button>`}function shell(){return `<header class="header"><div style="display:flex;gap:16px;flex:1;align-items:center"><span style="font-weight:600;font-size:16px">StudentLink</span><div class="search-wrap"><input type="text" class="search" id="search" placeholder="Search students or schools…"><div id="search-results" class="search-results" hidden></div></div></div><div style="display:flex;align-items:center;gap:8px"><button class="btn btn-secondary" id="install-app" type="button">Install app</button><button class="btn btn-secondary message-count-shortcut" id="messages-shortcut" type="button" aria-label="Open messages; 0 conversations with unread messages">💬 <span class="message-shortcut-label">Messages</span> <span class="header-message-badge" data-message-header-badge hidden>0</span></button><button class="btn btn-secondary" id="logout">Log out</button><button class="btn btn-secondary" id="theme-toggle" type="button" aria-label="Switch color theme">☀️ Light</button><button class="btn btn-secondary" id="notifications-history-toggle" type="button" aria-label="Open notification history">🔔 Notifications <span id="notifications-history-count" hidden></span></button><button class="btn btn-secondary" id="notifications-toggle" type="button" aria-label="Enable browser notifications">🔔 Enable</button></div></header><section class="trending-mobile-wrap"><h3>Trending schools</h3><div id="trending-mobile" class="trending-mobile"></div></section><div class="layout"><div class="leftside">${nav('feed','📰','Feed')}${nav('friends','👥','Friends')}${nav('messages','💬','Messages')}${nav('games','🎮','Games')}${nav('profile','👤','Profile')}${nav('suggestions','💡','Feedback')}</div><div class="main" id="main"></div><aside class="rightside"><h3 style="margin:0 0 16px 0">Trending schools</h3><div id="trending"></div></aside></div>`}
function renderPasswordReset(message=''){
  const root=document.getElementById('app');if(!root)return;
  root.innerHTML='<div class="auth"><div class="auth-layout"><section class="auth-intro"><div class="brand"><span class="brandicon" aria-hidden="true">🔗</span><span>StudentLink</span></div><h1>Secure your account.</h1><p>Choose a new password to get back to your school community.</p></section><section class="auth-panel"><div class="hero"><div class="auth-card-heading"><h2>Set a new password</h2><p>Use at least 6 characters.</p></div><form id="reset-password-form"><div class="field"><label for="new-password">New password</label><input id="new-password" type="password" autocomplete="new-password" minlength="6" required></div><div class="field"><label for="confirm-password">Confirm new password</label><input id="confirm-password" type="password" autocomplete="new-password" minlength="6" required></div><button type="submit" class="btn auth-submit" id="save-new-password">Update password</button></form><p id="reset-password-message" class="auth-message" role="status" aria-live="polite" '+(message?'':'hidden')+'>'+esc(message)+'</p><button type="button" class="auth-text-link" id="back-to-login">Back to sign in</button></div></section></div></div>';
  const status=document.getElementById('reset-password-message');
  const form=document.getElementById('reset-password-form');
  document.getElementById('back-to-login').onclick=()=>{history.replaceState({},document.title,window.location.pathname);renderAuth('login')};
  form.onsubmit=async e=>{
    e.preventDefault();
    const password=document.getElementById('new-password').value,confirm=document.getElementById('confirm-password').value,button=document.getElementById('save-new-password');
    if(password.length<6){status.textContent='Your password must be at least 6 characters.';status.hidden=false;return}
    if(password!==confirm){status.textContent='The passwords do not match.';status.hidden=false;return}
    button.disabled=true;button.textContent='Updating…';
    try{
      const {data:{session},error:sessionError}=await db.auth.getSession();
      if(sessionError||!session)throw new Error('This reset link is invalid or has expired. Request a new password-reset email.');
      const {error}=await db.auth.updateUser({password});
      if(error)throw error;
      history.replaceState({},document.title,window.location.pathname);
      await db.auth.signOut();S.session=null;
      renderAuth('login','Your password has been updated. You can now sign in with your new password.');
    }catch(err){
      console.error('Password update failed:',err);
      status.textContent=err.message==='This reset link is invalid or has expired. Request a new password-reset email.'?err.message:'Could not update your password. The link may have expired; request a new one and try again.';
      status.hidden=false;button.disabled=false;button.textContent='Update password';
    }
  };
}
async function boot(){if(!db){renderAuth('signup',!configured?'Setup needed: create a Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.':!window.supabase?'StudentLink could not load its sign-in library. Check your connection and reload the page. If this continues, try another network.':'StudentLink could not initialize its sign-in service. Reload the page and try again.');return}const resetRequested=new URLSearchParams(window.location.search).get('reset-password')==='1';let {data:{session},error}=await db.auth.getSession();if(resetRequested){renderPasswordReset(error?'Could not validate the reset session. Request a new reset link.':'');return}if(error||!session){renderAuth();return}S.session=session;await loadProfile();const pendingGoogleProfileKey='studentlink-google-signup-profile';const pendingGoogleProfileRaw=safeSessionGet(pendingGoogleProfileKey);if(pendingGoogleProfileRaw){safeSessionRemove(pendingGoogleProfileKey);try{const pending=JSON.parse(pendingGoogleProfileRaw);if(Date.now()-Number(pending.createdAt)<10*60*1000&&S.profile?.school===''&&String(S.profile?.nickname||'').startsWith('Student_')&&pending.nickname&&pending.school){const {error:profileError}=await db.from('profiles').update({nickname:pending.nickname,school:pending.school}).eq('id',S.session.user.id);if(profileError)throw profileError;await loadProfile()}}catch(profileError){console.warn('Google signup profile details could not be saved:',profileError);toast('Google sign-in worked, but your profile details could not be saved. You can update them from Profile.')}}if(S.profile?.deleted_at){renderDeletedProfile();return}$('#app').innerHTML=shell();setupInstallControl();const invite=location.hash.match(/^#(ttt|cf|rps)=([0-9a-f-]{36})$/i);if(invite){S.view='game';if(invite[1].toLowerCase()==='ttt'){S.game='ttt';S.tttGameId=invite[2]}else if(invite[1].toLowerCase()==='cf'){S.game='connect';S.cfGameId=invite[2]}else{S.game='rps';S.rpsMode='online';S.rpsGameId=invite[2]}}const pushParams=new URLSearchParams(location.search);if(pushParams.get('openMessages')==='1'){S.view='messages';S.chat=pushParams.get('conversation')||null;S.replyOnOpen=pushParams.get('reply')==='1';}else if(pushParams.get('openFriends')==='1'){S.view='friends';}setupNotificationControl();setupNotificationHistoryControl();setUpRealtime();loadConvos().catch(error=>console.warn('Unread message counts are unavailable:',error));startUnreadBadgeSync();renderView();wireActions();$('#logout').onclick=()=>{db.auth.signOut();renderAuth()};const search=$('#search'),results=$('#search-results');let searchTimer;if(search&&results){search.oninput=()=>{clearTimeout(searchTimer);const term=search.value.trim();if(term.length<2){results.hidden=true;results.innerHTML='';return}searchTimer=setTimeout(async()=>{const safeTerm=term.replace(/[^\p{L}\p{N} '\-]/gu,'').trim();if(!safeTerm){results.hidden=true;results.innerHTML='';return}const [studentResult,schoolResult]=await Promise.all([db.from('profiles').select('id,nickname,school,avatar_url').neq('id',S.session.user.id).or('nickname.ilike.%'+safeTerm+'%,school.ilike.%'+safeTerm+'%').order('nickname').limit(20),db.from('profiles').select('school').not('school','is',null).ilike('school','%'+safeTerm+'%').limit(500)]);if(studentResult.error||schoolResult.error){results.innerHTML='<div class="search-result">Search unavailable</div>';results.hidden=false;return}const schoolMap=new Map();(schoolResult.data||[]).forEach(p=>{const name=(p.school||'').trim();const key=schoolKey(name);if(key&&!schoolMap.has(key))schoolMap.set(key,canonicalSchoolName(name))});const schoolButtons=Array.from(schoolMap.values()).slice(0,5).map(name=>'<button type="button" class="search-school-option" data-school="'+esc(name)+'"><span>🏫</span><span>View all students at <b>'+esc(name)+'</b></span></button>').join('');const studentRows=(studentResult.data||[]).map(p=>'<div class="search-result"><div style="display:flex;align-items:center;gap:8px"><button type="button" class="profile-open" data-public-profile="'+esc(p.id)+'" aria-label="View '+esc(p.nickname)+'\'s profile">'+profileAvatarMarkup(p.nickname,p.avatar_url,'avatar')+'</button><div><button type="button" class="profile-name-link" data-public-profile="'+esc(p.id)+'">'+esc(p.nickname)+'</button><div class="tiny">'+esc(p.school||'No school')+'</div></div></div><button class="btn btn-secondary" data-search-add="'+p.id+'">Add</button></div>').join('');results.innerHTML=(schoolButtons?'<div class="search-section-label">Schools</div>'+schoolButtons:'')+(studentRows?'<div class="search-section-label">Students</div>'+studentRows:'')||'<div class="search-result">No students or schools found</div>';results.hidden=false},250);}}}function updateNotificationButton(){
  const button=document.getElementById('notifications-toggle');
  if(!button)return;
  if(!('Notification' in window)){
    button.textContent='🔔 Unavailable';
    button.title='This browser does not support notifications.';
    button.disabled=true;
    return;
  }
  const permission=Notification.permission;
  button.disabled=permission==='denied';
  button.textContent=permission==='granted'?'🔔 Push On':permission==='denied'?'🔔 Blocked':'🔔 Enable';
  button.title=permission==='granted'?'Notifications are allowed. Background push works after this device subscribes.':permission==='denied'?'Allow notifications for this site in your browser settings.':'Enable message notifications, including when StudentLink is closed.';
  button.setAttribute('aria-label',button.title);
}
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
  const {count,error}=await db.from('notifications').select('id',{count:'exact',head:true}).is('read_at',null);
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
  panel.style.cssText='position:fixed;z-index:3000;top:72px;right:12px;width:min(390px,calc(100vw - 24px));max-height:min(70vh,560px);overflow:auto;padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--p1);color:var(--txt);box-shadow:0 12px 36px rgba(0,0,0,.25)';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close">Close</button></div><div class="tiny">Loading notification history…</div>';
  document.body.appendChild(panel);
  panel.querySelector('#studentlink-notification-close').onclick=()=>panel.remove();
  const {data,error}=await db.from('notifications').select('id,type,title,body,target_url,related_id,actor_id,created_at,read_at').order('created_at',{ascending:false}).limit(50);
  if(!panel.isConnected)return;
  if(error){panel.innerHTML='<strong>Notifications</strong><p class="tiny">Notification history could not load. Please try again.</p><button type="button" class="btn btn-secondary" id="studentlink-notification-close">Close</button>';panel.querySelector('button').onclick=()=>panel.remove();console.warn('Notification history could not load:',error);return}
  if(!data?.length){panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close">Close</button></div><p class="tiny">No notifications yet. New messages and friend requests will appear here.</p>';panel.querySelector('button').onclick=()=>panel.remove();return}
  panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px"><strong>Notifications</strong><button type="button" class="btn btn-secondary" id="studentlink-notification-close">Close</button></div>'+data.map(item=>'<article style="padding:10px 8px;border-bottom:1px solid var(--line);border-radius:8px;background:'+(item.read_at?'transparent':'var(--p2)')+'"><button type="button" data-notification-id="'+esc(item.id)+'" data-notification-type="'+esc(item.type)+'" style="display:block;width:100%;text-align:left;padding:0;border:0;background:transparent;color:var(--txt);cursor:pointer"><strong>'+esc(item.title)+'</strong><div style="font-size:13px;margin-top:3px">'+esc(item.body||'')+'</div><div class="tiny" style="margin-top:5px">'+esc(new Date(item.created_at).toLocaleString())+(item.read_at?'':' · New')+'</div></button>'+(item.type==='message'?'<form data-quick-reply="'+esc(item.id)+'" style="display:flex;gap:6px;margin-top:9px"><input name="reply" maxlength="1500" aria-label="Reply to '+esc(item.title)+'" placeholder="Reply…" style="min-width:0;flex:1;width:0;padding:9px 11px;border:1px solid var(--line);border-radius:18px;background:var(--p);color:var(--txt);font:inherit;font-size:14px" required><button type="submit" class="btn" style="padding:8px 12px;border-radius:18px;white-space:nowrap">Send</button></form>':'')+'</article>').join('');
  panel.querySelector('#studentlink-notification-close').onclick=()=>panel.remove();
  panel.querySelectorAll('[data-notification-id]').forEach(itemButton=>itemButton.onclick=async()=>{
    const item=data.find(row=>row.id===itemButton.dataset.notificationId);
    if(item&&!item.read_at){const {error:readError}=await db.from('notifications').update({read_at:new Date().toISOString()}).eq('id',item.id);if(readError){console.warn('Could not mark notification read:',readError);return}item.read_at=new Date().toISOString()}
    panel.remove();await refreshNotificationHistoryBadge();
    if(item?.type==='friend_request')setView('friends');else setView('messages');
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
  if(unread.length)await db.from('notifications').update({read_at:new Date().toISOString()}).in('id',unread);
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
    playMessageSound();
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
async function loadProfile(){let {data,error}=await db.from('profiles').select('*').eq('id',S.session.user.id).maybeSingle();if(error)console.warn(error);S.profile=data||{id:S.session.user.id,nickname:'Student',school:''}}
async function renderView(){
  const main=$('#main');
  if(!main)return;
  main.setAttribute('aria-live','polite');
  main.setAttribute('aria-busy','true');
  main.innerHTML='<div class="card state-message" role="status"><span class="state-icon" aria-hidden="true">⏳</span><div><b>Loading this page…</b><p class="tiny">Please wait a moment.</p></div></div>';
  const renderers={
    feed:()=>viewFeed(),
    friends:()=>viewFriends(),
    messages:()=>viewMessages(),
    games:()=>viewGames(),
    game:()=>viewGame(),
    profile:()=>viewProfile(),
    'public-profile':()=>viewPublicProfile(S.publicProfileId),
    suggestions:()=>viewSuggestions(),
    school:()=>viewSchoolStudents(S.schoolFilter)
  };
  try{
    const render=renderers[S.view];
    if(!render)throw new Error('That StudentLink page is not available.');
    await render();
  }catch(error){
    console.error('StudentLink page failed:',S.view,error);
    if(main.isConnected){
      main.innerHTML='<section class="card state-message error-state" role="alert"><span class="state-icon" aria-hidden="true">!</span><div><b>This page could not be loaded</b><p id="page-error-message"></p><p class="tiny">Other StudentLink sections remain available. Try this page again or open another section.</p><button type="button" class="btn btn-secondary" id="retry-page">Try again</button></div></section>';
      const message=$('#page-error-message');
      if(message)message.textContent=String(error?.message||'Something went wrong. Please try again.');
      $('#retry-page')?.addEventListener('click',()=>{renderView().catch(e=>console.error('Page retry failed:',e));});
    }
  }finally{
    if(main.isConnected)main.setAttribute('aria-busy','false');
  }
  // Sidebar school discovery is optional and must not prevent the selected page from working.
  try{
    await viewSchools();
  }catch(error){
    console.warn('Trending schools are temporarily unavailable:',error);
    const fallback='<p class="tiny">Trending schools are temporarily unavailable.</p>';
    const desktop=$('#trending'),mobile=$('#trending-mobile');
    if(desktop)desktop.innerHTML=fallback;
    if(mobile)mobile.innerHTML=fallback;
  }
}
async function viewFeed(){
 const mode=S.feedMode==='school'?'school':'all';let data=[];
 if(S.feedOrderMode!==mode||!S.feedOrderIds.length){const result=await db.rpc('get_studentlink_feed',{p_school_only:mode==='school',p_limit:40});if(result.error)throw result.error;data=result.data||[];S.feedOrderMode=mode;S.feedOrderIds=data.map(p=>p.id)}
 else{const result=await db.from('posts').select('id,user_id,body,created_at,post_type,poll_question,poll_options,image_url').in('id',S.feedOrderIds);if(result.error)throw result.error;const byId=new Map((result.data||[]).map(p=>[p.id,p]));data=S.feedOrderIds.map(id=>byId.get(id)).filter(Boolean);S.feedOrderIds=data.map(p=>p.id)}
 const schoolName=S.profile?.school||'';let html='<div class="head feed-head"><div><h1 class="title">Feed</h1><p class="tiny">Posts are shuffled by default.</p></div><div class="feed-controls"><label for="feed-filter" class="tiny">Show</label><select id="feed-filter" aria-label="Filter posts"><option value="all" '+(mode==='all'?'selected':'')+'>All schools</option><option value="school" '+(mode==='school'?'selected':'')+(schoolName?'':' disabled')+'>My school</option></select><button class="btn" id="new-post">New post</button></div></div><section class="card post-composer" aria-label="Create a post"><div class="post-composer-top"><span class="post-composer-avatar" aria-hidden="true">✎</span><button type="button" class="post-composer-prompt" id="post-composer-open">Share something with your school community…</button></div><div class="post-composer-actions"><span class="tiny">💬 Start a discussion</span><span class="tiny">🖼️ Add a photo or poll</span><button type="button" class="btn btn-secondary" id="post-composer-create">Create post +</button></div></section>';
 if(mode==='school'&&!schoolName)html+='<div class="card"><b>Add your school first</b><p class="tiny">Open Profile and choose your school to filter posts.</p></div>';else if(!data.length)html+='<div class="card"><b>No posts found</b></div>';
 if(data.length){const ids=[...new Set(data.map(p=>p.user_id))],postIds=data.map(p=>p.id);const results=await Promise.all([db.from('profiles').select('id,nickname,school,avatar_url').in('id',ids),db.from('post_likes').select('post_id').in('post_id',postIds),db.from('post_likes').select('post_id').in('post_id',postIds).eq('user_id',S.session.user.id),db.from('comments').select('post_id').in('post_id',postIds)]);results.forEach(r=>{if(r.error)throw r.error});const users=new Map((results[0].data||[]).map(p=>[p.id,p])),likeMap={},commentMap={},likedSet=new Set((results[2].data||[]).map(x=>x.post_id));(results[1].data||[]).forEach(x=>likeMap[x.post_id]=(likeMap[x.post_id]||0)+1);(results[3].data||[]).forEach(x=>commentMap[x.post_id]=(commentMap[x.post_id]||0)+1);data=data.filter(p=>users.has(p.user_id));const pollIds=data.filter(p=>p.post_type==='poll').map(p=>p.id),voteResult=pollIds.length?await db.from('poll_votes').select('post_id,user_id,option_index').in('post_id',pollIds):{data:[],error:null};if(voteResult.error)throw voteResult.error;const voteMap={};(voteResult.data||[]).forEach(v=>{(voteMap[v.post_id]||(voteMap[v.post_id]=[])).push(v)});html+=data.map(p=>postCard(p,users.get(p.user_id),likedSet.has(p.id),likeMap[p.id]||0,commentMap[p.id]||0,voteMap[p.id]||[])).join('')}
 $('#main').innerHTML=html;$('#feed-filter')?.addEventListener('change',e=>{S.feedMode=e.target.value;S.feedOrderIds=[];S.feedOrderMode='';renderView()});
 const openPostComposer=()=>{modal('Create a post','<form id="postform"><div class="field"><label for="pb">What&#39;s on your mind?</label><textarea id="pb" maxlength="280" required></textarea></div><div class="field"><label><input type="radio" name="pt" value="text" checked> Text</label><label><input type="radio" name="pt" value="poll"> Poll</label></div><div id="post-image-field" class="field"><label for="post-image">Attach an image (optional)</label><label for="post-image" class="btn btn-secondary post-image-add">＋ Add</label><input id="post-image" class="post-image-input" type="file" accept="image/jpeg,image/png,image/webp"><p class="tiny">JPG, PNG or WebP; maximum 5 MB. Images are available to signed-in students.</p><div id="post-image-preview" hidden></div></div><div id="pollopts" style="display:none"><div class="field"><label for="pq">Question</label><input id="pq" maxlength="180"></div>'+[1,2,3,4].map(n=>'<div class="field"><label for="po'+n+'">Option '+n+'</label><input id="po'+n+'" maxlength="100"></div>').join('')+'</div><button type="submit" class="btn">Post</button></form>');const imageInput=$('#post-image'),preview=$('#post-image-preview');imageInput.onchange=()=>{const file=imageInput.files?.[0];preview.innerHTML='';preview.hidden=true;if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){imageInput.value='';toast('Choose a JPG, PNG or WebP image no larger than 5 MB.');return}const img=document.createElement('img');img.alt='Selected post image preview';img.style.cssText='max-width:100%;max-height:240px;border-radius:8px;object-fit:contain';img.src=URL.createObjectURL(file);preview.append(img);preview.hidden=false};$('[value="poll"]').onchange=()=>{$('#pollopts').style.display='block';$('#post-image-field').hidden=true};$('[value="text"]').onchange=()=>{$('#pollopts').style.display='none';$('#post-image-field').hidden=false};$('#postform').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,submit=form.querySelector('button[type="submit"]'),pt=$('[name="pt"]:checked')?.value||'text',body=$('#pb').value.trim(),file=pt==='text'?imageInput.files?.[0]:null;let payload;if(pt==='poll'){const q=$('#pq').value.trim(),opts=[1,2,3,4].map(n=>$('#po'+n).value.trim()).filter(Boolean);if(!q||opts.length<2){toast('Add a poll question and at least 2 options.');return}payload={user_id:S.session.user.id,body:body||q,post_type:'poll',poll_question:q,poll_options:opts}}else{if(!body&&!file){toast('Write something or attach an image.');return}payload={user_id:S.session.user.id,body:body||' ',post_type:'text'}}if(submit){submit.disabled=true;submit.textContent='Posting…'}try{if(file){const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg',path=S.session.user.id+'/'+makeRandomId()+'.'+ext;const {error:uploadError}=await db.storage.from('post-images').upload(path,file,{contentType:file.type,upsert:false});if(uploadError)throw uploadError;const {data:publicData}=db.storage.from('post-images').getPublicUrl(path);payload.image_url=publicData.publicUrl}const {error}=await db.from('posts').insert(payload);if(error)throw error;S.feedOrderIds=[];S.feedOrderMode='';closeModal();await renderView();toast(pt==='poll'?'Poll published.':'Post published.')}catch(err){console.error(err);toast('Could not publish your post. Check the image storage setup and try again.');if(submit){submit.disabled=false;submit.textContent='Post'}}}};$('#new-post')?.addEventListener('click',openPostComposer);$('#post-composer-open')?.addEventListener('click',openPostComposer);$('#post-composer-create')?.addEventListener('click',openPostComposer);
 $$('[data-like]').forEach(b=>b.onclick=()=>toggleLike(b.dataset.like,b.classList.contains('liked')));$$('[data-comments]').forEach(b=>b.onclick=()=>openComments(b.dataset.comments));$$('[data-vote]').forEach(b=>b.onclick=()=>votePoll(b.dataset.vote,Number(b.dataset.option)));$$('[data-delete-post]').forEach(b=>b.onclick=()=>deleteOwnPost(b.dataset.deletePost));
}
async function deleteOwnPost(postId){if(!window.confirm('Delete this post? This cannot be undone.'))return;const {data,error}=await db.from('posts').delete().eq('id',postId).eq('user_id',S.session.user.id).select('id').maybeSingle();if(error){console.error(error);toast('Could not delete this post.');return}if(!data){toast('Post not found or you cannot delete it.');return}S.feedOrderIds=S.feedOrderIds.filter(id=>id!==postId);toast('Your post was deleted.');await renderView()}
async function votePoll(postId,optionIndex){const {data:existing,error:checkError}=await db.from('poll_votes').select('post_id').eq('post_id',postId).eq('user_id',S.session.user.id).maybeSingle();if(checkError){toast(checkError.message);return}if(existing){toast('You have already voted in this poll.');return}const {error}=await db.from('poll_votes').insert({post_id:postId,user_id:S.session.user.id,option_index:optionIndex});if(error){toast(error.message);return}toast('Vote recorded.');await renderView()}
function postCard(p,profile,liked,count,comments,votes=[]){const myVote=votes.find(v=>v.user_id===S.session.user.id);const total=votes.length;return `<article class="card"><div class="post-top"><button type="button" class="profile-open" data-public-profile="${esc(p.user_id)}" aria-label="View ${esc(profile?.nickname||'Student')}'s profile">${profileAvatarMarkup(profile?.nickname,profile?.avatar_url,'avatar')}</button><div style="flex:1"><button type="button" class="profile-name-link" data-public-profile="${esc(p.user_id)}">${esc(profile?.nickname||'Student')}</button> <span class="tiny">${new Date(p.created_at).toLocaleDateString()}</span></div>${p.user_id===S.session.user.id?'<button type="button" class="btn btn-secondary post-delete" data-delete-post="'+p.id+'" aria-label="Delete your post">Delete</button>':''}</div>${p.image_url?'<div class="post-image-wrap"><img class="post-image" src="'+esc(p.image_url)+'" alt="Image attached to post" loading="lazy"></div>':''}${p.post_type==='poll'?`<div><b>${esc(p.poll_question)}</b><div style="margin-top:8px">${(p.poll_options||[]).map((o,i)=>{const n=votes.filter(v=>v.option_index===i).length;return `<button data-vote="${p.id}" data-option="${i}" class="btn btn-secondary" style="display:flex;justify-content:space-between;gap:12px;margin-bottom:4px;text-align:left;width:100%" ${myVote?'disabled':''}><span>${esc(o)}${myVote&&myVote.option_index===i?' ✓':''}</span><span>${myVote?`${n} vote${n===1?'':'s'}`:''}</span></button>`}).join('')}</div><div class="tiny">${total} vote${total===1?'':'s'}${myVote?' · You voted':''}</div></div>`:`<p>${esc(p.body)}</p>`}<div style="display:flex;gap:12px;margin-top:12px"><button data-like="${p.id}" class="btn btn-secondary ${liked?'liked':''}" style="flex:1">❤️ ${count}</button><button data-comments="${p.id}" class="btn btn-secondary" style="flex:1">💬 Comment (${comments})</button></div></article>`}
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
async function toggleLike(id,liked){
  const buttons=$$('[data-like]').filter(button=>button.dataset.like===String(id));
  if(!buttons.length||buttons.some(button=>button.dataset.busy==='true'))return;
  buttons.forEach(button=>{button.dataset.busy='true';button.disabled=true});
  try{
    const q=liked
      ?db.from('post_likes').delete().eq('post_id',id).eq('user_id',S.session.user.id)
      :db.from('post_likes').insert({post_id:id,user_id:S.session.user.id});
    const {error}=await q;
    if(error){toast(error.message||'Could not update your like. Please try again.');return}
    buttons.forEach(button=>{
      const match=(button.textContent||'').match(/(\d+)\s*$/);
      const current=match?Number(match[1]):0;
      const next=Math.max(0,current+(liked?-1:1));
      button.textContent='❤️ '+next;
      button.classList.toggle('liked',!liked);
      button.setAttribute('aria-pressed',String(!liked));
      button.setAttribute('aria-label',(liked?'Like':'Unlike')+' post; '+next+' likes');
    });
  }catch(error){
    console.error('Could not update post like:',error);
    toast('Could not update your like. Check your connection and try again.');
  }finally{
    buttons.forEach(button=>{delete button.dataset.busy;button.disabled=false});
  }
}

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
 $('#main').innerHTML='<div class="head messages-page-head"><button type="button" class="btn btn-secondary messages-back-feed" id="messages-back-feed" aria-label="Back to feed">← Feed</button><div class="messages-page-title"><h1 class="title">Messages</h1><p class="tiny">Chat privately with accepted friends.</p></div></div><section class="messenger-layout" id="messenger-layout"><aside class="messenger-sidebar"><div class="messenger-sidebar-head"><h2>Chats</h2><input class="messenger-search" id="messenger-search" type="search" placeholder="Search conversations" aria-label="Search conversations"></div><div class="messenger-conversation-list" id="convos"></div></aside><section class="messenger-chat" id="messenger-chat"><div class="messenger-empty">Choose a conversation to start chatting.</div></section></section>';
 const container=$('#convos'),layout=$('#messenger-layout');
 $('#messages-back-feed').onclick=()=>{S.chat=null;setView('feed')};
 const renderList=(filter='')=>{const q=filter.trim().toLowerCase(),items=S.convos.filter(c=>c.otherNickname.toLowerCase().includes(q)||String(c.lastMessage||'').toLowerCase().includes(q));
 container.innerHTML=items.length?items.map(c=>'<button type="button" class="messenger-conversation '+(S.chat===c.id?'active':'')+'" data-convo="'+esc(c.id)+'">'+profileAvatarMarkup(c.otherNickname,c.otherAvatar||'','avatar')+'<span class="messenger-conversation-copy"><strong>'+esc(c.otherNickname)+'</strong><span class="tiny messenger-preview">'+esc(c.lastMessage||'No messages yet')+'</span></span><span class="messenger-unread-badge"'+(c.unreadCount?'':' hidden')+' aria-label="'+esc(c.unreadCount)+' unread messages">'+esc(c.unreadCount||0)+'</span></button>').join(''):'<div class="messenger-empty">'+(S.convos.length?'No matching conversations.':'No conversations yet. Add a friend to start chatting.')+'</div>';
 container.querySelectorAll('[data-convo]').forEach(el=>el.onclick=()=>openConversation(el.dataset.convo));};
 renderList();updateMessageBadges();$('#messenger-search').oninput=e=>renderList(e.target.value);
 if(S.chat&&S.convos.some(c=>c.id===S.chat))await openConversation(S.chat);
}
async function openConversation(conversationId){
 S.chat=conversationId;const convo=S.convos.find(c=>c.id===conversationId);
 const {data:messages,error}=await db.from('messages').select('id,conversation_id,sender_id,body,created_at,attachment_path,attachment_name,attachment_mime_type,attachment_size').eq('conversation_id',conversationId).order('created_at');
 if(error)throw error;
 const isVisibleChat=S.view==='messages'&&S.chat===conversationId&&document.visibilityState==='visible';
 if(isVisibleChat){const latestKnown=(messages||[]).reduce((latest,m)=>!latest||String(m.created_at)>latest?String(m.created_at):latest,'')||new Date().toISOString();try{await updateMessageReadCursor(conversationId,latestKnown);const stateConvo=S.convos.find(c=>c.id===conversationId);if(stateConvo)stateConvo.unreadCount=0;updateMessageBadges()}catch(readError){console.warn('Could not sync this conversation read status:',readError);toast('Messages opened, but read status could not sync. Please try again.')}}
 const chat=$('#messenger-chat'),layout=$('#messenger-layout');
 if(!chat||!layout){await viewMessages();return}layout.classList.add('chat-open');document.querySelector('.layout')?.classList.add('messages-chat-open');
 const renderedMessages=await Promise.all((messages||[]).map(async m=>{
   let attachmentHTML='';
   if(m.attachment_path){
     try{
       const {data:signed,error:signedError}=await db.storage.from('message-files').createSignedUrl(m.attachment_path,3600,{download:true});
       if(signedError)throw signedError;
       if(signed?.signedUrl)attachmentHTML='<a class="message-attachment" href="'+esc(signed.signedUrl)+'" target="_blank" rel="noopener noreferrer" download="'+esc(m.attachment_name||'attachment')+'">📎 '+esc(m.attachment_name||'Download attachment')+' <span class="message-attachment-size">'+esc(formatAttachmentSize(m.attachment_size))+'</span></a>';
       else attachmentHTML='<span class="message-attachment-unavailable">📎 Attachment unavailable</span>';
     }catch(_){attachmentHTML='<span class="message-attachment-unavailable">📎 Attachment unavailable</span>'}
   }
   return '<div class="message-row '+(m.sender_id===S.session.user.id?'mine':'')+'"><div class="message-bubble">'+messageBodyHTML(m.body||'')+(attachmentHTML?'<div class="message-attachment-wrap">'+attachmentHTML+'</div>':'')+'</div><time class="message-time" datetime="'+esc(m.created_at)+'">'+esc(new Date(m.created_at).toLocaleString())+'</time></div>';
 }));
 chat.innerHTML='<header class="messenger-chat-head"><button type="button" class="btn btn-secondary messenger-back" id="messenger-back" aria-label="Back to conversations">← Chats</button>'+profileAvatarMarkup(convo?.otherNickname||'Student',convo?.otherAvatar||'','avatar')+'<div class="messenger-chat-person"><h2>'+esc(convo?.otherNickname||'Conversation')+'</h2><span class="tiny">StudentLink chat</span></div></header><div class="messenger-scroll" id="message-list">'+(renderedMessages.join('')||'<div class="messenger-empty">This is the beginning of your conversation.</div>')+'</div><form id="msgform" class="messenger-composer"><input id="message-file" class="message-file-input" type="file" aria-label="Choose a file to attach"><button type="button" class="btn btn-secondary messenger-attach" id="attach-file" aria-label="Attach a file" title="Attach a file">📎</button><textarea id="msgtext" maxlength="1500" rows="1" placeholder="Message…" aria-label="Message text"></textarea><button type="submit" class="btn" id="send-message">Send</button></form><div id="attachment-status" class="messenger-attachment-status" hidden></div>';
 if(S.replyOnOpen){S.replyOnOpen=false;const composer=$('#msgtext');if(composer){composer.placeholder='Write your reply…';composer.focus();}}
 const list=$('#message-list');if(list)list.scrollTop=list.scrollHeight;
 $('#messenger-back').onclick=()=>{layout.classList.remove('chat-open');document.querySelector('.layout')?.classList.remove('messages-chat-open');S.chat=null};
 const fileInput=$('#message-file'),attachButton=$('#attach-file'),attachmentStatus=$('#attachment-status');
 attachButton.onclick=()=>fileInput.click();
 fileInput.onchange=()=>{const file=fileInput.files?.[0];if(!file){attachmentStatus.hidden=true;attachmentStatus.textContent='';return;}if(file.size<=0||file.size>=5*1024*1024){toast('Choose a non-empty file smaller than 5 MB.');fileInput.value='';attachmentStatus.hidden=true;attachmentStatus.textContent='';return;}attachmentStatus.textContent='📎 '+file.name+' · '+formatAttachmentSize(file.size)+' · ready to send';attachmentStatus.hidden=false;};
 $('#msgtext').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#msgform').requestSubmit()}});
 $('#msgform').onsubmit=async e=>{e.preventDefault();const input=$('#msgtext'),body=input.value.trim(),send=$('#send-message'),file=fileInput.files?.[0];if(!body&&!file)return;if(file&&(file.size<=0||file.size>=5*1024*1024)){toast('Choose a non-empty file smaller than 5 MB.');return;}send.disabled=true;attachButton.disabled=true;let uploadedPath=null;try{if(file){const extension=(file.name.match(/\.([a-zA-Z0-9]{1,12})$/)||[])[1]||'bin';uploadedPath=conversationId+'/'+S.session.user.id+'/'+makeRandomId()+'.'+extension.toLowerCase();const {error:uploadError}=await db.storage.from('message-files').upload(uploadedPath,file,{cacheControl:'3600',upsert:false,contentType:file.type||'application/octet-stream'});if(uploadError)throw uploadError;}const {error:sendError}=await db.from('messages').insert({conversation_id:conversationId,sender_id:S.session.user.id,body:body||(file?'📎 File attached':'Message'),attachment_path:uploadedPath,attachment_name:file?.name||null,attachment_mime_type:file?.type||null,attachment_size:file?.size||null});if(sendError)throw sendError;input.value='';fileInput.value='';attachmentStatus.hidden=true;attachmentStatus.textContent='';await loadConvos();await openConversation(conversationId)}catch(err){console.error(err);if(uploadedPath){const {error:cleanupError}=await db.storage.from('message-files').remove([uploadedPath]);if(cleanupError)console.warn('Could not clean up an unsent attachment:',cleanupError)}toast(file?'The message or attachment could not be sent. Please try again.':'Message could not be sent. Please try again.')}finally{if($('#send-message'))$('#send-message').disabled=false;if($('#attach-file'))$('#attach-file').disabled=false}};

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
  document.querySelectorAll('[data-message-nav-badge],[data-message-header-badge],[data-home-unread-badge]').forEach(badge=>{badge.textContent=String(unreadChats);badge.hidden=unreadChats===0;badge.setAttribute('aria-label',unreadChats+' chats with unread messages')});
  const headerShortcut=document.getElementById('messages-shortcut');if(headerShortcut)headerShortcut.setAttribute('aria-label','Open messages; '+unreadChats+' conversations with unread messages');
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
  const {data,error}=await db.from('conversations').select('id,user_a,user_b,updated_at').or(`user_a.eq.${S.session.user.id},user_b.eq.${S.session.user.id}`).order('updated_at',{ascending:false});
  if(error)throw error;
  const rows=data||[];const otherIds=rows.map(c=>c.user_a===S.session.user.id?c.user_b:c.user_a);
  const {data:profiles,error:profileError}=otherIds.length?await db.from('profiles').select('id,nickname,avatar_url').in('id',otherIds):{data:[],error:null};
  if(profileError)throw profileError;
  const profilesById=Object.fromEntries((profiles||[]).map(p=>[p.id,p]));
  const {data:readRows,error:readError}=rows.length?await db.from('conversation_reads').select('conversation_id,last_read_at').eq('user_id',S.session.user.id):{data:[],error:null};
  if(readError)throw readError;
  S.messageReadAt=Object.fromEntries((readRows||[]).map(r=>[r.conversation_id,r.last_read_at]));
  S.convos=await Promise.all(rows.map(async c=>{
    const otherId=c.user_a===S.session.user.id?c.user_b:c.user_a,person=profilesById[otherId]||{};
    const {data:lastMessages,error:messageError}=await db.from('messages').select('body,created_at,sender_id').eq('conversation_id',c.id).order('created_at',{ascending:false}).limit(1);
    if(messageError)throw messageError;
    const last=lastMessages?.[0]||null;
    const cursor=S.messageReadAt[c.id]||'1970-01-01T00:00:00.000Z';
    const {count:unreadCount,error:unreadError}=await db.from('messages').select('id',{count:'exact',head:true}).eq('conversation_id',c.id).neq('sender_id',S.session.user.id).gt('created_at',cursor);
    if(unreadError)throw unreadError;
    return{id:c.id,otherId,otherNickname:person.nickname||'Student',otherAvatar:person.avatar_url||'',lastMessage:last?.body||'',lastMessageAt:last?.created_at||c.updated_at||c.created_at,unreadCount:Number(unreadCount)||0};
  }));
  S.convos.sort((a,b)=>new Date(b.lastMessageAt||0)-new Date(a.lastMessageAt||0));
  updateMessageBadges();
}
function viewGames(){
  const games=[
    {icon:'⭕❌',name:'Tic-Tac-Toe',mode:'MULTIPLAYER',description:'Challenge another student in a live match.',id:'ttt',tone:'blue'},
    {icon:'🔵🟡',name:'Connect Four',mode:'MULTIPLAYER',description:'Connect four discs before your opponent does.',id:'connect',tone:'purple'},
    {icon:'✊✋✌️',name:'Rock Paper Scissors',mode:'MULTIPLAYER',description:'Play live rounds with another StudentLink player.',id:'rps',tone:'coral'},
    {icon:'🧠',name:'Student Quiz',mode:'SOLO',description:'Test your general knowledge and learn as you go.',id:'quiz',tone:'green'},
    {icon:'🔢',name:'Number Guess',mode:'SOLO',description:'Use hints to find the hidden number from 1 to 100.',id:'guess',tone:'amber'},
    {icon:'🔤',name:'Word Scramble',mode:'SOLO',description:'Unscramble words and build your score.',id:'scramble',tone:'sky'}
  ];
  $('#main').innerHTML='<section class="games-page"><div class="games-intro"><div><p class="eyebrow">PLAY • LEARN • CONNECT</p><h1 class="title">StudentLink Games</h1><p class="games-subtitle">Quick challenges for your break. Play solo or compete with classmates.</p></div><div class="games-count"><strong>06</strong><span>games to play</span></div></div><div class="games-section-heading"><h2>Game library</h2><span class="tiny">Pick a game to get started</span></div><div class="games-grid">'+games.map(g=>'<button type="button" class="game-tile tone-'+g.tone+'" data-game="'+g.id+'"><span class="game-tile-icon" aria-hidden="true">'+g.icon+'</span><span class="game-tile-copy"><span class="game-tile-heading">'+esc(g.name)+'</span><span class="game-tile-description">'+esc(g.description)+'</span><span class="game-tile-mode '+(g.mode==='MULTIPLAYER'?'mode-online':'mode-solo')+'">'+(g.mode==='MULTIPLAYER'?'● '+g.mode:'○ '+g.mode)+'</span></span><span class="game-tile-arrow" aria-hidden="true">↗</span></button>').join('')+'</div><p class="games-footnote">Online games need a signed-in account and an active connection. Solo games work without an opponent.</p></section>';
  $$('[data-game]').forEach(el=>el.onclick=()=>{S.game=el.dataset.game;S.view='game';renderView()});
}


function scrambleWord(word){let chars=word.split(''),mixed=word;for(let i=0;i<12&&mixed===word;i++){for(let j=chars.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[chars[j],chars[k]]=[chars[k],chars[j]]}mixed=chars.join('')}return mixed===word?word.split('').reverse().join(''):mixed}
const STUDENT_QUIZ_SETS=[{"title":"General Knowledge","questions":[{"q":"Which planet is known as the Red Planet?","options":["Venus","Mars","Jupiter","Mercury"],"answer":1,"why":"Iron-rich dust gives Mars its reddish appearance."},{"q":"What is the chemical formula for water?","options":["CO₂","O₂","H₂O","NaCl"],"answer":2,"why":"A water molecule contains two hydrogen atoms and one oxygen atom."},{"q":"Which organ pumps blood around the body?","options":["Lungs","Heart","Liver","Kidneys"],"answer":1,"why":"The heart circulates blood."},{"q":"What is 15% of 200?","options":["15","20","30","45"],"answer":2,"why":"0.15 × 200 = 30."},{"q":"What is the SI unit of force?","options":["Joule","Watt","Pascal","Newton"],"answer":3,"why":"Force is measured in newtons."},{"q":"Which is Earth's largest ocean?","options":["Atlantic","Indian","Pacific","Arctic"],"answer":2,"why":"The Pacific is the largest ocean."},{"q":"What is the capital of Ghana?","options":["Kumasi","Accra","Tamale","Cape Coast"],"answer":1,"why":"Accra is Ghana's capital."},{"q":"Which gas do plants absorb for photosynthesis?","options":["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],"answer":2,"why":"Plants use carbon dioxide to make sugars."},{"q":"What does CPU stand for?","options":["Central Processing Unit","Computer Power Utility","Core Program Upload","Central Print Unit"],"answer":0,"why":"The CPU executes program instructions."},{"q":"What is the square root of 144?","options":["10","11","12","14"],"answer":2,"why":"12 × 12 = 144."}]},{"title":"Mathematics","questions":[{"q":"Solve: 3x + 5 = 20.","options":["3","5","7","8"],"answer":1,"why":"3x = 15, so x = 5."},{"q":"What is 7 squared?","options":["14","42","49","56"],"answer":2,"why":"7 × 7 = 49."},{"q":"Area of a rectangle 8 cm by 3 cm?","options":["11 cm²","22 cm²","24 cm²","48 cm²"],"answer":2,"why":"Area = length × width."},{"q":"Express 0.25 as a simplest fraction.","options":["1/2","1/3","1/4","2/5"],"answer":2,"why":"0.25 = 1/4."},{"q":"Sum of angles in a triangle?","options":["90°","180°","270°","360°"],"answer":1,"why":"Interior angles total 180°."},{"q":"Evaluate 2³ × 2².","options":["16","24","32","64"],"answer":2,"why":"2⁵ = 32."},{"q":"Mean of 4, 6, 8 and 10?","options":["6","7","8","9"],"answer":1,"why":"Their total is 28; divide by 4."},{"q":"What is 20% of 150?","options":["15","20","30","45"],"answer":2,"why":"0.2 × 150 = 30."},{"q":"Solve: 5x = 45.","options":["5","8","9","10"],"answer":2,"why":"45 divided by 5 is 9."},{"q":"Perimeter of a square with side 6 cm?","options":["12 cm","18 cm","24 cm","36 cm"],"answer":2,"why":"4 × 6 = 24 cm."}]},{"title":"Physics","questions":[{"q":"Which instrument measures electric current?","options":["Voltmeter","Ammeter","Barometer","Thermometer"],"answer":1,"why":"An ammeter measures current."},{"q":"What is the SI unit of energy?","options":["Newton","Joule","Watt","Pascal"],"answer":1,"why":"Energy is measured in joules."},{"q":"Change in velocity per unit time is…","options":["Distance","Acceleration","Momentum","Force"],"answer":1,"why":"That is the definition of acceleration."},{"q":"What energy does a moving object have?","options":["Chemical","Potential","Kinetic","Nuclear"],"answer":2,"why":"Kinetic energy is energy of motion."},{"q":"Approximate speed of light in vacuum?","options":["3×10⁶ m/s","3×10⁸ m/s","3×10⁵ m/s","300 m/s"],"answer":1,"why":"It is about 300 million metres per second."},{"q":"Which device converts electricity into rotation?","options":["Motor","Generator","Transformer","Fuse"],"answer":0,"why":"An electric motor produces motion."},{"q":"Unit of frequency?","options":["Hertz","Tesla","Ohm","Coulomb"],"answer":0,"why":"Frequency is measured in hertz."},{"q":"Heat transfer through a vacuum?","options":["Conduction","Convection","Radiation","Diffusion"],"answer":2,"why":"Radiation needs no material medium."},{"q":"SI unit of pressure?","options":["Newton","Joule","Pascal","Watt"],"answer":2,"why":"Pressure is measured in pascals."},{"q":"Which lens converges parallel light rays?","options":["Concave","Convex","Plane glass","Opaque"],"answer":1,"why":"A convex lens converges parallel rays."}]},{"title":"Chemistry","questions":[{"q":"Atomic number of carbon?","options":["4","6","8","12"],"answer":1,"why":"Carbon has six protons."},{"q":"A solution with pH 2 is…","options":["Acidic","Neutral","Alkaline","Always a salt"],"answer":0,"why":"Values below 7 are acidic."},{"q":"Gas often released by reactive metals with dilute acids?","options":["Oxygen","Hydrogen","Nitrogen","Chlorine"],"answer":1,"why":"The reaction commonly releases hydrogen."},{"q":"Chemical symbol for sodium?","options":["S","So","Na","N"],"answer":2,"why":"Na comes from natrium."},{"q":"Which particles are in an atomic nucleus?","options":["Electrons only","Protons and neutrons","Neutrons and electrons","Protons only"],"answer":1,"why":"The nucleus contains protons and usually neutrons."},{"q":"Most abundant gas in dry air?","options":["Oxygen","Carbon dioxide","Nitrogen","Argon"],"answer":2,"why":"Nitrogen makes up about 78% of dry air."},{"q":"Formula of table salt?","options":["KCl","NaCl","CaCO₃","HCl"],"answer":1,"why":"Sodium chloride is NaCl."},{"q":"Method used to obtain crystals from a solution?","options":["Filtration","Crystallisation","Decantation","Sieving"],"answer":1,"why":"Crystallisation forms solid crystals."},{"q":"Which bond involves shared electron pairs?","options":["Ionic","Covalent","Metallic only","Hydrogen only"],"answer":1,"why":"Covalent bonds involve shared electrons."},{"q":"Approximate pH of pure water at room temperature?","options":["2","5","7","12"],"answer":2,"why":"Pure water is approximately neutral."}]},{"title":"Biology","questions":[{"q":"Which cell structure contains most genetic information?","options":["Ribosome","Nucleus","Cell wall","Vacuole"],"answer":1,"why":"Most cellular DNA is in the nucleus."},{"q":"Green pigment used in photosynthesis?","options":["Haemoglobin","Chlorophyll","Melanin","Keratin"],"answer":1,"why":"Chlorophyll absorbs light."},{"q":"Which blood cells help defend against pathogens?","options":["Red cells","White cells","Platelets","Plasma only"],"answer":1,"why":"White blood cells help immune defence."},{"q":"Where does human gas exchange mainly occur?","options":["Stomach","Lungs","Kidney","Pancreas"],"answer":1,"why":"Gas exchange occurs in lung alveoli."},{"q":"Basic unit of life?","options":["Atom","Tissue","Cell","Organ"],"answer":2,"why":"The cell is life's basic structural unit."},{"q":"Main quick energy nutrient?","options":["Carbohydrate","Vitamin C","Water","Mineral salts"],"answer":0,"why":"Carbohydrates are a major energy source."},{"q":"Water vapour loss from plant leaves is…","options":["Respiration","Transpiration","Pollination","Germination"],"answer":1,"why":"This process is transpiration."},{"q":"Which molecule carries inherited information?","options":["DNA","Starch","Glucose","Cellulose"],"answer":0,"why":"DNA stores genetic information."},{"q":"Which organ filters blood to form urine?","options":["Heart","Kidney","Lung","Small intestine"],"answer":1,"why":"Kidneys filter blood."},{"q":"Transfer of pollen from anther to stigma?","options":["Fertilisation","Pollination","Germination","Dispersal"],"answer":1,"why":"That process is pollination."}]},{"title":"Ghana and Civics","questions":[{"q":"Ghana's Independence Day is celebrated on…","options":["1 January","6 March","1 July","21 September"],"answer":1,"why":"Ghana celebrates independence on 6 March."},{"q":"What is Ghana's currency?","options":["Naira","Cedi","Dalasi","Rand"],"answer":1,"why":"The cedi is Ghana's currency."},{"q":"Which arm of government interprets laws?","options":["Executive","Legislature","Judiciary","Cabinet"],"answer":2,"why":"The judiciary interprets and applies laws."},{"q":"Capital of the Ashanti Region?","options":["Sunyani","Kumasi","Ho","Koforidua"],"answer":1,"why":"Kumasi is the regional capital."},{"q":"Ghana's flag colours from top to bottom?","options":["Red, gold, green","Green, white, red","Gold, red, blue","Red, white, green"],"answer":0,"why":"The horizontal bands are red, gold and green."},{"q":"Main purpose of voting in an election?","options":["Choose representatives","Appoint every judge","Write all laws alone","Replace the constitution"],"answer":0,"why":"Voting lets eligible citizens choose representatives."},{"q":"Which institution makes national laws in Ghana?","options":["Parliament","Police Service","Electoral Commission","Supreme Court"],"answer":0,"why":"Parliament is the national legislature."},{"q":"Which is a civic responsibility?","options":["Destroy public property","Obey lawful rules","Stop others voting","Ignore safety"],"answer":1,"why":"Responsible citizenship includes obeying laws."},{"q":"Capital of the Northern Region?","options":["Tamale","Bolgatanga","Wa","Damongo"],"answer":0,"why":"Tamale is the regional capital."},{"q":"Democracy broadly means…","options":["Rule by the people","Rule by one family","No laws","Military rule only"],"answer":0,"why":"People have a role in governing."}]},{"title":"Geography","questions":[{"q":"Largest continent by area?","options":["Africa","Europe","Asia","South America"],"answer":2,"why":"Asia is the largest continent."},{"q":"Line dividing Northern and Southern Hemispheres?","options":["Prime Meridian","Equator","Tropic of Cancer","Date Line"],"answer":1,"why":"The Equator is at 0° latitude."},{"q":"Molten rock beneath Earth's surface?","options":["Lava","Magma","Ash","Basalt"],"answer":1,"why":"Molten rock underground is magma."},{"q":"Instrument that records earthquake waves?","options":["Barometer","Seismograph","Anemometer","Hygrometer"],"answer":1,"why":"A seismograph records ground motion."},{"q":"Breaking down rocks in place is…","options":["Weathering","Condensation","Deposition only","Evaporation"],"answer":0,"why":"Weathering breaks down rock."},{"q":"Imaginary line at 0° longitude?","options":["Equator","Prime Meridian","Tropic of Capricorn","Arctic Circle"],"answer":1,"why":"The Prime Meridian is 0° longitude."},{"q":"Which is renewable energy?","options":["Coal","Natural gas","Solar energy","Petroleum"],"answer":2,"why":"Sunlight is naturally replenished."},{"q":"Movement of people from rural areas to cities?","options":["Urbanisation","Condensation","Erosion","Rotation"],"answer":0,"why":"Urbanisation describes growth in urban populations."},{"q":"Liquid layer surrounding Earth's inner core?","options":["Crust","Mantle","Outer core","Lithosphere"],"answer":2,"why":"The outer core is mainly liquid iron and nickel."},{"q":"Which instrument measures wind speed?","options":["Anemometer","Rain gauge","Thermometer","Barometer"],"answer":0,"why":"An anemometer measures wind speed."}]},{"title":"English Language","questions":[{"q":"Synonym for 'rapid'?","options":["Slow","Swift","Dull","Quiet"],"answer":1,"why":"Swift means fast."},{"q":"Choose the correct sentence.","options":["She go to school.","She goes to school.","She going school.","She gone every day."],"answer":1,"why":"Third-person singular uses 'goes'."},{"q":"Plural of 'analysis'?","options":["Analysises","Analyses","Analysis","Analysies"],"answer":1,"why":"The plural is analyses."},{"q":"Which word is an adjective in 'The bright lamp glowed'?","options":["The","bright","lamp","glowed"],"answer":1,"why":"Bright describes the noun lamp."},{"q":"Choose the correctly spelled word.","options":["Accomodation","Accommodation","Acommodation","Accommadation"],"answer":1,"why":"Accommodation has double c and double m."},{"q":"Punctuation that usually ends a direct question?","options":["Comma","Full stop","Question mark","Colon"],"answer":2,"why":"A direct question ends with a question mark."},{"q":"Which word is a conjunction?","options":["Quickly","Although","Blue","Teacher"],"answer":1,"why":"Although connects clauses."},{"q":"Past tense of 'teach'?","options":["Teached","Taught","Teaching","Taughted"],"answer":1,"why":"The past tense is taught."},{"q":"'The book was written by Ama' uses which voice?","options":["Active","Passive","Imperative","Interrogative"],"answer":1,"why":"The subject receives the action."},{"q":"Antonym of 'scarce'?","options":["Rare","Limited","Abundant","Few"],"answer":2,"why":"Abundant means plentiful."}]},{"title":"Computing and ICT","questions":[{"q":"What does RAM stand for?","options":["Random Access Memory","Read All Memory","Rapid Action Module","Run Access Machine"],"answer":0,"why":"RAM temporarily stores data used by active programs."},{"q":"Which is an operating system?","options":["Linux","HTML","USB","JPEG"],"answer":0,"why":"Linux is an operating system."},{"q":"HTML primarily defines…","options":["Webpage structure","Electric current","Image compression","Passwords"],"answer":0,"why":"HTML structures webpage content."},{"q":"Which device routes data between networks?","options":["Router","Keyboard","Monitor","Microphone"],"answer":0,"why":"Routers forward packets between networks."},{"q":"Which number system uses only 0 and 1?","options":["Decimal","Binary","Octal","Roman"],"answer":1,"why":"Binary is base 2."},{"q":"Phishing is…","options":["A cyber scam","A cooling method","A programming loop","A file format"],"answer":0,"why":"Phishing attempts to steal information or trick users."},{"q":"Which is good password practice?","options":["Reuse one password","Use a long unique password","Share it with friends","Use your first name"],"answer":1,"why":"Unique long passwords improve account security."},{"q":"What does URL stand for?","options":["Uniform Resource Locator","Universal RAM Link","User Routing Language","Unified Read Log"],"answer":0,"why":"A URL identifies a resource location."},{"q":"Which is an input device?","options":["Keyboard","Speaker","Projector","Printer"],"answer":0,"why":"A keyboard sends data into a computer."},{"q":"A backup is…","options":["An extra copy of data","Brightness setting","Malware","Browser tab"],"answer":0,"why":"Backups help recover lost data."}]},{"title":"Engineering and Electronics","questions":[{"q":"Unit of electrical resistance?","options":["Volt","Ampere","Ohm","Watt"],"answer":2,"why":"Resistance is measured in ohms."},{"q":"Which component stores electric charge?","options":["Capacitor","Resistor","Fuse","Switch"],"answer":0,"why":"A capacitor stores charge in an electric field."},{"q":"An LED…","options":["Emits light when powered correctly","Stores files","Measures mass","Amplifies sound mechanically"],"answer":0,"why":"A light-emitting diode produces light."},{"q":"In a simple series circuit, what is the same through every component?","options":["Current","Voltage","Resistance","Power"],"answer":0,"why":"The same current flows through series components."},{"q":"Which device measures voltage?","options":["Ammeter","Voltmeter","Compass","Thermometer"],"answer":1,"why":"A voltmeter measures potential difference."},{"q":"In industrial automation, PLC stands for…","options":["Programmable Logic Controller","Power Line Capacitor","Primary Light Circuit","Parallel Logic Cable"],"answer":0,"why":"PLCs control industrial processes."},{"q":"Which logic gate outputs 1 only when all inputs are 1?","options":["OR","AND","NOT","XOR"],"answer":1,"why":"An AND gate requires every input to be high."},{"q":"Purpose of a fuse?","options":["Protect from excessive current","Increase voltage forever","Store code","Measure temperature"],"answer":0,"why":"A fuse opens the circuit when current is too high."},{"q":"A ramp is which simple machine?","options":["Lever","Inclined plane","Pulley","Wheel and axle"],"answer":1,"why":"A ramp is an inclined plane."},{"q":"Which device converts mechanical energy into electrical energy?","options":["Generator","Motor","Resistor","Diode"],"answer":0,"why":"A generator produces electrical energy from mechanical input."}]},{"title":"Health and Environment","questions":[{"q":"Nutrient important for tissue growth and repair?","options":["Protein","Water only","Fibre only","Salt"],"answer":0,"why":"Proteins supply amino acids for growth and repair."},{"q":"Which practice helps prevent many infections?","options":["Handwashing with soap","Sharing cups","Ignoring clean water","Dirty hands on food"],"answer":0,"why":"Handwashing reduces transfer of germs."},{"q":"Gas humans need for aerobic respiration?","options":["Oxygen","Helium","Methane","Neon"],"answer":0,"why":"Cells use oxygen during aerobic respiration."},{"q":"Recycling aims to…","options":["Process materials for reuse","Increase dumping","Make materials toxic","Stop all manufacturing"],"answer":0,"why":"Recycling turns used materials into usable materials."},{"q":"Which is biodegradable?","options":["Banana peel","Glass bottle","Aluminium can","Plastic bag"],"answer":0,"why":"Microorganisms can break down banana peels."},{"q":"Electrical fire safety: what should you do?","options":["Pour water immediately","Keep clear and alert emergency services","Touch exposed wires","Hide it"],"answer":1,"why":"Water can conduct electricity; get trained help."},{"q":"Which vitamin can skin make with suitable sunlight?","options":["Vitamin A","Vitamin C","Vitamin D","Vitamin K only"],"answer":2,"why":"UVB exposure enables vitamin D production."},{"q":"Dehydration is…","options":["Excess loss of body water","Too much oxygen","Bone growth","Protein digestion"],"answer":0,"why":"It occurs when fluid loss exceeds intake."},{"q":"Which action conserves water?","options":["Repair leaking taps","Leave taps running","Hose pavements for hours","Ignore leaks"],"answer":0,"why":"Fixing leaks prevents water loss."},{"q":"Compost is commonly made from…","options":["Organic waste","Only glass","Metal scraps","Plastic wrappers"],"answer":0,"why":"Compost forms from decomposed organic materials."}]},{"title":"History and Culture","questions":[{"q":"Which civilisation built the pyramids at Giza?","options":["Ancient Egypt","Ancient Rome","Maya","Viking kingdoms"],"answer":0,"why":"The Giza pyramids were built in ancient Egypt."},{"q":"Which organisation formed in 1945 to promote international cooperation?","options":["United Nations","ECOWAS","NATO alone","Commonwealth only"],"answer":0,"why":"The United Nations was established in 1945."},{"q":"Where were the ancient Olympic Games held?","options":["Olympia","Carthage","Sparta only","Rome"],"answer":0,"why":"The ancient games were held at Olympia in Greece."},{"q":"The ancient Mali Empire developed in which continent?","options":["Africa","Europe","Australia","South America"],"answer":0,"why":"It developed in West Africa."},{"q":"Oral tradition is…","options":["Knowledge passed through spoken stories and practices","A printed timetable","A machine","A written exam only"],"answer":0,"why":"Oral traditions transmit history and culture through speech."},{"q":"A drum belongs to which instrument family?","options":["Percussion","Strings","Woodwind","Brass"],"answer":0,"why":"Drums produce sound through struck surfaces."},{"q":"What is an artefact in history?","options":["An object made or used by people","A forecast","An element only","A password"],"answer":0,"why":"Artefacts provide evidence about past human life."},{"q":"Why compare multiple historical sources?","options":["To check evidence and differing accounts","To avoid evidence","All sources are always correct","To replace dates with guesses"],"answer":0,"why":"Cross-checking helps assess reliability and perspective."},{"q":"Which trade routes crossed the Sahara?","options":["Trans-Saharan routes","Panama Canal","Pacific Silk Route","Northwest Passage"],"answer":0,"why":"They linked West Africa with North Africa and beyond."},{"q":"What can a historical primary source provide?","options":["Evidence from the period studied","Guaranteed complete truth","Only future predictions","No useful information"],"answer":0,"why":"Primary sources offer direct evidence but still need interpretation."}]},{"title":"Logic and Problem Solving","questions":[{"q":"Next number: 2, 4, 8, 16, …","options":["18","24","30","32"],"answer":3,"why":"Each term is doubled."},{"q":"All Zips are Zaps; all Zaps are Zops. What must be true?","options":["All Zips are Zops","No Zips are Zops","All Zops are Zips","No Zaps are Zips"],"answer":0,"why":"The relationship is transitive."},{"q":"Which number is not prime: 3, 5, 7, 10, 11?","options":["3","5","7","10"],"answer":3,"why":"10 has factors other than 1 and itself."},{"q":"Three books cost GH₵12 each. Total?","options":["GH₵24","GH₵30","GH₵36","GH₵40"],"answer":2,"why":"3 × 12 = 36."},{"q":"If yesterday was Monday, what day is tomorrow?","options":["Tuesday","Wednesday","Thursday","Sunday"],"answer":1,"why":"Today is Tuesday, so tomorrow is Wednesday."},{"q":"Complete: A, C, E, G, …","options":["H","I","J","K"],"answer":1,"why":"The sequence skips one letter each time."},{"q":"18 girls and 12 boys are in a class. Total?","options":["26","28","30","32"],"answer":2,"why":"18 + 12 = 30."},{"q":"Which is the odd one out?","options":["Triangle","Square","Circle","Kilogram"],"answer":3,"why":"Kilogram is a unit of mass, not a shape."},{"q":"If 5 machines make 5 items in 5 minutes, how long for 10 machines to make 10 items?","options":["5 minutes","10 minutes","15 minutes","50 minutes"],"answer":0,"why":"Each machine makes one item in five minutes."},{"q":"An integer greater than 6 and less than 9 is…","options":["5","6","7","9"],"answer":2,"why":"7 is between 6 and 9."}]},{"title":"Business and Financial Literacy","questions":[{"q":"A budget is…","options":["A plan for income and spending","A bank password","A tax only","A receipt printer"],"answer":0,"why":"A budget helps plan and track money."},{"q":"Profit is…","options":["Revenue minus costs","Costs plus debt","Money borrowed","All sales before expenses"],"answer":0,"why":"Profit remains after costs are deducted."},{"q":"Which is an example of saving?","options":["Keeping part of income for later","Spending all income","Borrowing for every want","Ignoring expenses"],"answer":0,"why":"Saving reserves money for future needs."},{"q":"An entrepreneur typically…","options":["Organises a venture and takes business risks","Only shops for personal use","Sets every law","Avoids all decisions"],"answer":0,"why":"Entrepreneurs organise resources to create goods or services."},{"q":"Interest on savings is…","options":["A return paid on deposited funds","A building cost","A password reset","A receipt"],"answer":0,"why":"Interest is a return, subject to account terms."},{"q":"Why compare prices before buying?","options":["To evaluate value and total cost","To assume products are identical","To ignore quality","To spend more"],"answer":0,"why":"Compare prices alongside quality and needs."},{"q":"Which is a basic need?","options":["Food","Luxury console","Designer decoration","Premium headphones"],"answer":0,"why":"Food is a basic necessity."},{"q":"A warning sign of a scam is…","options":["Pressure to pay quickly for huge guaranteed returns","Verifiable terms","An itemised receipt","Time to compare"],"answer":0,"why":"Urgency and unrealistic returns are common warning signs."},{"q":"Revenue means…","options":["Income from sales before costs","Profit after all expenses","Tax only","A wish list"],"answer":0,"why":"Revenue is generated by sales or services."},{"q":"Diversification means…","options":["Spreading exposure across different assets","Putting everything in one asset","Borrowing without a plan","Guaranteeing profit"],"answer":0,"why":"It can reduce concentration risk but cannot eliminate risk."}]},{"title":"Mixed Challenge","questions":[{"q":"Which planet is closest to the Sun?","options":["Venus","Mercury","Earth","Mars"],"answer":1,"why":"Mercury is the innermost planet."},{"q":"What is 9 × 8?","options":["63","72","81","89"],"answer":1,"why":"9 multiplied by 8 equals 72."},{"q":"Which computer part displays visual output?","options":["Monitor","Mouse","Keyboard","Microphone"],"answer":0,"why":"A monitor displays visual information."},{"q":"Which force attracts objects toward Earth?","options":["Magnetism only","Gravity","Friction only","Tension only"],"answer":1,"why":"Gravity attracts objects with mass."},{"q":"Cape Coast is the capital of which Ghanaian region?","options":["Central","Western","Volta","Upper East"],"answer":0,"why":"Cape Coast is the Central Regional capital."},{"q":"Main function of roots in most plants?","options":["Absorb water and anchor plant","Make seeds only","Attract pollinators only","Release sound"],"answer":0,"why":"Roots anchor plants and absorb water and minerals."},{"q":"Common file extension for JavaScript?","options":[" .js",".jpg",".mp3",".xlsx"],"answer":0,"why":"JavaScript files commonly use .js."},{"q":"3/4 expressed as a percentage is…","options":["25%","50%","75%","80%"],"answer":2,"why":"3 ÷ 4 × 100 = 75%."},{"q":"Which instrument measures temperature?","options":["Thermometer","Ammeter","Barometer","Anemometer"],"answer":0,"why":"A thermometer measures temperature."},{"q":"Before sharing a news claim, you should…","options":["Check reliable sources and context","Share immediately","Trust every headline","Remove its source"],"answer":0,"why":"Verification helps limit misinformation."}]}];
const STUDENT_QUIZ_QUESTIONS=STUDENT_QUIZ_SETS.flatMap(s=>s.questions);


function renderLocalGame(){
  const game=S.game;
  const titles={quiz:'Student Quiz',rps:'Rock Paper Scissors',guess:'Number Guess',scramble:'Word Scramble'};
  let html='<div class="head"><button type="button" class="btn btn-secondary" id="games-back">← Games</button><h1 class="title">'+titles[game]+'</h1></div>';
  if(game==='quiz'){
    if(!S.quizState)S.quizState={setIndex:null,index:0,score:0,selected:null,finished:false};
    const st=S.quizState;
    if(st.setIndex===null){
      html+='<div class="card"><p>Choose a set of 10 questions. Practise different subjects and track your score in each set.</p><div class="quiz-set-grid">'+STUDENT_QUIZ_SETS.map((set,i)=>'<button type="button" class="btn btn-secondary quiz-set-card" data-quiz-set="'+i+'"><span class="quiz-set-number">SET '+String(i+1).padStart(2,'0')+'</span><b>'+esc(set.title)+'</b><span class="tiny">10 questions</span></button>').join('')+'</div></div>';
      $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');
      $$('[data-quiz-set]').forEach(b=>b.onclick=()=>{S.quizState={setIndex:Number(b.dataset.quizSet),index:0,score:0,selected:null,finished:false};renderLocalGame()});return;
    }
    const activeSet=STUDENT_QUIZ_SETS[st.setIndex],questions=activeSet.questions;
    if(st.finished||st.index>=questions.length){
      html+='<div class="card quiz-result"><p class="eyebrow">SET '+String(st.setIndex+1).padStart(2,'0')+' COMPLETE</p><h2>'+esc(activeSet.title)+'</h2><p class="quiz-result-score">'+st.score+' <span>/ 10</span></p><p>'+(st.score>=9?'Outstanding work!':st.score>=7?'Great job — keep building on it.':st.score>=5?'Good effort. Review the explanations and try again.':'Keep practising and try again.')+'</p><div class="quiz-result-actions"><button type="button" class="btn" id="quiz-restart">Retry this set</button><button type="button" class="btn btn-secondary" id="quiz-sets">All sets</button>'+(st.setIndex<STUDENT_QUIZ_SETS.length-1?'<button type="button" class="btn btn-secondary" id="quiz-next-set">Next set →</button>':'')+'</div></div>';
      $('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');
      $('#quiz-restart').onclick=()=>{S.quizState={setIndex:st.setIndex,index:0,score:0,selected:null,finished:false};renderLocalGame()};
      $('#quiz-sets').onclick=()=>{S.quizState={setIndex:null,index:0,score:0,selected:null,finished:false};renderLocalGame()};
      const ns=$('#quiz-next-set');if(ns)ns.onclick=()=>{S.quizState={setIndex:st.setIndex+1,index:0,score:0,selected:null,finished:false};renderLocalGame()};return;
    }
    const q=questions[st.index];
    html+='<div class="card quiz-question-card"><div class="quiz-topline"><button type="button" class="btn btn-secondary" id="quiz-sets">← All sets</button><span class="quiz-set-pill">SET '+String(st.setIndex+1).padStart(2,'0')+' · '+esc(activeSet.title)+'</span></div><p class="tiny">Question '+(st.index+1)+' of 10 · Score: '+st.score+'</p><div class="quiz-progress"><div style="width:'+((st.index+(st.selected!==null?1:0))*10)+'%"></div></div><h2 class="quiz-question-title">'+esc(q.q)+'</h2><div class="quiz-options">'+q.options.map((option,i)=>'<button type="button" class="btn '+(st.selected===i?'':'btn-secondary')+' quiz-answer" data-quiz-answer="'+i+'" '+(st.selected!==null?'disabled':'')+'><span class="quiz-option-letter">'+String.fromCharCode(65+i)+'</span><span>'+esc(option)+'</span></button>').join('')+'</div>';
    if(st.selected!==null)html+='<div class="quiz-explanation"><b>'+(st.selected===q.answer?'Correct!':'Not quite.')+'</b> '+esc(q.why)+'</div><button type="button" class="btn" id="quiz-next">'+(st.index===9?'See set results':'Next question →')+'</button>';
    html+='</div>';$('#main').innerHTML=html;$('#games-back').onclick=()=>setView('games');
    $('#quiz-sets').onclick=()=>{S.quizState={setIndex:null,index:0,score:0,selected:null,finished:false};renderLocalGame()};
    $$('[data-quiz-answer]').forEach(btn=>btn.onclick=()=>{if(st.selected!==null)return;st.selected=Number(btn.dataset.quizAnswer);if(st.selected===q.answer)st.score++;renderLocalGame()});
    const next=$('#quiz-next');if(next)next.onclick=()=>{st.index++;st.selected=null;if(st.index>=questions.length)st.finished=true;renderLocalGame()};return;
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
 '<section class="profile-hero card"><div>'+profileAvatarMarkup(p.nickname,p.avatar_url,'avatar profile-public-avatar')+'</div><div class="profile-hero-copy"><h2>'+esc(p.nickname||'Student')+'</h2><div class="profile-school-line">🎓 '+esc(p.school||'School not provided')+'</div><p class="profile-public-bio">'+esc(p.bio||'This student has not added a bio yet.')+'</p>'+(p.class_year?'<div class="tiny">Class / year: '+esc(p.class_year)+'</div>':'')+'</div></section>'+
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
 $('#pf').onsubmit=async e=>{e.preventDefault();const n=$('#pn').value.trim(),schoolName=canonicalVerifiedSchoolName($('#ps').value.trim());if(n.length<3||n.length>24){toast('Nickname must be 3–24 characters.');return}if(!schoolName){toast('Please choose your school.');$('#ps').focus();return}const save=$('#save-profile'),extra={bio:$('#pbio').value.trim(),year:$('#pyear').value,interests:$('#pinterests').value.trim()};save.disabled=true;save.textContent='Saving…';try{const {error}=await db.from('profiles').update({nickname:n,school:schoolName,bio:extra.bio,class_year:extra.year,interests:extra.interests}).eq('id',S.session.user.id);if(error)throw error;localStorage.setItem(profileDraftKey(),JSON.stringify(extra));await loadProfile();toast('Profile saved.');viewProfile()}catch(err){console.error(err);toast('Could not save your profile. Check the nickname and try again.');save.disabled=false;save.textContent='Save profile'}};
 $('#delete-profile')?.addEventListener('click',async()=>{if(!window.confirm('Hide your profile and posts? You can restore them later by signing in again.'))return;const button=$('#delete-profile');button.disabled=true;button.textContent='Hiding profile…';const {error}=await db.from('profiles').update({deleted_at:new Date().toISOString()}).eq('id',S.session.user.id);if(error){console.error(error);toast('Could not hide your profile. Please try again.');button.disabled=false;button.textContent='Delete profile';return}await db.auth.signOut();S.session=null;renderAuth('login','Your profile is hidden. Log in again to restore it.');});
}
function profileAvatarMarkup(name,photo,className='profile-avatar'){return photo?'<span class="'+className+' has-photo"><img src="'+esc(photo)+'" alt="Profile photo" loading="lazy" /></span>':'<span class="'+className+'">'+initials(name||'Student')+'</span>'}
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
}async function viewSchools(){let {data,error}=await db.from('profiles').select('school').not('school','is',null).neq('school','').order('school').limit(1000);if(error)throw error;let c={};(data||[]).forEach(p=>{const name=canonicalSchoolName((p.school||'').trim());const key=schoolKey(name);if(key){if(!c[key])c[key]={name,count:0};c[key].count++}});let top=Object.values(c).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name)).slice(0,5);const cards=top.map(({name,count})=>'<button type="button" class="card trending-school" data-school="'+esc(name)+'"><b>'+esc(name)+'</b><span class="tiny">'+count+' students</span></button>').join('')||'<p class="tiny">Schools will appear as students join.</p>';const desktop=$('#trending'),mobile=$('#trending-mobile');if(desktop)desktop.innerHTML=cards;if(mobile)mobile.innerHTML=cards;}async function viewSchoolStudents(school){const chosen=canonicalSchoolName(school||'');if(!chosen){S.view='feed';await renderView();return}$('#main').innerHTML='<div class="card">Loading students from '+esc(chosen)+'…</div>';const {data,error}=await db.from('profiles').select('id,nickname,school').not('school','is',null).neq('school','').order('nickname').limit(2000);if(error)throw error;const people=(data||[]).filter(p=>schoolKey(canonicalSchoolName(p.school||''))===schoolKey(chosen));let html='<div class="head"><button type="button" class="btn btn-secondary" id="back-to-feed">← Back</button><h1 class="title" style="margin-top:12px">'+esc(chosen)+'</h1><span class="tiny">'+people.length+' student'+(people.length===1?'':'s')+'</span></div>';if(!people.length)html+='<div class="card">No other students from this school have joined yet.</div>';else html+=people.map(p=>'<div class="card school-student"><div class="school-student-info"><span class="avatar">'+initials(p.nickname)+'</span><div><b>'+esc(p.nickname)+(p.id===S.session.user.id?' (You)':'')+'</b><div class="tiny">'+esc(p.school||chosen)+'</div></div></div>'+(p.id===S.session.user.id?'<span class="tiny">Your profile</span>':'<button type="button" class="btn" data-add="'+p.id+'">Add friend</button>')+'</div>').join('');$('#main').innerHTML=html;$('#back-to-feed').onclick=()=>setView('feed');wireActions();}async function addFriend(id){if(id===S.session.user.id)return;const {error}=await db.from('friendships').insert({user_id:S.session.user.id,friend_id:id,status:'pending'});if(error){toast(error.code==='23505'?'A request already exists.':error.message);return}toast('Friend request sent.');renderView()}
async function acceptFriend(id){const {error}=await db.from('friendships').update({status:'accepted'}).eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}toast('Friend request accepted.');renderView()}
async function declineFriend(id){const {error}=await db.from('friendships').delete().eq('user_id',id).eq('friend_id',S.session.user.id).eq('status','pending');if(error){toast(error.message);return}renderView()}
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
function syncNavigationState(){ document.querySelectorAll('[data-view]').forEach(link=>{const selected=link.dataset.view===S.view||(S.view==='game'&&link.dataset.view==='games');link.classList.toggle('active',selected);link.setAttribute('aria-current',selected?'page':'false');link.setAttribute('aria-pressed',String(selected));});const layout=document.querySelector('.layout');if(layout){layout.classList.toggle('messages-mode',S.view==='messages');if(S.view!=='messages')layout.classList.remove('messages-chat-open')}document.querySelector('.trending-mobile-wrap')?.classList.toggle('messages-view',S.view==='messages'); }
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
document.addEventListener('click',e=>{if(e.target.closest('#theme-toggle')){applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');return}const publicProfile=e.target.closest('[data-public-profile]');if(publicProfile){e.preventDefault();openPublicProfile(publicProfile.dataset.publicProfile);return}if(e.target.closest('[data-public-back]')){setView('friends');return}const sr=$('#search-results');if(sr&&!e.target.closest('.search-wrap'))sr.hidden=true;const school=e.target.closest('[data-school]');if(school){e.preventDefault();S.schoolFilter=school.dataset.school;S.view='school';syncNavigationState();if(sr)sr.hidden=true;renderView();return}const messageShortcut=e.target.closest('#messages-shortcut');if(messageShortcut){e.preventDefault();setView('messages');return}let v=e.target.closest('[data-view]');if(v){e.preventDefault();setView(v.dataset.view);return}let add=e.target.closest('[data-search-add]');if(add){addFriend(add.dataset.searchAdd).catch(error=>{console.error(error);toast('Could not send the friend request. Please try again.')});if(sr)sr.hidden=true}});
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
// Last-resort diagnostics for unexpected errors. Feature-level handlers should catch expected failures first.
window.addEventListener('unhandledrejection',event=>{
  console.error('Unhandled StudentLink async error:',event.reason);
});
window.addEventListener('error',event=>{
  console.error('Unexpected StudentLink runtime error:',event.error||event.message);
});

startStudentLink();
