auth.config = {
  apiKey: "AIzaSyBxGXe52WtXo_B5iKBo9BQZSfAwYFhLRO8",
  authDomain: "uios-83649.firebaseapp.com",
  projectId: "uios-83649",
  messagingSenderId: "47824486713",
  appId: "1:47824486713:web:51f3a124b42b1080"
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

window.onload = () => {

  window.db.name = "database";
  window.db.schema = {};
  window.db.version = 0;
  window.db.version > 0
    ? window.db
    .open(window.db.name, window.db.version, window.db.schema)
    .then((e) => init())
  : init();
  
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
  
  //eruda.init();

  console.log("Initializing...");

  window.rout.ing = (href, GOT, n, m = GOT[n], root = GOT[0]) => {
    return m.includes("#") || 
      (root === 'chat' && n > 1) || 
      (root === 'users' && n === 1);
  };

  window.dom = {
    body: document.body,
    boot: byId('boot'),
    camera: byId('camera')
  };

  firebase.initializeApp(auth.config);
  firebase.auth().onAuthStateChanged((user) => {
    console.log("auth");
    auth
      .change(user)
      .then((data) => {
      //console.log({data});
      //alert(123);
      //var user = data.user;
      //if(localStorage.href) {
      //localStorage.href.router();
      //localStorage.removeItem('href');
      //} else {
      (dom.boot ? dom.boot.dataset.page : window.location.pathname).router();
      //}
    })
      .catch((error) => {
      alert("There was an error verifying your user.");
      console.log({ error });
    });
  });

  dom.body.dataset.theme = "meridiem";
  dom.body.onclick = (event) => on.touch.tap(event, "tap");

  console.log("Initialized");
  
}
