// Data proyek terpusat — dipakai oleh index.html (slider/kartu) dan proyek.html (detail).
window.PROJECTS = {
  arsatwa: {
    name: "ARsatwa",
    cat: "web",
    tag: "Web / AR · Edukasi",
    cover: "assets/portfolio/arsatwa.svg",
    g: "linear-gradient(135deg,#22c55e,#134e2b)",
    year: "2024",
    role: "Perancang dan Pengembang",
    tech: ["HTML", "CSS", "JavaScript", "WebAR", "model-viewer", "3D (.glb)"],
    summary: "Media pembelajaran hewan berbasis Augmented Reality (WebAR) yang menampilkan model 3D, foto, narasi suara, dan kuis interaktif.",
    desc: [
      "ARsatwa adalah media pembelajaran interaktif berbasis WebAR. Siswa dapat melihat model 3D hewan, memutarnya, mendengar deskripsi suaranya, mengerjakan kuis, dan menampilkan hewan di dunia nyata melalui kamera HP (mode Augmented Reality).",
      "Terdapat 35 jenis hewan dari berbagai kelas (Mamalia, Unggas, Ikan, Reptil, Amfibi, Serangga), dengan 21 di antaranya dilengkapi model 3D + AR.",
    ],
    features: [
      "35 jenis hewan lintas kelas, 21 ber-model 3D + AR",
      "Mode AR markerless (Android: Scene Viewer, iOS: Quick Look)",
      "Putar, zoom, dan geser objek 3D",
      "Narasi suara hewan (Text-to-Speech Bahasa Indonesia)",
      "Kuis cepat interaktif dan pencarian hewan",
      "Tampilan responsif untuk HP dan komputer",
    ],
    shots: [
      { src: "assets/portfolio/shots/arsatwa/home.png", cap: "Halaman utama — detail hewan, foto dan tombol 3D/AR" },
      { src: "assets/portfolio/shots/arsatwa/kuis.png", cap: "Kuis cepat interaktif" },
    ],
  },
  edud: {
    name: "Edu-D",
    cat: "web",
    tag: "Web App · React dan Node",
    cover: "assets/portfolio/edud.svg",
    g: "linear-gradient(135deg,#059669,#0b3b2c)",
    year: "2024",
    role: "Full-stack Developer",
    tech: ["React", "Vite", "Node.js", "Express", "JSON Storage"],
    summary: "Aplikasi belajar mengajar dengan lima peran (admin, pengajar, pelajar, pimpinan, dan orang tua) beserta materi, tugas, kuis, kehadiran, dan rekap nilai.",
    desc: [
      "Edu-D adalah aplikasi belajar mengajar berbasis web. Admin mengelola pengguna, kelas, mata pelajaran, dan jadwal; pengajar membagikan materi, membuat tugas dan kuis, mencatat kehadiran, dan merekap nilai; pelajar mengakses materi, mengumpulkan tugas, dan mengerjakan kuis.",
      "Terdapat pula dasbor Pimpinan untuk memantau mutu belajar-mengajar (read-only) dan dasbor Orang Tua untuk memantau perkembangan anak. Setiap mata pelajaran memiliki forum diskusi, dan pengguna menerima notifikasi saat ada tugas, kuis, atau diskusi baru.",
    ],
    features: [
      "Lima peran: Admin, Pengajar, Pelajar, Pimpinan, Orang Tua",
      "Materi (teks, gambar, video, dokumen, tautan)",
      "Tugas dengan tenggat dan penanda terlambat",
      "Kuis pilihan ganda dengan batas waktu, dinilai otomatis",
      "Kehadiran, rekap nilai, statistik dan ekspor CSV",
      "Dasbor Pimpinan dan Orang Tua",
      "Forum diskusi dan notifikasi",
    ],
    shots: [
      { src: "assets/portfolio/shots/edud/admin.png", cap: "Dasbor Admin — statistik dan manajemen" },
      { src: "assets/portfolio/shots/edud/pengajar.png", cap: "Dasbor Pengajar" },
      { src: "assets/portfolio/shots/edud/pelajar.png", cap: "Dasbor Pelajar — progres belajar" },
      { src: "assets/portfolio/shots/edud/pimpinan.png", cap: "Dasbor Pimpinan — pemantauan mutu" },
      { src: "assets/portfolio/shots/edud/orangtua.png", cap: "Dasbor Orang Tua — laporan belajar anak" },
      { src: "assets/portfolio/shots/edud/login.png", cap: "Halaman masuk" },
    ],
  },
  agenda: {
    name: "Agenda Pimpinan",
    cat: "web",
    tag: "Web App + APK Android",
    cover: "assets/portfolio/agenda.svg",
    g: "linear-gradient(135deg,#16a34a,#0b3b2c)",
    year: "2025",
    role: "Full-stack dan Android (Capacitor)",
    tech: ["PWA", "Node.js", "Capacitor", "Android (APK)"],
    summary: "Aplikasi multi-pengguna (PWA + Android) untuk mengelola jadwal, agenda, dan notulen rapat pimpinan dengan data terpusat.",
    desc: [
      "Agenda Pimpinan adalah aplikasi web (PWA) multi-pengguna yang juga dipaketkan menjadi aplikasi Android (APK). Data rapat disimpan di server sehingga semua pengguna melihat data yang sama.",
      "Terdapat tiga peran: Admin (kelola pengguna dan semua rapat), Pimpinan (buat/ubah rapat dan notulen), dan Staf (lihat dan cetak, read-only).",
    ],
    features: [
      "Multi-peran: Admin, Pimpinan, Staf",
      "Jadwal, agenda, notulen dan keputusan rapat",
      "Data terpusat di server",
      "PWA — bisa dipasang di HP",
      "Tersedia versi APK Android",
      "Cetak jadwal dan notulen",
    ],
    shots: [
      { src: "assets/portfolio/shots/agenda/login.png", cap: "Dashboard ringkasan agenda" },
      { src: "assets/portfolio/shots/agenda/kalender.png", cap: "Tampilan kalender kegiatan" },
    ],
  },
  myactivity: {
    name: "MyActivity",
    cat: "web",
    tag: "Web App + APK Android",
    cover: "assets/portfolio/myactivity.svg",
    g: "linear-gradient(135deg,#10b981,#123524)",
    year: "2025",
    role: "Pengembang (PWA + Android)",
    tech: ["PWA", "IndexedDB", "Capacitor", "Android (APK)"],
    summary: "Aplikasi pencatat kegiatan dan keuangan harian (PWA + Android) dengan kalender, agenda, rekap arus kas, dan sistem kode aktivasi per perangkat.",
    desc: [
      "MyActivity adalah aplikasi pencatat kegiatan yang tersedia sebagai PWA maupun aplikasi Android (APK). Pengguna dapat mencatat kegiatan pada kalender, melihat agenda per tanggal, serta memantau rekap arus kas (pemasukan/pengeluaran).",
      "Aplikasi dilengkapi sistem aktivasi berbasis kode — satu kode berlaku untuk satu perangkat.",
    ],
    features: [
      "Kalender dan agenda kegiatan harian",
      "Pencatatan pemasukan dan pengeluaran",
      "Rekap arus kas + ekspor PDF dan CSV",
      "Pencarian kegiatan",
      "Sistem kode aktivasi per perangkat",
      "PWA + versi APK Android",
    ],
    shots: [
      { src: "assets/portfolio/shots/myactivity/agenda.png", cap: "Agenda — daftar kegiatan per tanggal" },
      { src: "assets/portfolio/shots/myactivity/kalender.png", cap: "Kalender bulanan" },
      { src: "assets/portfolio/shots/myactivity/rekap.png", cap: "Rekap arus kas dan rincian kegiatan" },
    ],
  },
  leadi: {
    name: "LeaDi-PDS",
    cat: "web",
    tag: "Web App · Lesson Study",
    cover: "assets/portfolio/leadi.svg",
    g: "linear-gradient(135deg,#15803d,#0b3b2c)",
    year: "2025",
    role: "Perancang dan Pengembang",
    tech: ["PWA", "Node.js (modul bawaan)", "JSON Storage"],
    summary: "Lesson Study Digital Platform berbasis Plan–Do–See untuk memperkuat praktik pembelajaran berbasis bukti di SMP.",
    desc: [
      "LeaDi-PDS (Lesson Study Digital Platform berbasis Plan-Do-See) adalah aplikasi web multi-pengguna yang mengintegrasikan seluruh siklus Lesson Study (Plan → Do → See) beserta Repositori Praktik Baik untuk replikasi dan diseminasi antar sekolah.",
      "Peran meliputi Guru SMP, Dosen Pendamping, Observer, dan Admin Sistem.",
    ],
    features: [
      "Siklus lengkap Plan → Do → See",
      "Repositori Praktik Baik antar sekolah",
      "Multi-peran: Guru, Dosen Pendamping, Observer, Admin",
      "Observasi dan refleksi pembelajaran",
      "PWA — bisa dipasang dan mendukung offline aset",
      "Arsitektur modular (Frontend · Backend · Database)",
    ],
    shots: [
      { src: "assets/portfolio/shots/leadi/dashboard.png", cap: "Dashboard guru dan daftar siklus Lesson Study" },
      { src: "assets/portfolio/shots/leadi/login.png", cap: "Halaman masuk multi-peran" },
    ],
  },
  sindrom: {
    name: "Prediksi Risiko Sindrom Metabolik",
    cat: "web",
    tag: "Web App · AI + APK Android",
    cover: "assets/portfolio/sindrom.png",
    g: "linear-gradient(135deg,#10b981,#0a3d2c)",
    year: "2025",
    role: "Perancang, Developer, ML dan Android",
    tech: ["JavaScript", "Machine Learning", "Python (pipeline)", "PWA", "Capacitor", "Android (APK)"],
    summary: "Aplikasi skrining dan prediksi risiko sindrom metabolik berbasis kriteria IDF dan model machine learning — tersedia sebagai web (PWA) sekaligus aplikasi Android (APK).",
    desc: [
      "Aplikasi untuk skrining dan prediksi risiko Sindrom Metabolik pada berbagai kategori umur. Terdiri dari skrining berbasis aturan (kriteria IDF), model prediksi AI (Logistic Regression) yang memberi probabilitas risiko, dan serious game 'Metabolic Heroes'.",
      "Model machine learning dilatih lewat pipeline Python lalu diekspor ke browser. Aplikasi tersedia dalam versi web (PWA) maupun versi mobile berupa APK Android (Capacitor) yang dapat dipasang langsung di HP.",
    ],
    features: [
      "Skrining berbasis kriteria IDF (menyesuaikan usia)",
      "Prediksi risiko AI (probabilitas 0–100%)",
      "Serious game edukasi 'Metabolic Heroes'",
      "Beberapa game tambahan (Healthy Choices, Healthy Runner 3D)",
      "Tersedia versi web (PWA) dan APK Android",
      "Bekerja offline",
    ],
    shots: [
      { src: "assets/portfolio/shots/sindrom/form.png", cap: "Formulir data pemeriksaan dan skrining" },
      { src: "assets/portfolio/shots/sindrom/skrining.png", cap: "Menu utama aplikasi" },
      { src: "assets/portfolio/shots/sindrom/home.png", cap: "Panduan pencegahan sindrom metabolik" },
    ],
  },
  manuskrip: {
    name: "Manuskrip — Portal Berita",
    cat: "web",
    tag: "Web App · Portal Berita",
    cover: "assets/portfolio/manuskrip.svg",
    g: "linear-gradient(135deg,#0f8f4e,#123524)",
    year: "2026",
    role: "Full-stack Developer",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "PWA"],
    summary: "Portal berita dengan tampilan bergaya editorial/koran, dilengkapi panel redaksi (admin) untuk mengelola dan menerbitkan berita.",
    desc: [
      "Manuskrip adalah portal berita yang menyajikan kabar terbaru dari berbagai kategori (nasional, internasional, ekonomi, teknologi, olahraga, hiburan, pendidikan, kesehatan, dan lainnya) dengan tampilan editorial khas koran.",
      "Dilengkapi Panel Redaksi (admin) untuk menulis, menyunting, dan menerbitkan berita, serta mode terang/gelap dan akses dari HP.",
    ],
    features: [
      "Portal berita multi-kategori",
      "Panel Redaksi (admin) untuk kelola berita",
      "Tampilan editorial/koran yang rapi",
      "Mode terang dan gelap",
      "Responsif dan bisa diakses dari HP",
    ],
    shots: [
      { src: "assets/portfolio/shots/manuskrip/home.png", cap: "Halaman utama portal berita" },
      { src: "assets/portfolio/shots/manuskrip/berita.png", cap: "Daftar berita terbaru dan terpopuler" },
    ],
  },
  mujtahidah: {
    name: "Profil Mujtahidah, S.KM., M.Kes",
    cat: "web",
    tag: "Website Profil",
    cover: "assets/portfolio/mujtahidah.jpg",
    g: "linear-gradient(135deg,#0f8f4e,#123524)",
    year: "2026",
    role: "Perancang dan Pengembang",
    tech: ["HTML", "CSS", "JavaScript", "Node.js"],
    summary: "Website profil akademik dosen Administrasi Kesehatan dengan admin konten (CMS ringan).",
    desc: [
      "Website profil akademik Mujtahidah, S.KM., M.Kes — dosen Administrasi Kesehatan, Fakultas Ilmu Keolahragaan dan Kesehatan, Universitas Negeri Makassar.",
      "Dilengkapi panel admin untuk mengubah konten profil (bio, pengalaman, pendidikan, portofolio, kontak) tanpa menyentuh kode.",
    ],
    features: [
      "Profil akademik lengkap",
      "Panel admin untuk kelola konten",
      "Bagian bidang keahlian dan publikasi",
      "Desain responsif dan elegan",
    ],
    shots: [
      { src: "assets/portfolio/shots/mujtahidah/home.png", cap: "Halaman utama profil" },
      { src: "assets/portfolio/shots/mujtahidah/konten.png", cap: "Bagian pengalaman dan keahlian" },
    ],
  },
  andisukri: {
    name: "Profil Prof. Andi Sukri Syamsuri",
    cat: "web",
    tag: "Website Profil Akademik",
    cover: "assets/portfolio/andisukri.jpg",
    g: "linear-gradient(135deg,#166534,#0b3b2c)",
    year: "2026",
    role: "Perancang dan Pengembang",
    tech: ["HTML", "CSS", "JavaScript", "Node.js"],
    summary: "Website profil akademik Prof. Dr. H. Andi Sukri Syamsuri, S.Pd., M.Hum. — Guru Besar Ilmu Linguistik, lengkap dengan rekam jejak, karya, dan rubrik tulisan.",
    desc: [
      "Website profil akademik Prof. Dr. H. Andi Sukri Syamsuri, S.Pd., M.Hum., Guru Besar Ilmu Linguistik. Menampilkan biografi, perjalanan karier, pendidikan, karya ilmiah, serta statistik publikasi (publikasi, sitasi, dan h-index).",
      "Dilengkapi rubrik 'Tulisan' untuk pandangan, opini, dan gagasan, serta panel admin untuk mengelola konten.",
    ],
    features: [
      "Biografi dan perjalanan karier",
      "Karya ilmiah dan statistik publikasi (sitasi, h-index)",
      "Rubrik tulisan/opini",
      "Panel admin untuk kelola konten",
      "Desain elegan dan responsif",
    ],
    shots: [
      { src: "assets/portfolio/shots/andisukri/home.png", cap: "Halaman utama profil" },
      { src: "assets/portfolio/shots/andisukri/konten.png", cap: "Bagian perjalanan dan karya" },
    ],
  },
};

// Urutan tampil di slider/kartu.
window.PROJECTS_ORDER = ["arsatwa", "edud", "agenda", "myactivity", "leadi", "sindrom", "manuskrip", "mujtahidah", "andisukri"];

/* ================= Sistem data dan edit (tersimpan di browser) =================
 * Perubahan (edit, tambah, hapus, urutan) disimpan di localStorage lalu
 * diterapkan di atas data bawaan — tampil di semua halaman. Gunakan
 * "Unduh projects.js" untuk menyimpannya permanen ke file.
 */
window.PF_STORE_KEY = "pf_project_overrides_v1"; // {id: patch/full}
window.PF_ORDER_KEY = "pf_project_order_v1";      // [id,...]
window.PF_DEL_KEY = "pf_project_deleted_v1";      // [id,...]

(function applyStored() {
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } };
  const ov = read(window.PF_STORE_KEY, "{}");
  Object.keys(ov).forEach((id) => {
    if (!window.PROJECTS[id]) {
      window.PROJECTS[id] = {};
      if (!window.PROJECTS_ORDER.includes(id)) window.PROJECTS_ORDER.push(id);
    }
    Object.assign(window.PROJECTS[id], ov[id]);
  });
  read(window.PF_DEL_KEY, "[]").forEach((id) => {
    delete window.PROJECTS[id];
    const i = window.PROJECTS_ORDER.indexOf(id);
    if (i >= 0) window.PROJECTS_ORDER.splice(i, 1);
  });
  const ord = read(window.PF_ORDER_KEY, "null");
  if (Array.isArray(ord)) {
    const valid = ord.filter((id) => window.PROJECTS[id]);
    const rest = window.PROJECTS_ORDER.filter((id) => !valid.includes(id));
    window.PROJECTS_ORDER = valid.concat(rest);
  }
})();

window.PF = {
  _read(k, d) { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } },
  getOverrides() { return this._read(window.PF_STORE_KEY, "{}"); },
  saveOrder() { localStorage.setItem(window.PF_ORDER_KEY, JSON.stringify(window.PROJECTS_ORDER)); },

  // Simpan/ubah data satu proyek (patch berisi field yang diubah).
  save(id, patch) {
    const ov = this.getOverrides();
    ov[id] = Object.assign({}, ov[id], patch);
    localStorage.setItem(window.PF_STORE_KEY, JSON.stringify(ov));
    if (!window.PROJECTS[id]) window.PROJECTS[id] = {};
    Object.assign(window.PROJECTS[id], patch);
  },

  // Tambah proyek baru; mengembalikan id-nya.
  addProject(entry) {
    const id = "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const full = Object.assign(
      { cat: "web", g: "linear-gradient(135deg,#22c55e,#0f8f4e)", cover: "", tag: "", name: "", year: "", role: "", summary: "", tech: [], desc: [], features: [], shots: [] },
      entry
    );
    if (!window.PROJECTS[id]) window.PROJECTS[id] = {};
    if (!window.PROJECTS_ORDER.includes(id)) window.PROJECTS_ORDER.push(id);
    this.save(id, full);
    // Batalkan penghapusan bila id pernah dihapus (tak mungkin untuk id baru, tapi aman).
    const del = this._read(window.PF_DEL_KEY, "[]").filter((x) => x !== id);
    localStorage.setItem(window.PF_DEL_KEY, JSON.stringify(del));
    this.saveOrder();
    return id;
  },

  // Hapus proyek (baik bawaan maupun tambahan).
  deleteProject(id) {
    const del = this._read(window.PF_DEL_KEY, "[]");
    if (!del.includes(id)) del.push(id);
    localStorage.setItem(window.PF_DEL_KEY, JSON.stringify(del));
    const ov = this.getOverrides();
    delete ov[id];
    localStorage.setItem(window.PF_STORE_KEY, JSON.stringify(ov));
    delete window.PROJECTS[id];
    const i = window.PROJECTS_ORDER.indexOf(id);
    if (i >= 0) window.PROJECTS_ORDER.splice(i, 1);
    this.saveOrder();
  },

  // Kembalikan satu proyek bawaan ke aslinya (hapus override-nya).
  reset(id) {
    const ov = this.getOverrides();
    delete ov[id];
    localStorage.setItem(window.PF_STORE_KEY, JSON.stringify(ov));
  },

  // Hapus semua perubahan yang tersimpan di browser ini.
  resetAll() {
    localStorage.removeItem(window.PF_STORE_KEY);
    localStorage.removeItem(window.PF_ORDER_KEY);
    localStorage.removeItem(window.PF_DEL_KEY);
  },

  // Unduh projects.js lengkap (data terbaru + sistem edit) untuk simpan permanen.
  download() {
    const data =
      "// Data proyek terpusat — dipakai oleh index.html (slider/kartu) dan proyek.html (detail).\n" +
      "window.PROJECTS = " + JSON.stringify(window.PROJECTS, null, 2) + ";\n\n" +
      "window.PROJECTS_ORDER = " + JSON.stringify(window.PROJECTS_ORDER) + ";\n";
    const blob = new Blob([data + "\n" + window.PF._loaderSource], { type: "application/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "projects.js";
    a.click();
    URL.revokeObjectURL(a.href);
  },
};

// Sumber blok sistem edit agar ikut saat file diunduh (menjaga fungsi CMS).
window.PF._loaderSource = [
  '/* ===== Sistem data dan edit (jangan hapus) ===== */',
  'window.PF_STORE_KEY="pf_project_overrides_v1";window.PF_ORDER_KEY="pf_project_order_v1";window.PF_DEL_KEY="pf_project_deleted_v1";',
  '(function(){const r=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}};const ov=r(PF_STORE_KEY,"{}");Object.keys(ov).forEach(id=>{if(!PROJECTS[id]){PROJECTS[id]={};if(!PROJECTS_ORDER.includes(id))PROJECTS_ORDER.push(id)}Object.assign(PROJECTS[id],ov[id])});r(PF_DEL_KEY,"[]").forEach(id=>{delete PROJECTS[id];const i=PROJECTS_ORDER.indexOf(id);if(i>=0)PROJECTS_ORDER.splice(i,1)});const o=r(PF_ORDER_KEY,"null");if(Array.isArray(o)){const v=o.filter(id=>PROJECTS[id]);PROJECTS_ORDER=v.concat(PROJECTS_ORDER.filter(id=>!v.includes(id)))}})();',
  'window.PF={_read(k,d){try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}},getOverrides(){return this._read(PF_STORE_KEY,"{}")},saveOrder(){localStorage.setItem(PF_ORDER_KEY,JSON.stringify(PROJECTS_ORDER))},save(id,p){const o=this.getOverrides();o[id]=Object.assign({},o[id],p);localStorage.setItem(PF_STORE_KEY,JSON.stringify(o));if(!PROJECTS[id])PROJECTS[id]={};Object.assign(PROJECTS[id],p)},addProject(e){const id="p_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);const f=Object.assign({cat:"web",g:"linear-gradient(135deg,#22c55e,#0f8f4e)",cover:"",tag:"",name:"",year:"",role:"",summary:"",tech:[],desc:[],features:[],shots:[]},e);if(!PROJECTS_ORDER.includes(id))PROJECTS_ORDER.push(id);this.save(id,f);this.saveOrder();return id},deleteProject(id){const d=this._read(PF_DEL_KEY,"[]");if(!d.includes(id))d.push(id);localStorage.setItem(PF_DEL_KEY,JSON.stringify(d));const o=this.getOverrides();delete o[id];localStorage.setItem(PF_STORE_KEY,JSON.stringify(o));delete PROJECTS[id];const i=PROJECTS_ORDER.indexOf(id);if(i>=0)PROJECTS_ORDER.splice(i,1);this.saveOrder()},reset(id){const o=this.getOverrides();delete o[id];localStorage.setItem(PF_STORE_KEY,JSON.stringify(o))},resetAll(){localStorage.removeItem(PF_STORE_KEY);localStorage.removeItem(PF_ORDER_KEY);localStorage.removeItem(PF_DEL_KEY)},download(){location.reload()}};',
].join("\n");
