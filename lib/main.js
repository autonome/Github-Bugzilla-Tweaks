
const { data } = require('sdk/self');
const { PageMod } = require('sdk/page-mod');
const tabs = require('sdk/tabs');

PageMod({
  attachTo: [ 'existing', 'top' ],
  include: /https:\/\/github.com\/.*\/pull\/.*/,
  contentScriptWhen: 'ready',
  contentScriptFile: data.url('tweaks.js'),
  onAttach: function onAttach(worker, mod) {
    worker.on('message', function(msg) {
      if (msg.bug)
        openAttachment(msg.bug, msg.url)
      else
        tabs.open('https://bugzilla.mozilla.org/enter_bug.cgi');
    });
  }
});

function openAttachment(bug, url) {
  let active = tabs.activeTab.index;
  tabs.open({
    url: 'https://bugzilla.mozilla.org/attachment.cgi?action=enter&bugid=' + bug,
    onOpen: function(tab) {
      tab.index = active + 1;
    }, 
    onReady: function(tab) {
      let worker = tab.attach({ contentScriptFile: data.url('autofill.js') });
      worker.postMessage({ url: url });
    }
  });
}
