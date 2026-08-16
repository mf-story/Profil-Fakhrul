// Server profil Muhammad Fakhrul — Node.js tanpa dependensi eksternal.
// Menyajikan situs statis + API konten (baca publik, tulis untuk admin) + login + unggah gambar.
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const vm = require("vm");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
const SECRET_FILE = path.join(DATA_DIR, "secret");
const PORT = process.env.PORT || 5510;

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ---------------- Secret & auth ---------------- */
function getSecret() {
  if (fs.existsSync(SECRET_FILE)) return fs.readFileSync(SECRET_FILE, "utf8");
  const s = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(SECRET_FILE, s);
  return s;
}
const SECRET = getSecret();

function hashPw(pw, salt) { return crypto.scryptSync(String(pw), salt, 32).toString("hex"); }
function loadAuth() {
  if (fs.existsSync(AUTH_FILE)) return JSON.parse(fs.readFileSync(AUTH_FILE, "utf8"));
  const salt = crypto.randomBytes(16).toString("hex");
  const auth = { salt, hash: hashPw("admin123", salt) };
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth));
  return auth;
}
function verifyPw(pw) {
  const a = loadAuth();
  const A = Buffer.from(a.hash, "hex");
  const B = Buffer.from(hashPw(pw, a.salt), "hex");
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
function setPw(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ salt, hash: hashPw(pw, salt) }));
}
function makeToken() { return crypto.createHmac("sha256", SECRET).update("admin-v1").digest("hex"); }
function checkToken(t) {
  try {
    const A = Buffer.from(t || "", "hex"), B = Buffer.from(makeToken(), "hex");
    return A.length === B.length && crypto.timingSafeEqual(A, B);
  } catch (e) { return false; }
}
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function isAuthed(req) { const c = parseCookies(req)["pf_session"]; return !!c && checkToken(c); }

/* ---------------- Konten ---------------- */
function loadProjectDefaults() {
  try {
    const code = fs.readFileSync(path.join(ROOT, "projects.js"), "utf8");
    const sandbox = {
      window: {},
      localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
      document: { currentScript: null, createElement() { return { click() {}, setAttribute() {} }; } },
      location: { reload() {} },
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { timeout: 3000 });
    return { projects: sandbox.window.PROJECTS || {}, order: sandbox.window.PROJECTS_ORDER || [] };
  } catch (e) {
    console.error("Gagal memuat default proyek:", e.message);
    return { projects: {}, order: [] };
  }
}
function defaultContent() {
  const site = JSON.parse(fs.readFileSync(path.join(ROOT, "site.default.json"), "utf8"));
  const pd = loadProjectDefaults();
  return { site, projects: pd.projects, projectsOrder: pd.order };
}
function loadContent() {
  if (fs.existsSync(CONTENT_FILE)) return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
  const c = defaultContent();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(c, null, 2));
  return c;
}
function saveContent(c) { fs.writeFileSync(CONTENT_FILE, JSON.stringify(c, null, 2)); }

/* ---------------- HTTP util ---------------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".m4v": "video/x-m4v",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json",
};
function sendJson(res, code, obj, extraHeaders) {
  const body = JSON.stringify(obj);
  res.writeHead(code, Object.assign({ "Content-Type": "application/json; charset=utf-8" }, extraHeaders || {}));
  res.end(body);
}
function readBody(req, limit = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let data = "", size = 0;
    req.on("data", (c) => { size += c.length; if (size > limit) { reject(new Error("terlalu besar")); req.destroy(); } else data += c; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

/* ---------------- Server ---------------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const p = decodeURIComponent(url.pathname);

  // ---- API ----
  if (p.startsWith("/api/")) {
    try {
      if (p === "/api/content" && req.method === "GET") {
        return sendJson(res, 200, loadContent());
      }
      if (p === "/api/me" && req.method === "GET") {
        return sendJson(res, 200, { authed: isAuthed(req) });
      }
      if (p === "/api/login" && req.method === "POST") {
        const body = JSON.parse((await readBody(req)) || "{}");
        if (verifyPw(body.password)) {
          const cookie = `pf_session=${makeToken()}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`;
          return sendJson(res, 200, { ok: true }, { "Set-Cookie": cookie });
        }
        return sendJson(res, 401, { ok: false, error: "Password salah" });
      }
      if (p === "/api/logout" && req.method === "POST") {
        return sendJson(res, 200, { ok: true }, { "Set-Cookie": "pf_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax" });
      }
      // Endpoint di bawah wajib login
      if (!isAuthed(req)) return sendJson(res, 401, { error: "Belum login" });

      if (p === "/api/content" && req.method === "POST") {
        const body = JSON.parse(await readBody(req));
        if (!body || !body.site || !body.projects) return sendJson(res, 400, { error: "Data tidak lengkap" });
        saveContent(body);
        return sendJson(res, 200, { ok: true });
      }
      if (p === "/api/upload" && req.method === "POST") {
        const body = JSON.parse(await readBody(req, 64 * 1024 * 1024));
        const m = /^data:((?:image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(body.dataUrl || "");
        if (!m) return sendJson(res, 400, { error: "Berkas tidak valid" });
        const ext = ({ "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif", "image/svg+xml": ".svg", "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov", "video/x-m4v": ".m4v" })[m[1]] || ".bin";
        const name = crypto.randomBytes(8).toString("hex") + ext;
        fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(m[2], "base64"));
        return sendJson(res, 200, { url: "/uploads/" + name });
      }
      if (p === "/api/change-password" && req.method === "POST") {
        const body = JSON.parse(await readBody(req));
        if (!body.password || String(body.password).length < 6) return sendJson(res, 400, { error: "Minimal 6 karakter" });
        setPw(body.password);
        return sendJson(res, 200, { ok: true });
      }
      if (p === "/api/reset" && req.method === "POST") {
        saveContent(defaultContent());
        return sendJson(res, 200, { ok: true });
      }
      return sendJson(res, 404, { error: "Tidak ditemukan" });
    } catch (e) {
      return sendJson(res, 500, { error: e.message });
    }
  }

  // ---- Berkas statis ----
  let rel = p === "/" ? "index.html" : p.replace(/^\/+/, "");
  const isUpload = rel.startsWith("uploads/");
  const baseDir = isUpload ? ROOT : ROOT;
  const filePath = path.normalize(path.join(baseDir, rel));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  // Jangan sajikan data rahasia
  if (filePath.startsWith(DATA_DIR)) { res.writeHead(404); return res.end("Not found"); }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end("404 Not Found"); }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const cache = isUpload ? "public, max-age=31536000, immutable" : "public, max-age=3600";
    const etag = '"' + st.size.toString(16) + "-" + Math.round(st.mtimeMs).toString(16) + '"';
    if (req.headers["if-none-match"] === etag) { res.writeHead(304, { ETag: etag, "Cache-Control": cache }); return res.end(); }

    // Dukungan HTTP Range (wajib agar <video>/<audio> bisa diputar & di-seek)
    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
      if (m && (m[1] !== "" || m[2] !== "")) {
        let start, end;
        if (m[1] === "") { // bytes=-N (N byte terakhir)
          const n = parseInt(m[2], 10);
          start = Math.max(0, st.size - n); end = st.size - 1;
        } else {
          start = parseInt(m[1], 10);
          end = m[2] === "" ? st.size - 1 : Math.min(parseInt(m[2], 10), st.size - 1);
        }
        if (isNaN(start) || isNaN(end) || start > end || start >= st.size) {
          res.writeHead(416, { "Content-Range": `bytes */${st.size}`, "Accept-Ranges": "bytes" });
          return res.end();
        }
        res.writeHead(206, {
          "Content-Type": type,
          "Content-Range": `bytes ${start}-${end}/${st.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": end - start + 1,
          "Cache-Control": cache,
          "ETag": etag,
        });
        return fs.createReadStream(filePath, { start, end }).pipe(res);
      }
    }

    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": st.size,
      "Accept-Ranges": "bytes",
      "Cache-Control": cache,
      "ETag": etag,
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  loadContent(); // pastikan content.json ada
  console.log("=".repeat(50));
  console.log("  Server Profil Muhammad Fakhrul berjalan");
  console.log("  Situs : http://localhost:" + PORT);
  console.log("  Admin : http://localhost:" + PORT + "/admin.html");
  console.log("  Password admin awal: admin123 (ganti di panel admin)");
  console.log("=".repeat(50));
});
