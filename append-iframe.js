"use strict";

class SVGIcons {
  #icons;
  #keys;

  constructor(icons) {
    this.#icons = this.#objectMap(icons, (svg) => this.#strToSVG(svg));
    this.#keys = Object.keys(this.#icons);
  }

  keyIncludes(key) {
    return this.#keys.includes(key);
  }

  get(key) {
    return this.#icons[key];
  }

  #objectMap(obj, callback) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, callback(value, key, obj)])
    );
  }

  #strToSVG(svg) {
    const template = document.createElement("template");
    template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#393e40" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="arcs">${svg}</svg>`;
    return template.content.firstChild;
  }
}

class IconArea {
  #iconArea = document.createElement("div");
  #icons = new SVGIcons({
    _self: '<circle cx="12" cy="12" r="10"></circle>',
    _blank: '<g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g>',
    _parent: '<path d="M18 15l-6-6-6 6"/>',
    _top: '<path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/>'
  });
  #lastTarget = null;

  constructor() {
    this.#iconArea.style = "display:flex;align-items:center;justify-content:center;width:20px;height:20px";
  }

  setIcon(target) {
    const currentTarget = this.#icons.keyIncludes(target) ? target : "_self";

    if (currentTarget !== this.#lastTarget) {
      this.#iconArea.replaceChildren(this.#icons.get(currentTarget));
      this.#lastTarget = currentTarget;
    }
  }

  getArea() {
    return this.#iconArea;
  }
}

class FadeAnimation {
  #target;
  #timeout;
  #isAnimating = false;
  #animationFrame;
  #animationResolve;

  constructor(target) {
    this.#target = target;
  }

  #finishAnimation(canceled) {
    this.#isAnimating = false;
    this.#animationResolve?.(canceled);
  }

  #animate(to, duration, delay) {
    return new Promise(async (resolve) => {
      const wasAnimating = this.#isAnimating;
      if (wasAnimating) {
        clearTimeout(this.#timeout);
        cancelAnimationFrame(this.#animationFrame);
        this.#finishAnimation(true);
      }

      this.#isAnimating = true;
      this.#animationResolve = resolve;

      if (!wasAnimating && delay) {
        await new Promise((resolve) => this.#timeout = setTimeout(resolve, delay));
      }

      const startOpacity = Number(getComputedStyle(this.#target).opacity);
      if (startOpacity === to) {
        this.#finishAnimation(false);
      };
      this.#target.style.opacity = startOpacity;

      const startTime = performance.now();
      const transitionPerSec = 1 / duration;

      const step = (timestamp) => {
        const elapsed = timestamp - startTime;

        const relativeOpacity = transitionPerSec * elapsed;

        const currentOpacity = startOpacity > to
          ? Math.max(startOpacity - relativeOpacity, to)
          : Math.min(startOpacity + relativeOpacity, to);
        this.#target.style.opacity = currentOpacity;

        if (currentOpacity === to) {
          this.#finishAnimation(false);
          return;
        };

        this.#animationFrame = requestAnimationFrame(step);
      }

      this.#animationFrame = requestAnimationFrame(step);
    });
  }

  fadeIn(duration, delay = 0) {
    return this.#animate(1, duration, delay);
  }

  fadeOut(duration, delay = 0) {
    return this.#animate(0, duration, delay);
  }
}

class IconIframe {
  #iframe = document.createElement("iframe");
  #iconArea = new IconArea();
  #exist = false;
  #fadeAnimation = new FadeAnimation(this.#iframe);

  #clearAttributes() {
    for (const attr of this.#iframe.attributes) {
      this.#iframe.removeAttribute(attr);
    }
  }

  #initIframe() {
    this.#clearAttributes();
    this.#iframe.style = "all:initial;border:none;position:fixed;z-index:2147483647;width:20px;height:20px;bottom:0;right:0;box-shadow:0 0 5px #0003;border-width:.1px;border-style:solid none none solid;border-color:#0005;border-top-left-radius:3px;opacity:0";
    window.document.body.append(this.#iframe);

    const iframeBody = this.#iframe.contentDocument.body;
    iframeBody.style = "margin:0;padding:0;background-color:#dfe1e7;over-flow:hidden";
    iframeBody.replaceChildren(this.#iconArea.getArea());
  }

  add(linkTarget) {
    this.#iconArea.setIcon(linkTarget);

    if (this.#exist) {
      return;
    }

    if (!this.#iframe.isConnected) {
      this.#initIframe();
    }

    this.#exist = true;
    this.#fadeAnimation.fadeIn(300, 200);
  }

  remove() {
    if (this.#exist) {
      this.#exist = false;
      this.#fadeAnimation.fadeOut(300, 200)
      .then((canceled) => {
        if (!canceled) {
          this.#iframe.remove()
        }
      });
    }
  }
}

const iconIframe = new IconIframe();

const showLinkTarget = (message) => {
  switch (message.msg) {
    case "addIframe":
      iconIframe.add(message.linkTarget);
      break;
    case "removeIframe":
      iconIframe.remove();
      break;
  }
};

chrome.runtime.onMessage.addListener(showLinkTarget);