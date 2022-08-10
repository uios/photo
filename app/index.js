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

window.cdn = {
    endpoint: "https://cdn.uios.computer/file/share-uios"
};

window.is = {
    json: (text)=>{
        return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
    }
    ,
    local: href=>href.contains(['127.0.0.1', 'about:', 'blob:', 'file:', 'localhost', 'tld']),
    mobile: ()=>{
        return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend"in document)
    }
    ,
    touch: ()=>{
        return (('ontouchstart'in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }
}

window.webcam.constraints.horizontal.video['facingMode'] = "self";

window.onload = async()=>{

    window.dom = {
        body: document.body,
        boot: byId('boot')
    };

    dom.body.dataset.load = "ing";

    window.db.name = "database";
    window.db.schema = {};
    window.db.version = 0;
    window.db.version > 0 ? window.db.open(window.db.name, window.db.version, window.db.schema).then((e)=>init()) : init();

    console.log('window.onload', {
        dom
    });

}

window.onpopstate = (event)=>{
    if (event.state) {
        var state = is.local(window.location.protocol) ? event.state.replace(/^#+/, '') : event.state;
        console.log('onpopstate', {
            event,
            state
        });
        state.router({
            pop: true
        });
    } else {
        if (document.location) {//console.log({place});
        }
    }
    console.log(event, "location: " + document.location + ", state: " + JSON.stringify(state));
}
;

function init() {

    //eruda.init();

    console.log("Initializing...");

    window.rout.ing = function(href, GOT, n, m=GOT[n], root=GOT[0]) {
        return m.includes("#") || (root === 'chat' && n > 1) || (root === 'my' && GOT[1] === "account" && n > 1) || (root === 'photo' && n === 1) || (root === 'post' && GOT[1] === 'photo' && n === 2) || (root === 'users' && n === 1);
    }

    firebase.initializeApp(auth.config);

    touch.events = {
        dbltap: on.touch.dbltap,
        drag: on.touch.drag,
        press: on.touch.press,
        tap: on.touch.tap
    };
    touch.ing = false;

    dom.body.dataset.theme = "meridiem";
    dom.body.addEventListener("click", function(e) {
        if (window.touch.ing === false) {
            on.touch.tap(e);
            //console.log(e.type,window.touch.ing);
        } else {
            window.touch.ing = false;
            //console.log(e.type,window.touch.ing);
        }
    });
    dom.body.addEventListener("touchstart", function(e) {
        window.touch.ing = true;
        touch.handler(event);
        console.log(e.type);
    }, {
        passive: true
    });
    dom.body.addEventListener("touchmove", touch.handler, {
        passive: true
    });
    dom.body.addEventListener("touchcancel", touch.handler, false);
    dom.body.addEventListener("touchend", function(e) {
        //window.touch.ing = false;
        touch.handler(event);
        console.log(e.type);
    });

    var go = false;
    const onAuthStateChanged = function(user) {
        const authChange = function(e) {
            const load = function(e) {
                dom.body.dataset.load = "ed";
            };
            dom.body.dataset.load = "ed";
        }
        auth.change(user).then(authChange);
        if (user) {
            byId("avi-header").innerHTML = byId("avi-footer").innerHTML = "<img onerror='model.error.image(this)' src='" + (cdn.endpoint + "/" + user.uid + "/avi.jpg") + "'>";
        } else {
            byId("avi-header").innerHTML = byId("avi-footer").innerHTML = "";
        }
        go ? null : (dom.boot.dataset.path ? dom.boot.dataset.path : window.location.pathname).router().then(go = true);
    }

    firebase.auth().onAuthStateChanged(onAuthStateChanged);

    console.log("Initialized");

}
