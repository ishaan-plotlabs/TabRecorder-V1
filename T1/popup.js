let tabId;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  tabId = tabs[0].id;

  chrome.tabCapture.getCapturedTabs((ci) => {
    if (!ci.some(e => e.tabId == tabId && e.status == "active")) {
      chrome.tabCapture.getMediaStreamId({ consumerTabId: tabId }, (streamId) => {
        chrome.tabs.sendMessage(tabId, { command: "start", streamId: streamId });
      });
    }
    else {
      chrome.tabs.sendMessage(tabId, { command: "start", streamId: "" });
    }
  });
});

document.getElementById("stop").onclick = () => {
  chrome.tabs.sendMessage(tabId, { command: "stop" });
}