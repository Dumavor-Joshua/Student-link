(function(){
  window.studentLinkInstallPrompt=null;
  window.addEventListener('beforeinstallprompt',function(event){
    event.preventDefault();
    window.studentLinkInstallPrompt=event;
    var button=document.getElementById('install-app');
    if(button)button.hidden=false;
  });
  window.addEventListener('appinstalled',function(){
    window.studentLinkInstallPrompt=null;
    var button=document.getElementById('install-app');
    if(button)button.hidden=true;
  });

  // Essential modules are downloaded together, then executed in dependency order.
  // The games engine is intentionally excluded from this first batch.
  var appSources=[
    'assets/js/core.js?v=studentlink-status-page-3',
    'assets/js/notifications.js?v=studentlink-refactor-80',
    'assets/js/feed.js?v=studentlink-refactor-80',
    'assets/js/messages.js?v=studentlink-status-row-1',
    'assets/js/status.js?v=studentlink-status-page-3',
    'assets/js/profile.js?v=studentlink-refactor-80',
    'assets/js/main.js?v=studentlink-refactor-80'
  ];
  var sources=[
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
    'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js'
  ];
  var gamesPromise=null;

  function loadGames(){
    if(window.__studentLinkGamesLoaded)return Promise.resolve();
    if(gamesPromise)return gamesPromise;

    if(!document.querySelector('link[data-studentlink-games-style]')){
      var style=document.createElement('link');
      style.rel='stylesheet';
      style.href='assets/css/games.css?v=studentlink-refactor-80';
      style.setAttribute('data-studentlink-games-style','');
      document.head.appendChild(style);
    }

    gamesPromise=new Promise(function(resolve,reject){
      var script=document.createElement('script');
      script.src='assets/js/games.js?v=studentlink-refactor-80';
      script.async=true;
      script.onload=function(){
        window.__studentLinkGamesLoaded=true;
        resolve();
      };
      script.onerror=function(){
        gamesPromise=null;
        reject(new Error('The games module could not be downloaded. Check your connection and try again.'));
      };
      document.body.appendChild(script);
    });
    return gamesPromise;
  }

  // These temporary route handlers let the normal app router await the module.
  // Loading games.js replaces them with the real feature implementations.
  window.viewGames=function(){
    return loadGames().then(function(){return window.viewGames();});
  };
  window.viewGame=function(){
    return loadGames().then(function(){return window.viewGame();});
  };

  function loadApp(){
    var failed=false;
    function fail(){
      if(failed)return;
      failed=true;
      var root=document.getElementById('app');
      if(root)root.innerHTML='<section class="studentlink-load-error"><h2>StudentLink could not load</h2><p>A required app module could not be downloaded. Check your connection, then reload this page.</p><button type="button" onclick="window.location.reload()">Reload StudentLink</button></section>';
    }
    appSources.forEach(function(source){
      var app=document.createElement('script');
      app.src=source;
      app.async=false;
      app.onerror=fail;
      document.body.appendChild(app);
    });
  }

  function loadLibrary(index){
    if(window.supabase&&typeof window.supabase.createClient==='function'){
      loadApp();
      return;
    }
    if(index>=sources.length){
      var root=document.getElementById('app');
      if(root)root.innerHTML='<section class="studentlink-load-error"><h2>StudentLink could not connect</h2><p>The Supabase library could not be downloaded from either provider. Check your connection and reload the page.</p><button type="button" onclick="window.location.reload()">Reload StudentLink</button></section>';
      return;
    }
    var script=document.createElement('script');
    var settled=false;
    var timeout=setTimeout(function(){
      if(settled)return;
      settled=true;
      script.remove();
      loadLibrary(index+1);
    },index===0?4500:6000);
    function finish(){
      if(settled)return;
      settled=true;
      clearTimeout(timeout);
      if(window.supabase&&typeof window.supabase.createClient==='function')loadApp();
      else loadLibrary(index+1);
    }
    script.src=sources[index];
    script.onload=finish;
    script.onerror=finish;
    document.head.appendChild(script);
  }

  loadLibrary(0);
  document.addEventListener('click',function(event){
    if(event.target&&event.target.closest('#modalclose')){
      var modal=document.getElementById('modalbg');
      if(modal)modal.classList.remove('show');
    }
  });
})();

if('serviceWorker' in navigator){
  window.addEventListener('load',function(){
    navigator.serviceWorker.register('./sw.js?v=studentlink-status-whatsapp-7').catch(function(error){
      console.warn('StudentLink offline support unavailable:',error);
    });
  });
}
