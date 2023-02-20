(() => {
  const iframe = document.createElement("iframe");
  iframe.style = "all:initial;border:none;display:none;position:fixed;width:20px;height:20px;bottom:0;right:0";
  document.body.append(iframe);

  const iframeDoc = iframe.contentDocument;
  iframeDoc.body.style = "margin:0;padding:0;background-color:#1ba;over-flow:hidden";
  const iconArea = iframeDoc.createElement("div");
  iconArea.style = "display:flex;align-items:center;justify-content:center;width:20px;height:20px";
  iframeDoc.body.append(iconArea);

  const icons = {
    _self: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="arcs"><circle cx="12" cy="12" r="10"></circle></svg>',
    _blank: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="arcs"><g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>',
    _parent: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="arcs"><path d="M18 15l-6-6-6 6"/></svg>',
    _top:'<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="arcs"><path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/></svg>'
  };

  const getParentAnchor = elem => {
    let currentElem = elem;
    while (currentElem && currentElem.nodeName.toLowerCase() !== "a") {
      currentElem = currentElem.parentNode;
    }
    return currentElem;
  };

  const showLinkTarget = e => {
    const targetLink = getParentAnchor(e.target);
    if (!targetLink) {
      iframe.style.display = "none";
      return;
    };

    iframe.style.display = "block";
    iconArea.innerHTML = icons[targetLink.target] ?? icons._self;
  };

  document.addEventListener("mousemove", showLinkTarget);
})();