window.mvc ? null : (window.mvc = {});

window.mvc.m ? null : (window.mvc.m = model = {
    error: {
        code: async(e,v)=>{
            var code = e.code;
            if (code === 404) {
                var elem = document.createElement('error');
                elem.innerHTML = await ajax('/cdn/html/error/error.404.html');
                v.insertAdjacentHTML('afterbegin', elem.outerHTML);
            }
        }
        ,
        image: e=>{
            console.log('model.error.image', e);
            e.remove();
        }
    },
    time: {
        date: (timestamp)=>{
            const rtf = new Intl.RelativeTimeFormat('en',{
                numeric: 'always',
            });
            const oneDayInMs = 1000 * 60 * 60 * 24;
            const daysDifference = Math.round((timestamp - new Date().getTime()) / oneDayInMs, );

            const formatted = isNaN(daysDifference) ? "" : rtf.format(daysDifference, 'day');
            return formatted;
        }
        ,
        line: ()=>{
            return new Promise(async(resolve,reject)=>{
                var feed = byId('feed-index-posts');
                var lastFeedId = feed.innerHTML === "" ? 0 : parseInt(feed.firstElementChild.dataset.id);
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios." + window.globals.domains.tld : api.endpoint;
                const f = async(d)=>{
                    var data = JSON.parse(d);
                    var posts = data.posts;
                    if (posts && posts.length > 0) {
                        var lastPostId = parseInt(posts[posts.length - 1].id);

                        if ((lastPostId > lastFeedId) && posts.length > 0) {
                            //feed.innerHTML = "";
                            var template = await ajax('/cdn/html/template/template.post.card.column.html');
                            var html = new DOMParser().parseFromString(template, "text/html").body;
                            var pp = 0;
                            do {
                                var post = posts[pp];
                                var caption = post.caption;
                                var comment = post.comment;
                                var comments = parseInt(post.comments);
                                var created = post.created;
                                var ext = post.format;
                                var uid = post.uid;
                                var user = post.user;
                                var username = post.username;
                                var liked = post.liked;
                                var likes = post.likes;
                                var saved = post.saved;

                                var card = html.firstElementChild.cloneNode(true);
                                var boxes = card.all('box');
                                card.dataset.id = post.id;
                                card.dataset.uid = uid;

                                var img = document.createElement('img');
                                img.src = cdn.endpoint + '/' + user + '/avi.jpg';
                                img.setAttribute("onerror", 'this.remove()');
                                const avi = boxes[0].find('picture');
                                avi.innerHTML = img.outerHTML;
                                avi.dataset.href = avi.nextElementSibling.dataset.href = "/users/" + user + "/";

                                var profile = boxes[0].find('span');
                                var owner = boxes[0].find('text');
                                profile.dataset.href = "/users/" + username + "/";
                                avi.dataset.src = cdn.endpoint + "/" + user + "/avi.jpg";
                                owner.textContent = username;

                                var media = boxes[1].find('media');
                                var content = document.createElement('img');
                                var format = "";
                                if (["jpg", "jpeg", "png"].includes(ext)) {
                                    var format = "photo";
                                } else if (["mp4"].includes(ext)) {
                                    var format = "video";
                                }
                                content.dataset.src = cdn.endpoint + "/" + user + "/" + format + "/" + uid + "." + ext;
                                media.insertAdjacentHTML("beforeend", content.outerHTML);

                                if (liked > 0) {
                                    var actions = boxes[2];
                                    var like = actions.find('.gg-heart').closest('ico');
                                    like.classList.add('color-ff3b30');
                                }

                                boxes[2].find('.gg-comment').closest('ico').dataset.href = '/photo/' + uid + '/comments/';

                                if (saved > 0) {
                                    var actions = boxes[2];
                                    var saved = actions.find('.gg-bookmark').closest('ico');
                                    saved.classList.add('color-ff3b30');
                                }

                                if (likes > 0) {
                                    var stats = boxes[3].find('text');
                                    stats.textContent = likes + " like" + (likes > 1 ? "s" : "");
                                }

                                if (caption) {
                                    var about = boxes[4];
                                    about.find('b').textContent = username;
                                    about.find('span').textContent = caption;
                                    about.classList.remove('hide');
                                }

                                if (comments > 0) {
                                    boxes[5].classList.remove('hide');
                                    boxes[5].find('text').dataset.href = "/photo/" + post.uid + "/comments/";
                                    boxes[5].find('text').textContent = "View " + (comments > 1 ? " all " : "") + comments + " comment" + (comments > 1 ? "s" : "");
                                }

                                var date = boxes[6].find('text');
                                date.textContent = model.time.date(new Date(created).getTime());

                                //html += card.outerHTML;
                                feed.insertAdjacentHTML('afterbegin', card.outerHTML);
                                pp++;
                            } while (pp < posts.length);
                            //feed.innerHTML = html;
                            lazyLoad(feed.all('[data-src]'))
                        }
                    }

                    resolve(route);
                }
                const c = (e)=>{
                    console.log('mvc.v users user /photo/users/:user catch', {
                        e
                    });
                    //model.error.code(e, v);
                }
                var jwt = auth.user() ? await auth.getIdToken() : null;
                const obj = {};
                jwt ? obj.jwt = jwt : null;
                lastFeedId > 0 ? obj.last = lastFeedId : null;
                const params = new URLSearchParams(obj);
                endpoint += '/photo/posts';
                if (obj.last) {
                    endpoint += '?' + params.toString();
                }
                ajax(endpoint).then(f).catch(c);
            }
            );
        }
    },
    users: {
        follow: async(target)=>{
            const uid = target.closest('[data-uid]').dataset.uid;
            console.log(uid);
            const a = function(d) {
                const data = JSON.parse(d);
                console.log({
                    data
                });
                byId('users-user-follow').classList.add('hide');
                byId('users-user-unfollow').classList.remove('hide');
                byId('users-user-count-followers').textContent = parseInt(byId('users-user-count-followers').textContent) + 1;
            }
            const b = function(error) {
                console.log(error);
            }

            const jwt = auth.user() ? await auth.getIdToken() : null;

            if (jwt) {
                const data = new FormData();
                data.append("app", window.global.app);
                data.append("jwt", jwt);
                data.append("ref", target.closest('[data-uid]').dataset.uid);
                data.append("type", "follow");
                const query = '?' + new URLSearchParams(data).toString();

                const uid = target.closest('card').dataset.uid;
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                const uri = endpoint + "/photo/activity";
                console.log(uri, {
                    data
                });
                ajax(uri, {
                    data,
                    dataType: "POST"
                }).then(a).catch(b);
            }
        }
        ,
        unfollow: async(target)=>{
            const uid = target.closest('[data-uid]').dataset.uid;
            console.log(uid);
            const a = function(d) {
                const data = JSON.parse(d);
                console.log({
                    data
                });
                modal.exit(target);
                byId('users-user-unfollow').classList.add('hide');
                byId('users-user-follow').classList.remove('hide');
                byId('users-user-count-followers').textContent = parseInt(byId('users-user-count-followers').textContent) - 1;
            }
            const b = function(error) {
                console.log(error);
            }
            const data = {
                type: "follow",
                uid
            };
            const query = '?' + new URLSearchParams(data).toString();

            const jwt = auth.user() ? await auth.getIdToken() : null;
            if (jwt) {
                const uid = target.closest('card').dataset.uid;
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                const uri = endpoint + "/photo/activity/follow/" + uid + "?app=" + window.global.app + "&jwt=" + jwt;
                console.log(uri);
                ajax(uri, {
                    dataType: "DELETE"
                }).then(a).catch(b);
            }
        }
    }
});

window.mvc.v ? null : (window.mvc.v = view = function(route) {
    console.log(108, {
        route
    });
    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        //var page = route.page = rout.ed.url(gut);
        $('aside').remove();

        if (route.search) {
            const query = route.search;
            const params = new URLSearchParams(query);
            const keywords = params.get('keywords');
            const input = byId('keywords')
            input.value = keywords;
            on.focus.in.search(byId('keywords'));
            byId('line-header').classList.add('display-none');
        } else {
            on.focus.out.search(byId('results-blur'));
            byId('line-header').classList.remove('display-none');
        }

        if (root) {
            if (root === "post") {
                if (get.length > 1) {
                    webcam.control.stop();
                } else {
                    webcam.control[auth.user() ? 'play' : 'stop']();
                }
            } else {
                webcam.control.stop();
            }

            if ((root === "photo" && GET.length == 1) || (root === "search")) {
                $(dom.header.find('form').parentNode.all('header > section > card > row > box')).addClass('-tablet-display-none');
                dom.header.find('form').classList.remove('-tablet-display-none');
            } else {
                $(dom.header.find('form').parentNode.all('header > section > card > row > box')).removeClass('-tablet-display-none');
                dom.header.find('form').classList.add('-tablet-display-none');
            }
        } else {
            webcam.control.stop();
            $(dom.header.find('form').parentNode.all('header > section > card > row > box')).removeClass('-tablet-display-none');
            dom.header.find('form').classList.add('-tablet-display-none');
        }

        if (root) {

            if (root === "activity") {
                var vp = dom.body.find('[data-page="' + page + '"]');
                vp.dataset.zIndex = 9;
                vp.dataset.vgaZIndex = 3;
                vp.dataset.mobileZIndex = 5;
                if (get.length > 1) {
                    //$('#tabs-activity > *').removeClass('color-000');
                    if (get.length > 2) {} else {
                        if (get[2] === "alerts") {//byId('tab-activity-alerts').classList.add('color-000');
                        }
                    }
                } else {
                    //byId('tab-activity').classList.add('color-000');
                    const a = async function(d) {
                        var json = JSON.parse(d);
                        var activity = json.activity;
                        if (activity.length > 0) {
                            const feed = byId('activity-feed');
                            feed.innerHTML = "";
                            var a = 0;
                            do {
                                var row = activity[a];
                                const ref = row.ref;
                                const owner = row.owner;
                                const type = row.type;
                                const username = row.username;
                                const user = row.user;

                                const template = vp.find('#feed-activity-' + type).content;
                                const elem = template.firstElementChild.cloneNode(true);
                                const avi = elem.find('picture');

                                var img = document.createElement('img');
                                img.src = cdn.endpoint + '/' + user + '/avi.jpg';
                                img.setAttribute("onerror", 'this.remove()');
                                avi.innerHTML = img.outerHTML;
                                avi.dataset.href = avi.nextElementSibling.dataset.href = "/users/" + user + "/";
                                elem.find('[placeholder="username"]').textContent = username;

                                if (type === "comment") {
                                    var img = document.createElement('img');
                                    img.className = "height-100pct position-absolute top-0 width-100pct";
                                    //img.className = "bg-black border-radius-50pc border-5px-solid border-color-fff height-100pc-10px width-100pc-10px";
                                    //img.onerror = e=>model.error.image(avi.firstElementChild);
                                    img.src = cdn.endpoint + "/" + owner + "/photo/" + ref + ".jpg";
                                    elem.all('picture')[2].dataset.href = "/photo/" + ref + "/";
                                    elem.all('picture')[2].innerHTML = img.outerHTML;
                                }

                                if (type === "follow") {
                                    row.following ? elem.find('text:last-child').textContent = "Following" : null;
                                }

                                if (type === "like") {
                                    var img = document.createElement('img');
                                    img.className = "height-100pct position-absolute top-0 width-100pct";
                                    //img.className = "bg-black border-radius-50pc border-5px-solid border-color-fff height-100pc-10px width-100pc-10px";
                                    //img.onerror = e=>model.error.image(avi.firstElementChild);
                                    img.src = cdn.endpoint + "/" + owner + "/photo/" + ref + ".jpg";
                                    elem.all('picture')[2].dataset.href = "/photo/" + ref + "/";
                                    elem.all('picture')[2].innerHTML = img.outerHTML;
                                }

                                //console.log(vp, elem, feed, '#feed-activity-' + type);

                                feed.insertAdjacentHTML('beforeend', elem.outerHTML);
                                a++;
                            } while (a < activity.length);
                        }
                        console.log({
                            json
                        });
                    }
                    const b = async function(e) {
                        console.log(e);
                    }

                    const jwt = auth.user() ? await auth.getIdToken() : null;
                    if (jwt) {
                        var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                        const uri = endpoint + "/photo/activity/?jwt=" + jwt;
                        console.log(uri);
                        ajax(uri).then(a).catch(b);
                    }
                }
                resolve(route);
            } else if (root === "chat") {
                var vp = dom.body.find('[data-pages="/chat/"]');
                vp.dataset.zIndex = 9;
                vp.dataset.mobileZIndex = 9;

                byId('convos').dataset.zIndex = 2;

                const convos = byId('chat-convos');
                const jwt = auth.user() ? await auth.getIdToken() : null;
                if (convos.innerHTML === "" && jwt) {
                    const a = async function(d) {
                        const data = JSON.parse(d);
                        console.log(150, {
                            data
                        });
                        const messages = data.messages;
                        const user = data.user;

                        vp.find('[placeholder="username"]').textContent = user.username;

                        if (messages.length > 0) {
                            convos.innerHTML = "";

                            var m = 0;
                            do {
                                const row = messages[m];
                                const message = row.message;
                                const convo = JSON.parse(row.convo).filter(e=>e !== user.uid);
                                const people = JSON.parse(row.people).filter((c,index)=>{
                                    return JSON.parse(row.people).indexOf(c) === index;
                                }
                                );
                                const usernames = JSON.parse(row.usernames);
                                var popping = [];

                                var u = 0;
                                do {
                                    if (u < 4) {
                                        popping[u] = people[u];
                                        console.log(u, people, people[u]);
                                    }
                                    u++;
                                } while (u < people.length);

                                if (people.length > 1) {
                                    var popped = popping.pop();
                                    group = popping.join(", ");
                                    group = group + " and " + popped;
                                } else {
                                    group = people[0]
                                }
                                console.log(row.convo, people, group, user);

                                const template = byId('template-convo').content;
                                var elem = template.firstElementChild.cloneNode(true);

                                var c = 0;
                                do {
                                    var pic = document.createElement('picture');
                                    var img = document.createElement('img');
                                    if (people.length > 1 && c < 2) {
                                        if (c > 0) {
                                            pic.className = "background-color-db border-2px-solid border-radius-50pc bottom-0 color-fff height-36px position-absolute right-0 width-36px";
                                        } else {
                                            pic.className = "background-color-db border-radius-50pc height-36px left-0 position-absolute top-0 width-36px";
                                        }
                                    } else {
                                        pic.className = "background-color-db border-radius-50pc height-50px width-50px";
                                    }
                                    img.className = "absolute bottom-0 height-75pc invert width-75pc";
                                    img.src = cdn.endpoint + "/" + convo[0] + "/avi.jpg";
                                    img.setAttribute("onerror", 'this.src = "cdn/svg/user.svg"');
                                    pic.innerHTML = img.outerHTML;
                                    var avi = elem.find('picture');
                                    avi.insertAdjacentHTML('beforeend', pic.outerHTML);
                                    //alert(c);
                                    c++;
                                } while (c < people.length);

                                elem.find('[placeholder="Full Name"]').textContent = group;
                                elem.find('[placeholder="Lorem ipsum dolor"]').textContent = message;
                                elem.dataset.href = "/chat/with" + rout.ed.url(usernames);
                                const html = elem.outerHTML;
                                convos.insertAdjacentHTML('beforeend', html);

                                m++;
                            } while (m < messages.length);
                        }

                        const template = byId('template-message').content;
                        var elem = template.firstElementChild;
                    }
                    const b = async function(error) {
                        const message = error.message;
                        console.log(message);
                    }

                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    const uri = endpoint + "/photo/messages?jwt=" + jwt;
                    console.log(uri);
                    ajax(uri).then(a).catch(b);
                }

                if (get.length > 1) {

                    if (get.length > 2) {
                        if (get[1] === "edit") {
                            byId('convos').dataset.zIndex = 1;
                            resolve(route);
                        }
                        if (get[1] === "with") {
                            if (get.length > 2) {
                                byId('convos').dataset.zIndex = 1;
                                const jwt = auth.user() ? await auth.getIdToken() : null;
                                if (jwt) {
                                    const a = async function(d) {
                                        const data = JSON.parse(d);
                                        const users = data.users;
                                        if (users.length > 0) {
                                            var popping = [];
                                            var usernames = [];
                                            var uids = [];
                                            var u = 0;
                                            do {
                                                var user = users[u];
                                                uids[u] = user.uid;
                                                if (u < 4) {
                                                    popping[u] = user.fullname;
                                                }
                                                usernames[u] = user.username;
                                                u++;
                                            } while (u < users.length);
                                            //console.log(87, usernames);
                                            var convo = popping[0];
                                            if (users.length > 1) {
                                                var popped = popping.pop();
                                                convo = popping.join(", ");
                                                convo = convo + " and " + popped;
                                            }
                                            vp.find('[data-pages="/chat/with/*/"] [placeholder="Full Name"]').textContent = convo;

                                            var chatWithUs = byId('chat-with-us');
                                            chatWithUs.innerHTML = "";
                                            const messages = data.messages;
                                            if (messages && messages.length > 0) {
                                                var m = 0;
                                                do {
                                                    const row = messages[m];
                                                    const message = row.message;
                                                    const template = byId('template-message').content;
                                                    var elem = template.firstElementChild;
                                                    elem.find('text').textContent = message;
                                                    const html = elem.outerHTML;
                                                    chatWithUs.insertAdjacentHTML('beforeend', html);
                                                    m++;
                                                } while (m < messages.length);
                                            }

                                            chatWithUs.parentNode.scrollTop = chatWithUs.scrollHeight + chatWithUs.clientHeight;

                                            route = rout.e("/chat/with" + rout.ed.url(data.convo));
                                            resolve(route);
                                            console.log(89, {
                                                convo,
                                                data,
                                                jwt,
                                                messages,
                                                popping,
                                                usernames
                                            });
                                        }
                                    }
                                    const b = async function(error) {
                                        const message = error.message;
                                        console.log(message);
                                    }
                                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                                    var convo = GET;
                                    convo.splice(0, 2);
                                    const uri = endpoint + "/photo/messages" + rout.ed.url(convo) + "?jwt=" + jwt;
                                    ajax(uri).then(a).catch(b);
                                } else {
                                    resolve(route);
                                }
                            } else {
                                resolve(route);
                            }
                        }
                    } else {
                        if (get[1] === "with") {
                            console.log(route.page, route.path);
                            $(byId('chat-with-them').all('text:not(:first-child)')).remove();
                            byId('chat-with-whom').innerHTML = "";
                        }
                        resolve(route);
                    }
                } else {
                    resolve(route);
                }
            } else if (root === "photo") {
                var vp = dom.body.find('[data-page="/photo/"]');
                if (get.length > 1) {
                    var vp = dom.body.find('pages[data-pages="/photo/*/"]');
                    var uid = get[1];

                    const postComments = vp.find('[data-order="3"]').all('box')[0].find('column');

                    const jwt = auth.user() ? await auth.getIdToken() : null;
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    endpoint += '/photo/posts/' + uid;
                    endpoint += (auth.user() ? '?jwt=' + jwt : '');
                    ajax(endpoint).then(async function(d) {
                        var data = JSON.parse(d);
                        var comments = data.comments;
                        var post = data.post;
                        var user = post.user;
                        var uid = post.uid;
                        var ext = post.format;
                        var liked = post.liked;
                        var likes = post.likes;
                        var saved = post.saved;
                        var username = post.username;

                        var block = vp.find('block');
                        block.dataset.uid = uid;

                        var photoPost = byId('photo-post');
                        var src = cdn.endpoint + "/" + post.user + "/photo/" + uid + "." + ext;
                        photoPost.find('img').src = src;

                        var profile = vp.find('[data-tablet-order="1"]');
                        profile.all('box')[0].dataset.href = "/users/" + username + "/";
                        profile.find('picture img').src = profile.find('picture img').dataset.src = cdn.endpoint + "/" + user + "/avi.jpg";
                        profile.find('[placeholder="username"]').textContent = username;

                        if (comments && comments.length > 0) {
                            const feedComments = postComments.find('[data-columns]');
                            feedComments.innerHTML = "";
                            var template = feedComments.nextElementSibling.content.firstElementChild;
                            var html = template.cloneNode(true);
                            html.classList.remove('hide');
                            var c = 0;
                            do {
                                var comment = comments[c];
                                html.find('picture img').dataset.src = html.find('picture img').src = cdn.endpoint + "/" + comment.user + "/avi.jpg";
                                html.all('text span')[0].textContent = comment.username;
                                html.all('text span')[1].textContent = comment.comment;
                                feedComments.insertAdjacentHTML('beforeend', html.outerHTML);
                                c++;
                            } while (c < comments.length);
                        }

                        var actions = vp.find('[data-order="3"]').all('box')[1];

                        var like = actions.find('.gg-heart').closest('ico');
                        if (liked > 0) {
                            like.classList.add('color-ff3b30');
                        } else {
                            like.classList.remove('color-ff3b30');
                        }

                        if (saved > 0) {
                            var save = actions.find('.gg-bookmark').closest('ico');
                            save.classList.add('color-ff3b30');
                        }

                        var stats = vp.find('[data-order="3"]').all('box')[2];
                        stats.find('span').textContent = likes;

                        resolve(route);
                    });

                    const formComment = vp.find('[data-order="3"]').find('form');
                    const postColumn = postComments.firstElementChild;
                    if (get[2] === "comments") {
                        postComments.className = "-tablet-background-color-fff -tablet-position-fixed -tablet-top-0 absolute height-100pc scroll-y width-100pc z-index-5";
                        postColumn.className = "-mobile-margin-bottom-90px -tablet-margin-bottom-45px -tablet-margin-top-45px grid-gap-20px padding-y-20px";
                        formComment.className = "-mobile-bottom-44px -tablet-background-color-fff -tablet-bottom-0 -tablet-position-fixed -tablet-z-index-6 border-color-db border-top-1px-solid margin-top-10px";
                    } else {
                        postComments.className = "-tablet-position-relative absolute";
                        postColumn.className = "-nth-child-3-last-display-block grid-gap-20px padding-y-20px";
                        formComment.className = "-tablet-display-none border-color-db border-top-1px-solid margin-top-10px";
                    }
                } else {
                    const jwt = auth.user() ? await auth.getIdToken() : null;
                    const a = function(d) {
                        const data = JSON.parse(d);
                        console.log({
                            data
                        });
                        const feed = byId('find-posts');
                        const posts = data.posts;
                        if (posts.length > 0) {
                            var boxes = feed.all('box');
                            var b = 0;
                            do {
                                const box = boxes[b];
                                if (b < posts.length) {
                                    const post = posts[b];
                                    const uid = post.uid;
                                    const user = post.user;
                                    box.dataset.href = "/photo/" + uid + "/";
                                    box.find('img').src = cdn.endpoint + "/" + user + "/photo/" + uid + "." + post.format;
                                } else {
                                    box.remove();
                                }
                                b++;
                            } while (b < boxes.length);
                        }
                    }
                    const b = function(error) {
                        const message = error.message;
                        console.log(message);
                    }
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    const uri = endpoint + "/photo/search/posts" + (jwt ? "?jwt=" + jwt : "");
                    console.log({
                        uri
                    });
                    ajax(uri).then(a).catch(b);
                }
                resolve(route);
            } else if (root === "my") {
                if (get.length > 1) {
                    if (get[1] === "account") {
                        var vp = dom.body.find('pages[data-pages="/my/account/"]');
                        const account = byId("my-account");
                        const header = byId('my-account-header');
                        const menu = byId("my-account-menu");
                        const menus = byId("my-account-menus");
                        if (get.length > 2) {
                            if (auth.user()) {
                                vp.dataset.zIndex = 3;
                                vp.dataset.tabletZIndex = 9;
                                vp.dataset.mobileZIndex = 5;
                            } else {
                                vp.dataset.zIndex = 9;
                                vp.dataset.tabletZIndex = 9;
                                vp.dataset.mobileZIndex = 9;
                            }
                            account.classList.add('margin-top-90px');
                            account.classList.add('tablet-margin-top-60px');
                            account.classList.add('margin-bottom-20px');
                            account.classList.remove('min-height-100pc');

                            header.classList.remove('tablet-hide');
                            header.classList.add('tablet-flex');
                            header.classList.add('mobile-flex');

                            menu.classList.add('tablet-hide');
                            menu.dataset.width = "240px";
                            menu.classList.remove('flex');
                            menu.classList.remove('mobile-display-block');
                            menu.classList.add('tablet-margin-top-60px');
                            menu.classList.add('tablet-margin-bottom-10px');

                            menus.classList.remove('hide');
                            menus.classList.add('tablet-hide');
                        } else {
                            if (auth.user()) {
                                vp.dataset.zIndex = 9;
                                vp.dataset.tabletZIndex = 9;
                                vp.dataset.mobileZIndex = 5;
                            } else {
                                vp.dataset.zIndex = 9;
                                vp.dataset.tabletZIndex = 9;
                                vp.dataset.mobileZIndex = 9;
                            }
                            account.classList.remove('margin-top-90px');
                            account.classList.remove('tablet-margin-top-60px');
                            account.classList.remove('margin-bottom-20px');
                            account.classList.add('min-height-100pc');

                            header.classList.add('tablet-hide');
                            header.classList.remove('tablet-flex');
                            header.classList.add('mobile-flex');

                            menu.classList.remove('tablet-hide');
                            menu.dataset.width = "100%";
                            menu.classList.add('flex');
                            menu.classList.add('mobile-display-block');
                            menu.classList.remove('tablet-margin-top-60px');
                            menu.classList.remove('tablet-margin-bottom-10px');

                            menus.classList.add('hide');
                            menus.classList.add('tablet-hide');
                        }
                        if (get[2] === "edit") {
                            const u = auth.user();
                            if (u) {
                                const avatar = byId('my-avatar');
                                const picture = avatar.find('picture');
                                const img = document.createElement('img');
                                img.setAttribute("onerror", 'this.remove()');
                                img.src = cdn.endpoint + "/" + u.uid + "/avi.jpg";
                                picture.innerHTML = img.outerHTML;
                                const email = byId('edit-email').find('[placeholder="Email"]');
                                email.value = u.email;
                                const phone = byId('edit-phone').find('[placeholder="Phone number"]');
                                phone.value = u.phoneNumber;
                                const a = function(d) {
                                    const data = JSON.parse(d);
                                    console.log({
                                        data
                                    });
                                    const settings = data.settings;
                                    if (settings) {
                                        const json = settings.json;
                                        if (json) {
                                            const account = json.account;
                                            if (account) {
                                                const name = byId('edit-name').find('[placeholder="Name"]');
                                                name.value = account.name;
                                                const username = byId('edit-username').find('[placeholder="Username"]');
                                                byId('form-my-account-edit').find('text').textContent = username.value = account.username;
                                                const website = byId('edit-website').find('[placeholder="Website"]');
                                                website.value = account.website;
                                                const bio = byId('edit-bio').find('textarea');
                                                bio.value = account.bio;
                                            }
                                        }
                                    }
                                    const user = data.user;
                                    if (user) {
                                        const name = byId('edit-name').find('[placeholder="Name"]');
                                        name.value = user.fullname;
                                        const username = byId('edit-username').find('[placeholder="Username"]');
                                        username.value = user.username;
                                        const website = byId('edit-website').find('[placeholder="Website"]');
                                        website.value = user.website;
                                        const bio = byId('edit-bio').find('textarea');
                                        bio.value = user.bio;
                                        const gender = byId('edit-gender').find('input');
                                        gender.value = user.gender;
                                    }
                                    resolve(route);
                                }
                                const jwt = await auth.getIdToken();
                                if (jwt) {
                                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                                    ajax(endpoint + "/photo/account?jwt=" + jwt).then(a);
                                }
                            }
                        }
                        if (get[2] === "password") {
                            const user = auth.user();
                            if (user) {
                                const oldPassword = byId('edit-old-password').find('input');
                                const newPassword = byId('edit-new-password').find('input');
                                const confirmPassword = byId('edit-confirm-password').find('input');
                                oldPassword.value = "";
                                newPassword.value = "";
                                confirmPassword.value = "";
                                const jwt = await auth.getIdToken();
                                if (jwt) {
                                    const a = function(d) {
                                        const data = JSON.parse(d);
                                        console.log({
                                            data
                                        });
                                        const img = document.createElement('img');
                                        img.src = cdn.endpoint + "/" + user.uid + "/avi.jpg";
                                        byId("form-my-account-password").find('picture').innerHTML = img.outerHTML;
                                        const username = byId("form-my-account-password").find('[placeholder="username"]');
                                        username.textContent = data.user.username;
                                        resolve(route);
                                    }
                                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                                    ajax(endpoint + "/photo/users/" + (user.uid) + "?jwt=" + jwt).then(a);
                                }
                            } else {
                                resolve(route);
                            }
                        }
                        if (get[2] === "notifications") {
                            const u = auth.user();
                            if (u) {
                                const a = function(d) {
                                    const data = JSON.parse(d);
                                    console.log({
                                        data
                                    });
                                    const notifications = data.notifications;
                                    if (notifications) {
                                        const pauseAll = notifications["pause_all"];
                                        if (pauseAll) {
                                            byId('form-my-pause-all').find('input').checked = pauseAll === "true";
                                        }

                                        const likes = notifications["likes"];
                                        if (likes) {
                                            byId('form-my-likes').find('[value="' + likes + '"]').checked = true;
                                        }
                                        const commentsPhotos = notifications["comments_photos"];
                                        if (commentsPhotos) {
                                            byId('form-my-comments-photos').find('[value="' + commentsPhotos + '"]').checked = true;
                                        }
                                        const comments = notifications["comments"];
                                        if (comments) {
                                            byId('form-my-comments').find('[value="' + comments + '"]').checked = true;
                                        }
                                        const commentLikes = notifications["comment_likes"];
                                        if (commentLikes) {
                                            byId('form-my-comment-likes').find('[value="' + commentLikes + '"]').checked = true;
                                        }

                                        const newFollowers = notifications["new_followers"];
                                        if (newFollowers) {
                                            byId('form-my-new-followers').find('[value="' + newFollowers + '"]').checked = true;
                                        }
                                        const acceptedRequests = notifications["accepted_requests"];
                                        if (acceptedRequests) {
                                            byId('form-my-accepted-requests').find('[value="' + acceptedRequests + '"]').checked = true;
                                        }
                                        const accountSuggestions = notifications["account_suggestions"];
                                        if (accountSuggestions) {
                                            byId('form-my-account-suggestions').find('[value="' + accountSuggestions + '"]').checked = true;
                                        }

                                        const messageRequests = notifications["message_requests"];
                                        if (messageRequests) {
                                            byId('form-my-message-requests').find('[value="' + messageRequests + '"]').checked = true;
                                        }
                                        const groupRequests = notifications["group_requests"];
                                        if (groupRequests) {
                                            byId('form-my-group-requests').find('[value="' + groupRequests + '"]').checked = true;
                                        }
                                        const messages = notifications["messages"];
                                        if (messages) {
                                            byId('form-my-messages').find('[value="' + messages + '"]').checked = true;
                                        }
                                    }
                                    resolve(route);
                                }
                                const jwt = await auth.getIdToken();
                                if (jwt) {
                                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                                    ajax(endpoint + "/photo/account/notifications?jwt=" + jwt).then(a);
                                }
                            }
                        }
                        if (get[2] === "privacy") {
                            const u = auth.user();
                            if (u) {
                                const a = function(d) {
                                    const data = JSON.parse(d);
                                    console.log({
                                        data
                                    });
                                    const privacy = data.privacy;
                                    if (privacy) {
                                        const privateAccount = privacy["private_account"];
                                        if (privateAccount) {
                                            byId('form-my-private-account').find('input').checked = privateAccount === "true";
                                        }
                                        const activityStatus = privacy["activity_status"];
                                        if (activityStatus) {
                                            byId('form-my-activity-status').find('input').checked = activityStatus === "true";
                                        }
                                        const yourPhotos = privacy["your_photos"];
                                        if (yourPhotos) {
                                            byId('form-my-your-photos').find('[value="' + yourPhotos + '"]').checked = true;
                                        }
                                        const allowMentions = privacy["allow_mentions"];
                                        if (allowMentions) {
                                            byId('form-my-allow-mentions').find('[value="' + allowMentions + '"]').checked = true;
                                        }
                                        const postsStats = privacy["posts_stats"];
                                        if (postsStats) {
                                            byId('form-my-posts-stats').find('input').checked = postsStats === "true";
                                        }
                                        const allowTags = privacy["allow_tags"];
                                        if (allowTags) {
                                            byId('form-my-allow-tags').find('[value="' + allowTags + '"]').checked = true;
                                        }
                                    }
                                    resolve(route);
                                }
                                const jwt = await auth.getIdToken();
                                if (jwt) {
                                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                                    ajax(endpoint + "/photo/account/privacy?jwt=" + jwt).then(a);
                                }
                            }
                        }
                        if (get[2] === "theme") {
                            const a = function(d) {
                                const data = JSON.parse(d);
                                console.log({
                                    data
                                });
                                const settings = data.settings;
                                var theme = "light";
                                if (settings) {
                                    const json = settings.json;
                                    theme = json.theme;
                                }
                                byId('form-my-account-theme').find('[data-before="' + theme + '"]').nextElementSibling.setAttribute('checked', true);
                                resolve(route);
                            }
                            const jwt = await auth.getIdToken();
                            if (jwt) {
                                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                                ajax(endpoint + "/photo/account?jwt=" + jwt).then(a);
                            }
                        }
                    }
                } else {
                    resolve(route);
                }
            } else if (root === "post") {
                var vp = dom.body.find('pages[data-pages="' + getRoot() + '"]');

                var post = byId('post');
                var postEr = byId('post-er');
                var postForm = byId('post-form');
                //var postFormat = byId('post-photo');
                //var postFormatSubmit = byId('post-photo-submit');
                var postHeader = byId('post-header');
                var postMedia = byId('post-media');
                var postOptions = byId('post-options');
                var postFormat = byId('post-format');

                var camera = byId('camera');
                var cameraBack = byId('camera-back');
                var cameraDisable = byId('camera-disable');
                var cameraFlip = byId('camera-flip');
                var cameraNext = byId('camera-next');
                var cameraPermissions = byId('camera-permissions');
                var cameraPhoto = byId('camera-photo');
                var cameraVideo = camera.find('video');

                var postPhoto = byId('post-photo');
                var postPhotoSubmit = byId('post-photo-submit');
                var mediaHeader = byId('media-header');

                if (get.length > 1) {
                    var format = get[1];
                    if (get.length > 2) {
                        var uid = get[2];
                        if (format === "photo") {
                            vp.dataset.zIndex = 3;
                            vp.dataset.vgaZIndex = 3;
                            vp.dataset.mobileZIndex = 5;

                            mediaHeader.classList.add('mobile-flex');

                            postEr.className = "dw1000px-padding-y-20px dw1000px-width-600px margin-x-auto max-width-100pc mobile-padding-top-0 width-50pc";
                            postForm.className = "direction-row dw1000px-direction-column dw1000px-margin-x-auto margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px";
                            postFormat.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-left-20px max-width-100pc mobile-max-width-100pc-20px mobile-padding-x-10px";
                            postPhotoSubmit.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-y-20px max-width-100pc";
                            postHeader.className = "hide";
                            postMedia.className = "dw1000px-width-600px margin-x-auto max-width-100pc mobile-margin-top-50px dw960px-padding-bottom-0";
                            postOptions.className = "hide";
                            camera.className = "bg-e5e5e5 border-radius-20px dw960px-width-100pc mobile-border-radius-0 mobile-margin-0 overflow-hidden width-100pc";
                            cameraDisable.classList.add('hide');
                            cameraFlip.classList.add('hide');
                            cameraPermissions.className = "hide";

                            var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                            ajax(endpoint + "/photo/posts/" + uid).then(function(d) {
                                var data = JSON.parse(d);
                                var post = data.post;
                                var user = post.user;
                                var uid = post.uid;
                                var ext = post.format;

                                var src = cdn.endpoint + "/" + user + "/photo/" + uid + "." + ext;
                                console.log(src);
                                cameraPhoto.find('img').src = src;
                            });
                        } else {
                            vp.dataset.zIndex = 9;
                            vp.dataset.vgaZIndex = 9;
                            vp.dataset.mobileZIndex = 9;

                            mediaHeader.classList.remove('mobile-flex');
                        }
                    } else {
                        console.log({
                            vp
                        });
                        vp.dataset.zIndex = 9;
                        vp.dataset.vgaZIndex = 9;
                        vp.dataset.mobileZIndex = 9;

                        mediaHeader.classList.remove('mobile-flex');

                        var format = get[1];
                        if (format === "photo") {
                            var postPhoto = byId('post-photo');
                            var postPhotoSubmit = byId('post-photo-submit');

                            postEr.className = "dw1000px-padding-y-20px dw1000px-width-600px margin-x-auto max-width-100pc mobile-padding-top-0 width-50pc";
                            postForm.className = "direction-row dw1000px-direction-column dw1000px-margin-x-auto margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px";
                            postFormat.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-left-20px max-width-100pc mobile-max-width-100pc-20px mobile-padding-x-10px";
                            postPhotoSubmit.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-y-20px max-width-100pc";
                            postHeader.className = "hide";
                            postMedia.className = "dw1000px-width-600px margin-x-auto max-width-100pc dw960px-padding-bottom-0";
                            postOptions.className = "hide";
                            camera.className = "bg-e5e5e5 border-radius-20px dw960px-width-100pc mobile-border-radius-0 mobile-margin-0 overflow-hidden width-100pc";
                            cameraDisable.classList.add('hide');
                            cameraFlip.classList.add('hide');
                            cameraPermissions.className = "hide";
                        }
                        if (format === "video") {
                            var postVideo = byId('post-video');
                            var postVideoSubmit = byId('post-video-submit');

                            postEr.className = "dw1000px-padding-y-20px dw1000px-width-600px margin-x-auto max-width-100pc mobile-padding-top-0 width-50pc";
                            postForm.className = "direction-row dw1000px-direction-column dw1000px-margin-x-auto margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px";
                            postFormat.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-left-20px max-width-100pc mobile-max-width-100pc-20px mobile-padding-x-10px";
                            postVideoSubmit.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-y-20px max-width-100pc";
                            postHeader.className = "hide";
                            postMedia.className = "dw1000px-width-600px margin-x-auto max-width-100pc dw960px-padding-bottom-0";
                            postOptions.className = "hide";
                            camera.className = "bg-e5e5e5 border-radius-20px dw960px-width-100pc mobile-border-radius-0 mobile-margin-0 overflow-hidden width-100pc";
                            cameraDisable.classList.add('hide');
                            cameraFlip.classList.add('hide');
                            cameraPermissions.className = "hide";
                        }
                        //if(format === "edit") {
                        //controller.post.shot();
                        //}
                        cameraVideo.classList.add('hide');
                    }
                } else {
                    vp.dataset.zIndex = 9;
                    vp.dataset.vgaZIndex = 9;
                    vp.dataset.mobileZIndex = 9;

                    mediaHeader.classList.remove('mobile-flex');

                    postEr.removeAttribute('class');
                    postForm.className = "direction-row margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px dw1000px-direction-column";
                    postFormat.className = "flex-1";
                    postHeader.className = "dw960px-margin-x-auto dw960px-width-480px hide margin-right max-width-100pc width-320px";
                    postMedia.className = "dw960px-width-480px margin-x-auto max-width-100pc mobile-padding-0 padding-y-36px dw960px-padding-bottom-0";
                    postOptions.className = "dw960px-width-100pc dw960px-margin-top-20px dw1000px-margin-left-0 margin-left-20px mobile-margin-top-0 width-50pc";
                    camera.className = "bg-e5e5e5 border-radius-20px dw960px-width-100pc mobile-border-radius-0 mobile-margin-0 overflow-hidden width-50pc";
                    cameraDisable.classList.remove('hide');
                    cameraFlip.classList.remove('hide');
                    cameraPermissions.className = "absolute absolute-full height-120px margin-auto text-align-center webcam-hide width-200px";
                    cameraPhoto.find('img').removeAttribute('src');
                    cameraVideo.classList.remove('hide');
                }
                cameraBack.className = "bottom-0 fixed hide left-0";
                cameraNext.className = "bottom-0 fixed hide right-0";
                resolve(route);
            } else if (root === "search") {
                if (get.length > 1) {
                    const jwt = auth.user() ? await auth.getIdToken() : null;
                    const a = async function(d) {
                        const data = JSON.parse(d);
                        const feed = byId('search-posts');
                        const posts = data.posts;
                        var html = await ajax('/cdn/html/template/template.feed.cascading.html');
                        var template = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
                        if (posts && posts.length > 0) {
                            feed.innerHTML = template.outerHTML;
                            var boxes = $(feed.all('box'));
                            var b = 0;
                            do {
                                const box = boxes[b];
                                if (b < posts.length) {
                                    const post = posts[b];
                                    const uid = post.uid;
                                    const user = post.user;
                                    box.classList.remove('hide');
                                    box.dataset.href = "/photo/" + uid + "/";
                                    box.find('img').src = cdn.endpoint + "/" + user + "/photo/" + uid + "." + post.format;
                                } else {
                                    box.remove();
                                }
                                b++;
                            } while (b < boxes.length);
                        } else {
                            feed.innerHTML = "";
                        }
                    }
                    const b = function(error) {
                        const message = error.message;
                        console.log(message);
                    }
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    const uri = endpoint + "/photo/search/posts" + ("?keywords=" + get[1]);
                    console.log({
                        uri
                    });
                    ajax(uri).then(a).catch(b);
                    resolve(route);
                }
            } else if (root === "users") {
                if (get.length > 1) {
                    var v = dom.body.find('pages[data-root="' + root + '"]');
                    console.log(route, v);
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    const jwt = auth.user() ? await auth.getIdToken() : "";
                    var resource = rout.ed.url(rout.ed.dir(route.path)).replace(/\/+$/, '');
                    const uri = endpoint + '/photo' + resource + (jwt ? "?jwt=" + jwt : "");
                    ajax(uri).then(async(user)=>{
                        var error = v.find('error');
                        error ? error.remove() : null;

                        var json = JSON.parse(user);

                        var uid = json.user.uid;
                        var bio = json.user.bio;
                        var fullname = json.user.fullname;
                        var username = get[1] = json.user.username;

                        v.find('wrap').dataset.uid = uid;

                        var avi = byId('users-user-avatar');
                        var img = document.createElement('img');
                        img.className = "bg-black border-radius-50pc border-5px-solid border-color-fff height-100pc-10px width-100pc-10px";
                        img.onerror = e=>model.error.image(avi.firstElementChild);
                        img.src = cdn.endpoint + "/" + uid + "/avi.jpg";
                        avi.innerHTML = img.outerHTML;

                        if (auth.user() && uid === auth.user().uid) {
                            byId('users-user-account').classList.remove('hide');
                            byId('users-user-edit').classList.remove('hide');
                            byId('users-user-follow').classList.add('hide');
                            byId('users-user-message').classList.add('hide');
                            byId('users-user-more').classList.add('hide');
                            byId('users-user-unfollow').classList.add('hide');
                        } else {
                            var friend = json.user.friend;
                            if (friend > 0) {
                                byId('users-user-follow').classList.add('hide');
                                byId('users-user-unfollow').classList.remove('hide');
                            } else {
                                byId('users-user-follow').classList.remove('hide');
                                byId('users-user-unfollow').classList.add('hide');
                            }
                            byId('users-user-account').classList.add('hide');
                            byId('users-user-edit').classList.add('hide');
                            byId('users-user-message').classList.remove('hide');
                            byId('users-user-more').classList.remove('hide');

                            byId('users-user-message').dataset.href = "/chat/with/" + username;
                        }

                        if (fullname) {
                            byId('users-user-fullname').textContent = fullname;
                            byId('users-user-fullname').classList.remove('hide');
                        }
                        if (fullname) {
                            var about = byId('users-user-fullname').closest('box');
                            about.classList.remove('hide');
                        }
                        byId('users-user-username').textContent = username;

                        if (bio) {
                            byId('users-user-bio').classList.remove('hide');
                            byId('users-user-bio').innerText = bio;
                        } else {
                            byId('users-user-bio').classList.add('hide');
                        }

                        byId('users-user-count-posts').textContent = json.stats.posts;
                        byId('users-user-count-followers').textContent = json.stats.followers;
                        byId('users-user-count-following').textContent = json.stats.following;

                        route.path = rout.e(rout.ed.url(get)).path;

                        1 < 0 ? console.log('mvc.v users user route', {
                            route,
                            paths
                        }) : null;

                        $('#tabs-profile > *').removeClass('color-000');
                        if (get.length > 2) {
                            if (get[2] === "feed") {
                                byId('tab-user-profile-feed').classList.add('color-000');

                                byId('tab-user-profile').classList.add('color-000');
                                byId('users-user-feed').innerHTML = "";

                                var posts = json.posts;
                                if (posts && posts.length > 0) {
                                    var html = await ajax('/cdn/html/template/template.post.card.column.html');
                                    var template = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
                                    var p = 0;
                                    do {
                                        var post = posts[p];
                                        var ext = post.format;

                                        var card = template.cloneNode(true);
                                        var boxes = card.all('box');

                                        var profile = boxes[0].find('span');
                                        var avi = boxes[0].find('picture img');
                                        var owner = boxes[0].find('text');
                                        profile.dataset.href = "/users/" + post.username + "/";
                                        avi.dataset.src = cdn.endpoint + "/" + post.user + "/avi.jpg";
                                        owner.textContent = username;

                                        var media = boxes[1].find('media');
                                        var content = document.createElement('img');
                                        var format = "";
                                        if (["jpg", "jpeg", "png"].includes(ext)) {
                                            var format = "photo";
                                        } else if (["mp4"].includes(ext)) {
                                            var format = "video";
                                        }
                                        content.dataset.src = cdn.endpoint + "/" + post.user + "/" + format + "/" + post.uid + "." + ext;
                                        media.insertAdjacentHTML("beforeend", content.outerHTML);

                                        byId('users-user-feed').insertAdjacentHTML('afterbegin', card.outerHTML);
                                        p++;
                                    } while (p < posts.length);
                                }
                                resolve(route);
                            } else if (get[2] === "followers") {

                                const feed = byId('feed-users-user-followers');
                                feed.innerHTML = "";

                                const followers = json.followers;
                                if (followers && followers.length > 0) {
                                    const template = byId('template-users-user-followers').content.firstElementChild;
                                    var u = 0;
                                    do {
                                        const user = followers[u];
                                        const uid = user.uid;

                                        var html = template.cloneNode(true);

                                        html.dataset.href = "/users/" + user.username + "/";
                                        html.classList.remove('hide');
                                        html.dataset.uid = uid;
                                        html.find('[placeholder="username"]').textContent = user.username;
                                        html.find('[placeholder="Full Name"]').textContent = user.fullname;

                                        if (auth.user()) {
                                            const button = html.find("#feed-users-user-friends-unfollow");
                                            if (auth.user().uid === uid) {
                                                button.classList.add('hide');
                                            } else {
                                                button.classList.remove('hide');
                                                if (parseInt(user.friend) > 0) {
                                                    button.textContent = "Following";
                                                } else {
                                                    button.textContent = "Follow";
                                                }
                                            }
                                        }

                                        feed.insertAdjacentHTML('beforeend', html.outerHTML);
                                        u++;
                                    } while (u < followers.length);
                                }
                                resolve(route);

                            } else if (get[2] === "following") {

                                const feed = byId('feed-users-user-following');
                                feed.innerHTML = "";

                                const following = json.following;
                                if (following && following.length > 0) {
                                    const template = byId('template-users-user-following').content.firstElementChild;
                                    var u = 0;
                                    do {
                                        const user = following[u];
                                        const uid = user.uid;

                                        var html = template.cloneNode(true);

                                        html.dataset.href = "/users/" + user.username + "/";
                                        html.classList.remove('hide');
                                        html.dataset.uid = uid;
                                        html.find('[placeholder="username"]').textContent = user.username;
                                        html.find('[placeholder="Full Name"]').textContent = user.fullname;

                                        if (auth.user()) {
                                            if (auth.user().uid === uid) {
                                                html.find("#feed-users-user-friends-unfollow").classList.add('hide');
                                            } else {
                                                html.find("#feed-users-user-friends-unfollow").classList.remove('hide');
                                            }
                                        }

                                        feed.insertAdjacentHTML('beforeend', html.outerHTML);
                                        u++;
                                    } while (u < following.length);
                                    console.log({
                                        following
                                    })
                                }
                                resolve(route);

                            } else if (get[2] === "saved") {
                                byId('tab-user-profile-saved').classList.add('color-000');
                                byId('users-user-saved').innerHTML = "";

                                var posts = json.posts;
                                if (posts) {
                                    var html = await ajax('/cdn/html/template/template.post.card.grid.html');
                                    var template = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
                                    var p = 0;
                                    do {
                                        var post = posts[p];
                                        var ext = post.format;

                                        var card = template.cloneNode(true);
                                        var boxes = card.all('box');

                                        var format = "";
                                        if (["jpg", "jpeg", "png"].includes(ext)) {
                                            format = "photo";
                                        } else if (['mp4'].includes(ext)) {
                                            format = "video";
                                        }
                                        boxes[0].find('picture img').dataset.src = cdn.endpoint + "/" + post.user + "/" + format + "/" + post.uid + "." + ext;

                                        byId('users-user-saved').insertAdjacentHTML('afterbegin', card.outerHTML);
                                        p++;
                                    } while (p < posts.length);
                                }

                                resolve(route);
                            } else if (get[2] === "tagged") {
                                byId('tab-user-profile-tagged').classList.add('color-000');
                                byId('users-user-tagged').innerHTML = "";

                                var posts = json.posts;
                                if (posts) {
                                    var html = await ajax('/cdn/html/template/template.post.card.grid.html');
                                    var template = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
                                    var p = 0;
                                    do {
                                        var post = posts[p];
                                        var ext = post.format;

                                        var card = template.cloneNode(true);
                                        var boxes = card.all('box');

                                        var format = "";
                                        if (["jpg", "jpeg", "png"].includes(ext)) {
                                            format = "photo";
                                        } else if (['mp4'].includes(ext)) {
                                            format = "video";
                                        }
                                        boxes[0].find('picture img').dataset.src = cdn.endpoint + "/" + post.user + "/" + format + "/" + post.uid + "." + ext;

                                        byId('users-user-tagged').insertAdjacentHTML('afterbegin', card.outerHTML);
                                        p++;
                                    } while (p < posts.length);
                                }

                                resolve(route);
                            }
                        } else {
                            byId('tab-user-profile').classList.add('color-000');
                            byId('users-user-posts').innerHTML = "";

                            var posts = json.posts;
                            if (posts) {
                                var html = await ajax('/cdn/html/template/template.post.card.grid.html');
                                var template = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
                                var p = 0;
                                do {
                                    var post = posts[p];
                                    var ext = post.format;

                                    var card = template.cloneNode(true);
                                    card.dataset.href = "/photo/" + post.uid + "/";

                                    var boxes = card.all('box');

                                    var format = "";
                                    if (["jpg", "jpeg", "png"].includes(ext)) {
                                        format = "photo";
                                    } else if (['mp4'].includes(ext)) {
                                        format = "video";
                                    }
                                    boxes[0].find('picture img').dataset.src = cdn.endpoint + "/" + uid + "/" + format + "/" + post.uid + "." + ext;

                                    byId('users-user-posts').insertAdjacentHTML('afterbegin', card.outerHTML);
                                    p++;
                                } while (p < posts.length);
                            }
                            console.log(1075, {
                                route
                            })
                            resolve(route);

                        }
                    }
                    ).catch((e)=>{
                        console.log('mvc.v users user /photo/users/:user catch', {
                            e
                        });
                        model.error.code(e, v);
                        resolve(route);
                    }
                    );
                }
            } else {
                var e = {
                    code: 404,
                    message: "Not Found"
                };
                console.log('mvc.v ' + route.path, {
                    e
                });
                model.error.code(e, v);
                resolve(route);
            }
        }
        if (!root || (root === "activity" && $("main pages[data-active='true']").length === 0)) {
            var v = dom.body.find('page[data-page="/"]');
            v.dataset.active = true;
            const jwt = auth.user() ? await auth.getIdToken() : null;
            var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;

            const indexMyUser = byId('index-my-user');
            if (auth.user()) {
                var img = document.createElement('img');
                img.setAttribute("onerror", 'this.remove()');
                img.src = cdn.endpoint + "/" + auth.user().uid + '/avi.jpg';
                indexMyUser.find('picture').innerHTML = img.outerHTML;
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                const mine = async(d)=>{
                    const json = JSON.parse(d);
                    indexMyUser.find('[placeholder="username"]').textContent = json.user.username;
                    indexMyUser.find('[placeholder="Full Name"]').textContent = json.user.fullname;
                }
                ajax(endpoint + '/photo/users?filter=mine&jwt=' + jwt).then(mine);
                indexMyUser.parentNode.classList.remove('hide');
            } else {
                indexMyUser.parentNode.classList.add('hide');
            }

            var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios." + window.globals.domains.tld : api.endpoint;
            const active = async(d)=>{
                var data = JSON.parse(d);
                const users = data.users;
                if (users.length > 0) {
                    const feedActiveUsers = byId("index-active-users");
                    feedActiveUsers.innerHTML = "";
                    const child = feedActiveUsers.nextElementSibling.content.firstElementChild.cloneNode(true);
                    var u = 0;
                    do {
                        const user = users[u];

                        var img = document.createElement('img');
                        img.setAttribute("onerror", 'this.remove()');
                        img.src = cdn.endpoint + "/" + user.uid + '/avi.jpg';

                        child.dataset.href = '/users/' + user.uid + '/';
                        child.find('picture').innerHTML = img.outerHTML;
                        child.find('[placeholder="username"]').textContent = user.username;

                        feedActiveUsers.insertAdjacentHTML('beforeend', child.outerHTML);

                        u++;
                    } while (u < users.length);
                }
            }
            ajax(endpoint + '/photo/users?filter=active').then(active);

            var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
            const suggested = async(d)=>{
                var data = JSON.parse(d);
                const users = data.users;
                if (users.length > 0) {
                    const feedSuggestedUsers = byId("index-suggested-users");
                    var u = 0;
                    do {
                        const user = users[u];

                        var img = document.createElement('img');
                        img.setAttribute("onerror", 'this.remove()');
                        img.src = cdn.endpoint + "/" + user.uid + '/avi.jpg';

                        const child = feedSuggestedUsers.children[u];
                        child.find('box').dataset.href = '/users/' + user.uid + '/';
                        child.find('picture').innerHTML = img.outerHTML;
                        child.find('[placeholder="username"]').dataset.href = '/users/' + user.uid + '/';
                        child.find('[placeholder="username"]').textContent = user.username;
                        child.all('box')[2].all('text')[1].dataset.href = '/users/' + user.uid + '/';

                        u++;
                    } while (u < users.length);
                }
            }
            ajax(endpoint + '/photo/users?filter=suggested' + (jwt ? '&jwt=' + jwt : '')).then(suggested);

            mvc.m.time.line();
            resolve(route);
        }
    }
    );
}
);

window.mvc.c ? null : (window.mvc.c = controller = {
    account: {
        menu: ()=>{
            const menu = byId("my-account-menu");
            if (GET.length > 2) {
                '/my/account/'.router();
            } else {
                rout.ed.close();
            }
        }
    },
    comment: {
        onkeydown: function(event) {
            var keyCode = event.keyCode;
            var target = event.target;
            var submit = target.closest('form').find('[type="submit"]');
            if (keyCode === 13) {
                event.preventDefault();
                submit.click();
            } else {
                const target = event.target;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
            }
        },
        onkeyup: function(event) {
            var keyCode = event.keyCode;
            var target = event.target;
            var submit = target.closest('form').find('[type="submit"]');
            if (target.value.length > 0) {
                submit.removeAttribute('disabled');
            } else {
                submit.setAttribute('disabled', true);
            }

        },
        onsubmit: async function(event) {
            event.preventDefault();

            const target = event.target;
            const post = target.closest('[data-uid]');
            const ref = post.dataset.uid;
            const jwt = await auth.getIdToken();
            const textarea = target.find('textarea');
            const text = textarea.value;

            if (text.length > 0) {
                var data = new FormData();
                data.append("ref", ref);
                data.append("jwt", jwt);
                data.append("text", text);

                const a = function(d) {
                    const data = JSON.parse(d);
                    const comment = data.comment;
                    console.log('POST comment', data);
                    textarea.value = "";

                    var vp = dom.body.find('pages[data-pages="/photo/*/"]');
                    const postComments = vp.find('[data-order="3"]').all('box')[0].find('column');
                    var template = postComments.find('template').content.firstElementChild;
                    var html = template.cloneNode(true);
                    html.classList.remove('hide');
                    html.find('img').src = cdn.endpoint+"/"+data.user+'/avi.jpg';
                    html.all('text span')[0].textContent = comment.username;
                    html.all('text span')[1].textContent = comment.comment;
                    postComments.find('[data-columns]').insertAdjacentHTML('afterbegin', html.outerHTML);
                };
                const b = function(error) {
                    console.log(error);
                    alert(error.message);
                };
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                ajax(endpoint + "/photo/comments", {
                    data,
                    dataType: "POST"
                }).then(a).catch(b);
            }
        }
    },
    convo: {
        onchecked: async function(target) {
            console.log(target);
            const box = target.closest('box');
            const form = target.closest('form');
            const checked = target.checked;
            const search = form.find('[placeholder="Search"]');
            const uid = box.dataset.uid;
            const username = box.find('[placeholder="username"]').textContent;
            const submit = form.find('[type="submit"]');

            if (checked) {
                console.log(search.parentNode.all('[data-uid="' + uid + '"]'), search.parentNode);
                if (search.parentNode.all('[data-uid="' + uid + '"]').length === 0) {
                    const text = document.createElement('text');
                    text.className = "background-color-0096c7 border-radius-50px color-fff flex flex-direction-row height-36px line-height-36px margin-x-10px margin-y-7px padding-x-10px";
                    text.dataset.uid = uid;
                    text.textContent = username;
                    text.dataset.tap = `event.target.closest("text").remove(); $('[data-uid="` + uid + `"] label').length > 0 ? $('[data-uid="` + uid + `"] label')[0].click() : null`;
                    text.insertAdjacentHTML('beforeend', '<n class="gg-close"></n>')
                    search.insertAdjacentHTML('beforebegin', text.outerHTML);
                    search.value = "";
                }
            } else {
                $(search.parentNode.all('[data-uid="' + uid + '"]')).remove();
            }

            submit.disabled = search.parentNode.all('[data-uid]').length === 0;
        },
        onkeydown: function(event) {
            var keyCode = event.keyCode;
            var target = event.target;
            if (keyCode === 13) {
                event.preventDefault();
            }

            const form = target.closest('form');
            var results = form.find('[data-columns="1"]');
            results.innerHTML = "";
        },
        onkeyup: function(event) {
            var keyCode = event.keyCode;
            var target = event.target;
            var username = target.value;

            if (keyCode === 13) {
                event.preventDefault();
            } else {
                target.style.width = 'auto';
                target.style.width = target.scrollWidth + 'px';

                if (username.length > 0) {
                    var data = new FormData();

                    const form = target.closest('form');
                    var vp = dom.body.find('page[data-page="/chat/with/"]');
                    var results = form.find('[data-columns="1"]');

                    const a = function(d) {
                        const data = JSON.parse(d);
                        const users = data.users;

                        if (users.length > 0) {
                            const form = target.closest('form');
                            var template = form.find('template').content.firstElementChild;
                            results.innerHTML = "";
                            var htm = "";

                            const search = form.find('[placeholder="Search"]');

                            var u = 0;
                            do {
                                const user = users[u];
                                const uid = user.uid;

                                var html = template.cloneNode(true);

                                const exists = search.parentNode.all('[data-uid="' + uid + '"]');
                                if (exists.length > 0) {
                                    html.find('[type="checkbox"]').setAttribute('checked', true)
                                }

                                html.classList.remove('hide');
                                html.dataset.uid = uid;
                                html.find('[placeholder="username"]').textContent = user.username;
                                html.find('[placeholder="Full Name"]').textContent = user.fullname;
                                results.insertAdjacentHTML('beforeend', html.outerHTML);
                                htm += html.outerHTML;
                                u++;
                            } while (u < users.length);
                            results.innerHTML = htm;
                        }
                    };
                    const b = function(error) {
                        console.log(error);
                        //alert(error.message);
                    };

                    window.yield ? window.yield.abort() : null;
                    window.yield = new AbortController()
                    window.signal = window.yield.signal

                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/search/users/" + username, {
                        signal
                    }).then(a).catch(b);
                }
            }
        },
        onsubmit: async function(event) {
            event.preventDefault();

            const form = event.target;
            const search = form.find('[placeholder="Search"]');
            const users = search.parentNode.all('[data-uid]');
            console.log('controller.convo.onsubmit', {
                users
            });

            if (users.length > 0) {
                var u = 0;
                var uids = [];
                do {
                    var user = users[u];
                    uids[u] = user.dataset.uid;
                    u++;
                } while (u < users.length);
                const convo = rout.ed.url(uids);
                ("/chat/with" + convo).router();
            }
        }
    },
    message: {
        onkeydown: function(event) {
            const keyCode = event.keyCode;
            if (keyCode === 13) {
                event.preventDefault();
            }
        },
        onkeyup: function(event) {
            const keyCode = event.keyCode;
            if (keyCode === 13) {
                event.preventDefault();
                const form = event.target.closest('form');
                const submit = form.find('[type="submit"]');
                submit.click();
            }
        },
        onsubmit: async function(event) {
            event.preventDefault();

            const jwt = auth.user() ? await auth.getIdToken() : null;

            if (jwt) {

                const form = event.target;
                const convo = rout.ed.dir(window.location.pathname);
                convo.splice(0, 2);
                console.log('controller.message.onsubmit', {
                    convo,
                    jwt
                });

                if (convo.length > 0) {

                    const textarea = form.find('textarea');
                    const message = textarea.value;
                    textarea.value = "";

                    const template = byId('template-message').content;
                    var elem = template.firstElementChild;
                    elem.find('text').textContent = message;
                    const html = elem.outerHTML;
                    const chatWithUs = byId('chat-with-us');
                    chatWithUs.insertAdjacentHTML('beforeend', html);
                    const insert = chatWithUs.lastElementChild;
                    insert.classList.add('opacity-50pc');

                    var data = new FormData();
                    //data.append("ref", ref);
                    data.append("jwt", jwt);
                    data.append("message", message);

                    const a = function(d) {
                        const data = JSON.parse(d);
                        console.log('POST message', data);
                        insert.classList.remove('opacity-50pc');
                    };
                    const b = function(error) {
                        console.log(error);
                        alert(error.message);
                    };
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/messages" + rout.ed.url(convo), {
                        data,
                        dataType: "POST"
                    }).then(a).catch(b);
                }

            }
        }
    },
    modal: {
        login: async()=>{
            const template = await ajax('/cdn/html/template/template.login.html');
            modal.card(template);
        }
    },
    my: {
        avatar: async(method)=>{
            if (method === "update") {
                const html = await ajax('/cdn/html/template/template.avatar.html');
                modal.card(html);
            }
            if (method === "delete") {
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                const jwt = auth.user() ? await auth.getIdToken() : null;
                if (jwt) {
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        console.log({
                            data
                        });
                    }
                    ajax(endpoint + "/photo/account/avatar?jwt=" + jwt, {
                        dataType: "DELETE"
                    }).then(a)
                }
            }
        }
        ,
        forgot: event=>{
            event.preventDefault();
            const form = event.target;
            const email = form.find('[type="email"]').value;
            firebase.auth().sendPasswordResetEmail(email).then(event=>{
                alert("Password reset email sent!");
            }
            ).catch((error)=>{
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            }
            );
        }
        ,
        gender: async()=>{
            const html = await ajax('/cdn/html/template/template.gender.html');
            modal.card(html);
        }
        ,
        login: (event,f)=>{
            event.preventDefault();
            auth.account.login(event).then(e=>(f ? f : '/').router()).catch(e=>{
                var code = e.code;
                var message = e.message;
                alert(message);
            }
            );
        }
        ,
        setup: event=>{
            auth.account.setup(event).then(d=>{
                console.log('my.setup then', {
                    d
                });
                var email = d.email;
                var password = d.password;
                auth.account.signin(email, password).then(e=>{
                    '/'.router();
                }
                ).catch(e=>{
                    console.log('my.setup signin catch', {
                        e
                    })
                }
                );
                console.log('setup.then', d);
            }
            ).catch(e=>{
                var message = e.message;
                var error = message.error;
                console.log('setup.catch', e);
                alert(error);
            }
            );
        }
    },
    feed: {
        copy: function(target) {
            const key = target.closest('[data-key]').dataset.key;
            const uid = key.split('.')[0];
            const link = window.location.protocol + '//' + window.location.host + '/photo/' + uid + '/';
            navigator.clipboard.writeText(link);
            modal.exit(target);
            byId('notification').classList.remove('transform-translateY-100pct');
            var load = setTimeout(function() {
                byId('notification').classList.add('transform-translateY-100pct');
            }, 5000)
        },
        delete: async function(target) {
            if (auth.user()) {
                const key = target.closest('[data-key]').dataset.key;

                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                const t = async(d)=>{
                    const data = JSON.parse(d);
                    const sel = '[data-uid="' + key.split('.')[0] + '"]';
                    $(sel).remove();
                    modal.exit(target);
                    console.log(data);
                }
                const c = async(e)=>{
                    console.log(e);
                }

                const jwt = await auth.getIdToken();
                ajax(endpoint + '/photo/posts/' + key + '?jwt=' + jwt, {
                    dataType: "DELETE"
                }).then(t).catch(c);
            }
        },
        like: async function(target) {
            if (auth.user()) {
                const post = target.closest('[data-uid]');
                const like = post.find('.gg-heart').closest('ico');
                const jwt = await auth.getIdToken();
                //console.log({jwt});
                if (like.classList.contains('color-ff3b30')) {
                    const a = function(data) {
                        like.classList.remove('color-ff3b30')
                        console.log('activity.like', data);
                    };
                    const b = function(error) {
                        console.log(error);
                        alert(error.message);
                    };
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/activity/like/" + post.dataset.uid + '?app=photo&jwt=' + jwt, {
                        dataType: "DELETE"
                    }).then(a).catch(b);
                } else {
                    const a = function(data) {
                        like.classList.add('color-ff3b30')
                        console.log('activity.like', data);
                    };
                    const b = function(error) {
                        console.log(error);
                        alert(error.message);
                    };
                    var data = new FormData();
                    data.append("app", "photo");
                    data.append("jwt", jwt);
                    data.append("ref", post.dataset.uid);
                    data.append("type", "like");
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/activity", {
                        data,
                        dataType: "POST"
                    }).then(a).catch(b);
                }
            }
        },
        more: async function(target) {
            var template = await ajax('/cdn/html/template/template.post.more.html');
            var html = new DOMParser().parseFromString(template, 'text/html').body.firstElementChild;
            console.log({
                html
            });
            var boxes = html.all('box');
            const card = target.closest('[data-uid]');
            const src = card.find('media [src]').src;
            const dir = rout.ed.dir(src);
            const key = dir[dir.length - 1];
            const uid = key.split('.')[0];
            const user = rout.ed.dir(target.closest('[data-uid]').find('picture').dataset.href)[1];
            html.dataset.key = key;
            boxes[2].dataset.uid = user;
            route.page === "/photo/*/" ? boxes[4].classList.add('hide') : null;
            boxes[4].dataset.href = '/photo/' + uid + '/';
            if (auth.user()) {
                if (auth.user().uid === user) {
                    boxes[0].classList.remove('display-none');
                    boxes[1].classList.add('display-none');
                    boxes[2].classList.add('display-none');
                } else {
                    boxes[0].classList.add('display-none');
                    boxes[1].classList.remove('display-none');
                    boxes[2].classList.remove('display-none');
                }
            } else {
                boxes[0].classList.add('display-none');
                boxes[2].classList.add('display-none');
            }
            const ppp = await modal.card(html.outerHTML);
        },
        save: async function(target) {
            if (auth.user()) {
                const post = target.closest('[data-uid]');
                const save = post.find('.gg-bookmark').closest('ico');
                const jwt = await auth.getIdToken();
                //console.log({jwt});
                if (save.classList.contains('color-ff3b30')) {
                    const a = function(data) {
                        save.classList.remove('color-ff3b30')
                        console.log('activity.save', data);
                    };
                    const b = function(error) {
                        console.log(error);
                        alert(error.message);
                    };
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/activity/save/" + post.dataset.uid + '?app=c829e5bc-f583-452b-8dbd-db3b0a6a5b07&jwt=' + jwt, {
                        dataType: "DELETE"
                    }).then(a).catch(b);
                } else {
                    const a = function(data) {
                        save.classList.add('color-ff3b30')
                        console.log('activity.save', data);
                    };
                    const b = function(error) {
                        console.log(error);
                        alert(error.message);
                    };
                    var data = new FormData();
                    data.append("app", "c829e5bc-f583-452b-8dbd-db3b0a6a5b07");
                    data.append("jwt", jwt);
                    data.append("ref", post.dataset.uid);
                    data.append("type", "save");
                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/activity", {
                        data,
                        dataType: "POST"
                    }).then(a).catch(b);
                }
            }
        },
        share: function() {}
    },
    post: {
        file: input=>{
            webcam.load.file(input).then(media=>{
                var file = media.file;
                var type = media.type;
                const camera = byId('camera');
                const photo = camera.find('#camera-photo');
                const elem = photo.find('img');
                elem.dataset.type = type;
                //elem.src = file;
                //controller.post.shot                        
                elem.src = byId('camera-canvas').toDataURL("image/jpeg", 1);
                controller.post.skip();
            }
            );
        }
        ,
        skip: target=>{
            var tabs = byId('post-tabs');
            var tab = tabs.find('[data-selected="true"]');
            var format = tab.dataset.format;
            var href = "/post/" + format + "/";
            href.router();
        }
        ,
        snap: target=>{
            var tabs = byId('post-tabs');
            var tab = tabs.find('[data-selected="true"]');
            var format = tab.dataset.format;
            if (['audio', 'merch', 'pages', 'photo'].includes(format)) {
                webcam.snap('photo');
                //controller.post.shot();
            } else if (['video'].includes(format)) {
                webcam.record.er && webcam.record.er.state === "recording" ? webcam.record.ed() : webcam.record.ing();
                //controller.post.shot();
            }
            controller.post.skip();
        }
        ,
        shot: ()=>{
            var post = byId('post');
            var postEr = byId('post-er');
            var postForm = byId('post-form');
            var postFormat = byId('post-format');
            var postFormatSubmit = byId('post-format-submit');
            var postHeader = byId('post-header');
            var postMedia = byId('post-media');
            var postOptions = byId('post-options');
            var camera = byId('camera');
            var cameraBack = byId('camera-back');
            var cameraDisable = byId('camera-disable');
            var cameraFlip = byId('camera-flip');
            var cameraNext = byId('camera-next');
            var cameraPermissions = byId('camera-permissions');
            var cameraVideo = camera.find('video');

            camera.className = "bg-e5e5e5 landscape-width-100vh margin-auto overflow-hidden padding-top-100pc portrait-width-100vw";
            cameraBack.classList.remove('hide');
            cameraDisable.classList.add('hide');
            cameraNext.classList.remove('hide');
            cameraFlip.classList.add('hide');
            cameraPermissions.classList.add('hide');
            cameraVideo.classList.add('hide');
            postEr.className = "absolute absolute-full align-center flex justify-center";
            postForm.className = "direction-row dw1000px-direction-column margin-auto max-width-100pc mobile-margin-0 mobile-max-width-100pc width-1280px";
            postMedia.className = "";
            postFormat.classList.add('hide');
            postHeader.classList.add('hide');
            postOptions.classList.add('hide');
        }
        ,
        submit: async(event)=>{
            event.preventDefault();

            const form = event.target;
            const submit = form.find('[type="submit"]');
            submit.disabled = true;

            const format = GET[1];
            if (["photo"].includes(format)) {
                const card = byId("post-" + format + "-metadata");
                if (format === "photo") {
                    const file = byId('post-file').files[0];
                    const img = byId('camera-photo').find('img');
                    const src = img.src;
                    if (file || src) {
                        var data = new FormData();
                        var elem = null;

                        data.append('base64', src);
                        file ? data.append('file', file) : null;

                        //elem = card.find("#post-photo-metadata-title input");
                        //elem.value === "" ? null : data.append("title", elem.value);

                        elem = card.find("#post-photo-metadata-details textarea");
                        caption = elem.value;
                        elem.value === "" ? null : data.append("caption", caption);

                        const people = byId("post-photo-metadata-people").dataset.people ? byId("post-photo-metadata-people").dataset.people : null;
                        people ? data.append("people", people) : null;

                        const tags = card.find("#post-photo-metadata-details textarea").value.split(' ').filter(tag=>tag.startsWith("#"));
                        data.append('tags', JSON.stringify(tags));

                        data.append("jwt", await auth.getIdToken());

                        var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                        const url = endpoint + "/photo/posts";
                        //const url = "https://api.uios.tld"+"/photo/posts";
                        var settings = {
                            data,
                            dataType: "POST"
                        };
                        console.log({
                            url,
                            settings
                        });
                        alert("Uploading " + format + " post.");
                        ajax(url, settings).then((d)=>{
                            var data = JSON.parse(d);
                            submit.disabled = false;
                            //'/post/photo/'+data.uid+'/'.router();
                            '/'.router();
                        }
                        ).catch(error=>{
                            console.log({
                                error
                            });
                            submit.disabled = false;
                        }
                        );
                    } else {
                        alert("You must add a photo.");
                        submit.disabled = false;
                    }
                }
            } else {
                alert("Format not supported.");
                submit.disabled = false;
            }
        }
        ,
        tags: async(target)=>{
            var template = await ajax('/cdn/html/template/template.post.photo.tags.html');
            var html = new DOMParser().parseFromString(template, 'text/html').body.firstElementChild;
            var people = JSON.parse(target.closest('[data-json]').dataset.json);
            if (people.length > 0) {
                const search = html.find('[placeholder="Search"]');
                var p = 0;
                do {
                    const person = people[p];
                    const uid = person.uid;
                    const username = person.username;

                    var template = html.all('template')[1].content.firstElementChild.cloneNode(true);
                    template.dataset.uid = uid;
                    template.find('[placeholder="username"]').textContent = username;
                    const list = html.find('#photo-tags-people');
                    list.insertAdjacentHTML('beforeend', template.outerHTML);
                    p++;
                } while (p < people.length);
            }
            const ppp = await modal.page(html.outerHTML);
            ppp.className = "align-items-center background-rgba-0-0-0-50pct flex justify-content-center height-100pct overflow-x-hidden position-fixed top-0 width-100pct";
            //ppp.firstElementChild.className = ppp.find('form > card').className;
        }
        ,
        type: target=>{
            var elem = target.closest('[data-format]');
            if (elem) {
                var camera = byId('camera');
                var cameraAspect = byId('camera-aspect');
                var optionsAspect = byId('post-options-aspect');
                var format = elem.dataset.format;
                var index = elem.index();
                var card = target.closest('card');
                var line = card.firstElementChild;
                line.dataset.transform = "translateX(" + index + "00%)";
                card.find('[data-selected]').removeAttribute('data-selected');
                elem.dataset.selected = true;
                if (format === "video") {
                    cameraAspect.classList.remove('aspect-ratio-1x1');
                    cameraAspect.classList.add('aspect-ratio-16x9');

                    optionsAspect.classList.remove('aspect-ratio-1x1');
                    optionsAspect.classList.add('aspect-ratio-16x9');
                } else {
                    cameraAspect.classList.remove('aspect-ratio-16x9');
                    cameraAspect.classList.add('aspect-ratio-1x1');

                    optionsAspect.classList.remove('aspect-ratio-16x9');
                    optionsAspect.classList.add('aspect-ratio-1x1');
                }
            }
        }
        ,
        untag: (target)=>{
            const box = target.closest('box');
            const uid = box.dataset.uid;
            $('[data-uid="' + uid + '"] label').length > 0 ? $('[data-uid="' + uid + '"] label')[0].click() : null;
            console.log(uid, $('[data-uid="' + uid + '"] label'));
            box.remove();
        }
    },
    system: {
        theme: type=>{
            window.tS = event=>{
                if (event.matches) {
                    document.body.dataset.theme = "dark";
                } else {
                    document.body.removeAttribute('data-theme');
                }
            }
            if (type === "system") {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.dataset.theme = "dark";
                } else {
                    document.body.removeAttribute('data-theme');
                }
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', tS);
            } else {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', tS);
            }

            if (type === "auto") {
                controller.system.time();
            } else {
                if (window.timer) {
                    clearTimeout(window.timer);
                    window.timer = 0;
                }
            }

            if (type === "light") {
                document.body.removeAttribute('data-theme');
            }

            if (type === "dark") {
                document.body.dataset.theme = "dark";
            }
        }
        ,
        time: function(io) {
            const today = new Date();
            let h = today.getHours();
            let hr = h > 12 ? h - 12 : (h ? h : 12);
            let m = checkTime(today.getMinutes());
            let s = checkTime(today.getSeconds());
            let ap = h < 12 ? "a" : "p";
            let t = hr + ":" + m + ":" + s;

            h > 6 && h < 18 ? document.body.removeAttribute('data-theme') : document.body.dataset.theme = "dark";

            window.timer = setTimeout(controller.system.time, 1000);

            function checkTime(i) {
                return (i = i < 10 ? "0" + i : i);
            }
        }
    },
    tags: {
        onchecked: async function(target) {
            console.log(target);
            const box = target.closest('box');
            const form = target.closest('form');
            const checked = target.checked;
            const search = form.find('[placeholder="Search"]');
            const uid = box.dataset.uid;
            const username = box.find('[placeholder="username"]').textContent;
            const submit = form.find('[type="submit"]');
            const list = form.find('#photo-tags-people');

            if (checked) {
                console.log(list.all('[data-uid="' + uid + '"]'));
                if (list.all('[data-uid="' + uid + '"]').length === 0) {
                    var doc = await ajax('/cdn/html/template/template.post.photo.tags.html');
                    var template = new DOMParser().parseFromString(doc, 'text/html').body.all("template")[1].content.firstElementChild.cloneNode(true);
                    template.dataset.uid = uid;
                    template.find('[placeholder="username"]').textContent = username;
                    list.insertAdjacentHTML('beforeend', template.outerHTML);
                }
            } else {
                $(list.all('[data-uid="' + uid + '"]')).remove();
            }

            //submit.disabled = search.parentNode.all('[data-uid]').length === 0;
        },
        onkeydown: function(event) {
            var keyCode = event.keyCode;
            var target = event.target;
            if (keyCode === 13) {
                event.preventDefault();
            }

            const form = target.closest('form');
            var results = form.find('[data-columns="1"]');
            results.innerHTML = "";
        },
        onkeyup: function(event) {
            var keyCode = event.keyCode;
            var target = event.target;
            var username = target.value;

            if (keyCode === 13) {
                event.preventDefault();
            } else {
                //target.style.width = 'auto';
                //target.style.width = target.scrollWidth + 'px';

                if (username.length > 0) {
                    var data = new FormData();

                    const form = target.closest('form');
                    var vp = dom.body.find('page[data-page="/chat/with/"]');
                    var results = form.find('[data-columns="1"]');

                    const a = function(d) {
                        const data = JSON.parse(d);
                        const users = data.users;

                        if (users.length > 0) {
                            const form = target.closest('form');
                            var template = form.find('template').content.firstElementChild;
                            results.innerHTML = "";
                            var htm = "";

                            const search = form.find('[placeholder="Search"]');

                            var u = 0;
                            do {
                                const user = users[u];
                                const uid = user.uid;

                                var html = template.cloneNode(true);

                                const exists = search.parentNode.all('[data-uid="' + uid + '"]');
                                if (exists.length > 0) {
                                    html.find('[type="checkbox"]').setAttribute('checked', true)
                                }

                                html.classList.remove('hide');
                                html.dataset.uid = uid;
                                html.find('[placeholder="username"]').textContent = user.username;
                                html.find('[placeholder="Full Name"]').textContent = user.fullname;
                                results.insertAdjacentHTML('beforeend', html.outerHTML);
                                htm += html.outerHTML;
                                u++;
                            } while (u < users.length);
                            results.innerHTML = htm;
                        }
                    };
                    const b = function(error) {
                        console.log(error);
                        //alert(error.message);
                    };

                    window.yield ? window.yield.abort() : null;
                    window.yield = new AbortController()
                    window.signal = window.yield.signal

                    var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/photo/search/users/" + username, {
                        signal
                    }).then(a).catch(b);
                }
            }
        }
    },
    users: {
        more: target=>{
            const a = function(ppp) {}
            modal.card(byId('template-users-user-more').content.firstElementChild.innerHTML).then(a);
        }
        ,
        profile: ()=>{
            var href = (auth.user() ? '/users/' + auth.user().uid + "/" : '/my/');
            //alert(href);
            href.router();
        }
        ,
        unfollow: target=>{
            const a = function(ppp) {
                ppp.find('card').dataset.uid = target.closest('wrap[data-uid]').dataset.uid
                ppp.find('picture').innerHTML = byId('users-user-avatar').innerHTML;
                ppp.find('[placeholder="@username"]').textContent = "@" + GET[1];
            }
            modal.card(byId('template-users-user-unfollow').content.firstElementChild.innerHTML).then(a);
        }
    }
});
