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
        var path = route.path;
        var get = route ? route.GOT : rout.ed.dir(dom.body.dataset.path);
        var root = get[0];
        GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);
        console.log(get, path);

        if (root) {
            if (root === "activity") {
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
                var vp = dom.body.find('[data-root="' + root + '"]');
                vp.dataset.zIndex = 3;
                vp.dataset.mobileZIndex = 9;

                if (get.length > 1) {
                    if (get.length > 2) {
                        if (get[1] === "with") {
                            if (get[2]) {
                                byId('convos').dataset.zIndex = 1;
                            }
                        }
                    } else {
                        if (get[1] === "with") {}
                    }
                } else {
                    byId('convos').dataset.zIndex = 2;
                }
                resolve(route);
            } else if (root === "find") {
                if (get.length > 1) {} else {}
                resolve(route);
            } else if (root === "my") {
                if (get.length > 1) {
                    if (get[1] === "account") {
                        const menu = byId("my-account-menu");
                        if (get.length > 2) {
                            menu.classList.add('tablet-hide');
                        } else {
                            menu.classList.remove('tablet-hide');
                        }
                    }
                }
                resolve(route);
            } else if (root === "post") {
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

                if (get.length > 1) {
                    if (get.length > 2) {} else {
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
                    ajax(api.endpoint + '/v1/users/' + get[1]).then(async(user)=>{
                        var error = v.find('error');
                        error ? error.remove() : null;

                        var json = JSON.parse(user);
                        //console.log('mvc.v users user /v1/users/'+get[1],{json,route});

                        var uid = json.user.uid;
                        var fullname = json.user.fullname;
                        var username = get[1] = json.user.username;

                        //var avi = document.createElement('img');
                        //avi.onerror = e => model.error.image(avi);
                        var avi = byId('users-user-avatar');
                        var img = avi.firstElementChild;
                        img.src = cdn.endpoint + "/" + uid + "/avi.jpg";

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
                            ajax(api.endpoint + '/v1/posts/' + uid).then(async(d)=>{
                                var data = JSON.parse(d);
                                var posts = data.posts;
                                if (posts) {
                                    var html = await ajax('/cdn/html/template/template.post.card.grid.html');
                                    var template = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
                                    byId('users-user-posts').innerHTML = "";
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
                            ).catch((e)=>{
                                console.log('mvc.v users user /v1/posts/:user catch', {
                                    e
                                });
                                resolve(route);
                            }
                            );
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
            ajax(api.endpoint + '/v1/posts/').then(async(d)=>{
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
