const data = require("sdk/self").data;
const pageMod = require("sdk/page-mod");
const Bugzilla = require("bugzilla").Bugzilla;

const DEBUG = 0

const bzUIURL = DEBUG ?
  'https://landfill.bugzilla.org' :
  'https://bugzilla.mozilla.org'

const attachmentDetailsURL = DEBUG ?
  'https://landfill.bugzilla.org/bzapi_sandbox/attachment.cgi?action=edit&id=' :
  'https://bugzilla.mozilla.org/attachment.cgi?action=edit&id='

pageMod.PageMod({
  attachTo: [ 'existing', 'top' ],
  include: /https:\/\/github.com\/.*\/pull\/.*/,
  contentScriptWhen: "end",
  contentScriptFile: data.url("tweaks.js"),
  onAttach: function onAttach(worker, mod) {
    worker.on('message', function(msg) {
      if (msg.bug)
        postAttachment(msg.bug, msg.url);
      else
        require('sdk/tabs').open('https://bugzilla.mozilla.org/enter_bug.cgi');
    });
  }
});

function getBugzillaCredentials(cb) {
  require("sdk/passwords").search({
    url: bzUIURL,
    onComplete: function onComplete(credentials) {
      if (credentials.length > 1) {
        var message = "You have " + credentials.length +
          " credentials for bugzilla stored; I don't know which one to use!\n" +
          "Please clear the ones you don't care about from " +
          "Preferences... Security... Saved Passwords " +
          "OR submit an enhancement.\n";
        credentials.forEach(function(cred) {
          message += '\n' + cred.username;
        });
        require("sdk/notifications").notify({
          title: "Too Many Accounts!",
          text: message
        });
        return;
      }

      if (credentials.length) {
        cb(credentials[0]);
        return;
      }
    }
  });
}

function postAttachment(bug, pullRequestURL) {
  getBugzillaCredentials(function(credentials) {

    var attachmentContent = require("sdk/base64").encode(
      '<!DOCTYPE html>' +
      '<meta charset="utf-8">' +
      '<meta http-equiv="refresh" content="5;' + pullRequestURL + '">' +
      '<title>Bugzilla Code Review</title>' +
      '<p>You can review this patch at <a href="' + pullRequestURL + '">' + pullRequestURL + '</a>, ' +
      'or wait 5 seconds to be redirected there automatically.</p>');

    var path = "/bug/" + bug + "/attachment?username=" + encodeURIComponent(credentials.username) +
               "&password=" + encodeURIComponent(credentials.password);

    Bugzilla.ajax({
      method: "POST",
      url: path,
      data: {
        bug_id: bug,
        comments: [{text: "Pointer to Github pull-request"}],
        encoding: "base64",
        data: attachmentContent,
        description: "Pointer to Github pull request: " + pullRequestURL,
        file_name: "pull-request.html",
        content_type: "text/html"
      },
      success: function(data) {
        require("sdk/notifications").notify({
          title: "Success!",
          text: "Your pull request was successfully posted as an attachment to bug " + bug + " on bugzilla.mozilla.org. Forwarding..."
        });
        // Forward the user to the details page for the new attachment.
        require("sdk/tabs").activeTab.url = attachmentDetailsURL + data.id;
      },
      error: function(data) {
        var message = "Your pull request was not successfully posted as an attachment to bug " + bug + " on bugzilla.mozilla.org.";
        if (data.json && data.json.message)
          message += " " + data.json.message;
        require("sdk/notifications").notify({
          title: "Failure!",
          text: message
        });
      }
    });
  });
}
