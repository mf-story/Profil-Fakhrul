// Panel admin — login + editor konten situs & proyek (tersimpan di server).
let state = null;
let current = "hero";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const catLabel = { web: "Web dan Aplikasi", edukasi: "Edukasi", foto: "Fotografi", video: "Video dan Drone" };

function getPath(o, p) { return p.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }
function setPath(o, p, v) {
  const ks = p.split("."); const last = ks.pop(); let t = o;
  ks.forEach((k, i) => { if (t[k] == null) t[k] = /^\d+$/.test(ks[i + 1]) ? [] : {}; t = t[k]; });
  t[last] = v;
}
function toast(msg, ok = true) {
  const t = $("#toast"); t.textContent = msg; t.className = "toast " + (ok ? "ok" : "err"); t.hidden = false;
  clearTimeout(t._t); t._t = setTimeout(() => (t.hidden = true), 2500);
}
function fileToDataURL(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); }); }
async function uploadFile(f) {
  const dataUrl = await fileToDataURL(f);
  const r = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataUrl }) });
  if (!r.ok) throw new Error("upload gagal");
  return (await r.json()).url;
}

/* ---------------- Auth & boot ---------------- */
async function boot() {
  const me = await (await fetch("/api/me")).json();
  if (!me.authed) { $("#loginScreen").hidden = false; return; }
  await loadAndStart();
}
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: $("#loginPw").value }) });
  if (r.ok) { $("#loginScreen").hidden = true; await loadAndStart(); }
  else { $("#loginNote").textContent = "Password salah."; $("#loginNote").className = "form-note err"; }
});
async function loadAndStart() {
  state = await (await fetch("/api/content")).json();
  if (!state.projectsOrder) state.projectsOrder = Object.keys(state.projects || {});
  $("#app").hidden = false;
  $("#cmsNav").addEventListener("click", (e) => { const b = e.target.closest("button[data-panel]"); if (b) switchPanel(b.dataset.panel); });
  $("#btnSave").addEventListener("click", save);
  $("#btnLogout").addEventListener("click", async () => { await fetch("/api/logout", { method: "POST" }); location.reload(); });
  // Toolbar editor teks (seperti Word)
  $("#panel").addEventListener("click", (e) => {
    const btn = e.target.closest(".rt-tools button"); if (!btn) return;
    e.preventDefault();
    const edit = btn.closest(".rt").querySelector(".rt-edit"); edit.focus();
    const cmd = btn.dataset.cmd;
    if (cmd === "bold") document.execCommand("bold", false);
    else if (cmd === "em") wrapEm();
    else if (cmd === "br") document.execCommand("insertHTML", false, "<br>");
    setPath(state, edit.dataset.rich, edit.innerHTML);
  });
  switchPanel("hero");
}
async function save() {
  try {
    const r = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) });
    if (!r.ok) throw new Error((await r.json()).error || "gagal");
    toast("Tersimpan. Muat ulang situs untuk melihat perubahan.");
  } catch (e) { toast("Gagal menyimpan: " + e.message, false); }
}

/* ---------------- Panel switching ---------------- */
function switchPanel(name) {
  current = name;
  $$("#cmsNav button").forEach((b) => b.classList.toggle("active", b.dataset.panel === name));
  const panel = $("#panel");
  panel.innerHTML = PANELS[name] ? PANELS[name]() : "";
  panel.oninput = panel.onchange = (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.bind) { setPath(state, el.dataset.bind, el.type === "checkbox" ? el.checked : el.value); return; }
    if (el.dataset && el.dataset.rich != null) { setPath(state, el.dataset.rich, el.innerHTML); }
  };
  if (AFTER[name]) AFTER[name](panel);
}
function $$(s, r = document) { return [...r.querySelectorAll(s)]; }

/* ---------------- Field helpers ---------------- */
const fld = (label, path, val) => `<label class="fld"><span>${label}</span><input type="text" data-bind="${path}" value="${esc(val)}" /></label>`;
const area = (label, path, val, rows = 3) => `<label class="fld"><span>${label}</span><textarea data-bind="${path}" rows="${rows}">${esc(val)}</textarea></label>`;
const richBox = (path, html) => `<div class="rt"><div class="rt-tools"><button type="button" data-cmd="bold" title="Tebal"><b>B</b></button><button type="button" data-cmd="em" title="Sorot warna">✨</button><button type="button" data-cmd="br" title="Baris baru">↵</button></div><div class="rt-edit" contenteditable="true" data-rich="${path}">${html || ""}</div></div>`;
const richField = (label, path, html) => `<div class="fld"><span>${label}</span>${richBox(path, html)}</div>`;
const head = (basePath, h) => `${fld("Label kecil (kicker)", basePath + ".kicker", h.kicker)}${richField("Judul", basePath + ".titleHtml", h.titleHtml)}${h.lead !== undefined ? area("Teks pengantar (lead)", basePath + ".lead", h.lead, 2) : ""}`;
function wrapEm() {
  const sel = window.getSelection();
  const safe = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  if (!sel || !sel.rangeCount || sel.isCollapsed) { document.execCommand("insertHTML", false, "<em>teks</em>"); return; }
  document.execCommand("insertHTML", false, "<em>" + safe(sel.toString()) + "</em>");
}

/* ---------------- Panels ---------------- */
const PANELS = {
  hero() {
    const h = state.site.hero;
    return `<h2 class="cms-title">Hero (bagian atas)</h2>
      ${fld("Eyebrow (teks kecil di atas judul)", "site.hero.eyebrow", h.eyebrow)}
      ${richField("Judul besar", "site.hero.titleHtml", h.titleHtml)}
      ${richField("Sub-judul", "site.hero.subtitleHtml", h.subtitleHtml)}
      <div class="fgrid">${fld("Teks tombol utama", "site.hero.btnPrimary", h.btnPrimary)}${fld("Teks tombol kedua", "site.hero.btnSecondary", h.btnSecondary)}</div>`;
  },
  services() {
    const s = state.site.services;
    return `<h2 class="cms-title">Keahlian</h2>${head("site.services", s)}
      <h3 class="cms-sub">Daftar keahlian</h3>
      <div id="svcList">${(s.items || []).map((it, i) => svcRow(it, i)).join("")}</div>
      <button class="add-row" id="addSvc">+ Tambah keahlian</button>`;
  },
  education() {
    const e = state.site.education;
    return `<h2 class="cms-title">Pendidikan</h2>${head("site.education", e)}
      <div id="eduList">${(e.items || []).map((it, i) => eduRow(it, i)).join("")}</div>
      <button class="add-row" id="addEdu">+ Tambah pendidikan</button>`;
  },
  experience() {
    const x = state.site.experience;
    return `<h2 class="cms-title">Pengalaman</h2>${head("site.experience", x)}
      <div id="expList">${(x.items || []).map((it, i) => expRow(it, i)).join("")}</div>
      <button class="add-row" id="addExp">+ Tambah pengalaman</button>`;
  },
  about() {
    const a = state.site.about;
    return `<h2 class="cms-title">Tentang Saya</h2>
      ${fld("Label kecil", "site.about.kicker", a.kicker)}
      ${richField("Judul", "site.about.titleHtml", a.titleHtml)}
      <div class="fgrid">${fld("Inisial bingkai", "site.about.frameInitials", a.frameInitials)}${fld("Badge", "site.about.badge", a.badge)}</div>
      <label class="fld"><span>Foto (opsional, ganti inisial)</span><div class="img-field"><div class="img-prev" id="aboutPrev">${a.frameImage ? `<img src="${esc(a.frameImage)}">` : ""}</div><div class="img-ctrl"><input type="file" id="aboutFile" accept="image/*" /><input type="text" data-bind="site.about.frameImage" value="${esc(a.frameImage || "")}" placeholder="path/URL foto" /></div></div></label>
      <h3 class="cms-sub">Paragraf</h3><div id="aboutParas">${(a.paragraphs || []).map((p, i) => `<div class="erow">${richBox("site.about.paragraphs." + i, p)}<button class="row-del" data-del-para="${i}">×</button></div>`).join("")}</div>
      <button class="add-row" id="addPara">+ Tambah paragraf</button>
      <h3 class="cms-sub">Poin (checklist)</h3><div id="aboutPoints">${(a.points || []).map((p, i) => `<div class="erow"><input type="text" data-bind="site.about.points.${i}" value="${esc(p)}" /><button class="row-del" data-del-point="${i}">×</button></div>`).join("")}</div>
      <button class="add-row" id="addPoint">+ Tambah poin</button>
      ${fld("Teks tombol", "site.about.btn", a.btn)}`;
  },
  contact() {
    const c = state.site.contact;
    return `<h2 class="cms-title">Kontak</h2>${head("site.contact", c)}
      <div class="fgrid">${fld("Email", "site.contact.email", c.email)}${fld("Lokasi", "site.contact.location", c.location)}</div>
      <div class="fgrid">${fld("Nomor WhatsApp (mis. 62812...)", "site.contact.whatsappNumber", c.whatsappNumber)}${fld("Label WhatsApp tampil", "site.contact.whatsappLabel", c.whatsappLabel)}</div>
      <h3 class="cms-sub">Sosial media</h3><div id="socList">${(c.socials || []).map((s, i) => `<div class="erow"><input type="text" data-bind="site.contact.socials.${i}.label" value="${esc(s.label)}" placeholder="Label (IG)" style="max-width:120px" /><input type="text" data-bind="site.contact.socials.${i}.url" value="${esc(s.url)}" placeholder="https://..." /><button class="row-del" data-del-soc="${i}">×</button></div>`).join("")}</div>
      <button class="add-row" id="addSoc">+ Tambah sosial</button>`;
  },
  projects() {
    const ids = state.projectsOrder || [];
    return `<h2 class="cms-title">Proyek</h2>
      <button class="eb-btn primary" id="addProj" style="margin-bottom:14px">➕ Tambah Proyek</button>
      <div class="admin-list" id="projList">${ids.map((id, i) => projRow(id, i, ids.length)).join("")}</div>`;
  },
  settings() {
    return `<h2 class="cms-title">Pengaturan</h2>
      <h3 class="cms-sub">Ganti password admin</h3>
      <div class="fgrid"><label class="fld"><span>Password baru (min. 6)</span><input type="password" id="newPw" /></label><label class="fld"><span>&nbsp;</span><button class="btn btn-primary" id="btnChangePw" type="button">Ganti Password</button></label></div>
      <h3 class="cms-sub">Lainnya</h3>
      <p class="muted" style="margin-bottom:12px">Kembalikan seluruh konten ke bawaan (menghapus semua perubahan).</p>
      <button class="btn btn-outline" id="btnResetAll" type="button" style="color:#dc2626">↺ Reset semua konten</button>`;
  },
};

const svcRow = (it, i) => `<div class="cms-card"><div class="cms-card-top"><b>Keahlian ${i + 1}</b><button class="row-del" data-del-svc="${i}" style="display:inline-grid">×</button></div>
  <div class="fgrid">${fld("Judul", `site.services.items.${i}.title`, it.title)}<label class="fld"><span>Kategori (untuk daftar karya)</span><select data-bind="site.services.items.${i}.cat">${["web", "edukasi", "foto", "video"].map((k) => `<option value="${k}" ${it.cat === k ? "selected" : ""}>${catLabel[k]}</option>`).join("")}</select></label></div>
  ${area("Deskripsi", `site.services.items.${i}.desc`, it.desc, 2)}
  <label class="fld chk"><input type="checkbox" data-bind="site.services.items.${i}.wide" ${it.wide ? "checked" : ""} /> Kartu lebar</label></div>`;
const eduRow = (it, i) => `<div class="cms-card"><div class="cms-card-top"><b>Pendidikan ${i + 1}</b><button class="row-del" data-del-edu="${i}" style="display:inline-grid">×</button></div>
  <div class="fgrid">${fld("Tahun", `site.education.items.${i}.date`, it.date)}${fld("Jenjang / judul", `site.education.items.${i}.title`, it.title)}</div>
  ${fld("Institusi", `site.education.items.${i}.org`, it.org)}${area("Keterangan", `site.education.items.${i}.desc`, it.desc, 2)}</div>`;
const expRow = (it, i) => `<div class="cms-card"><div class="cms-card-top"><b>Pengalaman ${i + 1}</b><button class="row-del" data-del-exp="${i}" style="display:inline-grid">×</button></div>
  <div class="fgrid">${fld("Tahun", `site.experience.items.${i}.year`, it.year)}${fld("Jabatan / judul", `site.experience.items.${i}.title`, it.title)}</div>
  ${fld("Organisasi", `site.experience.items.${i}.org`, it.org)}${area("Keterangan", `site.experience.items.${i}.desc`, it.desc, 2)}</div>`;
const projRow = (id, i, n) => { const p = state.projects[id] || {}; return `<div class="admin-row" data-id="${id}">
  <div class="ar-cover">${p.cover ? `<img src="${esc(p.cover)}">` : "📁"}</div>
  <div class="ar-info"><h3>${esc(p.name || "(tanpa nama)")}</h3><span class="ar-tag">${esc(p.tag || "")}</span><span class="ar-cat">${catLabel[p.cat] || p.cat || "web"}</span></div>
  <div class="ar-actions"><button class="eb-btn" data-move="up" ${i === 0 ? "disabled" : ""}>↑</button><button class="eb-btn" data-move="down" ${i === n - 1 ? "disabled" : ""}>↓</button><button class="eb-btn" data-edit>✏️</button><button class="eb-btn danger" data-del>🗑️</button></div></div>`; };

/* ---------------- After-render (lists, uploads, buttons) ---------------- */
const AFTER = {
  services(panel) {
    $("#addSvc", panel).onclick = () => { state.site.services.items.push({ icon: "", title: "Keahlian baru", desc: "", cat: "web", wide: false }); switchPanel("services"); };
    panel.querySelectorAll("[data-del-svc]").forEach((b) => (b.onclick = () => { state.site.services.items.splice(+b.dataset.delSvc, 1); switchPanel("services"); }));
  },
  education(panel) {
    $("#addEdu", panel).onclick = () => { state.site.education.items.push({ date: "", title: "Pendidikan baru", org: "", desc: "" }); switchPanel("education"); };
    panel.querySelectorAll("[data-del-edu]").forEach((b) => (b.onclick = () => { state.site.education.items.splice(+b.dataset.delEdu, 1); switchPanel("education"); }));
  },
  experience(panel) {
    $("#addExp", panel).onclick = () => { state.site.experience.items.push({ year: "", title: "Pengalaman baru", org: "", desc: "" }); switchPanel("experience"); };
    panel.querySelectorAll("[data-del-exp]").forEach((b) => (b.onclick = () => { state.site.experience.items.splice(+b.dataset.delExp, 1); switchPanel("experience"); }));
  },
  about(panel) {
    $("#addPara", panel).onclick = () => { (state.site.about.paragraphs = state.site.about.paragraphs || []).push(""); switchPanel("about"); };
    $("#addPoint", panel).onclick = () => { (state.site.about.points = state.site.about.points || []).push(""); switchPanel("about"); };
    panel.querySelectorAll("[data-del-para]").forEach((b) => (b.onclick = () => { state.site.about.paragraphs.splice(+b.dataset.delPara, 1); switchPanel("about"); }));
    panel.querySelectorAll("[data-del-point]").forEach((b) => (b.onclick = () => { state.site.about.points.splice(+b.dataset.delPoint, 1); switchPanel("about"); }));
    $("#aboutFile", panel).onchange = async (e) => { if (e.target.files[0]) { try { const url = await uploadFile(e.target.files[0]); state.site.about.frameImage = url; switchPanel("about"); toast("Foto diunggah."); } catch { toast("Gagal unggah", false); } } };
  },
  contact(panel) {
    $("#addSoc", panel).onclick = () => { (state.site.contact.socials = state.site.contact.socials || []).push({ label: "", url: "#" }); switchPanel("contact"); };
    panel.querySelectorAll("[data-del-soc]").forEach((b) => (b.onclick = () => { state.site.contact.socials.splice(+b.dataset.delSoc, 1); switchPanel("contact"); }));
  },
  projects(panel) {
    $("#addProj", panel).onclick = () => openProj(null);
    $("#projList", panel).addEventListener("click", (e) => {
      const row = e.target.closest(".admin-row"); if (!row) return; const id = row.dataset.id;
      if (e.target.closest("[data-edit]")) openProj(id);
      else if (e.target.closest("[data-del]")) { if (confirm("Hapus proyek ini?")) { delete state.projects[id]; state.projectsOrder = state.projectsOrder.filter((x) => x !== id); switchPanel("projects"); } }
      else if (e.target.closest('[data-move="up"]')) moveProj(id, -1);
      else if (e.target.closest('[data-move="down"]')) moveProj(id, 1);
    });
  },
  settings(panel) {
    $("#btnChangePw", panel).onclick = async () => {
      const pw = $("#newPw", panel).value;
      const r = await fetch("/api/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (r.ok) { toast("Password diganti."); $("#newPw", panel).value = ""; } else toast((await r.json()).error || "Gagal", false);
    };
    $("#btnResetAll", panel).onclick = async () => {
      if (!confirm("Kembalikan SEMUA konten ke bawaan?")) return;
      await fetch("/api/reset", { method: "POST" });
      state = await (await fetch("/api/content")).json();
      switchPanel("hero"); toast("Konten dikembalikan ke bawaan.");
    };
  },
};
function moveProj(id, dir) {
  const arr = state.projectsOrder; const i = arr.indexOf(id); const j = i + dir;
  if (i < 0 || j < 0 || j >= arr.length) return;
  arr.splice(j, 0, arr.splice(i, 1)[0]); switchPanel("projects");
}

/* ---------------- Editor proyek ---------------- */
const projEditor = $("#projEditor");
const shotsEditor = $("#pf_shots");
function addShotRow(shot) {
  const row = $("#shotRowTpl").content.cloneNode(true).querySelector(".shot-row");
  const prev = row.querySelector(".img-prev"), file = row.querySelector(".s-file"), src = row.querySelector(".s-src"), cap = row.querySelector(".s-cap");
  if (shot) { src.value = shot.src || ""; cap.value = shot.cap || ""; if (shot.src) prev.innerHTML = `<img src="${esc(shot.src)}">`; }
  file.onchange = async () => { if (file.files[0]) { try { const url = await uploadFile(file.files[0]); src.value = url; prev.innerHTML = `<img src="${esc(url)}">`; } catch { toast("Gagal unggah", false); } } };
  src.oninput = () => (prev.innerHTML = src.value ? `<img src="${esc(src.value)}">` : "");
  row.querySelector(".row-del").onclick = () => row.remove();
  shotsEditor.appendChild(row);
}
function openProj(id) {
  const p = id ? state.projects[id] : null;
  $("#projEditorTitle").textContent = id ? "Edit Proyek" : "Tambah Proyek";
  $("#pf_id").value = id || "";
  $("#pf_name").value = p ? p.name || "" : "";
  $("#pf_cat").value = p ? p.cat || "web" : "web";
  $("#pf_tag").value = p ? p.tag || "" : "";
  $("#pf_year").value = p ? p.year || "" : "";
  $("#pf_role").value = p ? p.role || "" : "";
  $("#pf_cover").value = p ? p.cover || "" : "";
  $("#pf_coverPrev").innerHTML = p && p.cover ? `<img src="${esc(p.cover)}">` : "";
  $("#pf_summary").value = p ? p.summary || "" : "";
  $("#pf_tech").value = p && p.tech ? p.tech.join(", ") : "";
  $("#pf_desc").value = p && p.desc ? p.desc.join("\n") : "";
  $("#pf_features").value = p && p.features ? p.features.join("\n") : "";
  shotsEditor.innerHTML = "";
  (p && p.shots ? p.shots : []).forEach(addShotRow);
  projEditor.classList.add("open"); projEditor.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
}
function closeProj() { projEditor.classList.remove("open"); projEditor.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
$("#pf_coverFile").onchange = async (e) => { if (e.target.files[0]) { try { const url = await uploadFile(e.target.files[0]); $("#pf_cover").value = url; $("#pf_coverPrev").innerHTML = `<img src="${esc(url)}">`; } catch { toast("Gagal unggah", false); } } };
$("#pf_cover").oninput = (e) => ($("#pf_coverPrev").innerHTML = e.target.value ? `<img src="${esc(e.target.value)}">` : "");
$("#pf_addShot").onclick = () => addShotRow();
projEditor.addEventListener("click", (e) => { if (e.target.hasAttribute("data-pclose")) closeProj(); });
$("#projForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const lines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);
  const data = {
    name: $("#pf_name").value.trim(), cat: $("#pf_cat").value, tag: $("#pf_tag").value.trim(),
    year: $("#pf_year").value.trim(), role: $("#pf_role").value.trim(), cover: $("#pf_cover").value.trim(),
    summary: $("#pf_summary").value.trim(),
    tech: $("#pf_tech").value.split(",").map((s) => s.trim()).filter(Boolean),
    desc: lines($("#pf_desc").value), features: lines($("#pf_features").value),
    shots: $$(".shot-row", shotsEditor).map((r) => ({ src: r.querySelector(".s-src").value.trim(), cap: r.querySelector(".s-cap").value.trim() })).filter((s) => s.src),
    g: "linear-gradient(135deg,#22c55e,#0f8f4e)",
  };
  let id = $("#pf_id").value;
  if (!id) { id = "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); state.projectsOrder.push(id); }
  else data.g = state.projects[id].g || data.g;
  state.projects[id] = Object.assign({}, state.projects[id], data);
  closeProj(); switchPanel("projects"); toast("Proyek disimpan (klik Simpan untuk publikasi).");
});

boot();
