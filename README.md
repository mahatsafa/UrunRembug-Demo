# UrunRembug — Prototipe Demo

*Fair Funding for the Backbone of Indonesia* — Tim Inovasi Generasi (IG), SMK Telkom Malang,
Moklet Idea Challenge (MIC) 2026, bidang Kewirausahaan Sosial.

Prototipe yang bisa diklik untuk platform pembiayaan UMKM berbasis dana CSR & ZIS dengan model
**dana bergulir 0% bunga**. Ada tiga peran: **UMKM**, **Admin/Verifikator**, dan **Donor CSR**.

> ⚠️ **Semua data adalah simulasi.** Tidak ada uang sungguhan, login sungguhan, atau server.
> Nama UMKM dan donor fiktif. Badge "Prototipe — data simulasi" tampil di setiap halaman.

## Menjalankan

Butuh Node.js 20 atau lebih baru (cek dengan `node -v`).

```bash
npm install      # unduh semua library (sekali saja)
npm run dev      # jalankan di http://localhost:5173
npm test         # jalankan uji otomatis logika bisnis
npm run build    # build versi produksi ke folder dist/
```

## Alur demo (± 90 detik)

1. Buka `/` lalu pilih **Saya UMKM** → **Ajukan Pinjaman** (form sudah terisi data Bu Sari) → Kirim.
2. Menu **Edukasi** → selesaikan 3 modul kuis.
3. Kembali ke `/`, pilih **Saya Admin** → buka pengajuan bertanda **DEMO** → centang 4 checklist → **Setujui**.
4. Pilih **Saya UMKM** → **Kirim Laporan Penggunaan Termin 1** → menu **Cicilan** → **Bayar Cicilan**.
5. Pilih **Saya Donor CSR** → lihat angka, siklus dana, dan feed aktivitas berubah. Tekan **Unduh Laporan Dampak**.

**Momen "wow" untuk video:** buka `/admin` dan `/donor` di **dua jendela berdampingan**.
Saat tombol "Setujui" ditekan, dashboard donor langsung berubah tanpa refresh.

Sebelum merekam ulang, tekan **Reset data demo** di halaman awal.

## Cara kerja sinkron real-time

```
Jendela Admin                    localStorage (browser)              Jendela Donor
  klik "Setujui"  ──simpan──►   data terbaru disimpan   ──event "storage"──►  muat ulang data
                                                                               angka KPI beranimasi
```

Lihat `src/store/AppState.tsx`.

## Struktur folder

```
src/
  data/       seed.ts (data awal), modul.ts (materi edukasi), types.ts (bentuk data)
  store/      AppState.tsx (penyimpanan + sinkron), actions.ts (semua perubahan data)
  lib/        hitung.ts (rumus KPI), format.ts (format Rupiah & tanggal)
  components/ Layout, Timeline, KPI beranimasi, Siklus Dana, tombol & kartu
  pages/      Landing, umkm/*, admin/*, donor/*
test/         uji otomatis (Vitest)
docs/PRD.md   dokumen kebutuhan produk (acuan pengembangan)
```

## Angka penting (konsisten dengan proposal)

| Item | Nilai |
|---|---|
| Dana awal donor | Rp100.000.000 |
| Pinjaman umum | Rp2.000.000, tenor 10 bulan, cicilan Rp200.000, bunga 0% |
| Pencairan | 2 termin (50% + 50%), termin 2 setelah laporan penggunaan |
| Syarat pencairan | Checklist verifikasi lapangan lengkap **dan** lulus 3 modul training |

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di vercel.com → **Add New Project** → pilih repo → Framework: **Vite** → Deploy.
3. `vercel.json` sudah mengatur agar alamat seperti `/donor` tidak error 404.
