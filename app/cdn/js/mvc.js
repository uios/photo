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
: (window.mvc.v = view = function(route) {
  return new Promise(async function (resolve, reject) {
    var path = route.path;
    var get = route ? route.GOT : rout.ed.dir(dom.body.dataset.path);
    var root = get[0];
    GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

    if (root) {
      if(root === "activity") {
        var data = await ajax('https://codepen.io/anoniiimous/pen/ExEjPjO.html');
        var doc = new DOMParser().parseFromString(data,'text/html');
        var pages = doc.body.find('page');
        var vp = dom.body.find('[data-page="/'+root+'/"]');
        if(vp.innerHTML === "") {
          vp.innerHTML = pages.innerHTML;
        }
        if(get.length > 1) {
          //$('#tabs-activity > *').removeClass('color-000');
          if(get.length > 2) {
          } 
          else {
            if(get[2] === "alerts") {
              //byId('tab-activity-alerts').classList.add('color-000');
            }
          }
        } 
        else {
          //byId('tab-activity').classList.add('color-000');          
        }
      }
      if(root === "chat") {
        var data = await ajax('https://codepen.io/anoniiimous/pen/MWVwvjG.html');
        var doc = new DOMParser().parseFromString(data,'text/html');
        var pages = doc.body.find('pages');
        var vp = dom.body.find('[data-root="'+root+'"]');
        if(vp.innerHTML === "") {
          vp.innerHTML = pages.innerHTML;
        }
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
          var data = await ajax('https://codepen.io/anoniiimous/pen/LYdPjdy.html');
          var doc = new DOMParser().parseFromString(data,'text/html');
          var page = doc.body.find('page');
          var block = page.find('block');
          block.classList.add('fg-lightgray');
          block.classList.add('margin-top-70px');
          block.classList.add('max-width-960px');
          block.classList.add('mobile-margin-bottom-50px');
          var html = page.innerHTML;
          rout.er().innerHTML = html;
        }
      }
      if(root === "my") {
        if(get.length > 1) {
        } 
        else {
          var data = await ajax('https://codepen.io/anoniiimous/pen/NWyNdGp.html');
          var doc = new DOMParser().parseFromString(data,'text/html');
          var page = doc.body.find('page');
          //page.find('block').classList.add('margin-y-50px');
          var html = page.innerHTML;
          rout.er().innerHTML = html;
        }
      }
      if(root === "post") {
        var data = await ajax('https://codepen.io/anoniiimous/pen/KKowBzg.html');
        var doc = new DOMParser().parseFromString(data,'text/html');
        var pages = doc.body.find('pages');
        var vp = dom.body.find('[data-root="'+root+'"]');
        if(vp.innerHTML === "") {
          vp.innerHTML = pages.innerHTML;
        }
        if(get.length > 1) {
          //$('#tabs-activity > *').removeClass('color-000');
          if(get.length > 2) {
          } 
          else {
            if(get[2] === "alerts") {
              //byId('tab-activity-alerts').classList.add('color-000');
            }
          }
        } 
        else {
          //byId('tab-activity').classList.add('color-000');          
        }
      }
      if(root === "users") {
        var data = await ajax('https://codepen.io/anoniiimous/pen/NWYPWab.html');
        var doc = new DOMParser().parseFromString(data,'text/html');
        var pages = doc.body.find('pages');
        var vp = dom.body.find('[data-root="'+root+'"]');
        if(vp.innerHTML === "") {
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
  users: {
    profile: () => {
      var href = (auth.user() ? '/users/'+auth.user().uid+"/" : '/my/');
      //alert(href);
      href.router();
    }
  }
});
