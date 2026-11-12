import type { AppState, Checklist, Pinjaman, Transaksi, Umkm } from './types';
import { ID_SEMUA_MODUL } from './modul';
import { tanggalLokal } from '../lib/format';

// DATA AWAL (seed) — semua nama, usaha, dan angka di bawah ini FIKTIF.
// Angka dibuat konsisten dengan proposal: dana awal Rp100 juta,
// pinjaman umum Rp2 juta, tenor 10 bulan, cicilan Rp200.000, bunga 0%.

export const VERSI_DATA = 1;
export const ID_UMKM_DEMO = 'u-demo';

const lengkap: Checklist = { lokasi: true, usahaBerjalan: true, dokumen: true, foto: true };
const kosong: Checklist = { lokasi: false, usahaBerjalan: false, dokumen: false, foto: false };

function umkm(
  id: string, nama: string, pemilik: string, jenis: string, kecamatan: string,
  omzetSebelum: number, omzetSekarang: number, lulus = true,
): Umkm {
  return { id, nama, pemilik, jenis, kecamatan, omzetSebelum, omzetSekarang, modulSelesai: lulus ? [...ID_SEMUA_MODUL] : [] };
}

function pinjaman(
  id: string, umkmId: string, nominal: number, tenor: 5 | 10, tujuan: string,
  status: Pinjaman['status'], jatuhTempo: number, dibayar: number, tanggalAjuan: string,
  checklist: Checklist = lengkap,
): Pinjaman {
  return {
    id, umkmId, nominal, tenor, tujuan, status, checklist,
    catatanVerifikator: '',
    laporanTermin1: status === 'termin2' || status === 'lunas',
    cicilanDibayar: dibayar, cicilanJatuhTempo: jatuhTempo, tanggalAjuan,
  };
}

// Buku kas 7 hari terakhir milik UMKM demo, dihitung mundur dari hari ini.
function transaksiAwal(): Transaksi[] {
  const data: [number, 'masuk' | 'keluar', number, string][] = [
    [6, 'masuk', 145000, 'Jual keripik 29 bungkus'],
    [6, 'keluar', 60000, 'Beli tempe'],
    [5, 'masuk', 120000, 'Jual keripik 24 bungkus'],
    [4, 'masuk', 160000, 'Jual keripik 32 bungkus'],
    [4, 'keluar', 85000, 'Minyak goreng & bumbu'],
    [3, 'masuk', 110000, 'Jual keripik 22 bungkus'],
    [2, 'masuk', 175000, 'Pesanan arisan'],
    [2, 'keluar', 40000, 'Plastik kemasan'],
    [1, 'masuk', 135000, 'Jual keripik 27 bungkus'],
  ];
  return data.map(([m, tipe, nominal, keterangan], i) => ({ id: `t${i}`, tanggal: tanggalLokal(m), tipe, nominal, keterangan }));
}

export function buatSeed(): AppState {
  const menitLalu = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

  return {
    versi: VERSI_DATA,
    donor: [{ id: 'd1', nama: 'PT Mitra Nusantara (contoh)', danaMasuk: 100_000_000 }],
    umkm: [
      // UMKM demo: belum punya pinjaman, dipakai untuk memperagakan alur dari awal.
      umkm(ID_UMKM_DEMO, 'Keripik Tempe Bu Sari', 'Sari Wulandari', 'Makanan ringan', 'Sukun', 3_500_000, 3_500_000, false),
      umkm('u1', 'Warung Kopi Pak Darto', 'Darto', 'Kedai minuman', 'Lowokwaru', 4_000_000, 5_100_000),
      umkm('u2', 'Jahit Bu Ratna', 'Ratna Sari', 'Jasa jahit', 'Klojen', 2_800_000, 3_400_000),
      umkm('u3', 'Laundry Kiloan Mbak Wulan', 'Wulan', 'Jasa laundry', 'Lowokwaru', 3_200_000, 4_000_000),
      umkm('u4', 'Kue Basah Bu Endang', 'Endang', 'Kue tradisional', 'Sukun', 2_500_000, 2_700_000),
      umkm('u5', 'Sablon Kaos Mas Rian', 'Rian Pratama', 'Sablon', 'Blimbing', 3_000_000, 3_300_000),
      umkm('u6', 'Bengkel Motor Pak Slamet', 'Slamet', 'Bengkel', 'Kedungkandang', 5_000_000, 6_200_000),
      umkm('u7', 'Toko Kelontong Bu Yati', 'Suyati', 'Toko kelontong', 'Sukun', 4_500_000, 5_600_000),
      umkm('u8', 'Nasi Pecel Bu Murni', 'Murni', 'Warung makan', 'Klojen', 2_200_000, 2_500_000),
      umkm('u9', 'Kerajinan Bambu Pak Joko', 'Joko Susilo', 'Kerajinan', 'Kedungkandang', 2_600_000, 3_100_000),
      umkm('u10', 'Es Dawet Mas Fajar', 'Fajar', 'Minuman', 'Blimbing', 1_800_000, 1_800_000, false),
      umkm('u11', 'Batik Tulis Mbak Dewi', 'Dewi Lestari', 'Batik', 'Klojen', 3_600_000, 3_600_000),
    ],
    pinjaman: [
      pinjaman('p1', 'u1', 2_000_000, 10, 'Mesin kopi bekas', 'termin2', 6, 6, '2026-05-04'),
      pinjaman('p2', 'u2', 2_000_000, 10, 'Mesin obras', 'termin2', 5, 5, '2026-06-02'),
      pinjaman('p3', 'u3', 2_000_000, 10, 'Mesin cuci kedua', 'termin2', 4, 4, '2026-07-01'),
      pinjaman('p4', 'u4', 2_000_000, 10, 'Oven dan loyang', 'termin2', 5, 2, '2026-06-03'),
      pinjaman('p5', 'u5', 2_000_000, 10, 'Tinta dan screen', 'termin1', 2, 2, '2026-09-01'),
      pinjaman('p6', 'u6', 3_000_000, 10, 'Kompresor angin', 'termin2', 7, 7, '2026-04-01'),
      pinjaman('p7', 'u7', 1_500_000, 5, 'Tambah stok barang', 'lunas', 5, 5, '2026-05-15'),
      pinjaman('p8', 'u8', 1_000_000, 5, 'Etalase lauk', 'termin1', 1, 1, '2026-10-01'),
      pinjaman('p9', 'u9', 2_500_000, 10, 'Alat potong bambu', 'termin2', 3, 3, '2026-08-01'),
      pinjaman('p10', 'u10', 1_500_000, 5, 'Gerobak baru', 'diajukan', 0, 0, '2026-11-09', kosong),
      pinjaman('p11', 'u11', 2_000_000, 10, 'Kain dan malam batik', 'verifikasi', 0, 0, '2026-11-05',
        { lokasi: true, usahaBerjalan: true, dokumen: false, foto: false }),
    ],
    aktivitas: [
      { id: 'a1', waktu: menitLalu(18), tipe: 'bayar', teks: 'Bengkel Motor Pak Slamet membayar cicilan ke-7 — Rp300.000' },
      { id: 'a2', waktu: menitLalu(55), tipe: 'verifikasi', teks: 'Verifikator mengunjungi Batik Tulis Mbak Dewi (Klojen)' },
      { id: 'a3', waktu: menitLalu(130), tipe: 'ajuan', teks: 'Es Dawet Mas Fajar mengajukan pinjaman Rp1.500.000' },
      { id: 'a4', waktu: menitLalu(300), tipe: 'bayar', teks: 'Warung Kopi Pak Darto membayar cicilan ke-6 — Rp200.000' },
    ],
    transaksiDemo: transaksiAwal(),
    // Total = Rp8.350.000, sama dengan jumlah semua cicilan yang sudah dibayar di atas.
    riwayatPengembalian: [
      { bulan: 'Mei', nominal: 300_000 },
      { bulan: 'Jun', nominal: 700_000 },
      { bulan: 'Jul', nominal: 1_000_000 },
      { bulan: 'Agu', nominal: 1_250_000 },
      { bulan: 'Sep', nominal: 1_600_000 },
      { bulan: 'Okt', nominal: 1_900_000 },
      { bulan: 'Nov', nominal: 1_600_000 },
    ],
  };
}
