// QuickQR: detect text highlighted by the user on a webpage.
let lastSentText = "";
let sendTimer = null;

function getSelectedText() {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : "";
}

function sendSelectedText() {
  const text = getSelectedText();
  if (!text || text === lastSentText) return;

  lastSentText = text;
  chrome.runtime.sendMessage({
    type: "QUICKQR_SELECTED_TEXT",
    text
  }).catch(() => {
    // The side panel may be closed; that's okay.
  });
}

function scheduleSelectionSend() {
  clearTimeout(sendTimer);
  sendTimer = setTimeout(sendSelectedText, 100);
}

document.addEventListener("mouseup", scheduleSelectionSend);
document.addEventListener("keyup", scheduleSelectionSend);
document.addEventListener("selectionchange", scheduleSelectionSend);

// Also respond when the user opens the Text tab after highlighting text.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "QUICKQR_GET_SELECTION") {
    sendResponse({ text: getSelectedText() });
  }
});
