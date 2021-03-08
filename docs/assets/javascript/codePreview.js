! function () {
  function e() {
    var main = Docsify.dom.getNode("#main")
    $('.doc-preview').each(function () {
      var code = $.trim($(this).find('.doc-preview-content').html())
      $(`
        <div class="doc-preview">
          <button class="see">查看代码</button>
          <button class="capture">截图</button>
          <button class="copy">复制代码</button>
          <button class="edit">在线编辑</button>
        </div>
      `).appendTo($(this))
      $(this).next().hide()
      var height = $(this).find('.doc-preview-content').height()
      itemPreview($(this), code, height)
      toggle($(this), '.see')
      copyCode($(this), '.copy', code)
      openEditor($(this), '.edit', code)
      getCapture($(this), '.capture')
    })

    function getCapture(parent, cls) {
      parent.find(cls).click(function () {
        var iframe = parent.find('iframe')
        var content = $(iframe).contents().find('body')[0]
        html2canvas(content, {
          useCORS: true
        }).then(function (canvas) {
          canvas.toBlob(function(blob) {
            saveAs(blob, "hangge.png");
         });
        });
      })
    }

    function itemPreview(parent, code, height) {
      var iframe = $(`<iframe></iframe>`).appendTo(parent.find('.doc-preview-content'))
      iframe.prev().remove()
      iframe.height(height)
      servePreview(code, iframe)
    }

    function toggle(parent, cls) {
      parent.find(cls).click(function () {
        if ($(this).text() == '查看代码') {
          $(this).text('隐藏代码')
          parent.next().show()
        } else {
          $(this).text('查看代码')
          parent.next().hide()
        }
      })
    }

    function copyCode(parent, cls, code) {
      parent.find(cls).click(function () {
        copyTocontent(code)
      })
    }

    const copyTocontent = function (str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    }


    function openEditor(parent, cls, code) {
      parent.find(cls).click(function () {
        $(`
          <div class="doc-frame">
            <div class="doc-frame-head">
              <h2 class="doc-frame-title">在线编辑</h2>
              <div class="doc-frame-buttons">
                <button class="close" id="close">关闭</button>
                <button class="format" id="format">格式化</button>
                <button class="copy" id="copy">复制</button>
                <button class="preview" id="preview">预览</button>
              </div>
            </div>
            <div class="doc-frame-content">
              <div class="doc-frame-left">
                <div class="doc-editor" id="code"></div>
                <div class="doc-props"></div>
              </div>
              <div class="doc-frame-right">
                <div class="doc-phone">
                  <iframe id="phone"></iframe>
                </div>
              </div>
            </div>
          </div>
        `).appendTo('body')

        var editor
        // 渲染editor
        require.config({ paths: { 'vs': '../node_modules/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], function () {

          // 初始化变量
          var fileCounter = 0;
          var editorArray = [];
          var defaultCode = [
            code
          ].join('\n');
          // 定义编辑器主题
          monaco.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [{ background: 'EDF9FA' }],
          });
          monaco.editor.setTheme('myTheme');

          // 新建一个编辑器
          function newEditor(container_id, code, language) {
            var model = monaco.editor.createModel(code, language);
            var editor = monaco.editor.create(document.getElementById(container_id), {
              model: model,
            });
            editorArray.push(editor);
            return editor;
          }

          // 新建一个 div
          function addNewEditor(code, language) {
            var new_container = document.createElement("DIV");
            new_container.id = "container-" + fileCounter.toString(10);
            new_container.className = "container";
            document.getElementById("code").appendChild(new_container);
            fileCounter += 1;
            return newEditor(new_container.id, code, language);
          }
          editor = addNewEditor(code, 'text/html');
          setTimeout(function () {
            editor.getAction(['editor.action.formatDocument'])._run()
          }, 700)
          servePreview(code, $('#phone'))
          // 添加点击事件
          $('#preview').click(function () {
            servePreview(editor.getValue(), $('#phone'))
          })
          $('#format').click(function () {
            editor.getAction(['editor.action.formatDocument'])._run()
          })
          $('#close').click(function () {
            $('.doc-frame').remove()
          })
          $('#copy').click(function () {
            copyTocontent(editor.getValue())
          })
        });
      })
    }

    function servePreview(code, dom) {
      var codes = `
      <div class="v-page" interval style="height:auto;background:none;">
        <section class="v-page-content">
          ${code}
        </section>
      </div>
      `
      var style = `
        <style>
          html,body{
            height:auto;
            margin:0;
          }
          ::-webkit-scrollbar {
            width: 6px;
            height: 1px;

          }
          ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: #ccc;
          }
          ::-webkit-scrollbar-track {
            background: #fff;
          }
        </style>
      `
      var l = window.location
      var link = `<link rel="stylesheet" href="${l.origin}${l.pathname}libs/v.css"/>`
      var blob = new Blob([link, style, codes], { type: 'text/html', endings: 'transparent' })
      var url = URL.createObjectURL(blob)
      dom.attr('src', url)
    }
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
