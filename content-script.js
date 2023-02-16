(() => {
  const iframe = document.createElement("iframe");
  iframe.src = "/iframe.html";

  const showLinkDetail = e => {
    const target = e.target;
    if (target.tagName.toLowerCase() !== "a") return;
  };

  document.addEventListener("mousemove", showLinkDetail);
})();