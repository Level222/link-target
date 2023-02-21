"use strict";

const getParentAnchor = elem => {
  let currentElem = elem;
  while (currentElem && currentElem.nodeName.toLowerCase() !== "a") {
    currentElem = currentElem.parentNode;
  }
  return currentElem;
};

const sendAnchorMsg = e => {
  const msgData = {};

  const targetLink = getParentAnchor(e.target);

  if (targetLink) {
    msgData.msg = "addIframe";
    msgData.linkTarget = targetLink.target;
  } else {
    msgData.msg = "removeIframe";
  }

  chrome.runtime.sendMessage({
    msg: "sendBack",
    sendBackData: msgData
  });
};

document.addEventListener("mousemove", sendAnchorMsg);