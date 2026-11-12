# PRD — UrunRembug Demo Prototype (MIC 2026)

> **PRD (Product Requirements Document)** = dokumen yang menjelaskan *apa* yang harus dibangun dan *kenapa*, bukan *bagaimana* kodenya ditulis. Dokumen ini dipakai sebagai konteks untuk Claude Code.

---

## 1. Konteks

UrunRembug adalah platform digital pembiayaan UMKM berbasis dana CSR dan ZIS (Zakat, Infaq, Sedekah) dengan model **dana bergulir**: dana dipinjamkan ke UMKM tanpa bunga (0%), dikembalikan lewat cicilan, lalu dipinjamkan lagi ke UMKM berikutnya. Donor bisa memantau ke mana dananya pergi dan apa dampaknya secara real-time.

Tagline: **"Fair Funding for the Backbone of Indonesia"**
Tim: Inovasi Generasi (IG), SMK Telkom Malang — Bima Gusto Mahatsafa, Iqbal Ilmi.
Kompetisi: Moklet Idea Challenge (MIC) 2026, bidang Kewirausahaan Sosial.

## 2. Tujuan Demo

1. Bisa direkam untuk **video vertikal 9:16 (1080×1920), maksimal 2 menit**, dengan alur: masalah → solusi → demo → manfaat.
2. Bisa didemokan langsung saat pitching di HP atau laptop.
3. Menunjukkan **satu momen "wow"**: saat admin menyetujui pinjaman atau UMKM membayar cicilan, **dashboard donor langsung berubah**. Inilah bukti nilai jual utama, yaitu transparansi real-time.

## 3. Non-Goals (TIDAK dibangun)

- Tidak ada uang sungguhan, payment gateway, atau integrasi bank.
- Tidak ada login atau autentikasi sungguhan (cukup pilih peran).
- Tidak ada backend atau database server. Semua data berupa **dummy (data simulasi)** di browser.
- Tidak ada penghimpunan zakat (secara hukum dana ZIS disalurkan lewat BAZNAS/LAZ mitra).
- Tidak perlu SEO, multi-bahasa, atau optimasi produksi.

## 4. Prinsip Kejujuran Demo

- Di setiap halaman tampilkan badge kecil **"Prototipe — data simulasi"**.
- Semua nama UMKM, donor, dan angka adalah fiktif. **Jangan memakai nama perusahaan, bank, atau lembaga nyata** sebagai donor atau mitra.
- Angka harus konsisten dengan proposal (lihat bagian 8).

## 5. Pengguna & Peran

| Peran | Siapa | Tujuan di demo |
|---|---|---|
| **UMKM** | Pelaku usaha mikro (contoh: penjual keripik tempe) | Mengajukan pinjaman, melihat status, belajar, membayar cicilan |
| **Admin / Verifikator** | Tim UrunRembug | Memverifikasi pengajuan dan menyetujui pencairan |
| **Donor CSR** | Perusahaan pemberi dana | Memantau dana, UMKM penerima, dan dampak |

Halaman awal menampilkan **pemilih peran** (3 kartu besar). Peran bisa diganti kapan saja lewat menu.

## 6. Fitur & Layar

### 6.1 Landing / Pilih Peran
- Logo UrunRembug, tagline, penjelasan satu kalimat.
- Tiga kartu peran: "Saya UMKM", "Saya Admin", "Saya Donor".
- Tombol kecil **"Reset data demo"** untuk mengembalikan data awal sebelum merekam ulang.

### 6.2 UMKM
1. **Beranda UMKM**: status pinjaman aktif, sisa cicilan, progres training, dan tombol "Ajukan Pinjaman".
2. **Form Pengajuan** (3 langkah, stepper):
   - Data usaha: nama usaha, jenis usaha, alamat (kecamatan di Malang), omzet per bulan.
   - Kebutuhan dana: nominal (Rp500.000–Rp5.000.000), tujuan penggunaan, tenor (5/10 bulan).
   - Ringkasan + simulasi cicilan otomatis (nominal ÷ tenor, **tanpa bunga**), lalu submit.
3. **Timeline Status**: Diajukan → Verifikasi Lapangan → Training → Pencairan Termin 1 → Pencairan Termin 2 → Lunas. Langkah aktif disorot.
4. **Edukasi**: 3 modul singkat (Pisahkan Uang Usaha & Pribadi, Mencatat Kas Harian, Menghitung Untung). Setiap modul berisi kartu teks dan kuis 3 soal. Lulus semua modul = training selesai.
5. **Cicilan**: jadwal cicilan dan tombol **"Bayar Cicilan (simulasi)"**. Setelah bayar, muncul toast "Cicilanmu kembali ke dana bergulir dan akan membantu UMKM berikutnya 💚".
6. **Catat Keuangan** (sederhana): input pemasukan/pengeluaran harian dan grafik mingguan.

### 6.3 Admin / Verifikator
1. **Antrean Pengajuan**: daftar kartu dengan status (Baru, Diverifikasi, Disetujui, Ditolak).
2. **Detail Pengajuan**: data usaha, checklist verifikasi lapangan (lokasi sesuai, usaha berjalan, dokumen lengkap, foto usaha), catatan verifikator.
3. Tombol **Setujui & Cairkan Termin 1** (aktif hanya jika checklist lengkap **dan** training UMKM selesai) serta tombol **Tolak**.
4. Ringkasan: jumlah pengajuan, tingkat persetujuan, dan kas bergulir tersedia.

### 6.4 Donor CSR (layar terpenting)
1. **Kartu KPI** di atas:
   - Total dana disalurkan
   - Kas bergulir tersedia
   - Jumlah UMKM aktif
   - Tingkat pengembalian (%)
   - Putaran dana ke-berapa
2. **Visual Dana Bergulir**: diagram lingkaran/arus Dana Masuk → Disalurkan → Dikembalikan → Disalurkan Lagi, berisi angka.
3. **Daftar UMKM Penerima**: nama, jenis usaha, kecamatan, nominal, status cicilan (lancar/terlambat), dan kenaikan omzet.
4. **Grafik dampak**: omzet rata-rata sebelum vs sesudah, dan pengembalian per bulan.
5. **Feed aktivitas real-time**: "Keripik Tempe Bu Sari membayar cicilan ke-3 — Rp200.000", "Pinjaman Warung Pak Darto disetujui".
6. Tombol **"Unduh Laporan Dampak"** yang membuka halaman ramah cetak (`window.print()`) berisi ringkasan KPI dan daftar UMKM.

### 6.5 Sinkronisasi Real-Time (momen "wow")
- State disimpan di `localStorage`.
- Gunakan event `storage` di browser agar **tab Donor yang terbuka di jendela lain ikut berubah otomatis** saat tab Admin atau UMKM mengubah data.
- Perubahan angka di kartu KPI diberi animasi (count-up atau highlight singkat), supaya terlihat jelas di video.

## 7. Model Data (TypeScript-like)

```ts
type Umkm = {
  id: string; nama: string; pemilik: string; jenis: string;
  kecamatan: string; omzetSebelum: number; omzetSekarang: number;
  trainingSelesai: boolean; modulSelesai: string[];
};
type Pinjaman = {
  id: string; umkmId: string; nominal: number; tenor: 5 | 10;
  tujuan: string;
  status: "diajukan" | "verifikasi" | "training" | "termin1" | "termin2" | "lunas" | "ditolak";
  checklist: { lokasi: boolean; usahaBerjalan: boolean; dokumen: boolean; foto: boolean };
  cicilanDibayar: number; // jumlah kali bayar
  tanggalAjuan: string;
};
type Donor = { id: string; nama: string; danaMasuk: number };
type Aktivitas = { id: string; waktu: string; teks: string; tipe: "bayar" | "setuju" | "ajuan" | "lulus" };
type AppState = { umkm: Umkm[]; pinjaman: Pinjaman[]; donor: Donor[]; aktivitas: Aktivitas[]; kasBergulir: number; putaran: number };
```

## 8. Data Awal (seed) — harus konsisten dengan proposal

- 1 donor fiktif: **"PT Mitra Nusantara (contoh)"**, dana masuk **Rp100.000.000**.
- Rata-rata pinjaman **Rp2.000.000**, tenor **10 bulan**, cicilan **Rp200.000/bulan**, bunga **0%**.
- 12 UMKM fiktif di kecamatan Kota Malang (Klojen, Lowokwaru, Blimbing, Sukun, Kedungkandang) dengan beragam status: kebanyakan lancar, 1 terlambat, 2 menunggu verifikasi.
- Tingkat pengembalian awal sekitar **92%**, putaran ke-1.
- Contoh jenis usaha: keripik tempe, warung kopi, jahit, laundry kiloan, kue basah, sablon kaos, bengkel motor, toko kelontong.
- 1 UMKM "demo" (misal **"Keripik Tempe Bu Sari"**) belum mengajukan, untuk diperagakan dari awal.

## 9. Desain & Brand

- Warna: **Teal `#007A75`** (platform, kepercayaan), **Amber `#FEA11D`** (UMKM, kehangatan), putih, abu-abu netral. Teal dan amber dipakai seimbang.
- Font: Poppins atau Plus Jakarta Sans (Google Fonts).
- **Mobile-first**: desain utama di lebar 390px (cocok untuk rekaman 9:16), tetap rapi di desktop.
- Logo: file `public/logo.png` (disediakan tim). Jika belum ada, pakai placeholder teks "UrunRembug" dengan "Urun" berwarna teal dan "Rembug" berwarna amber.
- Gaya: bersih, ramah, sudut membulat, ikon (lucide-react), bahasa Indonesia santai-sopan.

## 10. Teknologi

- **Vite + React + TypeScript**
- **Tailwind CSS** untuk styling
- **Recharts** untuk grafik
- **React Router** untuk navigasi
- State: React Context + `localStorage` (tanpa backend)
- Deploy: **Vercel** (static site)
- Struktur folder:
  ```
  src/
    data/seed.ts        # data awal
    store/AppState.tsx  # context + localStorage + storage event
    pages/              # Landing, umkm/*, admin/*, donor/*
    components/         # Card, KpiCard, Stepper, Timeline, Badge, Toast
    lib/format.ts       # format Rupiah, tanggal
  ```
- Kode harus mudah dibaca, dengan komentar singkat berbahasa Indonesia di bagian penting. Tim adalah pelajar SMK yang perlu memahami dan menjelaskan kodenya ke juri.

## 11. Kriteria Selesai (Acceptance Criteria)

- [ ] `npm run dev` jalan tanpa error, `npm run build` sukses.
- [ ] Alur penuh bisa dilakukan dalam < 90 detik: UMKM ajukan → selesaikan training → Admin verifikasi & setujui → UMKM bayar cicilan → Donor melihat perubahan.
- [ ] Dua jendela browser (Admin dan Donor) berdampingan: aksi di Admin **langsung** mengubah dashboard Donor tanpa refresh.
- [ ] Badge "Prototipe — data simulasi" terlihat di semua halaman.
- [ ] Tombol "Reset data demo" mengembalikan seed.
- [ ] Tampilan rapi di 390×844 (iPhone 12/13/14) dan 1440px.
- [ ] Format Rupiah benar (`Rp2.000.000`), tidak ada angka `NaN` atau undefined.

## 12. Rencana Pengerjaan (bertahap)

Kerjakan **satu fase per sesi** dan berhenti untuk direview setelah setiap fase.

1. **Fase 1 — Fondasi:** setup Vite+React+TS+Tailwind+Router, tema warna, layout mobile, badge prototipe, seed data, AppState + localStorage + storage event, landing pilih peran, tombol reset.
2. **Fase 2 — Alur UMKM:** beranda, form pengajuan 3 langkah, timeline status, modul edukasi + kuis, cicilan + toast.
3. **Fase 3 — Alur Admin:** antrean, detail + checklist, setujui/tolak dengan aturan training.
4. **Fase 4 — Dashboard Donor:** kartu KPI + animasi, visual dana bergulir, daftar UMKM, grafik, feed aktivitas, laporan cetak.
5. **Fase 5 — Polish & Deploy:** responsif, animasi kecil, cek kriteria selesai, deploy ke Vercel, README.

## 13. Storyboard Video (≤ 2 menit, 9:16)

| Detik | Adegan | Isi |
|---|---|---|
| 0–15 | Masalah | UMKM sulit dapat modal (tanpa agunan, takut pinjol). Data: kredit UMKM hanya ±17% dari total kredit (OJK). |
| 15–30 | Solusi | Logo + konsep dana bergulir 0% dari CSR & ZIS. |
| 30–55 | Demo UMKM | Ajukan pinjaman → kuis edukasi → timeline status. |
| 55–75 | Demo Admin | Checklist verifikasi → Setujui. |
| 75–100 | Demo Donor | Split screen: angka KPI berubah real-time, feed aktivitas, unduh laporan. |
| 100–120 | Manfaat | "Satu rupiah, berputar berkali-kali." Nama tim + MIC 2026. |

Rekam layar HP (atau Chrome DevTools mode perangkat 390×844), lalu edit di CapCut atau Canva.
