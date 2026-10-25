// Configure these two values from your own Supabase project. Never use a service-role key here.
const SUPABASE_URL='https://fpdcetkvxdryogtvldax.supabase.co';const SUPABASE_ANON_KEY='sb_publishable_HMzJqdTbufV4vvJ6QyWl5A_-0PPa0Rs';
const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_URL.includes('YOUR_')&&!SUPABASE_ANON_KEY.includes('YOUR_');const db=configured&&window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let activeStatusUserIds=new Set();
function safeSessionGet(key){try{return window.sessionStorage.getItem(key)}catch(_){return null}}function safeSessionSet(key,value){try{window.sessionStorage.setItem(key,value);return true}catch(_){return false}}function safeSessionRemove(key){try{window.sessionStorage.removeItem(key)}catch(_){}}const S={session:null,profile:null,schools:[],schoolVariants:[],view:'feed',publicProfileId:null,schoolFilter:'',feedMode:'all',feedOrderIds:[],feedOrderMode:'',friends:[],requests:[],convos:[],chat:null,replyOnOpen:false,channel:null,tttChannel:null,tttGameId:null,onlineGameChannel:null,cfGameId:null,rpsGameId:null,rpsMode:'computer',game:'',ttt:Array(9).fill(0),notifiedMessageIds:new Set(),notifiedFriendshipIds:new Set(),messageReadAt:{},schoolStatsCache:null,schoolStatsLoadedAt:0,schoolStatsPromise:null,};
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function initials(s='S'){return esc(s.trim().split(/\s+/).slice(0,2).map(x=>x[0].toUpperCase()).join(''))}
function makeRandomId(){if(window.crypto&&typeof window.crypto.randomUUID==='function')return window.crypto.randomUUID();const bytes=new Uint8Array(16);if(window.crypto&&typeof window.crypto.getRandomValues==='function')window.crypto.getRandomValues(bytes);else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const h=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)}
function schoolKey(s=''){
  return String(s??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en')
    .replace(/&/g,' and ')
    // Common keyboard/OCR typo: lowercase l entered in place of capital I in "Institute".
    .replace(/\blnstitute\b/g,'institute')
    .replace(/\b(senior\s+high\s*\/\s*technical|senior\s+high\s*\/\s*tech|senior\s+high\s+technical|shts|shst|shst\.?|senior high tech)\b/g,' shts ')
    .replace(/\b(technical\s+institute|tech\.?\s+inst\.?|tech\.?\s+institute)\b/g,' techinst ')
    .replace(/\b(snr\.?\s*high|senior\s+high(?:\s+school)?|s\.?h\.?s\.?)\b/g,' shs ')
    .replace(/\b(shs|shts)\s+school\b/g,' $1 ')
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
  "Nkroful Agricultural Senior High School",
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
  "Fiaseman Senior High School",
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
  'presby senior high school legon':"Presbyterian Boys' Senior High School, Legon",
  'presby shs legon':"Presbyterian Boys' Senior High School, Legon",
  'presec boys':"Presbyterian Boys' Senior High School, Legon",
  'opoku ware school kumasi':'Opoku Ware School',
  'kumasihigh':'Kumasi High School',
  'kumasi high shs':'Kumasi High School',
  'st thomas aquinas':'St. Thomas Aquinas Senior High School',
  'st thomas aquinas shs':'St. Thomas Aquinas Senior High School',
  'tema secondary':'Tema Senior High School',
  'tamale secondary':'Tamale Senior High School',
  'prempeh college kumasi':'Prempeh College'
};
const SCHOOL_ALIAS_KEYS=new Map(Object.entries(SCHOOL_ALIASES).map(([alias,canonical])=>[schoolKey(alias),canonical]));
// Correct an obvious mistaken profile label to the canonical Abor Senior High entry.
SCHOOL_ALIAS_KEYS.set(schoolKey('A or senior high school'),'Abor Senior High');
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
  const schoolType=value=>{const candidateKey=schoolKey(value);return /\bshts\b/.test(candidateKey)?'shts':/\bshs\b/.test(candidateKey)?'shs':/\btechinst\b/.test(candidateKey)?'techinst':''};
  const inputType=schoolType(name);
  const scores=VERIFIED_GHANA_SHS_TVET.map(candidate=>{
    const candidateType=schoolType(candidate);
    return {name:candidate,score:inputType&&candidateType&&inputType!==candidateType?0:schoolSimilarity(key,candidate)};
  }).sort((a,b)=>b.score-a.score);
  if(!scores.length||scores[0].score<0.91)return '';
  if(scores[1]&&scores[0].score-scores[1].score<0.045)return '';
  return scores[0].name;
}
function canonicalVerifiedSchoolName(name=''){
  const original=String(name??'').trim().replace(/\s+/g,' ');
  if(!original)return '';
  return verifiedSchoolMatch(original)||original;
}

function installCanonicalSchoolDirectory(names){
  const canonicalNames=[...new Set((names||[]).map(n=>String(n||'').trim()).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'}));
  if(canonicalNames.length<500)return false;
  const legacyNames=[...VERIFIED_GHANA_SHS_TVET];
  const schoolType=value=>{
    const key=schoolKey(value);
    return /\bshts\b/.test(key)?'shts':/\bshs\b/.test(key)?'shs':/\btechinst\b/.test(key)?'techinst':'';
  };
  const core=value=>schoolKey(String(value||'').replace(/\([^)]*\)/g,' '))
    .replace(/\b(shts|shs|techinst|senior|high|technical|institute|school|college|academy|secondary|presec|of|the|and|for|centre|center|accra|kumasi|tamale|koforidua|cape|coast|sekondi|takoradi|navrongo|mankessim|bekwai|suhum|aburi|legon|obuasi|ejisu|fiapre|sunyani|dunkwa|nkwatia|mampong|asokwa|hohoe|abusco|an seco|ghanass|ghanasco|ketasco|kp ansec|k stys|big boss|owass)\b/g,' ')
    .replace(/\s+/g,' ').trim();
  const candidatesFor=value=>{
    const inputType=schoolType(value),inputCore=core(value),a=schoolKey(value);
    const locationWords=['accra','kumasi','tamale','koforidua','cape coast','sekondi','takoradi','navrongo','mankessim','bekwai','suhum','aburi','legon','obuasi','ejisu','fiapre','sun y ani','sunyani','dunkwa','nkwatia','akw atia','mampong','asokwa','hohoe'];
    const hasWord=(key,word)=>(' '+key+' ').includes(' '+word+' ');
    const inputFirst=a.split(' ')[0],coreFirst=inputCore.split(' ')[0];
    const likely=canonicalNames.filter(name=>{
      const key=schoolKey(name),candidateCore=core(name);
      return key.split(' ')[0]===inputFirst||candidateCore.split(' ')[0]===coreFirst;
    });
    const searchNames=likely.length?likely:canonicalNames;
    const scored=searchNames.map(name=>{
      const candidateType=schoolType(name),b=schoolKey(name);
      if(inputType&&candidateType&&inputType!==candidateType)return {name,score:0};
      const inputLocations=locationWords.filter(w=>hasWord(a,w));
      const candidateLocations=locationWords.filter(w=>hasWord(b,w));
      const locationMismatch=inputLocations.length>0&&candidateLocations.length>0&&!inputLocations.some(w=>candidateLocations.includes(w));
      if(locationMismatch)return {name,score:0};
      const candidateCore=core(name);
      const coreScore=inputCore&&candidateCore?schoolSimilarity(inputCore,candidateCore):0;
      const fullScore=schoolSimilarity(value,name);
      const score=Math.max(fullScore,coreScore*.94);
      return {name,score};
    }).sort((x,y)=>y.score-x.score);
    if(!scored.length||scored[0].score<0.86||(scored[1]&&scored[0].score-scored[1].score<0.08))return '';
    return scored[0].name;
  };
  VERIFIED_GHANA_SHS_TVET.splice(0,VERIFIED_GHANA_SHS_TVET.length,...canonicalNames);
  const aliases=[];
  for(const [alias,target] of Object.entries(SCHOOL_ALIASES)){
    const exact=canonicalNames.find(n=>schoolKey(n)===schoolKey(target));
    aliases.push([alias,exact||candidatesFor(target)||target]);
  }
  for(const oldName of legacyNames){
    const exact=canonicalNames.find(n=>schoolKey(n)===schoolKey(oldName));
    const match=exact||candidatesFor(oldName);
    if(match)aliases.push([oldName,match]);
  }
  SCHOOL_ALIAS_KEYS.clear();
  for(const [alias,target] of aliases){
    if(canonicalNames.some(n=>schoolKey(n)===schoolKey(target)))SCHOOL_ALIAS_KEYS.set(schoolKey(alias),target);
  }
  // Reapply this observed typo alias after rebuilding the directory-backed map.
  const aborCanonical=canonicalNames.find(n=>schoolKey(n)===schoolKey('Abor Senior High'));
  if(aborCanonical)SCHOOL_ALIAS_KEYS.set(schoolKey('A or senior high school'),aborCanonical);
  return true;
}
async function loadCanonicalSchoolDirectory(){
  try{
    const response=await fetch(new URL('data/ghana-shs-master.json',document.baseURI),{cache:'no-store'});
    if(!response.ok)throw new Error('Directory request returned '+response.status);
    const payload=await response.json();
    if(!Array.isArray(payload.schools))throw new Error('Directory file has no school list');
    const loaded=installCanonicalSchoolDirectory(payload.schools.map(s=>typeof s==='string'?s:s?.name));
    if(!loaded)throw new Error('Directory did not contain enough school names');
  }catch(error){
    console.warn('StudentLink school directory could not be refreshed; using the built-in fallback list.',error);
  }
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

function canonicalSchoolName(s=''){
  const original=String(s??'').trim().replace(/\s+/g,' ');
  if(!original)return '';
  const key=schoolKey(original);
  const typeOf=value=>{const k=schoolKey(value);return /\bshts\b/.test(k)?'shts':/\bshs\b/.test(k)?'shs':/\btechinst\b/.test(k)?'techinst':''};
  const locationWords=['accra','kumasi','tamale','koforidua','cape coast','sekondi','takoradi','navrongo','mankessim','bekwai','suhum','aburi','legon','obuasi','ejisu','fiapre','sunyani','dunkwa','nkwatia','mampong','asokwa','hohoe'];
  const hasLocation=value=>locationWords.filter(word=>(' '+schoolKey(value)+' ').includes(' '+word+' '));
  const inputType=typeOf(original),inputLocations=hasLocation(original);
  const observed=Array.from(new Set([original,...(S.schoolVariants||[]).map(value=>String(value||'').trim()).filter(Boolean)]));
  const candidates=observed.map(value=>{
    const candidateType=typeOf(value),candidateLocations=hasLocation(value);
    if(inputType&&candidateType&&inputType!==candidateType)return {value,score:0};
    if(inputLocations.length&&candidateLocations.length&&!inputLocations.some(location=>candidateLocations.includes(location)))return {value,score:0};
    return {value,score:schoolSimilarity(original,value)};
  }).filter(item=>item.score>=0.88).sort((a,b)=>b.score-a.score||schoolKey(a.value).localeCompare(schoolKey(b.value),'en')||a.value.localeCompare(b.value,'en'));
  if(candidates.length){
    const otherMatches=candidates.filter(item=>schoolKey(item.value)!==key).sort((a,b)=>b.score-a.score);
    const ambiguous=otherMatches.length>1&&otherMatches[1].score>=otherMatches[0].score-0.035;
    if(otherMatches.length&&!ambiguous){
      const cluster=[original,...otherMatches.map(item=>item.value)];
      const canonicalDirectoryName=cluster.map(value=>VERIFIED_GHANA_SHS_TVET.find(name=>schoolKey(name)===schoolKey(value))).find(Boolean);
      if(canonicalDirectoryName)return canonicalDirectoryName;
      const representative=cluster.sort((a,b)=>schoolKey(a).localeCompare(schoolKey(b),'en')||a.localeCompare(b,'en'))[0];
      const representativeKey=schoolKey(representative);
      return SCHOOL_ALIAS_KEYS.get(representativeKey)||representative;
    }
  }
  // Exact directory names and explicit aliases are resolved after observed-profile clustering.
  // This lets an exact directory spelling group with a student's older near-identical profile value.
  const exact=VERIFIED_GHANA_SHS_TVET.find(name=>schoolKey(name)===key);
  if(exact)return exact;
  const explicitAlias=SCHOOL_ALIAS_KEYS.get(key);
  if(explicitAlias){
    const target=VERIFIED_GHANA_SHS_TVET.find(name=>schoolKey(name)===schoolKey(explicitAlias));
    if(target)return target;
  }
  return verifiedSchoolMatch(original)||original;
}
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
function nav(v,ico,label){const selected=S.view===v||(S.view==='game'&&v==='games');const badge=v==='messages'?'<span class="nav-unread-badge" data-message-nav-badge hidden>0</span>':v==='feed'?'<span class="nav-unread-badge" data-home-unread-badge hidden>0</span>':'';return `<button type="button" class="navitem ${selected?'active':''}" data-view="${v}" aria-current="${selected?'page':'false'}" aria-pressed="${selected}"><span aria-hidden="true">${ico}</span><span>${label}</span>${badge}</button>`}function shell(){return `<header class="header"><div style="display:flex;gap:16px;flex:1;align-items:center"><button type="button" class="header-brand-home" id="header-brand-home" aria-label="Go to Feed">StudentLink</button><div class="search-wrap"><input type="text" class="search" id="search" placeholder="Search students or schools…"><div id="search-results" class="search-results" hidden></div></div></div><div style="display:flex;align-items:center;gap:8px"><button class="btn btn-secondary" id="install-app" type="button">Install app</button><button class="btn btn-secondary" id="theme-toggle" type="button" aria-label="Switch color theme">☀️ Light</button></div></header><section class="trending-mobile-wrap"><h3>Trending schools</h3><div id="trending-mobile" class="trending-mobile"></div></section><div class="layout"><div class="leftside">${nav('feed','📰','Feed')}${nav('friends','👥','Friends')}${nav('messages','💬','Messages')}${nav('games','🎮','Games')}${nav('profile','👤','Profile')}${nav('suggestions','💡','Feedback')}</div><div class="main" id="main"></div><aside class="rightside"><h3 style="margin:0 0 16px 0">Trending schools</h3><div id="trending"></div></aside></div>`}
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
async function boot(directoryReady){if(!db){renderAuth('signup',!configured?'Setup needed: create a Supabase project, run supabase_schema.sql, and replace the two configuration values in assets/app.js.':!window.supabase?'StudentLink could not load its sign-in library. Check your connection and reload the page. If this continues, try another network.':'StudentLink could not initialize its sign-in service. Reload the page and try again.');return}const resetRequested=new URLSearchParams(window.location.search).get('reset-password')==='1';let {data:{session},error}=await db.auth.getSession();if(resetRequested){renderPasswordReset(error?'Could not validate the reset session. Request a new reset link.':'');return}if(error||!session){renderAuth();return}S.session=session;await loadProfile();const pendingGoogleProfileKey='studentlink-google-signup-profile';const pendingGoogleProfileRaw=safeSessionGet(pendingGoogleProfileKey);if(pendingGoogleProfileRaw){safeSessionRemove(pendingGoogleProfileKey);try{const pending=JSON.parse(pendingGoogleProfileRaw);if(Date.now()-Number(pending.createdAt)<10*60*1000&&S.profile?.school===''&&String(S.profile?.nickname||'').startsWith('Student_')&&pending.nickname&&pending.school){const {error:profileError}=await db.from('profiles').update({nickname:pending.nickname,school:pending.school}).eq('id',S.session.user.id);if(profileError)throw profileError;await loadProfile()}}catch(profileError){console.warn('Google signup profile details could not be saved:',profileError);toast('Google sign-in worked, but your profile details could not be saved. You can update them from Profile.')}}if(S.profile?.deleted_at){renderDeletedProfile();return}$('#app').innerHTML=shell();setupInstallControl();const invite=location.hash.match(/^#(ttt|cf|rps)=([0-9a-f-]{36})$/i);if(invite){S.view='game';if(invite[1].toLowerCase()==='ttt'){S.game='ttt';S.tttGameId=invite[2]}else if(invite[1].toLowerCase()==='cf'){S.game='connect';S.cfGameId=invite[2]}else{S.game='rps';S.rpsMode='online';S.rpsGameId=invite[2]}}const pushParams=new URLSearchParams(location.search);if(pushParams.get('openMessages')==='1'){S.view='messages';S.chat=pushParams.get('conversation')||null;S.replyOnOpen=pushParams.get('reply')==='1';}else if(pushParams.get('openFriends')==='1'){S.view='friends';}else if(/^[0-9a-f-]{36}$/i.test(pushParams.get('openProfile')||'')){S.view='public-profile';S.publicProfileId=pushParams.get('openProfile');}setupNotificationControl();setupNotificationHistoryControl();setUpRealtime();loadConvos().catch(error=>console.warn('Unread message counts are unavailable:',error));startUnreadBadgeSync();renderView();wireActions();const search=$('#search'),results=$('#search-results');let searchTimer;if(search&&results){search.oninput=()=>{clearTimeout(searchTimer);const term=search.value.trim();if(term.length<2){results.hidden=true;results.innerHTML='';return}searchTimer=setTimeout(async()=>{const safeTerm=term.replace(/[^\p{L}\p{N} '\-]/gu,'').trim();if(!safeTerm){results.hidden=true;results.innerHTML='';return}const [studentResult,schoolResult]=await Promise.all([db.from('profiles').select('id,nickname,school,avatar_url').neq('id',S.session.user.id).or('nickname.ilike.%'+safeTerm+'%,school.ilike.%'+safeTerm+'%').order('nickname').limit(20),db.from('profiles').select('school').not('school','is',null).ilike('school','%'+safeTerm+'%').limit(500)]);if(studentResult.error||schoolResult.error){results.innerHTML='<div class="search-result">Search unavailable</div>';results.hidden=false;return}const schoolMap=new Map();(schoolResult.data||[]).forEach(p=>{const name=(p.school||'').trim();const key=schoolKey(name);if(key&&!schoolMap.has(key))schoolMap.set(key,canonicalSchoolName(name))});const schoolButtons=Array.from(schoolMap.values()).slice(0,5).map(name=>'<button type="button" class="search-school-option" data-school="'+esc(name)+'"><span>🏫</span><span>View all students at <b>'+esc(name)+'</b></span></button>').join('');const studentRows=(studentResult.data||[]).map(p=>'<div class="search-result"><div style="display:flex;align-items:center;gap:8px"><button type="button" class="profile-open" data-public-profile="'+esc(p.id)+'" aria-label="View '+esc(p.nickname)+'\'s profile">'+profileAvatarMarkup(p.nickname,p.avatar_url,'avatar',p.id)+'</button><div><button type="button" class="profile-name-link" data-public-profile="'+esc(p.id)+'">'+esc(p.nickname)+'</button><div class="tiny">'+esc(p.school||'No school')+'</div></div></div><button class="btn btn-secondary" data-search-add="'+p.id+'">Add</button></div>').join('');results.innerHTML=(schoolButtons?'<div class="search-section-label">Schools</div>'+schoolButtons:'')+(studentRows?'<div class="search-section-label">Students</div>'+studentRows:'')||'<div class="search-result">No students or schools found</div>';results.hidden=false},250);}}}function updateNotificationButton(){
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
async function loadProfile(){let {data,error}=await db.from('profiles').select('*').eq('id',S.session.user.id).maybeSingle();if(error)console.warn(error);S.profile=data||{id:S.session.user.id,nickname:'Student',school:''};S.profile.school=canonicalSchoolName(S.profile.school||'')}
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