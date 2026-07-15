/* HNGRY collections carousel — mobile only.
   Auto-advances horizontally with a segmented progress bar; syncs to manual
   swipes and dot taps; pauses while the user is interacting. */
(function () {
  function initCarousel(root) {
    var track = root.querySelector("[data-carousel-track]");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-carousel-dot]"));
    if (!track || dots.length < 2) return;

    var seconds = parseFloat(root.getAttribute("data-autoplay")) || 4;
    root.style.setProperty("--hngry-autoplay", seconds + "s");

    var mq = window.matchMedia("(max-width: 749px)");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null;
    var current = 0;
    var active = false;
    var programmatic = false;
    var programmaticTimer;

    var tiles = Array.prototype.slice.call(track.querySelectorAll(".hngry-collections__tile"));

    function paintDots() {
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
        d.classList.toggle("is-done", i < current);
      });
    }

    function goTo(i, smooth) {
      current = (i + tiles.length) % tiles.length;
      var tile = tiles[current];
      if (tile) {
        // ignore scroll events fired by this programmatic move
        programmatic = true;
        clearTimeout(programmaticTimer);
        programmaticTimer = setTimeout(function () {
          programmatic = false;
        }, 700);
        track.scrollTo({
          left: tile.offsetLeft - (track.clientWidth - tile.clientWidth) / 2,
          behavior: smooth === false ? "auto" : "smooth",
        });
      }
      paintDots();
    }

    function schedule() {
      clearTimeout(timer);
      if (reduce) return;
      timer = setTimeout(function () {
        goTo(current + 1);
        schedule();
      }, seconds * 1000);
    }

    function start() {
      if (active) return;
      active = true;
      current = 0;
      goTo(0, false);
      schedule();
    }

    function stop() {
      active = false;
      clearTimeout(timer);
      dots.forEach(function (d) {
        d.classList.remove("is-active", "is-done");
      });
    }

    // keep current in sync when the user swipes manually
    var scrollThrottle;
    track.addEventListener(
      "scroll",
      function () {
        if (!active || programmatic) return;
        clearTimeout(scrollThrottle);
        scrollThrottle = setTimeout(function () {
          var center = track.scrollLeft + track.clientWidth / 2;
          var nearest = 0;
          var best = Infinity;
          tiles.forEach(function (t, i) {
            var c = t.offsetLeft + t.clientWidth / 2;
            var dist = Math.abs(c - center);
            if (dist < best) {
              best = dist;
              nearest = i;
            }
          });
          if (nearest !== current) {
            current = nearest;
            paintDots();
            schedule(); // restart timer after a manual move
          }
        }, 120);
      },
      { passive: true }
    );

    // pause auto-advance while touching, resume after
    track.addEventListener("pointerdown", function () {
      clearTimeout(timer);
    });
    track.addEventListener("pointerup", schedule);

    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        goTo(parseInt(d.getAttribute("data-index"), 10));
        schedule();
      });
    });

    // only run on mobile; toggle when crossing the breakpoint
    function evaluate() {
      if (mq.matches) start();
      else stop();
    }
    (mq.addEventListener ? mq.addEventListener("change", evaluate) : mq.addListener(evaluate));
    evaluate();
  }

  function boot() {
    document.querySelectorAll("[data-hngry-carousel]").forEach(initCarousel);
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
  document.addEventListener("shopify:section:load", boot);
})();
