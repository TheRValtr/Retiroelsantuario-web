
(() => {
  "use strict";

  // ---------- App boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    // Global
    setCurrentYear();
    initNavActiveState();     // optional helper for local .html navigation
    initSmoothAnchorScroll(); // handles sticky header offset

    // Page/feature modules (safe: each checks DOM presence)
    initAmenities();
    initGallery();
    initPackages();
    initBookingForm();
  });

  // ============================================================
  // Utilities
  // ============================================================

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function on(el, event, handler, options) {
    if (!el) return;
    el.addEventListener(event, handler, options);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // ============================================================
  // Global: Footer year
  // ============================================================
  function setCurrentYear() {
    const year = $("#year");
    if (!year) return;
    year.textContent = new Date().getFullYear();
  }

  // ============================================================
  // Global: Mark current nav link (useful when aria-current missing)
  // Works with local files like "Booking.html", "Amenities.html"
  // ============================================================
  function initNavActiveState() {
    const links = $all(".nav__links a");
    if (!links.length) return;

    // Get current file name (handles local + hosted)
    const path = window.location.pathname;
    const current = path.split("/").pop() || ""; // e.g. "Booking.html"

    links.forEach((a) => {
      const href = (a.getAttribute("href") || "").trim();
      if (!href) return;

      // Only target same-site html links
      if (href.endsWith(".html") || href.includes(".html")) {
        const hrefFile = href.split("/").pop();
        if (hrefFile && hrefFile === current) {
          a.setAttribute("aria-current", "page");
        }
      }
    });
  }

  // ============================================================
  // Global: Smooth anchor scrolling with sticky header offset
  // - Works for #naturaleza, #booking, etc.
  // - Prevents headings getting hidden under sticky header
  // ============================================================
  function initSmoothAnchorScroll() {
    const header = $(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;

    const anchorLinks = $all('a[href^="#"]:not([href="#"])');
    if (!anchorLinks.length) return;

    anchorLinks.forEach((link) => {
      on(link, "click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId.length < 2) return;

        const target = $(targetId);
        if (!target) return;

        e.preventDefault();

        const top =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          12;

        window.scrollTo({ top, behavior: "smooth" });

        // Update URL hash without jumping
        history.pushState(null, "", targetId);
      });
    });
  }

  // ============================================================
  // Amenities page module
  // ============================================================
  function initAmenities() {
    const grid = $(".amenities-grid");
    if (!grid) return; // not on amenities page

    // Placeholder for future behavior:
    // - highlight selected card
    // - auto-scroll to detail section
    // - filter categories
    console.log("Amenities module ready ✔");
  }

  // ============================================================
  // Gallery page module (album pagination later)
  // ============================================================
  function initGallery() {
    const gallery = $(".gallery-grid");
    if (!gallery) return; // not on gallery page

    // Placeholder for future behavior:
    // - album pages (4–6 images each)
    // - next/prev buttons
    // - lightbox
    console.log("Gallery module ready ✔");
  }

  // ============================================================
  // Packages page module (hooks for selecting package and redirect)
  // ============================================================
  function initPackages() {
    const grid = $(".packages-grid");
    if (!grid) return; // not on packages page

    // Placeholder:
    // - clicking "Reservar" sets package choice for booking page
    // - use query params or localStorage
    console.log("Packages module ready ✔");
  }

  // ============================================================
  // Booking page module
  // - Progress bar syncing using your existing HTML
  // - Optional: basic client-side validation UX
  // - Optional: show success panel (for later when you AJAX submit)
  // ============================================================
  function initBookingForm() {
    const form = $(".booking-form");
    if (!form) return; // not on booking page

    console.log("Booking module ready ✔");

    // --- Progress steps sync (based on focusing fieldsets) ---
    const steps = $all(".step");
    const fill = $(".steps-bar__fill");
    const fieldsets = $all(".booking-form fieldset");

    if (steps.length && fill && fieldsets.length) {
      let current = 0;

      const update = () => {
        steps.forEach((step, idx) => {
          if (idx === current) step.setAttribute("aria-current", "step");
          else step.removeAttribute("aria-current");
        });

        const pct = ((current + 1) / steps.length) * 100;
        fill.style.width = pct + "%";
      };

      fieldsets.forEach((fs, idx) => {
        on(fs, "focusin", () => {
          current = clamp(idx, 0, steps.length - 1);
          update();
        });
      });

      update();
    }

    // --- Basic required-field feedback (no AJAX yet) ---
    // You can remove this if you prefer native browser validation only.
    on(form, "submit", (e) => {
      // Let the browser handle validation first:
      if (typeof form.reportValidity === "function") {
        const ok = form.reportValidity();
        if (!ok) {
          e.preventDefault();
          return;
        }
      }

      // Simple honeypot check
      const hp = $("#company_hp");
      if (hp && hp.value.trim() !== "") {
        e.preventDefault();
        return;
      }

      // If you later switch to AJAX submit, you will preventDefault here.
      // For now, allow normal POST to your endpoint.
    });

    // --- Success panel hook (for later when using AJAX) ---
    // Example future usage:
    // showSuccess();
    function showSuccess() {
      const panel = $("#formSuccess");
      if (!panel) return;
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
})();
