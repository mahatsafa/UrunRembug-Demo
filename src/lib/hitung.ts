import type { AppState, Checklist, Pinjaman } from '../data/types';

// Semua angka di dashboard DIHITUNG dari data, bukan diketik manual.
// Jadi ketika UMKM membayar cicilan, angka donor otomatis ikut berubah.

/** Besar satu kali cicilan (tanpa bunga): nominal dibagi tenor. */
export function cicilanPerBulan(p: Pick<Pinjaman, 'nominal' | 'tenor'>): number {
  return Math.round(p.nominal / p.tenor);
}

/** Uang yang sudah keluar dari kas untuk pinjaman ini (termin 1 = 50%, termin 2 = 100%). */
export function danaCair(p: Pinjaman): number {
  if (p.status === 'termin1') return p.nominal / 2;
  if (p.status === 'termin2' || p.status === 'lunas') return p.nominal;
  return 0;
}

/** Uang yang sudah kembali dari pinjaman ini lewat cicilan. */
export function danaKembali(p: Pinjaman): number {
  return p.cicilanDibayar * cicilanPerBulan(p);
}

export function checklistLengkap(c: Checklist): boolean {
  return c.lokasi && c.usahaBerjalan && c.dokumen && c.foto;
}

export function bisaBayar(p: Pinjaman): boolean {
  return (p.status === 'termin1' || p.status === 'termin2') && p.cicilanDibayar < p.tenor;
}

export function terlambat(p: Pinjaman): boolean {
  return p.cicilanDibayar < p.cicilanJatuhTempo;
}

export function ringkasan(state: AppState) {
  const totalMasuk = state.donor.reduce((s, d) => s + d.danaMasuk, 0);
  const totalDisalurkan = state.pinjaman.reduce((s, p) => s + danaCair(p), 0);
  const totalKembali = state.pinjaman.reduce((s, p) => s + danaKembali(p), 0);
  const kasBergulir = totalMasuk - totalDisalurkan + totalKembali;

  // Tingkat pengembalian = cicilan yang dibayar dibanding cicilan yang sudah jatuh tempo.
  const dibayar = state.pinjaman.reduce((s, p) => s + p.cicilanDibayar, 0);
  const seharusnya = state.pinjaman.reduce((s, p) => s + Math.max(p.cicilanJatuhTempo, p.cicilanDibayar), 0);
  const tingkatPengembalian = seharusnya === 0 ? 1 : dibayar / seharusnya;

  const aktif = state.pinjaman.filter((p) => p.status === 'termin1' || p.status === 'termin2');
  const pernahDibiayai = state.pinjaman.filter((p) => danaCair(p) > 0);
  const menunggu = state.pinjaman.filter((p) => p.status === 'diajukan' || p.status === 'verifikasi');

  // Rata-rata omzet sebelum vs sekarang untuk UMKM yang sudah pernah dibiayai.
  const umkmDibiayai = state.umkm.filter((u) => pernahDibiayai.some((p) => p.umkmId === u.id));
  const rata = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const omzetSebelum = rata(umkmDibiayai.map((u) => u.omzetSebelum));
  const omzetSekarang = rata(umkmDibiayai.map((u) => u.omzetSekarang));

  return {
    totalMasuk,
    totalDisalurkan,
    totalKembali,
    kasBergulir,
    tingkatPengembalian,
    jumlahAktif: aktif.length,
    jumlahDibiayai: pernahDibiayai.length,
    jumlahMenunggu: menunggu.length,
    omzetSebelum,
    omzetSekarang,
    kenaikanOmzet: omzetSebelum ? omzetSekarang / omzetSebelum - 1 : 0,
  };
}
