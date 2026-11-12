import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, Judul, Tombol } from '../../components/ui';
import { useApp } from '../../store/AppState';
import { tambahTransaksi } from '../../store/actions';
import { rupiah, rupiahSingkat, tanggalLokal } from '../../lib/format';

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const inputGaya = 'w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-teal';

export default function Catat() {
  const { state, ubah } = useApp();
  const [tipe, setTipe] = useState<'masuk' | 'keluar'>('masuk');
  const [nominal, setNominal] = useState('');
  const [ket, setKet] = useState('');

  // Kelompokkan transaksi 7 hari terakhir per tanggal untuk grafik.
  const grafik = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const iso = tanggalLokal(6 - i);
      const d = new Date(`${iso}T12:00:00`);
      const hariIni = state.transaksiDemo.filter((t) => t.tanggal === iso);
      return {
        hari: HARI[d.getDay()],
        Masuk: hariIni.filter((t) => t.tipe === 'masuk').reduce((s, t) => s + t.nominal, 0),
        Keluar: hariIni.filter((t) => t.tipe === 'keluar').reduce((s, t) => s + t.nominal, 0),
      };
    });
  }, [state.transaksiDemo]);

  const masuk = grafik.reduce((s, g) => s + g.Masuk, 0);
  const keluar = grafik.reduce((s, g) => s + g.Keluar, 0);
  const angka = Number(nominal);

  const simpan = () => {
    ubah((s) => tambahTransaksi(s, { tanggal: tanggalLokal(), tipe, nominal: angka, keterangan: ket || (tipe === 'masuk' ? 'Penjualan' : 'Belanja') }), 'Transaksi tercatat ✓');
    setNominal('');
    setKet('');
  };

  const terbaru = [...state.transaksiDemo].reverse().slice(0, 6);

  return (
    <div className="space-y-4">
      <Judul sub="Catat setiap uang masuk & keluar. Ini juga melatih kebiasaan dari modul edukasi.">Catat Kas Harian</Judul>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="!p-3"><div className="text-[11px] text-muted">Masuk 7 hari</div><div className="text-sm font-bold text-teal">{rupiahSingkat(masuk)}</div></Card>
        <Card className="!p-3"><div className="text-[11px] text-muted">Keluar 7 hari</div><div className="text-sm font-bold text-amber-dark">{rupiahSingkat(keluar)}</div></Card>
        <Card className="!p-3"><div className="text-[11px] text-muted">Untung</div><div className="text-sm font-bold">{rupiahSingkat(masuk - keluar)}</div></Card>
      </div>

      <Card>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafik} margin={{ left: -18, right: 4, top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e9e8" />
              <XAxis dataKey="hari" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => rupiah(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Masuk" fill="#007a75" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Keluar" fill="#fea11d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-bold">Tambah Catatan</h2>
        <div className="grid grid-cols-2 gap-2">
          {(['masuk', 'keluar'] as const).map((t) => (
            <button key={t} onClick={() => setTipe(t)}
              className={`rounded-xl border py-2 text-sm font-semibold ${tipe === t ? (t === 'masuk' ? 'border-teal bg-teal-soft text-teal' : 'border-amber bg-amber-soft text-amber-dark') : 'border-line text-muted'}`}>
              {t === 'masuk' ? 'Uang Masuk' : 'Uang Keluar'}
            </button>
          ))}
        </div>
        <input className={inputGaya} type="number" inputMode="numeric" placeholder="Nominal (Rp)" value={nominal} onChange={(e) => setNominal(e.target.value)} />
        <input className={inputGaya} placeholder="Keterangan (mis. jual 20 bungkus)" value={ket} onChange={(e) => setKet(e.target.value)} />
        <Tombol className="w-full" disabled={!(angka > 0)} onClick={simpan}>Simpan</Tombol>
      </Card>

      <Card>
        <h2 className="mb-2 font-bold">Catatan Terbaru</h2>
        <ul className="divide-y divide-line text-sm">
          {terbaru.map((t) => (
            <li key={t.id} className="flex justify-between py-2">
              <span>{t.keterangan}</span>
              <span className={t.tipe === 'masuk' ? 'font-semibold text-teal' : 'font-semibold text-amber-dark'}>
                {t.tipe === 'masuk' ? '+' : '−'}{rupiah(t.nominal)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
