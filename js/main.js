/* ═════════════════════════════════════════
   AHA YEMI RUCHULU — main.js
   Handles: Navbar, Reveal, Counters, Tabs,
   Testimonials, Gallery Lightbox, Forms
═════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initReveal();
  initCounters();
  initMenuTabs();
  initTestimonials();
  initGallery();
  setActiveLink();
});

/* ─── NAVBAR ─────────────────────────────── */
function initNavbar() {
  const nav  = document.getElementById("navbar");
  const ham  = document.getElementById("hamburger");
  const mob  = document.getElementById("mobile-menu");
  const close= document.getElementById("mobile-close");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  if (ham && mob) {
    ham.addEventListener("click", () => mob.classList.add("open"));
    close && close.addEventListener("click", () => mob.classList.remove("open"));
    mob.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mob.classList.remove("open")));
  }
}

/* ─── ACTIVE NAV LINK ─────────────────────── */
function setActiveLink() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
}

/* ─── SCROLL REVEAL ───────────────────────── */
function initReveal() {
  const opts = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        io.unobserve(e.target);
      }
    });
  }, opts);
  document.querySelectorAll(".reveal, .reveal-l, .reveal-r").forEach(el => io.observe(el));
}

/* ─── ANIMATED COUNTERS ───────────────────── */
function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => io.observe(el));
}

function animateCounter(el) {
  const end    = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const dur    = 2000;
  const t0     = performance.now();
  const tick   = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
    el.textContent = v.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ─── MENU TABS ───────────────────────────── */
function initMenuTabs() {
  const tabs = document.querySelectorAll(".menu-tab-btn");
  const panes= document.querySelectorAll(".menu-tab-content");
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t  => t.classList.remove("act"));
      panes.forEach(p => p.classList.remove("active"));
      btn.classList.add("act");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });
}

/* ─── TESTIMONIALS CAROUSEL ───────────────── */
function initTestimonials() {
  const track    = document.getElementById("rev-text");
  const img      = document.getElementById("rev-img");
  const name     = document.getElementById("rev-name");
  const role     = document.getElementById("rev-role");
  const dots     = document.querySelectorAll(".rev-dot");
  if (!track) return;

  const reviews = JSON.parse(document.getElementById("reviews-data")?.textContent || "[]");
  if (!reviews.length) return;

  let current = 0;
  let timer;

  function show(idx) {
    current = (idx + reviews.length) % reviews.length;
    const r = reviews[current];
    // Fade out
    [track, img, name, role].forEach(el => el && (el.style.opacity = "0"));
    setTimeout(() => {
      if (track) track.textContent = r.text;
      if (img)   { img.src = r.img; img.alt = r.name; }
      if (name)  name.textContent = r.name;
      if (role)  role.textContent = r.role;
      dots.forEach((d, i) => d.classList.toggle("act", i === current));
      [track, img, name, role].forEach(el => el && (el.style.opacity = "1"));
    }, 300);
  }

  dots.forEach((d, i) => d.addEventListener("click", () => { clearInterval(timer); show(i); startTimer(); }));

  function startTimer() {
    timer = setInterval(() => show(current + 1), 5500);
  }
  startTimer();
  show(0);
}

/* ─── GALLERY LIGHTBOX ────────────────────── */
function initGallery() {
  const lb    = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose= document.getElementById("lightbox-close");
  if (!lb) return;

  document.querySelectorAll(".gal-item").forEach(item => {
    item.addEventListener("click", () => {
      const src = item.querySelector("img")?.src;
      if (src && lbImg) {
        lbImg.src = src;
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  lbClose && lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });
}

/* ─── RESERVATION FORM ────────────────────── */
const resForm = document.getElementById("reservation-form");
if (resForm) {
  resForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = resForm.querySelector("button[type=submit]");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "Reservation Confirmed ✓";
      btn.style.background = "#3B6D11";
      btn.style.borderColor = "#3B6D11";
      btn.style.color = "#F7F5F2";
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
        resForm.reset();
      }, 3500);
    }
  });
}

/* ─── CATERING FORM ───────────────────────── */
const catForm = document.getElementById("catering-form");
if (catForm) {
  catForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = catForm.querySelector("button[type=submit]");
    if (btn) {
      btn.textContent = "Enquiry Sent — We'll Call You ✓";
      btn.style.background = "transparent";
      btn.style.color = "var(--gld)";
      setTimeout(() => {
        btn.textContent = "Send Catering Enquiry";
        btn.style.background = "";
        btn.style.color = "";
        catForm.reset();
      }, 3500);
    }
  });
}

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────── */
document.querySelectorAll("a[href^='#']").forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ─── DATE INPUT MIN DATE ─────────────────── */
const dateInputs = document.querySelectorAll("input[type='date']");
dateInputs.forEach(d => {
  const today = new Date().toISOString().split("T")[0];
  d.min = today;
});
