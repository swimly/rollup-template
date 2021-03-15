! function () {
  function e() {
    $('.start').each(function(){
      var group = $(this).nextUntil('.end')
      var card = $(group).wrapAll('<div class="card"></div>')
    })
    $('.card').find('.phone').click(function(){
      $(this).next('pre').toggle()
    })
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
