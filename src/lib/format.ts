// Fungsi bantu untuk menampilkan angka dan tanggal dalam format Indonesia.

const rupiahFormatter = new Intl.NumberFormat('id-ID');

/** 2000000 -> "Rp2.000.000" */
export function rupiah(n: number): string {
  if (!Number.isFinite(n)) return 'Rp0';
  const tanda = n < 0 ? '-' : '';
  return `${tanda}Rp${rupiahFormatter.format(Math.round(Math.abs(n)))}`;
}

/** 2000000 -> "Rp2 jt", untuk label grafik yang sempit */
export function rupiahSingkat(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `Rp${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
  if (Math.abs(n) >= 1_000) return `Rp${Math.round(n / 1_000)} rb`;
  return rupiah(n);
}

/** 0.9214 -> "92,1%" */
export function persen(x: number): string {
  if (!Number.isFinite(x)) return '0%';
  return `${(x * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`;
}

/** "2026-11-05" -> "5 Nov 2026" */
export function tanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Waktu relatif: "baru saja", "5 menit lalu", "2 jam lalu", "3 hari lalu" */
export function waktuRelatif(iso: string, sekarang = Date.now()): string {
  const detik = Math.max(0, Math.floor((sekarang - new Date(iso).getTime()) / 1000));
  if (detik < 60) return 'baru saja';
  const menit = Math.floor(detik / 60);
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.floor(jam / 24)} hari lalu`;
}

/** Membuat id acak pendek untuk data baru. */
export function idBaru(awalan: string): string {
  return `${awalan}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Tanggal lokal (bukan UTC) dalam format yyyy-mm-dd, mundur N hari dari hari ini. */
export function tanggalLokal(mundurHari = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - mundurHari);
  const dua = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`;
}
