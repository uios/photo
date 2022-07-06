window.mvc ? null : (window.mvc = {});

window.mvc.m
  ? null
: (window.mvc.m = model = {
  posts: {
    read: (posts) => {
      var html = ``;
      if(posts && posts.length > 0) {
        var i = 0;
        do {
          var post = posts[i]; //console.log(i,{post});
          var files = JSON.parse(post.files);
          //clone.find('[placeholder="username"]').textContent = username;
          //clone.find('[placeholder="username"]').dataset.href = '/users/'+username+'/';
          if(files) {
            var id = post.id;
            var format = post.format;
            var source = post.source;
            var user = post.user;
            var username = post.username;
            //html += `<section>`;
            html += `<box class="relative" data-id="`+id+`" data-format="`+format+`" data-user="`+user+`">`;
            html += `<header data-display="flex">
                  <box class="flex" data-api="controller" data-flex-direction="row" data-method="users" data-resource="index">
                    <picture class="cell-30px bg-black border-radius-50pc margin-10px" data-api="controller" data-method="users" data-resource="index">
                      <img class="absolute absolute-full" src="https://cdn.spriii.com/file/spriii/users/avi/`+user+`.jpg">
                    </picture>
                    <text class="bolder fg-black line-height-50px" data-flex="1">`+post.username+`</text>
                  </box>
                  <icon data-margin-left="auto"><div class="gg-more-alt"></div></icon>
                  <!--<box class="cell spriii"><div class="lippsis"></div><div class="lippsis"></div><div class="lippsis"></div></box>-->
                </header>`;

            if(format === "photo") {
              html += `<section><picture class="aspect-ratio-1x1 bg-lightgray border-radius-10px shadow"><img class="absolute absolute-full" data-src="`+post.source+`"></picture></section>`;
            }
            else if(format === "video") {
              if(source.includes("youtube.com")) {
                html += `<iframe class="absolute absolute-full" data-src="`+post.source+`"></iframe>`;
              } else {
                html += `<video class="absolute absolute-full border-radius-10px fit-cover" autoplay loop muted playsinline><source data-src="`+post.source+`" type="video/mp4"></source></video>`;
              }
            }
            else if(format === "audio") {
              html += `<section class="aspect-ratio-1x1 border-radius-10px paper shadow">`+post.source+`</section>`;
              html += `<audio class="width-100pc" controls><source data-src="`+post.source+`"></source></audio>`;
            }
            else if(format === "words") {
              html += `<section class="border-radius-10px paper shadow">`+post.source+`</section>`;
            }
            else {
              html += `<section><picture class="aspect-ratio-1x1 bg-lightgray border-radius-10px shadow"><img class="absolute absolute-full" data-src="`+cdn+JSON.parse(post.files).name+`"></picture></section>`;
            }

            html += `<footer data-display="flex">
                  <icon><div class="gg-heart"></div></icon>
                  <icon><div class="gg-comment"></div></icon>
                  <icon><div class="gg-share"></div></icon>
                  <icon data-margin-left="auto"><div class="gg-bookmark"></div></icon>
                </footer>`;
            html += `</box>`;
            //html += `</section>`;
          }
          //console.log({posts,post},html);
          i++; } while(i < posts.length);
      }

      return html;
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
        dom.camera = byId('camera');        
        var post = byId('post');
        var postEr = byId('post-er');
        var postForm = byId('post-form');
        var postFormat = byId('post-format');
        var postFormatSubmit = byId('post-format-submit');
        var postHeader = byId('post-header');
        var postMedia = byId('post-media');
        var postOptions = byId('post-options');
        var camera = byId('camera');
        var cameraPermissions = byId('camera-permissions');
        if(get.length > 1) {
          if(get.length > 2) {
          } 
          else {
            var format = get[1];
            if(format === "photo") {
              postEr.className = "dw1000px-padding-y-20px dw1000px-width-600px margin-x-auto max-width-100pc mobile-padding-top-0 width-50pc";
              postForm.className = "direction-row dw1000px-direction-column dw1000px-margin-x-auto margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px";
              postFormat.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-left-20px max-width-100pc mobile-max-width-100pc-20px mobile-padding-x-10px";
              postFormatSubmit.className = "flex-1 dw1000px-width-600px dw1000px-margin-x-auto margin-y-20px max-width-100pc";
              postHeader.className = "hide";
              postMedia.className = "dw1000px-width-600px margin-x-auto max-width-100pc dw960px-padding-bottom-0";
              postOptions.className = "hide";
              camera.className = "bg-e5e5e5 border-radius-20px dw960px-width-100pc mobile-border-radius-0 mobile-margin-0 overflow-hidden width-100pc";
              cameraPermissions.className = "hide";
            }
          }
        } 
        else {
          postEr.removeAttribute('class');
          postForm.className = "direction-row margin-auto max-width-100pc-40px mobile-margin-0 mobile-max-width-100pc width-1280px dw1000px-direction-column";
          postFormat.className = "flex-1";
          postHeader.className = "dw960px-width-480px margin-x-auto max-width-100pc";
          postMedia.className = "dw960px-width-480px margin-x-auto max-width-100pc mobile-padding-0 padding-y-36px dw960px-padding-bottom-0";
          postOptions.className = "dw960px-width-100pc width-50pc";
          camera.className = "bg-e5e5e5 border-radius-20px dw960px-width-100pc mobile-border-radius-0 mobile-margin-0 overflow-hidden width-50pc";
          cameraPermissions.className = "absolute absolute-full height-120px margin-auto text-align-center webcam-hide width-200px";
        }      
      }
      if(root === "users") {
        var vp = dom.body.find('[data-root="users"]');
        if(vp.innerHTML === "") {
          var data = await ajax('/cdn/html/pages/pages.users.html');
          var doc = new DOMParser().parseFromString(data,'text/html');
          var pages = doc.body.find('pages');
          vp.innerHTML = pages.innerHTML;
        }
        if(get.length > 1) {
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
        var format = elem.dataset.format;
        var index = elem.index();
        var card = target.closest('card');
        var line = card.firstElementChild;
        line.dataset.transform = "translateX("+index+"00%)";
        card.find('[data-selected]').removeAttribute('data-selected');
        elem.dataset.selected = true;
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
