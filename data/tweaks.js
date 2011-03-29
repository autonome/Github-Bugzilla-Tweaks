var list = document.getElementsByClassName("js-hard-tabs smalltabs")[0];

if (list) {
  var bug = getBugNumber(document.title);
  console.log("BUG #: " + bug);
  var li = document.createElement("li");
  
  if (bug)
    li.innerHTML = "<a href='#'>Attach to Bug " + bug + "</a>";
  else
    li.innerHTML = "<a href='#'>Attach to a New Bug</a>";

  li.addEventListener("click", function() {
    send(bug, document.location.toString());
  }, false);

  list.appendChild(li);
}

function send(bugNumber, pullRequestURL) {
  postMessage({bug: bugNumber, url: pullRequestURL});
}

// Search for a bug number in a string starting with: "bug ######"
function getBugNumber(str) {
  var parts = str.split(" ");
  return (parts.length > 1 &&
          parts[0].toLowerCase() == "bug" &&
          parts[1].search(/^[0-9]{6}/) != -1)
    ? parts[1].substr(0, 6) : null;
}
