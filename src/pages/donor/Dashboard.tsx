import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ArrowUpRight, Banknote, Download, HandCoins, Percent, RefreshCcw, Store, TrendingUp,
} from 'lucide-react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui';
import { KpiCard } from '../../components/AngkaAnimasi';
import { SiklusDana } from '../../components/SiklusDana';
import { useApp } from '../../store/AppState';
import { danaCair, ringkasan, terlambat } from '../../lib/hitung';
import { persen, rupiah, rupiahSingkat, waktuRelatif } from '../../lib/format';
import type { TipeAktivitas } from '../../data/types';

const WARNA_AKTIVITAS: Record<TipeAktivitas, string> = {
  bayar: 'bg-teal', setuju: 'bg-amber', cair: 'bg-amber', ajuan: 'bg-blue-500',
  lulus: 'bg-emerald-500', verifikasi: 'bg-blue-400', tolak: 'bg-red-400', laporan: 'bg-teal',
};

export default function Dashboard() {
  const { state } = useApp();
  const r = ringkasan(state);
  const donor = state.donor[0];

  // Re-render tiap 30 detik agar label "x menit lalu" tetap akurat.
  const [, setDetak] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDetak((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const dibiayai = state.pinjaman.filter((p) => danaCair(p) > 0);
  const dataOmzet = [
    { label: 'Sebelum', nilai: Math.round(r.omzetSebelum) },
    { label: 'Sekarang', nilai: Math.round(r.omzetSekarang) },
  ];

  return (
    <Layout peran="Donor CSR" lebar="lebar">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs text-muted">Dashboard transparansi</p>
          <h1 className="text-xl font-bold">{donor.nama}</h1>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
          </span>
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-6">
        <KpiCard label="Disalurkan" nilai={r.totalDisalurkan} format={rupiah} ikon={<Banknote size={15} />} aksen="amber" keterangan={`dari ${rupiahSingkat(r.totalMasuk)} dana masuk`} />
        <KpiCard label="Kas bergulir" nilai={r.kasBergulir} format={rupiah} ikon={<RefreshCcw size={15} />} keterangan="siap dipinjamkan lagi" />
        <KpiCard label="Sudah kembali" nilai={r.totalKembali} format={rupiah} ikon={<HandCoins size={15} />} keterangan="lewat cicilan UMKM" />
        <KpiCard label="UMKM dibiayai" nilai={r.jumlahDibiayai} format={(n) => `${Math.round(n)} usaha`} ikon={<Store size={15} />} aksen="amber" keterangan={`${r.jumlahMenunggu} menunggu verifikasi`} />
        <KpiCard label="Tingkat pengembalian" nilai={r.tingkatPengembalian} format={persen} ikon={<Percent size={15} />} keterangan="cicilan tepat waktu" />
        <KpiCard label="Kenaikan omzet" nilai={r.kenaikanOmzet} format={(n) => `+${persen(n)}`} ikon={<TrendingUp size={15} />} aksen="amber" keterangan="rata-rata UMKM dibiayai" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="font-bold">Siklus Dana Bergulir</h2>
          <p className="mb-2 text-xs text-muted">Satu rupiah yang kembali bisa dipinjamkan lagi ke UMKM lain.</p>
          <SiklusDana masuk={r.totalMasuk} disalurkan={r.totalDisalurkan} kembali={r.totalKembali} kas={r.kasBergulir} />
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">Aktivitas Terbaru</h2>
            <span className="text-[11px] text-muted">diperbarui otomatis</span>
          </div>
          <ul className="max-h-[300px] space-y-2.5 overflow-auto pr-1">
            {state.aktivitas.slice(0, 8).map((a) => (
              <li key={a.id} className="masuk flex gap-3 text-sm">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${WARNA_AKTIVITAS[a.tipe]}`} />
                <div>
                  <div>{a.teks}</div>
                  <div className="text-[11px] text-muted">{waktuRelatif(a.waktu)}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-bold">Pengembalian per Bulan</h2>
          <p className="mb-2 text-xs text-muted">Cicilan yang kembali ke kas bergulir</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.riwayatPengembalian} margin={{ left: -14, right: 4, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e9e8" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${Number(v) / 1_000_000}jt`} />
                <Tooltip formatter={(v) => rupiah(Number(v))} />
                <Bar dataKey="nominal" name="Pengembalian" fill="#007a75" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-bold">Dampak ke Omzet UMKM</h2>
          <p className="mb-2 text-xs text-muted">Rata-rata omzet per bulan</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataOmzet} margin={{ left: -14, right: 4, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e9e8" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(Number(v) / 1_000_000).toFixed(1)}jt`} />
                <Tooltip formatter={(v) => rupiah(Number(v))} />
                <Bar dataKey="nilai" name="Omzet" fill="#fea11d" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col justify-between bg-gradient-to-br from-teal to-teal-dark !text-white">
          <div>
            <h2 className="font-bold">Laporan Dampak</h2>
            <p className="mt-1 text-sm text-white/85">
              Ringkasan penyaluran dan dampak, siap dilampirkan pada laporan keberlanjutan perusahaan.
            </p>
          </div>
          <Link to="/donor/laporan" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-amber px-4 py-3 text-sm font-semibold text-ink">
            <Download size={16} /> Unduh Laporan Dampak
          </Link>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 font-bold">UMKM Penerima ({dibiayai.length})</h2>
        <div className="divide-y divide-line">
          {dibiayai.map((p) => {
            const u = state.umkm.find((x) => x.id === p.umkmId)!;
            const naik = u.omzetSebelum ? u.omzetSekarang / u.omzetSebelum - 1 : 0;
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{u.nama}</div>
                  <div className="text-xs text-muted">{u.jenis} · {u.kecamatan} · {rupiah(p.nominal)}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`text-xs font-semibold ${p.status === 'lunas' ? 'text-emerald-600' : terlambat(p) ? 'text-red-600' : 'text-teal'}`}>
                    {p.status === 'lunas' ? 'Lunas' : terlambat(p) ? 'Terlambat' : 'Lancar'} · {p.cicilanDibayar}/{p.tenor}
                  </div>
                  {naik > 0 && (
                    <div className="flex items-center justify-end gap-0.5 text-[11px] text-amber-dark">
                      <ArrowUpRight size={12} /> omzet +{persen(naik)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </Layout>
  );
}
