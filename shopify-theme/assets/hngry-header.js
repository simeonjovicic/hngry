/* Transparent-over-hero header: only on pages that have the HNGRY hero.
   At the top the header overlays the hero (transparent, light text); once the
   user scrolls it turns solid — the "real" header. */
(function () {
  function boot() {
    var hero = document.querySelector(".hngry-hero");
    var wrapper =
      document.querySelector(".section-header") ||
      document.querySelector(".header-wrapper") ||
      document.querySelector(".shopify-section-group-header-group");
    if (!hero || !wrapper) return;

    wrapper.classList.add("hngry-header-overlay");

    var solid = false;
    function onScroll() {
      var shouldBeSolid = window.scrollY > 40;
      if (shouldBeSolid === solid) return;
      solid = shouldBeSolid;
      wrapper.classList.toggle("hngry-header-solid", solid);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
  document.addEventListener("shopify:section:load", boot);
})();
