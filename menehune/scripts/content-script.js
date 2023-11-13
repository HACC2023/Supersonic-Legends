console.error("content-script.js: loaded");

var extractedText = document.body.innerHTML;
// sends the extractText message on page load
chrome.runtime.sendMessage({action: 'extractText', text:extractedText});
// handles the message to extract the text from the current page and send it back to the sidepanel script
// whether received on page load or from the extract button
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.error("content-script.js: request.action = " + request.action);
  if (request.action === 'extractText') {
    var extractedText = document.body.innerHTML;
    sendResponse({ text: extractedText });
  }
});