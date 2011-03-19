We use Github for the source code of the Firefox Add-on SDK. We use Bugzilla to track bugs and feature development. These two systems do not play nicely together.

One especially annoying aspect of the workflow we use for the Add-on SDK is that it's a pain to submit a change in a way that satisfies both the Github and Bugzilla workflows. On Github you need to create a branch for your change, push it to Github, then go the page for the branch and submit a "pull request", informing the forkees that you have changes you'd like merged into the main repository. On Bugzilla, the typical process is to attach a diff of your changes to a bug, and request review from a specific person.

Atul Varma improved things with a great idea: Submit an HTML file as a bug attachment, which points to the pull-request page on Github. He added a feature to pybugzilla that, given a pull-request URL and bug id, would generate the HTML file and submit it as an attachment to the bug. We now had something that was attached to a bug, that a reviewer could r+ or r-, making it easy for anyone following along to know where things were at, while allowing the code review itself to be done inline on Github.

However, using the tool isn't easy. You have to do your development work, then go to the Github page to make the pull request, then go back to the command line to construct the correct invocation of the command, then back to the Bugzilla page to request review from someone.

So I wrote an add-on to reduce the number of steps. With the Github Bugzilla Tweaks add-on, there's now a button the Github pull-request page that allows you to submit the request as an attachment on a bug in one-click:

To make it work, just title your pull request starting with "bug ######", replacing # with the bug id from Bugzilla. The add-on logs into Bugzilla with the stored credentials found in the Firefox password manager.

<a title="Install" href="http://j.mp/fp2xKV">Install</a>.
