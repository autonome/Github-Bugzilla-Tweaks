
exports.Bugzilla = {
  //BASE_URL: "https://api-dev.bugzilla.mozilla.org/test/latest/",
  BASE_URL: "https://api-dev.bugzilla.mozilla.org/latest",
  BASE_UI_URL: "https://bugzilla.mozilla.org",
  DEFAULT_OPTIONS: {
    method: "GET"
  },
  getShowBugURL: function Bugzilla_getShowBugURL(id) {
    return this.BASE_UI_URL + "/show_bug.cgi?id=" + id;
  },
  queryString: function Bugzilla_queryString(data) {
    var parts = [];
    for (name in data) {
      var values = data[name];
      if (!values.forEach)
        values = [values];
      values.forEach(
        function(value) {
          parts.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
        });
    }
    return parts.join("&");
  },
  ajax: function Bugzilla_ajax(options) {
    var newOptions = {__proto__: this.DEFAULT_OPTIONS};
    for (name in options)
      newOptions[name] = options[name];
    options = newOptions;

    var url = this.BASE_URL + options.url;

    if (options.method == "GET" && options.data)
      url += "?" + this.queryString(options.data);

    let headers = {
      "Accept": "application/json",
    };

    if (options.username && options.password)
      headers["Authorization"] = "Basic " + require("base64").base64encode(options.username + ":" + options.password);

    return require("request").Request({
      url: url,
      headers: headers,
      contentType: "application/json",
      content: options.method == "GET" ? "" : JSON.stringify(options.data),
      onComplete: function(response) {
        console.log(response.text);
        if (response.json)
          options.success(response.json);
        else if (options.error)
          options.error(response);
      }
    })[options.method.toLowerCase()]();
  },
  getBug: function Bugzilla_getBug(id, cb) {
    return this.ajax({url: "/bug/" + id,
                      success: cb});
  },
  search: function Bugzilla_search(query, cb) {
    return this.ajax({url: "/bug",
                      data: query,
                      success: cb});
  }
};
