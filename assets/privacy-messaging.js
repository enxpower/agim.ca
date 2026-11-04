/* Google Privacy & messaging; ad requests remain paused on every path. */
(() => {
  "use strict";
  const site = "agim.ca";
  const publisher = "ca-pub-3331849532184610";
  if (![site, "www." + site].includes(window.location.hostname)) return;
  if (document.getElementById("google-privacy-message-tag")) return;
  // Google documents this pause as preventing ad requests, including Auto ads.
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.pauseAdRequests = 1;
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  const footer = document.querySelector("footer");
  if (footer) {
    const entry = document.createElement("button");
    entry.type = "button";
    entry.id = "privacy-cookie-settings";
    entry.textContent = "Privacy and cookie settings";
    entry.hidden = true;
    entry.style.cssText = "background:none;border:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;padding:8px 0;margin:0 20px;max-width:100%;white-space:normal";
    entry.addEventListener("click", () => {
      window.googlefc.callbackQueue.push(() => {
        if (typeof window.googlefc.showRevocationMessage === "function") {
          window.googlefc.showRevocationMessage();
        }
      });
    });
    footer.appendChild(entry);
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => {
        if (typeof window.__tcfapi !== "function") return;
        window.__tcfapi("addEventListener", 0, (data, success) => {
          entry.hidden = !(success && data && data.gdprApplies);
        });
      }
    });
  }
  const tag = document.createElement("script");
  tag.id = "google-privacy-message-tag";
  tag.async = true;
  tag.crossOrigin = "anonymous";
  tag.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + publisher;
  document.head.appendChild(tag);
  // No ad slots, ad pushes, Auto ads enable call, or pause reset is made here.
})();
