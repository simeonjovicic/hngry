/* Adds .is-visible to .hngry-reveal elements as they scroll into view.
   Idempotent: safe to load from multiple sections. */
(function () {
  if (window.__hngryRevealInit) return;
  window.__hngryRevealInit = true;

  // opt in to hiding only when JS is running (CSS gates on .js-reveal)
  document.documentElement.classList.add("js-reveal");

  function run() {
    var els = document.querySelectorAll(".hngry-reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      // fire as soon as the top edge enters, so nothing sits as an empty block
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach(function (el) {
      io.observe(el);
    });

    // safety net: never leave content hidden longer than 2.5s
    setTimeout(function () {
      document.querySelectorAll(".hngry-reveal:not(.is-visible)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 2500);
  }

  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run);

  // re-scan when sections are re-rendered in the theme editor
  document.addEventListener("shopify:section:load", run);
})();
