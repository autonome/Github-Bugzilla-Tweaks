const { Cc, Ci } = require("chrome");

exports.base64encode = function base64encode(str) {
  var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);
  return wm.getMostRecentWindow("navigator:browser").btoa(str);
}
