// Frontend profil — mengambil konten dari server (/api/content) lalu merender semua bagian.
let CONTENT = null;

const catTitles = { web: "Web dan Aplikasi", edukasi: "Edukasi", foto: "Fotografi", video: "Video dan Drone" };

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function ytId(u) { if (!u) return ""; u = String(u).trim(); if (/^[\w-]{11}$/.test(u)) return u; const m = u.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : ""; }

function projectItems(cat) {
  const order = CONTENT.projectsOrder || [];
  return order
    .filter((id) => CONTENT.projects[id] && (CONTENT.projects[id].cat || "web") === cat)
    .map((id) => {
      const p = CONTENT.projects[id];
      return { id, img: p.cover, g: p.g, tag: p.tag, name: p.name, desc: p.summary };
    });
}
function itemsForCat(cat) {
  return projectItems(cat);
}

function headHTML(h) {
  return `<span class="kicker">${h.kicker || ""}</span><h2>${h.titleHtml || ""}</h2>${h.lead ? `<p class="lead">${h.lead}</p>` : ""}`;
}

function render() {
  const c = CONTENT.site;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Hero
  const hero = c.hero;
  document.getElementById("heroContent").innerHTML = `
    <span class="eyebrow reveal">${hero.eyebrow || ""}</span>
    <h1 class="hero-title reveal">${hero.titleHtml || ""}</h1>
    <p class="hero-sub reveal">${hero.subtitleHtml || ""}</p>
    <div class="hero-actions reveal">
      <a href="#services" class="btn btn-primary">${esc(hero.btnPrimary || "Lihat Karya")}</a>
      <a href="#contact" class="btn btn-outline">${esc(hero.btnSecondary || "Kontak")}</a>
    </div>`;
  const heroSec = document.getElementById("hero");
  const heroBg = heroSec.querySelector(".hero-bg");
  if (hero.bgImage) {
    heroSec.classList.add("has-photo");
    heroBg.style.backgroundImage = `linear-gradient(rgba(8,14,26,.55), rgba(8,14,26,.72)), url("${hero.bgImage}")`;
    document.body.classList.add("photo-hero");
  } else {
    heroSec.classList.remove("has-photo");
    heroBg.style.backgroundImage = "";
    document.body.classList.remove("photo-hero");
  }

  // Keahlian
  document.getElementById("servicesHead").innerHTML = headHTML(c.services);
  document.getElementById("services-grid").innerHTML = (c.services.items || []).map((s) => `
    <article class="svc reveal${s.wide ? " svc-wide" : ""}" data-cat="${esc(s.cat || "web")}" role="button" tabindex="0">
      <div class="svc-ico"><svg viewBox="0 0 24 24">${s.icon || ""}</svg></div>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.desc)}</p>
      <span class="svc-more">Lihat portofolio →</span>
    </article>`).join("");

  // Pendidikan
  document.getElementById("educationHead").innerHTML = headHTML(c.education);
  document.getElementById("education-grid").innerHTML = (c.education.items || []).map((e) => `
    <div class="edu-card reveal">
      <span class="edu-date">${esc(e.date)}</span>
      <h4>${esc(e.title)}</h4>
      <p class="edu-org">${esc(e.org)}</p>
      <p>${esc(e.desc)}</p>
    </div>`).join("");

  // Pengalaman
  document.getElementById("experienceHead").innerHTML = headHTML(c.experience);
  document.getElementById("experience-list").innerHTML = (c.experience.items || []).map((x) => `
    <div class="tl-item reveal">
      <span class="tl-year">${esc(x.year)}</span>
      <div class="tl-body">
        <h4>${esc(x.title)}</h4>
        <p class="tl-org">${esc(x.org)}</p>
        <p>${esc(x.desc)}</p>
      </div>
    </div>`).join("");

  // Galeri (tampil hanya bila ada gambar; item tanpa gambar diabaikan)
  const g = c.gallery || { items: [] };
  const gSec = document.getElementById("gallery");
  const gItems = (g.items || []).filter((it) => it.image);
  if (gItems.length) {
    document.getElementById("galleryHead").innerHTML = headHTML(g);
    document.getElementById("gallery-grid").innerHTML = gItems.map((it) => `
      <figure class="gcard reveal"><img src="${esc(it.image)}" alt="${esc(it.caption || "")}" class="gzoom" loading="lazy" />${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ""}</figure>`).join("");
    gSec.style.display = "";
  } else { gSec.style.display = "none"; }

  // Video: dukung file unggahan/URL video langsung ATAU tautan YouTube (di kolom mana pun).
  const v = c.video || {};
  const vSec = document.getElementById("video");
  const ytFromFile = ytId(v.file);
  const ytid = ytId(v.youtube) || ytFromFile;
  const fileVideo = v.file && !ytFromFile ? v.file : ""; // file yang benar-benar video (bukan link YouTube)
  if (fileVideo || ytid) {
    document.getElementById("videoHead").innerHTML = headHTML(v);
    if (fileVideo) {
      const poster = v.bgImage ? ` poster="${esc(v.bgImage)}"` : "";
      document.getElementById("video-frame").innerHTML = `<div class="vwrap"><video controls playsinline preload="metadata"${poster} src="${esc(fileVideo)}"></video></div>`;
    } else {
      const thumb = v.bgImage || `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;
      document.getElementById("video-frame").innerHTML = `<div class="vwrap" style="background-image:linear-gradient(rgba(8,14,26,.4),rgba(8,14,26,.55)),url('${esc(thumb)}')"><button class="vplay" data-yt="${ytid}" aria-label="Putar video">▶</button></div>`;
    }
    vSec.style.display = "";
  } else { vSec.style.display = "none"; }

  // Tentang
  const a = c.about;
  document.getElementById("about-inner").innerHTML = `
    <div class="about-visual reveal">
      <div class="about-frame">${a.frameImage ? `<img src="${esc(a.frameImage)}" alt="${esc(c.brand ? c.brand.name : "")}" />` : `<span>${esc(a.frameInitials || "MF")}</span>`}</div>
      <div class="about-badge">${esc(a.badge || "")}</div>
    </div>
    <div class="about-body reveal">
      <span class="kicker">${a.kicker || ""}</span>
      <h2>${a.titleHtml || ""}</h2>
      ${(a.paragraphs || []).map((p) => `<p>${p}</p>`).join("")}
      <ul class="about-points">${(a.points || []).map((pt) => `<li><span>✓</span> ${esc(pt)}</li>`).join("")}</ul>
      <a href="#contact" class="btn btn-primary">${esc(a.btn || "Kontak")}</a>
    </div>`;

  // Kontak
  const ct = c.contact;
  document.getElementById("contactHead").innerHTML = headHTML(ct);
  document.getElementById("contact-info").innerHTML = `
    <a href="mailto:${esc(ct.email)}" class="contact-item"><span class="ci-ico">✉️</span><div><b>Email</b><p>${esc(ct.email)}</p></div></a>
    <a href="https://wa.me/${esc(ct.whatsappNumber)}" class="contact-item" target="_blank" rel="noopener"><span class="ci-ico">💬</span><div><b>WhatsApp</b><p>${esc(ct.whatsappLabel)}</p></div></a>
    <div class="contact-item"><span class="ci-ico">📍</span><div><b>Lokasi</b><p>${esc(ct.location)}</p></div></div>
    <div class="socials">${(ct.socials || []).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div>`;

  initInteractions();
}

/* ---------------- Interaksi ---------------- */
function initInteractions() {
  // Reveal
  const revObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); revObserver.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revObserver.observe(el));

  // Kartu keahlian -> modal
  const grid = document.getElementById("services-grid");
  const open = (card) => { if (card && card.dataset.cat) openCategory(card.dataset.cat, card.querySelector("h3") ? card.querySelector("h3").textContent : ""); };
  grid.addEventListener("click", (e) => open(e.target.closest(".svc")));
  grid.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e.target.closest(".svc")); } });

  // Galeri -> lightbox
  const gg = document.getElementById("gallery-grid");
  if (gg) gg.addEventListener("click", (e) => { const img = e.target.closest("img.gzoom"); if (img) openLightbox(img.src, img.alt); });
  // Video -> putar
  const vf = document.getElementById("video-frame");
  if (vf) vf.addEventListener("click", (e) => {
    const btn = e.target.closest(".vplay"); if (!btn) return;
    vf.innerHTML = `<div class="vwrap"><iframe src="https://www.youtube.com/embed/${btn.dataset.yt}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>`;
  });

  // Form kontak
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
    if (!name || !email || !message) { note.textContent = "Mohon lengkapi semua kolom."; note.className = "form-note err"; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = "Format email tidak valid."; note.className = "form-note err"; return; }
    const to = (CONTENT.site.contact && CONTENT.site.contact.email) || "";
    const subject = encodeURIComponent(`Pesan dari ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    note.textContent = "Terima kasih! Aplikasi email Anda akan terbuka."; note.className = "form-note ok"; form.reset();
  });
}

/* ---------------- Modal ---------------- */
function openCategory(key, title) {
  const items = itemsForCat(key);
  document.getElementById("modalTitle").textContent = title || catTitles[key] || "Karya";
  document.getElementById("modalList").innerHTML = items.length ? items.map((it) => {
    const inner = `
      <span class="mw-ico" style="--g:${it.g}">${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy">` : it.ico}</span>
      <div><span class="mw-tag">${esc(it.tag)}</span><h5>${esc(it.name)}</h5><p>${esc(it.desc)}</p></div>`;
    return it.id
      ? `<a class="modal-work is-link" href="proyek.html?id=${encodeURIComponent(it.id)}&cat=${encodeURIComponent(key)}">${inner}<span class="mw-go">→</span></a>`
      : `<div class="modal-work">${inner}</div>`;
  }).join("") : `<p class="modal-empty">Belum ada proyek di kategori ini.</p>`;
  const modal = document.getElementById("workModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const modal = document.getElementById("workModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ---------------- Lightbox galeri ---------------- */
function openLightbox(src, alt) {
  const lb = document.getElementById("lightbox"); if (!lb) return;
  const img = document.getElementById("lbImg");
  img.src = src; img.alt = alt || "";
  lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
}
function closeLightbox() {
  const lb = document.getElementById("lightbox"); if (!lb) return;
  lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
}

/* ---------------- Navbar & global ---------------- */
function initGlobal() {
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (window.scrollY / h) * 100 + "%";
  });
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => { navLinks.classList.toggle("open"); navToggle.classList.toggle("open"); });
  navLinks.querySelectorAll("a").forEach((x) => x.addEventListener("click", () => { navLinks.classList.remove("open"); navToggle.classList.remove("open"); }));

  document.getElementById("workModal").addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeLightbox(); } });
  const lb = document.getElementById("lightbox");
  if (lb) {
    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  }
}

/* ---------------- Boot ---------------- */
(async function boot() {
  initGlobal();
  try {
    const r = await fetch("/api/content");
    CONTENT = await r.json();
    render();
    // Jika datang dari daftar kategori (mis. kembali dari halaman detail), buka lagi daftarnya.
    const cat = new URLSearchParams(location.search).get("cat");
    if (cat && catTitles[cat]) { const s = document.getElementById("services"); if (s) s.scrollIntoView(); setTimeout(() => openCategory(cat), 250); }
    else if (location.hash) {
      // Konten dirender oleh JS; loncat andal ke bagian (mis. #contact). Paksa instan agar tak diblokir scroll-behavior:smooth.
      const jump = () => {
        const el = document.querySelector(location.hash);
        if (!el) return;
        const se = document.scrollingElement || document.documentElement;
        const prev = se.style.scrollBehavior;
        se.style.scrollBehavior = "auto";
        se.scrollTop = el.getBoundingClientRect().top + se.scrollTop - 64;
        se.style.scrollBehavior = prev;
      };
      setTimeout(jump, 80);
      if (document.readyState !== "complete") window.addEventListener("load", () => setTimeout(jump, 100));
      setTimeout(jump, 600);
    }
  } catch (e) {
    document.getElementById("heroContent").innerHTML = '<p class="hero-sub">Gagal memuat konten. Jalankan lewat server (node server.js).</p>';
    console.error(e);
  }
})();
