import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, Judul, StatusBadge } from '../../components/ui';
import { useApp } from '../../store/AppState';
import { ID_UMKM_DEMO } from '../../data/seed';
import type { Pinjaman } from '../../data/types';
import { ringkasan, terlambat } from '../../lib/hitung';
import { rupiah, rupiahSingkat, tanggal } from '../../lib/format';

type Filter = 'tindakan' | 'aktif' | 'semua';

/** Pengajuan yang menunggu keputusan admin. */
export function perluTindakan(p: Pinjaman): boolean {
  return p.status === 'diajukan' || p.status === 'verifikasi' || (p.status === 'termin1' && p.laporanTermin1);
}

export default function Antrean() {
  const { state } = useApp();
  const [filter, setFilter] = useState<Filter>('tindakan');
  const r = ringkasan(state);

  const daftar = state.pinjaman
    .filter((p) => (filter === 'tindakan' ? perluTindakan(p) : filter === 'aktif' ? p.status === 'termin1' || p.status === 'termin2' : true))
    // UMKM demo selalu di atas supaya mudah ditemukan saat presentasi.
    .sort((a, b) => Number(b.umkmId === ID_UMKM_DEMO) - Number(a.umkmId === ID_UMKM_DEMO) || b.tanggalAjuan.localeCompare(a.tanggalAjuan));

  const jumlahTindakan = state.pinjaman.filter(perluTindakan).length;

  return (
    <div>
      <Judul sub="Verifikasi lapangan sebelum dana dicairkan.">Antrean Pengajuan</Judul>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <Card className="!p-3"><div className="text-[11px] text-muted">Perlu tindakan</div><div className="text-lg font-extrabold text-amber-dark">{jumlahTindakan}</div></Card>
        <Card className="!p-3"><div className="text-[11px] text-muted">Pinjaman aktif</div><div className="text-lg font-extrabold text-teal">{r.jumlahAktif}</div></Card>
        <Card className="!p-3"><div className="text-[11px] text-muted">Kas tersedia</div><div className="text-sm font-extrabold">{rupiahSingkat(r.kasBergulir)}</div></Card>
      </div>

      <div className="mb-3 flex gap-2">
        {([['tindakan', 'Perlu tindakan'], ['aktif', 'Aktif'], ['semua', 'Semua']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === k ? 'bg-teal text-white' : 'bg-white text-muted border border-line'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {daftar.length === 0 && <Card className="text-center text-sm text-muted">Tidak ada pengajuan di kategori ini.</Card>}
        {daftar.map((p) => {
          const u = state.umkm.find((x) => x.id === p.umkmId)!;
          return (
            <Link key={p.id} to={`/admin/${p.id}`} className={`flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm ${perluTindakan(p) ? 'border-amber' : 'border-line'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{u.nama}</span>
                  {u.id === ID_UMKM_DEMO && <span className="rounded bg-amber px-1.5 text-[10px] font-bold">DEMO</span>}
                </div>
                <div className="text-xs text-muted">{u.jenis} · Kec. {u.kecamatan} · {tanggal(p.tanggalAjuan)}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <span className="text-xs font-semibold">{rupiah(p.nominal)}</span>
                  {terlambat(p) && <span className="text-[11px] font-semibold text-red-600">terlambat</span>}
                  {p.status === 'termin1' && p.laporanTermin1 && <span className="text-[11px] font-semibold text-amber-dark">laporan masuk</span>}
                </div>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
