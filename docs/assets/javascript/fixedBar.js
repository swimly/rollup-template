! function () {
  function e() {
    var list = [{
      label: '<svg t="1615184831474" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2137"><path d="M419.2 160v256h-256V160h256m0-64h-256c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h256c35.2 0 64-28.8 64-64V160c0-35.2-28.8-64-64-64zM899.2 160v256h-256V160h256m0-64h-256c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h256c35.2 0 64-28.8 64-64V160c0-35.2-28.8-64-64-64zM419.2 608v256h-256v-256h256m0-64h-256c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h256c35.2 0 64-28.8 64-64v-256c0-35.2-28.8-64-64-64zM611.2 896c-19.2 0-32-12.8-32-32v-256c0-19.2 12.8-32 32-32s32 12.8 32 32v256c0 16-16 32-32 32zM768 896c-19.2 0-32-12.8-32-32v-256c0-19.2 12.8-32 32-32s32 12.8 32 32v256c0 16-16 32-32 32zM931.2 896c-19.2 0-32-12.8-32-32v-256c0-19.2 12.8-32 32-32s32 12.8 32 32v256c0 16-16 32-32 32z" fill="#666666" p-id="2138"></path></svg>',
      value: `string`,
      id: 'qrcode'
    }]
    var doc = Docsify.dom.getNode("#main")
    var fixed = document.createElement('ul')
    fixed.className = 'doc-fixed'
    list.forEach((item) => {
      var li = document.createElement('li')
      var dl = document.createElement('dl')
      dl.id = item.id
      var dt = document.createElement('dt')
      dt.innerHTML = item.label
      var dd = document.createElement('dd')
      dl.appendChild(dt)
      dl.appendChild(dd)
      li.appendChild(dl)
      fixed.appendChild(li)
    })
    doc.appendChild(fixed)
    var qrcodedom = document.querySelector('#qrcode').querySelector('dd')
    var l = window.location
    var nameA = l.hash.split('/')
    var name = nameA[nameA.length - 2]
    var url = `${l.origin}${l.pathname}src/components/${name}`
    var qrcode = new QRCode(qrcodedom, {
      text: url,
      width: 160,
      height: 160,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
