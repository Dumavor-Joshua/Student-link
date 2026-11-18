(function(){
  let gamesScriptPromise=null,gamesStylePromise=null;
  function loadGames(){
    const base=new URL('assets/js/game-loader.js',document.baseURI).href;
    const cssUrl=new URL('../css/games.css?v=studentlink-refactor-80',base).href;
    const jsUrl=new URL('games.js?v=studentlink-refactor-80',base).href;
    if(!gamesStylePromise)gamesStylePromise=new Promise((resolve,reject)=>{
      let style=document.querySelector('link[data-studentlink-games]');
      if(style){resolve();return}
      style=document.createElement('link');
      style.rel='stylesheet';
      style.href=cssUrl;
      style.dataset.studentlinkGames='1';
      style.onload=resolve;
      style.onerror=()=>{style.remove();gamesStylePromise=null;reject(new Error('Could not load game styles.'))};
      document.head.appendChild(style);
    });
    if(!gamesScriptPromise)gamesScriptPromise=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=jsUrl;
      script.async=true;
      script.onload=resolve;
      script.onerror=()=>{script.remove();gamesScriptPromise=null;reject(new Error('Could not load games.'))};
      document.body.appendChild(script);
    });
    return Promise.all([gamesStylePromise,gamesScriptPromise]);
  }
  window.viewGames=async function(){await loadGames();return window.viewGames()};
  window.viewGame=async function(){await loadGames();return window.viewGame()};
})();