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
    msgData.msg = "add-iframe";
    msgData.linkTarget = targetLink.target;
  } else {
    msgData.msg = "remove-iframe";
  }

  chrome.runtime.sendMessage({
    sendBack: true,
    data: msgData
  });
};

document.addEventListener("mousemove", sendAnchorMsg);