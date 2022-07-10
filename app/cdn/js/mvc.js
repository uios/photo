window.mvc ? null : (window.mvc = {});

window.mvc.m
  ? null
: (window.mvc.m = model = {
  error: {
    code: async(e,v) => {
      var code = e.code;
      if(code === 404) {
        var elem = document.createElement('error');
        elem.innerHTML = await ajax('/cdn/html/error/error.404.html');
        v.insertAdjacentHTML('afterbegin', elem.outerHTML);
      }
    }
  }
});

window.mvc.v
  ? null
: (window.mvc.v = view = function (route) { console.log(route);
  return new Promise(async function (resolve, reject) {
    var path = route.path;
    var get = route ? route.GOT : rout.ed.dir(dom.body.dataset.path);
    var root = get[0];
    GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);
    console.log(get,path);

    if (root) {
      if(root === "chat") {
        var vp = dom.body.find('[data-root="'+root+'"]');
        vp.dataset.zIndex = 3;
        vp.dataset.mobileZIndex = 9;
        
        if (get.length > 1) {
          if(get.length > 2) {
            if(get[1] === "with") {
              if(get[2]) {
                byId('convos').dataset.zIndex = 1;
              }
            }
          } else {
            if(get[1] === "with") {

            }
          }
        }
        else {              
          byId('convos').dataset.zIndex = 2;
        }
      }
      if(root === "find") {
        if(get.length > 1) {
        } 
        else {
          var vp = rout.er();
          if(vp.innerHTML === "") {
            var data = await ajax('/cdn/html/page/page.find.html');
            var doc = new DOMParser().parseFromString(data,'text/html');
            var page = doc.body.find('page');
            var block = page.find('block');
            var html = page.innerHTML;
            vp.innerHTML = html;
          }
          else {
            block = vp.find('block');
            block.classList.add('fg-lightgray');
            block.classList.add('margin-top-70px');
            block.classList.add('max-width-960px');
            block.classList.add('mobile-margin-bottom-50px');
          }
        }
      }
      if(root === "my") {
        if(get.length > 1) {
        } 
        else {
          var vp = rout.er();
          if(vp.innerHTML === "") {
            var data = await ajax('/cdn/html/page/page.my.html');
            var doc = new DOMParser().parseFromString(data,'text/html');
            var page = doc.body.find('page');
            //page.find('block').classList.add('margin-y-50px');
            var html = page.innerHTML;
            vp.innerHTML = html;
          }
        }
      }
      if(root === "post") {
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

        if(get.length > 1) {
          if(get.length > 2) {
          } 
          else {
            var format = get[1];
            if(format === "photo") {
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
            if(format === "video") {            
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
        } 
        else {
          postEr.removeAttribute('class');
          postForm.className = "direction-row margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px dw1000px-direction-column";
          postFormat.className = "flex-1";
          postHeader.className = "dw960px-margin-x-auto dw960px-width-480px margin-right max-width-100pc width-320px";
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
      }
      if(root === "users") {
        if(get.length > 1) {
          ajax(api.endpoint+'/v1/users/'+get[1])
            .then(user => {
              if(user) {
                var json = JSON.parse(user);
                //console.log('mvc.v users user /v1/users/'+get[1],{json,route});

                var username = get[1] = json.user.username;

                byId('users-user-username').textContent = username;

                route = rout.e(rout.ed.url(get));

                //console.log('mvc.v users user route',{route,paths});
              }
            }).catch((e) => {
              console.log('mvc.v users user /v1/users/:user catch',{e});
              model.error.code(e,dom.body.find('pages[data-root="'+root+'"]'));
            });

          $('#tabs-profile > *').removeClass('color-000');
          if(get.length > 2) {
            if(get[2] === "saved") {
              byId('tab-user-profile-saved').classList.add('color-000');
            }
            else if(get[2] === "tagged") {
              byId('tab-user-profile-tagged').classList.add('color-000');
            }
          } 
          else {
            byId('tab-user-profile').classList.add('color-000');
            //var html = page.innerHTML;
            //rout.er().innerHTML = html;
          }
        }              
        resolve(route);
      }
      resolve(route);
    } 
    else {
      document.body.removeAttribute("data-profile");
      //var card = byId("post").content.firstElementChild;
      //var json = await ajax("https://api-anon.herokuapp.com/v1/posts/read");
      //var posts = JSON.parse(json);
      //console.log({ posts });
      //var clone = card.cloneNode(true);
      //var media = clone.find(".media");
      //var html = mvc.m.posts.read(posts.rows);
      //console.log(byId("feed"), { html });
      //byId("feed").innerHTML = html;
      resolve(route);
    }
  });
});

window.mvc.c 
  ? null
: (window.mvc.c = controller = {
  my: {
    login: event => {
      event.preventDefault();
      auth.account.login(event)
        .then(e => '/'.router())
        .catch(e => {
          var code = e.code;
          var message = e.message;
          alert(message);
        });
    },
    setup: event => {
      auth.account.setup(event).then(d => {
        console.log('my.setup then',{d});
        var email = d.email;
        var password = d.password;
        auth.account.signin(email, password)
          .then(e => {
            '/'.router();
          })
          .catch(e => {
            console.log('my.setup signin catch',{e})
          });
        console.log('setup.then',d);
      }).catch(e => {
        var message = e.message;
        var error = message.error;
        console.log('setup.catch',e);
        alert(error);
      });
    }
  },
  post: {
    skip: target => {
      var tabs = byId('post-tabs');
      var tab = tabs.find('[data-selected="true"]');
      var format = tab.dataset.format;
      var href = "/post/"+format+"/";
      href.router();
    },
    snap: target => {
      var tabs = byId('post-tabs');
      var tab = tabs.find('[data-selected="true"]');
      var format = tab.dataset.format;
      if(['audio','merch','pages','photo'].includes(format)) {
        webcam.snap('photo');
        controller.post.shot();
      }
      else if(['video'].includes(format)) {
        webcam.record.er && webcam.record.er.state === "recording" ? webcam.record.ed() : webcam.record.ing();
        controller.post.shot();
      }
    },
    shot: () => {      
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
    },
    type: target => {
      var elem = target.closest('[data-format]');
      if(elem) {
        var camera = byId('camera');
        var cameraAspect = byId('camera-aspect');
        var optionsAspect = byId('post-options-aspect');
        var format = elem.dataset.format;
        var index = elem.index();
        var card = target.closest('card');
        var line = card.firstElementChild;
        line.dataset.transform = "translateX("+index+"00%)";
        card.find('[data-selected]').removeAttribute('data-selected');
        elem.dataset.selected = true;
        if(format === "video") {
          cameraAspect.classList.remove('aspect-ratio-1x1');
          cameraAspect.classList.add('aspect-ratio-16x9');
                                     
          optionsAspect.classList.remove('aspect-ratio-1x1');
          optionsAspect.classList.add('aspect-ratio-16x9');
        } 
        else {
          cameraAspect.classList.remove('aspect-ratio-16x9');
          cameraAspect.classList.add('aspect-ratio-1x1');
          
          optionsAspect.classList.remove('aspect-ratio-16x9');
          optionsAspect.classList.add('aspect-ratio-1x1');
        }
      }
    }
  },
  users: {
    profile: () => {
      var href = (auth.user() ? '/users/'+auth.user().uid+"/" : '/my/');
      //alert(href);
      href.router();
    }
  }
});
