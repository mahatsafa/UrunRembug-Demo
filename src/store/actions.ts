import type { Aktivitas, AppState, Checklist, Pinjaman, TipeAktivitas, Transaksi } from '../data/types';
import { ID_SEMUA_MODUL } from '../data/modul';
import { ID_UMKM_DEMO } from '../data/seed';
import { bisaBayar, checklistLengkap, cicilanPerBulan } from '../lib/hitung';
import { idBaru, rupiah, tanggalLokal } from '../lib/format';

// "Aksi" = semua perubahan data yang bisa terjadi di aplikasi.
// Setiap fungsi menerima state lama dan MENGEMBALIKAN state baru (tidak mengubah yang lama).
// Pola ini disebut "pure function": mudah dites dan tidak ada efek samping tersembunyi.

function catat(state: AppState, tipe: TipeAktivitas, teks: string): Aktivitas[] {
  const baru: Aktivitas = { id: idBaru('a'), waktu: new Date().toISOString(), tipe, teks };
  return [baru, ...state.aktivitas].slice(0, 40); // simpan 40 aktivitas terakhir saja
}

function ubahPinjaman(state: AppState, id: string, ubah: (p: Pinjaman) => Pinjaman): Pinjaman[] {
  return state.pinjaman.map((p) => (p.id === id ? ubah(p) : p));
}

function namaUmkm(state: AppState, umkmId: string): string {
  return state.umkm.find((u) => u.id === umkmId)?.nama ?? 'UMKM';
}

export function pinjamanDemo(state: AppState): Pinjaman | undefined {
  // Pinjaman terbaru milik UMKM demo (bisa ada riwayat ditolak sebelumnya).
  return [...state.pinjaman].reverse().find((p) => p.umkmId === ID_UMKM_DEMO);
}

export type DataPengajuan = {
  namaUsaha: string; jenis: string; kecamatan: string; omzet: number;
  nominal: number; tenor: 5 | 10; tujuan: string;
};

export function ajukanPinjaman(state: AppState, d: DataPengajuan): AppState {
  const umkm = state.umkm.map((u) =>
    u.id === ID_UMKM_DEMO
      ? { ...u, nama: d.namaUsaha, jenis: d.jenis, kecamatan: d.kecamatan, omzetSebelum: d.omzet, omzetSekarang: d.omzet }
      : u,
  );
  const baru: Pinjaman = {
    id: idBaru('p'), umkmId: ID_UMKM_DEMO, nominal: d.nominal, tenor: d.tenor, tujuan: d.tujuan,
    status: 'diajukan',
    checklist: { lokasi: false, usahaBerjalan: false, dokumen: false, foto: false },
    catatanVerifikator: '', laporanTermin1: false,
    cicilanDibayar: 0, cicilanJatuhTempo: 0, tanggalAjuan: tanggalLokal(),
  };
  return {
    ...state,
    umkm,
    pinjaman: [...state.pinjaman, baru],
    aktivitas: catat(state, 'ajuan', `${d.namaUsaha} mengajukan pinjaman ${rupiah(d.nominal)}`),
  };
}

export function lulusModul(state: AppState, umkmId: string, modulId: string): AppState {
  const u = state.umkm.find((x) => x.id === umkmId);
  if (!u || u.modulSelesai.includes(modulId)) return state;
  const modulSelesai = [...u.modulSelesai, modulId];
  const semuaLulus = ID_SEMUA_MODUL.every((m) => modulSelesai.includes(m));
  return {
    ...state,
    umkm: state.umkm.map((x) => (x.id === umkmId ? { ...x, modulSelesai } : x)),
    aktivitas: semuaLulus ? catat(state, 'lulus', `${u.nama} menyelesaikan seluruh training edukasi finansial`) : state.aktivitas,
  };
}

export function setChecklist(state: AppState, pinjamanId: string, checklist: Checklist, catatan: string): AppState {
  const p = state.pinjaman.find((x) => x.id === pinjamanId);
  if (!p || (p.status !== 'diajukan' && p.status !== 'verifikasi')) return state;
  const mulai = p.status === 'diajukan' && Object.values(checklist).some(Boolean);
  return {
    ...state,
    pinjaman: ubahPinjaman(state, pinjamanId, (x) => ({
      ...x, checklist, catatanVerifikator: catatan, status: mulai ? 'verifikasi' : x.status,
    })),
    aktivitas: mulai ? catat(state, 'verifikasi', `Verifikator mengunjungi ${namaUmkm(state, p.umkmId)}`) : state.aktivitas,
  };
}

/** Admin boleh menyetujui hanya jika checklist lengkap DAN UMKM lulus training. */
export function bolehDisetujui(state: AppState, p: Pinjaman): boolean {
  const u = state.umkm.find((x) => x.id === p.umkmId);
  const lulus = !!u && ID_SEMUA_MODUL.every((m) => u.modulSelesai.includes(m));
  return (p.status === 'diajukan' || p.status === 'verifikasi') && checklistLengkap(p.checklist) && lulus;
}

export function setujui(state: AppState, pinjamanId: string): AppState {
  const p = state.pinjaman.find((x) => x.id === pinjamanId);
  if (!p || !bolehDisetujui(state, p)) return state;
  return {
    ...state,
    pinjaman: ubahPinjaman(state, pinjamanId, (x) => ({ ...x, status: 'termin1' })),
    aktivitas: catat(state, 'setuju',
      `Pinjaman ${namaUmkm(state, p.umkmId)} disetujui — termin 1 ${rupiah(p.nominal / 2)} dicairkan`),
  };
}

export function tolak(state: AppState, pinjamanId: string): AppState {
  const p = state.pinjaman.find((x) => x.id === pinjamanId);
  if (!p || (p.status !== 'diajukan' && p.status !== 'verifikasi')) return state;
  return {
    ...state,
    pinjaman: ubahPinjaman(state, pinjamanId, (x) => ({ ...x, status: 'ditolak' })),
    aktivitas: catat(state, 'tolak', `Pengajuan ${namaUmkm(state, p.umkmId)} belum dapat disetujui`),
  };
}

export function kirimLaporanTermin1(state: AppState, pinjamanId: string): AppState {
  const p = state.pinjaman.find((x) => x.id === pinjamanId);
  if (!p || p.status !== 'termin1' || p.laporanTermin1) return state;
  return {
    ...state,
    pinjaman: ubahPinjaman(state, pinjamanId, (x) => ({ ...x, laporanTermin1: true })),
    aktivitas: catat(state, 'laporan', `${namaUmkm(state, p.umkmId)} mengirim laporan penggunaan dana termin 1 + foto nota`),
  };
}

export function cairkanTermin2(state: AppState, pinjamanId: string): AppState {
  const p = state.pinjaman.find((x) => x.id === pinjamanId);
  if (!p || p.status !== 'termin1' || !p.laporanTermin1) return state;
  return {
    ...state,
    pinjaman: ubahPinjaman(state, pinjamanId, (x) => ({ ...x, status: 'termin2' })),
    aktivitas: catat(state, 'cair', `Termin 2 untuk ${namaUmkm(state, p.umkmId)} dicairkan — ${rupiah(p.nominal / 2)}`),
  };
}

export function bayarCicilan(state: AppState, pinjamanId: string): AppState {
  const p = state.pinjaman.find((x) => x.id === pinjamanId);
  if (!p || !bisaBayar(p)) return state;
  const ke = p.cicilanDibayar + 1;
  const nominal = cicilanPerBulan(p);
  const lunas = ke >= p.tenor;
  const riwayat = state.riwayatPengembalian.map((r, i, arr) =>
    i === arr.length - 1 ? { ...r, nominal: r.nominal + nominal } : r,
  );
  return {
    ...state,
    pinjaman: ubahPinjaman(state, pinjamanId, (x) => ({
      ...x,
      cicilanDibayar: ke,
      cicilanJatuhTempo: Math.max(x.cicilanJatuhTempo, ke),
      status: lunas ? 'lunas' : x.status,
    })),
    riwayatPengembalian: riwayat,
    aktivitas: catat(state, 'bayar',
      `${namaUmkm(state, p.umkmId)} membayar cicilan ke-${ke} — ${rupiah(nominal)}${lunas ? ' (LUNAS 🎉)' : ''}`),
  };
}

export function tambahTransaksi(state: AppState, t: Omit<Transaksi, 'id'>): AppState {
  return { ...state, transaksiDemo: [...state.transaksiDemo, { ...t, id: idBaru('t') }] };
}
