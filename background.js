"use strict";

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.msg === "sendBack") {
    chrome.tabs.sendMessage(sender.tab.id, message.sendBackData);
  }
});