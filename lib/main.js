const data = require("self").data;
const pageMod = require("page-mod");
const Bugzilla = require("bugzilla").Bugzilla;

const bzUIURL = "https://bugzilla.mozilla.org";
//const bzUIURL = "https://landfill.bugzilla.org";

const attachmentDetailsURL = "https://bugzilla.mozilla.org/attachment.cgi?action=edit&id=";
//const attachmentDetailsURL = "https://landfill.bugzilla.org/bzapi_sandbox/attachment.cgi?action=edit&id=";

pageMod.PageMod({
  include: "https://github.com/*",
  contentScriptWhen: "end",
  contentScriptFile: data.url("tweaks.js"),
  onAttach: function onAttach(worker, mod) {
    worker.on('message', function(msg) {
      if (msg.bug)
        postAttachment(msg.bug, msg.url);
      else
        require('tabs').open('https://bugzilla.mozilla.org/enter_bug.cgi');
    });
  }
});

function getBugzillaCredentials(cb) {
  require("passwords").search({
    url: bzUIURL,
    onComplete: function onComplete(credentials) {
      if (credentials.length) {
        cb(credentials[0]);
        return;
      }
    }
  });
}

function postAttachment(bug, pullRequestURL) {

  getBugzillaCredentials(function(credentials) {

    var attachmentContent = require("base64").base64encode(
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
        require("notifications").notify({
          title: "Success!",
          text: "Your pull request was successfully posted as an attachment to bug " + bug + " on bugzilla.mozilla.org. Forwarding..."
        });
        // Forward the user to the details page for the new attachment.
        require("tabs").activeTab.url = attachmentDetailsURL + data.id;
      },
      error: function(data) {
        require("notifications").notify({
          title: "Failure!",
          text: "Your pull request was not successfully posted as an attachment to bug " + bug + " on bugzilla.mozilla.org."
        });
      }
    });
  });
}
