
const data = require("sdk/self").data;
const pageMod = require("sdk/page-mod");

pageMod.PageMod({
  attachTo: [ 'existing', 'top' ],
  include: /https:\/\/github.com\/.*\/pull\/.*/,
  contentScriptWhen: "end",
  contentScriptFile: data.url("tweaks.js"),
  onAttach: function onAttach(worker, mod) {
    worker.on('message', function(msg) {
      if (msg.bug)
        openAttachment(msg.bug, msg.url);
      else
        require('sdk/tabs').open('https://bugzilla.mozilla.org/enter_bug.cgi');
    });
  }
});

function openAttachment(bug, url) {
  require('sdk/tabs').open({
    url: 'https://bugzilla.mozilla.org/attachment.cgi?action=enter&bugid='+bug,
    onReady: function(tab) {
      tab.attach({
        contentScript: '!'+autofill+'("'+url+'")'
      });
    }
  });
}

function autofill(url) {
  window.addEventListener('load', function() {
    // switch from file to paste-text attachement
    if (document.querySelectorAll('.attachment_text_field.bz_tui_hidden').length) {
      unsafeWindow.TUI_toggle_class('attachment_text_field');
      unsafeWindow.TUI_toggle_class('attachment_data');
    }
  });
  var att = document.getElementById('attach_text');
  var dsc = document.getElementById('description');
  dsc.value = 'link to github PR: '+url;
  att.value = url;
  att.focus();
}
