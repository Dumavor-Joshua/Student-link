(function(){
  let gamesPromise=null;
  function loadGames(){
    if(gamesPromise)return gamesPromise;
    gamesPromise=new Promise((resolve,reject)=>{
      const base=document.currentScript&&document.currentScript.src||new URL('assets/js/game-loader.js',document.baseURI).href;
      const cssUrl=new URL('../css/games.css?v=studentlink-refactor-80',base).href;
      const jsUrl=new URL('games.js?v=studentlink-refactor-80',base).href;
      let style=document.querySelector('link[data-studentlink-games]');
      const styleReady=style?Promise.resolve():new Promise((done,fail)=>{
        style=document.createElement('link');
        style.rel='stylesheet';
        style.href=cssUrl;
        style.dataset.studentlinkGames='1';
        style.onload=done;
        style.onerror=()=>fail(new Error('Could not load game styles.'));
        document.head.appendChild(style);
      });
      const scriptReady=new Promise((done,fail)=>{
        const script=document.createElement('script');
        script.src=jsUrl;
        script.async=true;
        script.onload=done;
        script.onerror=()=>fail(new Error('Could not load games.'));
        document.body.appendChild(script);
      });
      Promise.all([styleReady,scriptReady]).then(()=>resolve()).catch(error=>{gamesPromise=null;reject(error)});
    });
    return gamesPromise;
  }
  window.viewGames=async function(){await loadGames();return window.viewGames()};
  window.viewGame=async function(){await loadGames();return window.viewGame()};
})();