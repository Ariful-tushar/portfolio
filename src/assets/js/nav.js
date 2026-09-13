// Small site scripts: mobile nav drawer + theme toggle.
(function () {
  "use strict";

  /* ---------- Mobile navigation drawer ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-nav-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.hasAttribute("data-open");
      if (open) {
        menu.removeAttribute("data-open");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        menu.setAttribute("data-open", "");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  }

  /* ---------- Theme toggle (dark <-> light) ---------- */
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    var root = document.documentElement;

    var sync = function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      themeBtn.setAttribute("aria-pressed", current === "light" ? "true" : "false");
      themeBtn.setAttribute(
        "aria-label",
        current === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
    };

    sync();

    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable — choice just won't persist */
      }
      sync();
    });
  }

  /* ---------- Generic 3D coverflow carousel ----------
     Used by both the Certificates and Featured Projects sections. Each
     instance gets its own set of data-attributes so they never interfere. */
  var initCoverflow = function (config) {
    var carousel = document.querySelector(config.carousel);
    if (!carousel) return;
    var stage = carousel.querySelector(config.track);
    if (!stage) return;
    var items = Array.prototype.slice.call(stage.children);
    var n = items.length;
    if (!n) return;

    var prevBtn = carousel.querySelector(config.prev);
    var nextBtn = carousel.querySelector(config.next);
    var dots = config.dots
      ? Array.prototype.slice.call(document.querySelectorAll(config.dots + " > *"))
      : [];
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = Math.min(config.startIndex != null ? config.startIndex : 2, n - 1);
    var maxVisible = 3;

    var circularOffset = function (i) {
      var raw = i - current;
      if (raw > n / 2) raw -= n;
      if (raw < -n / 2) raw += n;
      return raw;
    };

    var spacing = function () {
      var w = stage.clientWidth || 900;
      var min = config.minSpacing || 90;
      var max = config.maxSpacing || 190;
      return Math.max(min, Math.min(max, w * (config.spacingRatio || 0.24)));
    };

    var layout = function () {
      var sp = spacing();
      items.forEach(function (li, i) {
        var offset = circularOffset(i);
        var abs = Math.abs(offset);
        var sign = offset === 0 ? 0 : offset / abs;
        var visible = abs <= maxVisible;
        var s = offset === 0 ? 1.12 : Math.max(0.72, 1 - abs * 0.13);
        var o = !visible ? 0 : offset === 0 ? 1 : Math.max(0.22, 0.82 - abs * 0.22);
        li.style.setProperty("--x", offset * sp + "px");
        li.style.setProperty("--z", -abs * 140 + "px");
        li.style.setProperty("--ry", -sign * Math.min(abs, 3) * 32 + "deg");
        li.style.setProperty("--s", s);
        li.style.setProperty("--o", o);
        li.style.setProperty("--zi", 100 - abs);
        li.style.setProperty("--pe", visible ? "auto" : "none");
        li.setAttribute("data-active", offset === 0 ? "true" : "false");
        var focusables = li.querySelectorAll("a, button");
        for (var f = 0; f < focusables.length; f++) {
          focusables[f].tabIndex = offset === 0 ? 0 : -1;
        }
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    };

    var goTo = function (i) {
      current = ((i % n) + n) % n;
      layout();
    };
    var next = function () {
      goTo(current + 1);
    };
    var prev = function () {
      goTo(current - 1);
    };

    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    });

    var recentlyDragged = false;
    var dragState = null;

    stage.addEventListener("pointerdown", function (e) {
      dragState = { pointerId: e.pointerId, startX: e.clientX, moved: false, captured: false };
      pauseAutoplay();
    });
    stage.addEventListener("pointermove", function (e) {
      if (!dragState) return;
      if (!dragState.moved && Math.abs(e.clientX - dragState.startX) > 6) {
        dragState.moved = true;
        stage.classList.add("is-dragging");
        // Only capture once a real drag is confirmed — capturing on every
        // pointerdown (even a plain click) hijacks the click event and
        // breaks links/buttons inside the cards.
        try {
          stage.setPointerCapture(dragState.pointerId);
          dragState.captured = true;
        } catch (err) {
          /* ignore */
        }
      }
    });
    var endDrag = function (e) {
      if (!dragState) return;
      var dx = e.clientX - dragState.startX;
      stage.classList.remove("is-dragging");
      if (dragState.captured) {
        try {
          stage.releasePointerCapture(dragState.pointerId);
        } catch (err) {
          /* ignore */
        }
      }
      if (dragState.moved) {
        recentlyDragged = true;
        window.setTimeout(function () {
          recentlyDragged = false;
        }, 50);
        if (Math.abs(dx) > 40) {
          dx < 0 ? next() : prev();
        }
      }
      dragState = null;
      play();
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // Clicking a receded (non-active) card brings it to the centre instead of
    // following whichever link/button inside it was clicked; the active card's
    // own links/buttons behave normally.
    stage.addEventListener("click", function (e) {
      if (recentlyDragged) {
        e.preventDefault();
        return;
      }
      var li = e.target.closest("li");
      if (!li || li.parentElement !== stage) return;
      var idx = items.indexOf(li);
      var offset = circularOffset(idx);
      if (offset !== 0) {
        e.preventDefault();
        goTo(idx);
      }
    });

    var timer = null;
    var play = function () {
      if (reduceMotion || timer) return;
      timer = window.setInterval(next, config.autoplayMs || 4000);
    };
    var pauseAutoplay = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    carousel.addEventListener("mouseenter", pauseAutoplay);
    carousel.addEventListener("mouseleave", play);
    carousel.addEventListener("focusin", pauseAutoplay);
    carousel.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pauseAutoplay();
      else play();
    });
    window.addEventListener("resize", layout);

    layout();
    play();
  };

  initCoverflow({
    carousel: "[data-cert-carousel]",
    track: "[data-cert-track]",
    prev: "[data-cert-prev]",
    next: "[data-cert-next]",
    dots: "[data-cert-dots]",
  });

  /* ---------- Flat sliding carousel (Featured Projects) ----------
     Shows several cards at once (3 on desktop, fewer as it narrows) and
     slides one card at a time via arrows or drag — no 3D, no autoplay. */
  var initSlider = function (config) {
    var carousel = document.querySelector(config.carousel);
    if (!carousel) return;
    var viewport = carousel.querySelector(config.viewport);
    var track = carousel.querySelector(config.track);
    if (!track) return;
    var items = Array.prototype.slice.call(track.children);
    var n = items.length;
    if (!n) return;

    var prevBtn = carousel.querySelector(config.prev);
    var nextBtn = carousel.querySelector(config.next);
    var dots = config.dots
      ? Array.prototype.slice.call(document.querySelectorAll(config.dots + " > *"))
      : [];
    var current = 0;

    var visibleCount = function () {
      var w = (viewport || track).clientWidth || 900;
      if (w < 640) return 1;
      if (w < 980) return 2;
      return 3;
    };
    var maxIndex = function () {
      return Math.max(0, n - visibleCount());
    };
    var step = function () {
      var cs = getComputedStyle(track);
      var gap = parseFloat(cs.columnGap || cs.gap) || 0;
      return items[0].getBoundingClientRect().width + gap;
    };

    var render = function () {
      current = Math.max(0, Math.min(current, maxIndex()));
      track.style.transform = "translateX(" + -(current * step()) + "px)";
      if (prevBtn) prevBtn.disabled = current <= 0;
      if (nextBtn) nextBtn.disabled = current >= maxIndex();
      var visible = visibleCount();
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i >= current && i < current + visible);
      });
    };
    var goTo = function (i) {
      current = i;
      render();
    };
    var next = function () {
      goTo(current + 1);
    };
    var prev = function () {
      goTo(current - 1);
    };

    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    });

    var recentlyDragged = false;
    var dragState = null;

    track.addEventListener("pointerdown", function (e) {
      dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startOffset: -current * step(),
        moved: false,
        captured: false,
      };
    });
    track.addEventListener("pointermove", function (e) {
      if (!dragState) return;
      var dx = e.clientX - dragState.startX;
      if (!dragState.moved && Math.abs(dx) > 6) {
        dragState.moved = true;
        track.classList.add("is-dragging");
        // Only capture once a real drag is confirmed — capturing on every
        // pointerdown (even a plain click) hijacks the click event and
        // breaks links/buttons inside the cards.
        try {
          track.setPointerCapture(dragState.pointerId);
          dragState.captured = true;
        } catch (err) {
          /* ignore */
        }
      }
      if (dragState.moved) {
        track.style.transform = "translateX(" + (dragState.startOffset + dx) + "px)";
      }
    });
    var endDrag = function (e) {
      if (!dragState) return;
      var dx = e.clientX - dragState.startX;
      track.classList.remove("is-dragging");
      if (dragState.captured) {
        try {
          track.releasePointerCapture(dragState.pointerId);
        } catch (err) {
          /* ignore */
        }
      }
      var moved = dragState.moved;
      dragState = null;
      if (!moved) return;
      recentlyDragged = true;
      window.setTimeout(function () {
        recentlyDragged = false;
      }, 50);
      if (Math.abs(dx) > 60) {
        dx < 0 ? next() : prev();
      } else {
        render();
      }
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", function (e) {
      if (recentlyDragged) e.preventDefault();
    });

    window.addEventListener("resize", render);
    render();
  };

  initSlider({
    carousel: "[data-project-carousel]",
    viewport: "[data-project-viewport]",
    track: "[data-project-track]",
    prev: "[data-project-prev]",
    next: "[data-project-next]",
    dots: "[data-project-dots]",
  });
})();
