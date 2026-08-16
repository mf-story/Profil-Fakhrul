# Website Profil — Muhammad Fakhrul

Website profil pribadi statis (HTML/CSS/JS) dengan desain cerah & energik,
responsif, dan siap di-hosting di mana saja.

## Bagian
- Hero dengan animasi typewriter & count-up
- Tentang Saya
- Keahlian (skill bar animasi)
- Pengalaman (timeline)
- Portofolio (kartu proyek)
- Pendidikan
- Kontak (form + tautan sosial)

## Cara menjalankan
Buka `index.html` langsung di browser, **atau** jalankan server lokal:

```powershell
.\serve.ps1
```
Lalu buka http://localhost:5510

## Cara mengubah isi
Semua teks ada di [index.html](index.html). Yang perlu Anda sesuaikan:

| Bagian | Cari di index.html |
|--------|--------------------|
| Email | `fakhrul@example.com` (di 2 tempat: bagian Kontak & `app.js`) |
| WhatsApp | `wa.me/6280000000000` dan nomor tampilan |
| Lokasi | `Makassar, Indonesia` |
| Statistik | atribut `data-count` di bagian Hero |
| Sosial media | tautan `href="#"` di bagian `.socials` |
| Foto profil | ganti `<div class="avatar">MF</div>` dengan `<img>` |
| Warna tema | variabel `--brand-1/2/3` di [style.css](style.css) |

## Deploy
Cukup unggah folder ini ke GitHub Pages, Netlify, Vercel, atau hosting statis apa pun.
