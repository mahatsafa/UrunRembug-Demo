import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { Card, Tombol } from '../../components/ui';
import { useApp } from '../../store/AppState';
import { ajukanPinjaman, type DataPengajuan } from '../../store/actions';
import { rupiah } from '../../lib/format';
import { cicilanPerBulan } from '../../lib/hitung';
import { useUmkmDemo } from './UmkmLayout';

const KECAMATAN = ['Blimbing', 'Kedungkandang', 'Klojen', 'Lowokwaru', 'Sukun'];
const PILIHAN_NOMINAL = [1_000_000, 2_000_000, 3_000_000, 5_000_000];
const LANGKAH = ['Data Usaha', 'Kebutuhan Dana', 'Ringkasan'];

const inputGaya = 'mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20';

export default function Ajukan() {
  const { ubah } = useApp();
  const { umkm } = useUmkmDemo();
  const navigate = useNavigate();
  const [langkah, setLangkah] = useState(0);

  // Form sudah terisi data Bu Sari agar demo cepat. Semua tetap bisa diubah.
  const [data, setData] = useState<DataPengajuan>({
    namaUsaha: umkm.nama,
    jenis: umkm.jenis,
    kecamatan: umkm.kecamatan,
    omzet: umkm.omzetSebelum,
    nominal: 2_000_000,
    tenor: 10,
    tujuan: 'Beli spinner peniris minyak dan kemasan standing pouch',
  });
  const isi = <K extends keyof DataPengajuan>(k: K, v: DataPengajuan[K]) => setData((d) => ({ ...d, [k]: v }));

  const valid0 = data.namaUsaha.trim() && data.jenis.trim() && data.omzet > 0;
  const valid1 = data.nominal >= 500_000 && data.nominal <= 5_000_000 && data.tujuan.trim().length >= 5;

  const kirim = () => {
    ubah((s) => ajukanPinjaman(s, data), 'Pengajuan terkirim! Tim kami akan segera menjadwalkan verifikasi.');
    navigate('/umkm');
  };

  return (
    <div>
      <button onClick={() => (langkah ? setLangkah(langkah - 1) : navigate('/umkm'))} className="mb-3 flex items-center gap-1 text-sm font-semibold text-muted">
        <ArrowLeft size={16} /> Kembali
      </button>
      <h1 className="text-xl font-bold">Ajukan Pinjaman</h1>

      {/* Stepper 3 langkah */}
      <div className="my-4 flex items-center gap-2">
        {LANGKAH.map((l, i) => (
          <div key={l} className="flex flex-1 flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full ${i <= langkah ? 'bg-teal' : 'bg-line'}`} />
            <span className={`text-[11px] font-semibold ${i === langkah ? 'text-teal' : 'text-muted'}`}>{i + 1}. {l}</span>
          </div>
        ))}
      </div>

      {langkah === 0 && (
        <Card className="space-y-3">
          <label className="block text-sm font-medium">Nama usaha
            <input className={inputGaya} value={data.namaUsaha} onChange={(e) => isi('namaUsaha', e.target.value)} />
          </label>
          <label className="block text-sm font-medium">Jenis usaha
            <input className={inputGaya} value={data.jenis} onChange={(e) => isi('jenis', e.target.value)} />
          </label>
          <label className="block text-sm font-medium">Kecamatan (Kota Malang)
            <select className={inputGaya} value={data.kecamatan} onChange={(e) => isi('kecamatan', e.target.value)}>
              {KECAMATAN.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Omzet per bulan (Rp)
            <input type="number" inputMode="numeric" className={inputGaya} value={data.omzet || ''} onChange={(e) => isi('omzet', Number(e.target.value))} />
          </label>
          <Tombol className="w-full" disabled={!valid0} onClick={() => setLangkah(1)}>Lanjut</Tombol>
        </Card>
      )}

      {langkah === 1 && (
        <Card className="space-y-4">
          <div>
            <div className="text-sm font-medium">Nominal pinjaman</div>
            <div className="mt-1 text-2xl font-extrabold text-teal">{rupiah(data.nominal)}</div>
            <input
              type="range" min={500_000} max={5_000_000} step={250_000} value={data.nominal}
              onChange={(e) => isi('nominal', Number(e.target.value))}
              className="mt-2 w-full accent-teal"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {PILIHAN_NOMINAL.map((n) => (
                <button key={n} onClick={() => isi('nominal', n)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${data.nominal === n ? 'border-teal bg-teal-soft text-teal' : 'border-line text-muted'}`}>
                  {rupiah(n)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Tenor (lama cicilan)</div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {([5, 10] as const).map((t) => (
                <button key={t} onClick={() => isi('tenor', t)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold ${data.tenor === t ? 'border-teal bg-teal-soft text-teal' : 'border-line text-muted'}`}>
                  {t} bulan
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium">Dana akan dipakai untuk
            <textarea rows={2} className={inputGaya} value={data.tujuan} onChange={(e) => isi('tujuan', e.target.value)} />
          </label>
          <div className="rounded-xl bg-amber-soft p-3 text-sm">
            Cicilan: <b>{rupiah(cicilanPerBulan(data))}/bulan</b> selama {data.tenor} bulan
          </div>
          <Tombol className="w-full" disabled={!valid1} onClick={() => setLangkah(2)}>Lanjut</Tombol>
        </Card>
      )}

      {langkah === 2 && (
        <Card>
          <h2 className="font-bold">Ringkasan Pengajuan</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {[
              ['Usaha', `${data.namaUsaha} (${data.jenis})`],
              ['Lokasi', `Kec. ${data.kecamatan}, Malang`],
              ['Nominal', rupiah(data.nominal)],
              ['Tenor', `${data.tenor} bulan`],
              ['Cicilan', `${rupiah(cicilanPerBulan(data))}/bulan`],
              ['Total dikembalikan', rupiah(data.nominal)],
              ['Tujuan', data.tujuan],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 space-y-1.5 rounded-xl bg-teal-soft p-3 text-xs text-teal">
            {['Bunga 0% — kamu mengembalikan persis sebesar pinjaman', 'Tanpa agunan', 'Dana cair 2 tahap setelah verifikasi & training'].map((t) => (
              <div key={t} className="flex items-center gap-2"><BadgeCheck size={14} /> {t}</div>
            ))}
          </div>
          <Tombol varian="amber" className="mt-4 w-full" onClick={kirim}>Kirim Pengajuan</Tombol>
        </Card>
      )}
    </div>
  );
}
