// assets/js/script.js
'use strict';

// safe helper to toggle class
const elementToggleFunc = function (elem) {
  if (!elem) return;
  elem.classList.toggle("active");
};

// safe query helpers
const q = (sel, ctx = document) => ctx.querySelector(sel);
const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel) || []);

// SIDEBAR
const sidebar = q("[data-sidebar]");
const sidebarBtn = q("[data-sidebar-btn]");
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// TESTIMONIALS / MODAL
const testimonialsItem = qa("[data-testimonials-item]");
const modalContainer = q("[data-modal-container]");
const modalCloseBtn = q("[data-modal-close-btn]");
const overlay = q("[data-overlay]");

const modalImg = q("[data-modal-img]");
const modalTitle = q("[data-modal-title]");
const modalText = q("[data-modal-text]");

const testimonialsModalFunc = function () {
  if (modalContainer) modalContainer.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
};

if (testimonialsItem.length && modalContainer) {
  testimonialsItem.forEach((item) => {
    item.addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src || "";
        modalImg.alt = avatar.alt || "";
      }
      if (modalTitle && title) modalTitle.innerHTML = title.innerHTML || "";
      if (modalText && text) modalText.innerHTML = text.innerHTML || "";

      testimonialsModalFunc();
    });
  });
}

// close modal handlers (safe)
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalContainer && modalContainer.classList.contains("active")) {
    testimonialsModalFunc();
  }
});

// CUSTOM SELECT + FILTER
const select = q("[data-select]");
const selectItems = qa("[data-select-item]");
const selectValue = q("[data-selecct-value]"); // note: keep same spelling as HTML
const filterBtn = qa("[data-filter-btn]");
const filterItems = qa("[data-filter-item]");

if (select) {
  select.addEventListener("click", function (e) {
    e.stopPropagation();
    elementToggleFunc(this);
  });
}

// normalize helper
const norm = (s) => (s || "").toString().trim().toLowerCase();

const filterFunc = function (selectedValue) {
  const sel = norm(selectedValue);
  if (!filterItems.length) return;
  filterItems.forEach((fi) => {
    const cat = norm(fi.dataset.category);
    if (!sel || sel === "all") {
      fi.classList.add("active");
    } else if (cat === sel || cat.includes(sel)) {
      fi.classList.add("active");
    } else {
      fi.classList.remove("active");
    }
  });
};

// select-list item clicks
if (selectItems.length) {
  selectItems.forEach((sItem) => {
    sItem.addEventListener("click", function (ev) {
      const text = this.innerText || "";
      if (selectValue) selectValue.innerText = text;
      if (select) select.classList.remove("active");
      filterFunc(text);
    });
  });
}

// filter buttons (large screen)
let lastClickedBtn = filterBtn.length ? filterBtn[0] : null;
if (filterBtn.length) {
  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const text = this.innerText || "";
      if (selectValue) selectValue.innerText = text;
      filterFunc(text);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
}

// initialize filter state: try to use the button with .active, else "all"
(function initFilterState() {
  // try to find a filter button with active class
  const activeBtn = filterBtn.find ? filterBtn.find((b) => b.classList.contains("active")) : filterBtn.filter((b) => b.classList && b.classList.contains("active"))[0];
  if (activeBtn) {
    const t = activeBtn.innerText || "all";
    if (selectValue) selectValue.innerText = activeBtn.innerText;
    filterFunc(t);
    lastClickedBtn = activeBtn;
    return;
  }

  // fallback: use first filter button text if present
  if (filterBtn.length) {
    const t = filterBtn[0].innerText || "all";
    if (selectValue) selectValue.innerText = filterBtn[0].innerText;
    filterFunc(t);
    lastClickedBtn = filterBtn[0];
    filterBtn[0].classList.add("active");
    return;
  }

  // final fallback: show all
  filterFunc("all");
})();

// CONTACT FORM
const form = q("[data-form]");
const formInputs = qa("[data-form-input]");
const formBtn = q("[data-form-btn]");

if (form && formInputs.length && formBtn) {
  const check = () => {
    try {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    } catch (e) {
      // if checkValidity throws for any odd reason, keep button disabled
      formBtn.setAttribute("disabled", "");
    }
  };

  formInputs.forEach((inp) => inp.addEventListener("input", check));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // UI feedback, can be replaced by real submission logic
    formBtn.disabled = true;
    const orig = formBtn.innerHTML;
    formBtn.innerHTML = '<ion-icon name="checkmark-done-outline"></ion-icon> Sent';
    setTimeout(() => {
      form.reset();
      formBtn.innerHTML = orig;
      formBtn.disabled = false;
      check();
    }, 1200);
  });

  // initial validation run
  check();
}

// PAGE NAVIGATION (fixed bug: index shadowing + safer toggles)
const navigationLinks = qa("[data-nav-link]");
const pages = qa("[data-page]");

if (navigationLinks.length && pages.length) {
  // helper to set active page by name (pageName should match data-page)
  const setActivePage = (pageName) => {
    const name = norm(pageName);
    // pages
    pages.forEach((p) => {
      if (norm(p.dataset.page) === name) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
    // nav links
    navigationLinks.forEach((lnk) => {
      if (norm(lnk.textContent) === name) {
        lnk.classList.add("active");
      } else {
        lnk.classList.remove("active");
      }
    });
    window.scrollTo(0, 0);
  };

  navigationLinks.forEach((lnk) => {
    lnk.addEventListener("click", function () {
      const txt = this.textContent || "";
      setActivePage(txt);
    });
  });

  // initialize: use the nav link already marked .active OR the first one
  const initLink = navigationLinks.find ? navigationLinks.find((l) => l.classList.contains("active")) : navigationLinks.filter((l) => l.classList && l.classList.contains("active"))[0];
  if (initLink) {
    setActivePage(initLink.textContent);
  } else {
    setActivePage(navigationLinks[0].textContent);
  }
}
