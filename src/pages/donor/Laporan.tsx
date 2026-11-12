import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useApp } from '../../store/AppState';
import { danaCair, ringkasan, terlambat } from '../../lib/hitung';
import { persen, rupiah, tanggal, tanggalLokal } from '../../lib/format';

// Halaman ramah cetak. Tombol "Cetak / Simpan PDF" memakai window.print():
// di dialog cetak browser, pilih "Save as PDF" untuk menyimpan sebagai PDF.

export default function Laporan() {
  const { state } = useApp();
  const r = ringkasan(state);
  const donor = state.donor[0];
  const dibiayai = state.pinjaman.filter((p) => danaCair(p) > 0);

  const kpi: [string, string][] = [
    ['Dana masuk', rupiah(r.totalMasuk)],
    ['Dana disalurkan', rupiah(r.totalDisalurkan)],
    ['Dana sudah kembali', rupiah(r.totalKembali)],
    ['Kas bergulir tersedia', rupiah(r.kasBergulir)],
    ['UMKM dibiayai', `${r.jumlahDibiayai} usaha`],
    ['Tingkat pengembalian', persen(r.tingkatPengembalian)],
    ['Kenaikan omzet rata-rata', `+${persen(r.kenaikanOmzet)}`],
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="no-print sticky top-0 flex items-center justify-between border-b border-line bg-white px-4 py-3">
        <Link to="/donor" className="flex items-center gap-1 text-sm font-semibold text-muted"><ArrowLeft size={16} /> Dashboard</Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white">
          <Printer size={16} /> Cetak / Simpan PDF
        </button>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-8 text-ink">
        <header className="flex items-center justify-between border-b-4 border-teal pb-4">
          <img src="/logo-panjang.png" alt="UrunRembug" className="h-14" />
          <div className="text-right text-xs text-muted">
            <div className="font-semibold text-ink">Laporan Dampak Penyaluran</div>
            <div>{donor.nama}</div>
            <div>Per {tanggal(tanggalLokal())}</div>
          </div>
        </header>

        <p className="mt-3 rounded-lg bg-amber-soft px-3 py-2 text-xs font-semibold text-amber-dark">
          Dokumen prototipe — seluruh data merupakan simulasi untuk keperluan demo MIC 2026.
        </p>

        <h2 className="mt-6 text-lg font-bold">Ringkasan</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {kpi.map(([k, v]) => (
              <tr key={k} className="border-b border-line">
                <td className="py-2 text-muted">{k}</td>
                <td className="py-2 text-right font-semibold">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-6 text-lg font-bold">Daftar UMKM Penerima</h2>
        <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[560px] text-xs">
          <thead>
            <tr className="bg-teal text-left text-white">
              <th className="p-2">UMKM</th><th className="p-2">Kecamatan</th><th className="p-2 text-right">Pinjaman</th>
              <th className="p-2 text-right">Cicilan</th><th className="p-2">Status</th><th className="p-2 text-right">Omzet</th>
            </tr>
          </thead>
          <tbody>
            {dibiayai.map((p) => {
              const u = state.umkm.find((x) => x.id === p.umkmId)!;
              return (
                <tr key={p.id} className="border-b border-line">
                  <td className="p-2 font-semibold">{u.nama}</td>
                  <td className="p-2">{u.kecamatan}</td>
                  <td className="p-2 text-right">{rupiah(p.nominal)}</td>
                  <td className="p-2 text-right">{p.cicilanDibayar}/{p.tenor}</td>
                  <td className="p-2">{p.status === 'lunas' ? 'Lunas' : terlambat(p) ? 'Terlambat' : 'Lancar'}</td>
                  <td className="whitespace-nowrap p-2 text-right">{rupiah(u.omzetSebelum)} → {rupiah(u.omzetSekarang)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <h2 className="mt-6 text-lg font-bold">Catatan Metodologi</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>Pinjaman 0% bunga dicairkan dalam dua termin; termin 2 setelah UMKM melaporkan penggunaan termin 1.</li>
          <li>Setiap UMKM wajib lulus training finansial dan verifikasi lapangan sebelum pencairan.</li>
          <li>Tingkat pengembalian = jumlah cicilan dibayar ÷ jumlah cicilan yang telah jatuh tempo.</li>
          <li>Dana ZIS disalurkan melalui kemitraan dengan BAZNAS/LAZ resmi sesuai UU No. 23 Tahun 2011.</li>
        </ul>

        <footer className="mt-10 border-t border-line pt-3 text-center text-[11px] text-muted">
          UrunRembug · Tim Inovasi Generasi · SMK Telkom Malang · Moklet Idea Challenge 2026
        </footer>
      </article>
    </div>
  );
}
