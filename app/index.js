auth.config = {
  apiKey: "AIzaSyBxGXe52WtXo_B5iKBo9BQZSfAwYFhLRO8",
  authDomain: "uios-83649.firebaseapp.com",
  projectId: "uios-83649",
  messagingSenderId: "47824486713",
  appId: "1:47824486713:web:51f3a124b42b1080"
};

window.api = {
  endpoint: "https://api.uios.computer"
};

window.is = {
  json: (text) => {
    return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
  },
  local: href => href.contains(['127.0.0.1', 'about:', 'blob:', 'file:', 'localhost']),
  mobile: () => {
    return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
      navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document
    )
  },
  touch: () => { return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)); }
}

window.onload = async() => {

  window.dom = {
    body: document.body,
    boot: byId('boot')
  };
  
  dom.body.dataset.load = "ing";
  
  window.db.name = "database";
  window.db.schema = {};
  window.db.version = 0;
  window.db.version > 0
    ? window.db
    .open(window.db.name, window.db.version, window.db.schema)
    .then((e) => init())
  : init();
  
  console.log('window.onload',{dom});
  
}

window.onpopstate = (event) => {
  if(event.state) {
    var state = is.local(window.location.protocol) ? event.state.replace(/^#+/, '') : event.state;
    console.log('onpopstate',{event, state});
    state.router({pop:true});
  } else {
    if(document.location) {
      //console.log({place});
    }
  }
  console.log(event,"location: " + document.location + ", state: " + JSON.stringify(state));
};

function init() {
  
  eruda.init();

  console.log("Initializing...");

  window.rout.ing = (href, GOT, n, m = GOT[n], root = GOT[0]) => {
    return m.includes("#") || 
      (root === 'chat' && n > 1) || 
      (root === 'users' && n === 1);
  };

  firebase.initializeApp(auth.config);

  dom.body.dataset.theme = "meridiem";
  
  touch.events = {
    dbltap: on.touch.dbltap,
    drag: on.touch.drag,
    press: on.touch.press,
    tap: on.touch.tap
  };
  dom.body.addEventListener("touchstart",touch.handler,{passive:true});
  dom.body.addEventListener("touchmove",touch.handler,{passive:true});
  dom.body.addEventListener("touchcancel",touch.handler,false);
  dom.body.addEventListener("touchend",touch.handler,false);

  (dom.boot.dataset.path ? dom.boot.dataset.path : window.location.pathname).router().then(e => {
    firebase.auth().onAuthStateChanged(user => {
      auth.change(user).then(e => {
        dom.body.dataset.load = "ed";
      })
    });
  });

  console.log("Initialized");
  
}
