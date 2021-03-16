! function () {
  function e() {
    $('.start').each(function(){
      var group = $(this).nextUntil('.end')
      var card = $(group).wrapAll('<div class="card"></div>')
    })
    $('.card').each(function(){
      if ($(this).find('pre').length) {
        $(this).prepend($(`
          <div class="card-handle">
            <button class="see">查看代码</button>
          </div>
        `))
        $(this).find('.see').click(function(){
          if ($(this).text() == '查看代码') {
            $(this).text('隐藏代码')
          } else {
            $(this).text('查看代码')
          }
          $(this).parents('.card').find('pre').toggle()
        })
      }
    })
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
