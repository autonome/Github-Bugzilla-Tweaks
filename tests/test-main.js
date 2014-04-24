"use strict";

const main = require("main");
const { data } = require("self");
const pageMod = require("page-mod");
const tabs = require("tabs");

const testFolderURL = module.uri.split('test-main.js')[0];

exports.test_id = function(test) {
  test.assert(require("self").id.length > 0);
};

exports.test_getNumber = function(test) {
  test.waitUntilDone();
  let url = "data:text/html;charset=utf-8,<title>Bug 1234567: TEST</title>";

  tabs.open({
    url: url,
    onReady: function(tab) {
      tab.attach({
        contentScriptFile: [ data.url("tweaks.js"), testFolderURL + "tweaks-test-get-number.js"],
        onMessage: function(msg) {
          test.assertEqual(msg, 1234567, "Bug 1234567: works!");
          test.done();
        }
      });
    }
  });
};
