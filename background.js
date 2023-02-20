"use strict";

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.sendBack) {
    chrome.tabs.sendMessage(sender.tab.id, message.data);
  }
});