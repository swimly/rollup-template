! function () {
  function e() {
    var url = window.location.href.replace('#/', '').replace('/readme', '')
    if (url.indexOf('?preview=1') >= 0) {
      $('.markdown-section').removeClass('full')
      var iframe = $(`
        <div class="iframe">
          <iframe src="${url}"></iframe>
        </div>
      `).appendTo('.content')
      var pos = iframe[0].getBoundingClientRect()
      $('main').scroll(function(){
        console.log($(this).scrollTop())
        if ($(this).scrollTop() > 145) {
          $('.iframe').addClass('fixed')
          $('.iframe').css('left', pos.x + 'px')
          $('.iframe').css('right', 'auto')
        } else {
          $('.iframe').removeClass('fixed')
          $('.iframe').removeAttr('style')
        }
      })
    } else {
      $('.iframe').remove()
      $('.markdown-section').addClass('full')
    }
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
