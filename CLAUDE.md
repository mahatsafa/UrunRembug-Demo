# Panduan untuk Claude Code

Proyek ini adalah prototipe demo UrunRembug untuk lomba MIC 2026. Acuan utama: `docs/PRD.md`.

## Aturan
- Pemilik proyek adalah pelajar SMK yang sedang belajar. Jelaskan setiap perubahan dengan bahasa Indonesia sederhana, dan istilah teknis dijelaskan saat pertama muncul.
- Utamakan kode yang mudah dibaca daripada yang pendek. Beri komentar singkat berbahasa Indonesia di bagian penting.
- Semua data adalah simulasi. Jangan memakai nama perusahaan, bank, atau lembaga nyata sebagai donor/mitra. Badge "Prototipe — data simulasi" harus tetap ada.
- Angka di `src/data/seed.ts` harus konsisten dengan proposal (dana Rp100 jt, pinjaman Rp2 jt, tenor 10 bulan, 0% bunga).
- Logika perubahan data ditulis sebagai pure function di `src/store/actions.ts`, lalu dipanggil lewat `ubah()` dari `useApp()`. Rumus KPI ada di `src/lib/hitung.ts`.
- Tanpa backend: state disimpan di localStorage dan disinkronkan antar tab lewat event `storage`.

## Sebelum selesai
- `npm test` dan `npm run build` harus lolos tanpa error.
- Kerjakan perubahan dalam langkah kecil, satu fitur per commit.
