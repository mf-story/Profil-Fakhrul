// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Navbar scroll state + progress =====
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h) * 100 + "%";
});

// ===== Mobile menu =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
  })
);

// ===== Portfolio: data karya per jenis + modal =====
// Item placeholder untuk kategori non-web yang belum jadi proyek terdata.
const placeholders = {
  edukasi: [
    { ico: "🎮", g: "linear-gradient(135deg,#15803d,#0b3b2c)", tag: "Serious Game Edukasi", name: "Metabolic Heroes", desc: "Game edukasi gaya hidup sehat dengan kesulitan adaptif." },
    { ico: "📚", g: "linear-gradient(135deg,#166534,#123524)", tag: "Media Ajar", name: "Modul dan Media Pembelajaran Interaktif", desc: "Materi dan media pembelajaran yang menarik dan mudah dipahami." },
  ],
  foto: [
    { ico: "📷", g: "linear-gradient(135deg,#0f8f4e,#134e2b)", tag: "Fotografi", name: "Sesi Potret dan Human Interest", desc: "Pemotretan potret dan momen manusia dengan komposisi kuat." },
    { ico: "🌄", g: "linear-gradient(135deg,#166534,#0b3b2c)", tag: "Fotografi", name: "Lanskap dan Perjalanan", desc: "Dokumentasi keindahan alam dan perjalanan." },
  ],
  video: [
    { ico: "🎬", g: "linear-gradient(135deg,#065f46,#0b3b2c)", tag: "Videografi", name: "Film Dokumenter Pendek", desc: "Produksi video sinematik yang menceritakan sebuah kisah." },
    { ico: "🚁", g: "linear-gradient(135deg,#10b981,#0a3d2c)", tag: "Aerial / Drone", name: "Footage Udara Sinematik", desc: "Pengambilan gambar udara dramatis menggunakan drone." },
  ],
};
const catTitles = { web: "Web dan Aplikasi", edukasi: "Edukasi", foto: "Fotografi", video: "Video dan Drone" };

// Proyek terdata untuk kategori tertentu (dari PROJECTS).
function projectItems(cat) {
  return (window.PROJECTS_ORDER || [])
    .filter((id) => (window.PROJECTS[id].cat || "web") === cat)
    .map((id) => {
      const p = window.PROJECTS[id];
      return { id, img: p.cover, g: p.g, tag: p.tag, name: p.name, desc: p.summary, ico: p.ico };
    });
}
function itemsForCat(cat) {
  return projectItems(cat).concat(placeholders[cat] || []);
}

const modal = document.getElementById("workModal");
const modalTitle = document.getElementById("modalTitle");
const modalList = document.getElementById("modalList");
const servicesGrid = document.getElementById("services-grid");

function openCategory(key) {
  const items = itemsForCat(key);
  modalTitle.textContent = catTitles[key] || "Karya";
  modalList.innerHTML = items
    .map(
      (it) => {
        const inner = `
        <span class="mw-ico" style="--g:${it.g}">${it.img ? `<img src="${it.img}" alt="${it.name}" loading="lazy">` : it.ico}</span>
        <div>
          <span class="mw-tag">${it.tag}</span>
          <h5>${it.name}</h5>
          <p>${it.desc}</p>
        </div>`;
        return it.id
          ? `<a class="modal-work is-link" href="proyek.html?id=${it.id}">${inner}<span class="mw-go">→</span></a>`
          : `<div class="modal-work">${inner}</div>`;
      }
    )
    .join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
if (servicesGrid) {
  const openFromCard = (card) => { if (card && card.dataset.cat) openCategory(card.dataset.cat); };
  servicesGrid.addEventListener("click", (e) => openFromCard(e.target.closest(".svc")));
  servicesGrid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFromCard(e.target.closest(".svc")); }
  });
}
modal.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ===== Reveal on scroll =====
const revObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); revObserver.unobserve(e.target); }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revObserver.observe(el));

// ===== Count-up stats =====
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 45));
      const tick = () => {
        cur += step;
        if (cur >= target) el.textContent = target + "+";
        else { el.textContent = cur; requestAnimationFrame(tick); }
      };
      tick();
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".stat b").forEach((el) => countObserver.observe(el));

// ===== Contact form (validasi front-end saja) =====
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !message) {
    note.textContent = "Mohon lengkapi semua kolom.";
    note.className = "form-note err";
    return;
  }
  if (!emailOk) {
    note.textContent = "Format email tidak valid.";
    note.className = "form-note err";
    return;
  }
  const subject = encodeURIComponent(`Proyek dari ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:muhammad.fahrul@unismuh.ac.id?subject=${subject}&body=${body}`;
  note.textContent = "Terima kasih! Aplikasi email Anda akan terbuka.";
  note.className = "form-note ok";
  form.reset();
});
