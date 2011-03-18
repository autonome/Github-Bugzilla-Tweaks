var list = document.getElementsByClassName("js-hard-tabs smalltabs")[0];

if (list) {
  var titleParts = document.title.split(" ");
  var bug = titleParts[1].substr(0, 6);

  var li = document.createElement("li");
  li.innerHTML = "<a href='#'>Attach to Bug</a>";
  li.addEventListener("click", send, false);
  list.appendChild(li);
}

function send() {
  postMessage({bug: bug, url: document.location.toString()});
}
