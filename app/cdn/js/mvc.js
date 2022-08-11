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
    }
});

window.mvc.v ? null : (window.mvc.v = view = function(route) {
    console.log(route);
    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var get = route ? route.GOT : rout.ed.dir(dom.body.dataset.path);
        var root = get[0];
        GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);
        //console.log(get, path);

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
                } else {//byId('tab-activity').classList.add('color-000');          
                }
                resolve(route);
            } else if (root === "chat") {
                var vp = dom.body.find('[data-pages="/chat/"]');
                vp.dataset.zIndex = 9;
                vp.dataset.mobileZIndex = 9;

                if (get.length > 1) {
                    if (get.length > 2) {
                        if (get[1] === "edit") {
                            resolve(route);
                        }
                        if (get[1] === "with") {
                            if (get.length > 2) {
                                const jwt = auth.user() ? await auth.getIdToken() : null;
                                if (jwt) {
                                    byId('convos').dataset.zIndex = 1;
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
                                            const messages = data.messages;
                                            if (messages.length > 0) {
                                                var m = 0;
                                                do {
                                                    const row = messages[m];
                                                    const message = row.message;
                                                    const template = byId('template-message').content;
                                                    var elem = template.firstElementChild;
                                                    elem.find('text').textContent = message;
                                                    const html = elem.outerHTML;
                                                    chatWithUs.firstElementChild.insertAdjacentHTML('afterend', html);
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
                                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                                    var convo = GET;
                                    convo.splice(0, 2);
                                    const uri = endpoint + "/v1/messages" + rout.ed.url(convo) + "?jwt=" + jwt;
                                    ajax(uri).then(a).catch(b);
                                }
                            } else {
                                resolve(route);
                            }
                        }
                    } else {
                        if (get[1] === "with") {}
                        resolve(route);
                    }
                } else {
                    byId('convos').dataset.zIndex = 2;

                    const jwt = auth.user() ? await auth.getIdToken() : null;
                    if (jwt) {
                        const a = async function(d) {
                            const data = JSON.parse(d);
                            console.log(150, {
                                data
                            });
                            const messages = data.messages;
                            const user = data.user;

                            vp.find('[placeholder="username"]').textContent = user.username;

                            if (messages.length > 0) {
                                const convos = byId('chat-convos');
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
                                        img.setAttribute("onerror", 'this.src = "/cdn/svg/user.svg"');
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

                            resolve(route);
                        }
                        const b = async function(error) {
                            const message = error.message;
                            console.log(message);
                            resolve(route);
                        }

                        var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                        const uri = endpoint + "/v1/messages?jwt=" + jwt;
                        console.log(uri);
                        ajax(uri).then(a).catch(b);
                    } else {
                        resolve(route);
                    }
                }
            } else if (root === "find") {
                if (get.length > 1) {} else {}
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
                    }
                }
                resolve(route);
            } else if (root === "photo") {
                if (get.length > 1) {
                    var vp = dom.body.find('pages[data-pages="' + route.root + '"]');
                    console.log({
                        vp,
                        route
                    });
                    var uid = get[1];

                    const postComments = vp.find('[data-order="3"]').all('box')[0].find('column');

                    const jwt = auth.user() ? await auth.getIdToken() : null;
                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                    endpoint += '/v1/posts/' + uid;
                    endpoint += (auth.user() ? '?jwt=' + jwt : '');
                    ajax(endpoint).then(async function(d) {
                        var data = JSON.parse(d);
                        var comments = data.comments;
                        var post = data.post;
                        var user = data.user;
                        var uid = post.uid;
                        var ext = post.format;
                        var liked = post.liked;
                        var likes = post.likes;
                        var username = post.username;

                        var block = vp.find('block');
                        block.dataset.uid = uid;

                        var photoPost = byId('photo-post');
                        var src = cdn.endpoint + "/" + user + "/photo/" + uid + "." + ext;
                        photoPost.find('img').src = src;

                        var profile = vp.find('[data-tablet-order="1"]');
                        profile.all('box')[0].dataset.href = "/users/" + username + "/";
                        profile.find('picture img').src = cdn.endpoint + "/" + user + "/avi.jpg";
                        profile.find('[placeholder="username"]').textContent = username;

                        if (postComments.find('[data-columns]').children.length === 1 && comments && comments.length > 0) {
                            var template = postComments.find('[data-columns]').firstElementChild;
                            var html = template.cloneNode(true);
                            html.classList.remove('hide');
                            var c = 0;
                            do {
                                var comment = comments[c];
                                html.find('picture img').dataset.src = cdn.endpoint + "/" + comment.user + "/avi.jpg";
                                html.all('text span')[0].textContent = comment.username;
                                html.all('text span')[1].textContent = comment.comment;
                                postComments.find('[data-columns]').insertAdjacentHTML('beforeend', html.outerHTML);
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
                }
            } else if (root === "post") {
                var vp = dom.body.find('pages[data-root="' + root + '"]');

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

                            var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                            ajax(endpoint + "/v1/posts/" + uid).then(function(d) {
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
            } else if (root === "users") {
                if (get.length > 1) {
                    var v = dom.body.find('pages[data-root="' + root + '"]');
                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                    ajax(endpoint + '/v1/users/' + get[1]).then(async(user)=>{
                        var error = v.find('error');
                        error ? error.remove() : null;

                        var json = JSON.parse(user);
                        //console.log('mvc.v users user /v1/users/'+get[1],{json,route});

                        var uid = json.user.uid;
                        var fullname = json.user.fullname;
                        var username = get[1] = json.user.username;

                        var avi = byId('users-user-avatar');
                        var img = document.createElement('img');
                        img.className = "bg-black border-radius-50pc border-5px-solid border-color-fff height-100pc-10px width-100pc-10px";
                        img.onerror = e=>model.error.image(avi.firstElementChild);
                        img.src = cdn.endpoint + "/" + uid + "/avi.jpg";
                        avi.innerHTML = img.outerHTML;

                        if (fullname) {
                            byId('users-user-fullname').textContent = fullname;
                            byId('users-user-fullname').classList.remove('hide');
                        }
                        if (fullname) {
                            var about = byId('users-user-fullname').closest('box');
                            about.classList.remove('hide');
                        }
                        byId('users-user-username').textContent = username;

                        route = rout.e(rout.ed.url(get));

                        console.log('mvc.v users user route', {
                            route,
                            paths
                        });

                        $('#tabs-profile > *').removeClass('color-000');
                        if (get.length > 2) {
                            if (get[2] === "feed") {
                                byId('tab-user-profile-feed').classList.add('color-000');
                            }
                            if (get[2] === "saved") {
                                byId('tab-user-profile-saved').classList.add('color-000');
                            } else if (get[2] === "tagged") {
                                byId('tab-user-profile-tagged').classList.add('color-000');
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
                                    var boxes = card.all('box');

                                    var format = "";
                                    if (['jpg'].includes(ext)) {
                                        format = "photo";
                                    } else if (['mp4'].includes(ext)) {
                                        format = "video";
                                    }
                                    boxes[0].find('picture img').dataset.src = cdn.endpoint + "/" + uid + "/" + format + "/" + post.uid + "." + ext;

                                    byId('users-user-posts').insertAdjacentHTML('afterbegin', card.outerHTML);
                                    p++;
                                } while (p < posts.length);
                            }
                            resolve(route);

                        }
                    }
                    ).catch((e)=>{
                        console.log('mvc.v users user /v1/users/:user catch', {
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
        } else {
            var v = dom.body.find('page[data-page="/"]');
            const jwt = auth.user() ? await auth.getIdToken() : null;
            var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
            endpoint += '/v1/posts';
            endpoint += (auth.user() ? '?jwt=' + jwt : '');
            ajax(endpoint).then(async(d)=>{
                var data = JSON.parse(d);
                var posts = data.posts;
                var feed = byId('feed-index-posts');
                var lastFeedId = feed.innerHTML === "" ? 0 : parseInt(feed.firstElementChild.dataset.id);
                var lastPostId = parseInt(posts[posts.length - 1].id);

                if (lastPostId > lastFeedId && posts.length > 0) {
                    //var html = '';
                    var p = 0;
                    do {
                        var template = await ajax('/cdn/html/template/template.post.card.column.html');
                        var html = new DOMParser().parseFromString(template, "text/html").body;

                        var post = posts[p];
                        var caption = post.caption;
                        var created = post.created;
                        var ext = post.format;
                        var uid = post.uid;
                        var user = post.user;
                        var username = post.username;
                        var liked = post.liked;
                        var likes = post.likes;

                        var card = html.firstElementChild.cloneNode(true);
                        var boxes = card.all('box');
                        card.dataset.uid = uid;

                        var profile = boxes[0].find('span');
                        var avi = boxes[0].find('picture img');
                        var owner = boxes[0].find('text');
                        profile.dataset.href = "/users/" + username + "/";
                        avi.dataset.src = cdn.endpoint + "/" + user + "/avi.jpg";
                        owner.textContent = username;

                        var media = boxes[1].find('media');
                        var content = document.createElement('img');
                        var format = "";
                        if (["jpg"].includes(ext)) {
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

                        var date = boxes[6].find('text');
                        date.textContent = model.time.date(new Date(created).getTime());

                        //html += card.outerHTML;
                        feed.insertAdjacentHTML('afterbegin', card.outerHTML);
                        p++;
                    } while (p < posts.length);
                    //feed.innerHTML = html;
                }

                resolve(route);
            }
            ).catch((e)=>{
                console.log('mvc.v users user /v1/users/:user catch', {
                    e
                });
                model.error.code(e, v);
                resolve(route);
            }
            );
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
                    var template = postComments.find('[data-columns]').firstElementChild;
                    var html = template.cloneNode(true);
                    html.classList.remove('hide');
                    html.all('text span')[0].textContent = comment.username;
                    html.all('text span')[1].textContent = comment.comment;
                    postComments.find('[data-columns]').firstElementChild.insertAdjacentHTML('afterend', html.outerHTML);
                };
                const b = function(error) {
                    console.log(error);
                    alert(error.message);
                };
                var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                ajax(endpoint + "/v1/comments", {
                    data,
                    dataType: "POST"
                }).then(a).catch(b);
            }
        }
    },
    convo: {
        onchecked: function(target) {
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
                    text.className = "background-color-0096c7 border-radius-50px color-fff height-36px line-height-36px margin-x-10px margin-y-7px padding-x-10px";
                    text.dataset.uid = uid;
                    text.textContent = username;
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

            var vp = dom.body.find('page[data-page="/chat/with/"]');
            var results = vp.find('[data-columns="1"]');
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

                    var vp = dom.body.find('page[data-page="/chat/with/"]');
                    var results = vp.find('[data-columns="1"]');

                    const a = function(d) {
                        const data = JSON.parse(d);
                        const users = data.users;

                        if (users.length > 0) {
                            var template = vp.find('template').content.firstElementChild;
                            results.innerHTML = "";
                            var htm = "";

                            const form = target.closest('form');
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

                    if (window.yield) {
                        window.yield.abort();
                    }
                    window.yield = new AbortController()
                    window.signal = window.yield.signal;

                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/v1/search/users/" + username, {
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
                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/v1/messages" + rout.ed.url(convo), {
                        data,
                        dataType: "POST"
                    }).then(a).catch(b);
                }

            }
        }
    },
    my: {
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
        login: event=>{
            event.preventDefault();
            auth.account.login(event).then(e=>'/'.router()).catch(e=>{
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
                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/v1/activity/like/" + post.dataset.uid + '?app=photo&jwt=' + jwt, {
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
                    var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                    ajax(endpoint + "/v1/activity", {
                        data,
                        dataType: "POST"
                    }).then(a).catch(b);
                }
            }
        },
        more: async function(target) {
            var template = await ajax('/cdn/html/template/template.post.more.html');
            var html = new DOMParser().parseFromString(template, 'text/html').body[auth.user() ? 'firstElementChild' : 'firstElementChild'];
            var boxes = html.all('box');
            const uid = target.closest('[data-uid]').dataset.uid;
            dom.body.dataset.page === "/photo/*/" ? boxes[3].classList.add('hide') : boxes[3].dataset.tap = '("/photo/' + uid + '").router().then(modal.exit(event.target))';
            modal.card(html.outerHTML);
        },
        save: function() {},
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
                elem.src = file;
                controller.post.shot();
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
                controller.post.shot();
            } else if (['video'].includes(format)) {
                webcam.record.er && webcam.record.er.state === "recording" ? webcam.record.ed() : webcam.record.ing();
                controller.post.shot();
            }
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
                    //const img = byId('camera-photo').find('img');
                    //const src = img.src;
                    if (file) {
                        var data = new FormData();
                        var elem = null;

                        //data.append('base64', src);            
                        data.append('file', file);

                        //elem = card.find("#post-photo-metadata-title input");
                        //elem.value === "" ? null : data.append("title", elem.value);

                        elem = card.find("#post-photo-metadata-details textarea");
                        elem.value === "" ? null : data.append("caption", elem.value);

                        var tags = null;
                        const elems = card.all("#post-photo-metadata-tags section > text");
                        if (elems.length > 0) {
                            tags = [];
                            var e = 0;
                            do {
                                var elem = elems[e];
                                var tag = elem.textContent;
                                tags[e] = tag;
                                e++;
                            } while (e < elems.length);
                            data.append("tags", tags);
                        }

                        data.append("jwt", await auth.getIdToken())

                        const url = api.endpoint + "/v1/posts";
                        //const url = "https://api.uios.tld"+"/v1/posts";
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
    },
    users: {
        profile: ()=>{
            var href = (auth.user() ? '/users/' + auth.user().uid + "/" : '/my/');
            //alert(href);
            href.router();
        }
    }
});
