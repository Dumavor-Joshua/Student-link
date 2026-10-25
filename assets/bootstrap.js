
(function(){
  window.studentLinkInstallPrompt=null;
  window.addEventListener('beforeinstallprompt',function(event){event.preventDefault();window.studentLinkInstallPrompt=event;var button=document.getElementById('install-app');if(button)button.hidden=false;});
  window.addEventListener('appinstalled',function(){window.studentLinkInstallPrompt=null;var button=document.getElementById('install-app');if(button)button.hidden=true;});
  var appSrc='assets/app.js?v=studentlink-status-whatsapp-66';
  var sources=[
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
    'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js'
  ];
  function loadApp(){
    var app=document.createElement('script');
    app.src=appSrc;
    app.onerror=function(){
      var root=document.getElementById('app');
      if(root)root.innerHTML='<section class="studentlink-load-error"><h2>StudentLink could not load</h2><p>The app script could not be downloaded. Check your connection, then reload this page.</p><button type="button" onclick="window.location.reload()">Reload StudentLink</button></section>';
    };
    document.body.appendChild(app);
  }
  function loadLibrary(index){
    if(window.supabase&&typeof window.supabase.createClient==='function'){loadApp();return;}
    if(index>=sources.length){loadApp();return;}
    var script=document.createElement('script');
    script.src=sources[index];
    script.onload=function(){
      if(window.supabase&&typeof window.supabase.createClient==='function')loadApp();
      else loadLibrary(index+1);
    };
    script.onerror=function(){loadLibrary(index+1);};
    document.head.appendChild(script);
  }
  loadLibrary(0);
  document.addEventListener('click',function(event){if(event.target&&event.target.closest('#modalclose')){var modal=document.getElementById('modalbg');if(modal)modal.classList.remove('show');}});
})();

if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js?v=studentlink-install-64").catch(function(error){console.warn("StudentLink offline support unavailable:",error)})})}
