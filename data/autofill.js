
window.addEventListener('load', function() {
  // switch from upload-file to paste-text attachement
  if (document.querySelector('.attachment_text_field.bz_tui_hidden')) {
    unsafeWindow.TUI_toggle_class('attachment_text_field');
    unsafeWindow.TUI_toggle_class('attachment_data');
  }
})

self.on('message', function({ url }) {
  let att = document.getElementById('attach_text');
  let desc = document.getElementById('description');
  desc.value = 'Link to Github pull-request: ' + url;
  att.value = url;
  att.focus();
})
