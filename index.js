window.auth ? null : window.auth = {};
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
    endpoint: "https://cdn.uios.computer/file/photo-uios"
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

window.onload = async()=>{

    window.dom = {
        body: document.body,
        boot: byId('boot'),
        header: byId('body-header')
    };

    var domains = window.location.host.split('.');
    window.global = {
        app: "c829e5bc-f583-452b-8dbd-db3b0a6a5b07",
        domains: {
            domain: domains.length > 1 ? domains[domains.length - 2] : null,
            subdomain: domains.length > 2 ? domains[domains.length - 3] : null,
            tld: domains[domains.length - 1]
        }
    }
    
    dom.body.dataset.load = "ing";

    init();

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

function init() {
    console.log("Initializing...");

    window.rout.ing = function(href, GOT, n, m=GOT[n], root=GOT[0]) {
        return m.includes("#") || (root === 'chat' && n > 1) || (root === 'my' && GOT[1] === "account" && n > 1) || (root === 'photo' && n === 1) || (root === 'post' && GOT[1] === 'photo' && n === 2) || (root === 'users' && n === 1);
    }

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
        //console.log(e.type);
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
        //console.log(e.type);
    });

    var url = window.location.pathname;
    if (window.global.domains.subdomain === "uios") {
        var dir = rout.ed.dir(window.location.pathname);
        dir.splice(0, 1)
        var url = rout.ed.url(dir);
    }

    var uri = ((dom.boot.dataset.path ? dom.boot.dataset.path : url) + (window.location.search + window.location.hash));

    var go = false;
    const authChange = function(e) {
        const load = function(e) {
            dom.body.dataset.load = "ed";
        };
        dom.body.dataset.load = "ed";
    };
    if (window.firebase) {
        firebase.initializeApp(auth.config);
        const onAuthStateChanged = async function(user) {
            if (user) {
                byId("avi-header").innerHTML = byId("avi-footer").innerHTML = "<img onerror='model.error.image(this)' src='" + (cdn.endpoint + "/" + user.uid + "/avi.jpg") + "'>";
                const a = function(d) {
                    const data = JSON.parse(d);
                    const settings = data.settings;
                    if (settings) {
                        const json = settings.json;
                        const theme = json.theme;
                        controller.system.theme(theme);
                    }
                    auth.change(user).then(authChange);
                    go ? null : uri.router().then(function() {
                        go = true;
                        authChange();
                    });
                }
                const jwt = await auth.getIdToken();
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                ajax(endpoint + "/photo/account?jwt=" + jwt).then(a);
            } else {
                byId("avi-header").innerHTML = byId("avi-footer").innerHTML = "";
                go ? null : uri.router().then(function() {
                    go = true;
                    authChange();
                });
            }
        }
        firebase.auth().onAuthStateChanged(onAuthStateChanged);
    } else {
        uri.router().then(authChange);
    }

    console.log("Initialized");
}
