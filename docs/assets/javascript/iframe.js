! function () {
  function e() {
    var url = window.location.href.replace('#/', '').replace('/readme', '')
    $(`
      <div class="iframe">
        <iframe src="${url}"></iframe>
      </div>
    `).appendTo('.content')
    $('main').scroll(function(){
      if ($(this).scrollTop() > 0) {
        $('.iframe').addClass('fixed')
      } else {
        $('.iframe').removeClass('fixed')
      }
    })
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
