/* =========================================================
   Atang Peo Mogotsi - Digital Portfolio
   Interactions
   ========================================================= */

(function () {
  "use strict";

  var body = document.body;
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");
  var navLinks = Array.prototype.slice.call(primaryNav.querySelectorAll("a"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  /* -------------------------
     Mobile navigation
     ------------------------- */

  function setNav(open) {
    body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }

  navToggle.addEventListener("click", function () {
    setNav(!body.classList.contains("nav-open"));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setNav(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (!body.classList.contains("nav-open")) {
      return;
    }
    if (!primaryNav.contains(event.target) && !navToggle.contains(event.target)) {
      setNav(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1080 && body.classList.contains("nav-open")) {
      setNav(false);
    }
  });

  /* -------------------------
     Active section highlight
     ------------------------- */

  var ticking = false;

  function updateActiveLink() {
    var offset = 150;
    var currentId = "";

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset) {
        currentId = section.id;
      }
    });

    if (!currentId && sections.length) {
      currentId = sections[0].id;
    }

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateActiveLink();

  /* -------------------------
     Print-friendly documents
     ------------------------- */

  var printButtons = document.querySelectorAll("[data-print]");

  function clearPrintState() {
    body.classList.remove("print-cv", "print-application");
    var targets = document.querySelectorAll(".printing-target");
    for (var i = 0; i < targets.length; i += 1) {
      targets[i].classList.remove("printing-target");
    }
  }

  for (var i = 0; i < printButtons.length; i += 1) {
    printButtons[i].addEventListener("click", function () {
      var target = this.getAttribute("data-print");
      clearPrintState();
      body.classList.add(target === "cv" ? "print-cv" : "print-application");
      var section = document.getElementById(target);
      if (section) {
        section.classList.add("printing-target");
      }
      window.print();
    });
  }

  window.addEventListener("afterprint", clearPrintState);
})();
