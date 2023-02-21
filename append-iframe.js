"use strict";

const iframe = document.createElement("iframe");

const toSVGElem = svg => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#393e40" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="arcs">${svg}</svg>`;

const icons = new Map([
  ["_self", '<circle cx="12" cy="12" r="10"></circle>'],
  ["_blank", '<g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g>'],
  ["_parent", '<path d="M18 15l-6-6-6 6"/>'],
  ["_top", '<path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/>']
].map(([target, svg]) => [target, toSVGElem(svg)]));

const iconArea = document.createElement("div");
iconArea.style = "display:flex;align-items:center;justify-content:center;width:20px;height:20px";

const clearAttributes = elem => {
  for (const attr of elem.attributes) {
    elem.removeAttribute(attr);
  }
};

const targets = [...icons.keys()];
const formatLinkTarget = target => targets.includes(target) ? target : "_self";

let lastTarget;

const addIframe = linkTarget => {
  clearAttributes(iframe);
  iframe.style = "all:initial;border:none;position:fixed;z-index:2147483647;width:20px;height:20px;bottom:0;right:0;box-shadow:0 0 3px #bbb;border:.1px solid #aaa;border-top-left-radius:3px";

  if (!iframe.isConnected) {
    window.top.document.body.append(iframe);
    const iframeBody = iframe.contentDocument.body;
    iframeBody.style = "margin:0;padding:0;background-color:#dfe1e7;over-flow:hidden";
    iframeBody.replaceChildren(iconArea);
  }

  const currentTarget = formatLinkTarget(linkTarget);
  if (currentTarget !== lastTarget) {
    iconArea.innerHTML = icons.get(currentTarget);
    lastTarget = currentTarget;
  }
};

const removeIframe = () => {
  if (iframe.isConnected) {
    iframe.remove();
  }
};

const showLinkTarget = message => {
  switch (message.msg) {
    case "addIframe":
      addIframe(message.linkTarget);
      break;
    case "removeIframe":
      removeIframe();
      break;
  }
};

chrome.runtime.onMessage.addListener(showLinkTarget);