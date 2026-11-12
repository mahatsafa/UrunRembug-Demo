import { Link } from 'react-router-dom';
import { Check, HandCoins, PartyPopper } from 'lucide-react';
import { Card, Judul, Progres, Tombol } from '../../components/ui';
import { useApp } from '../../store/AppState';
import { bayarCicilan } from '../../store/actions';
import { bisaBayar, cicilanPerBulan, danaCair } from '../../lib/hitung';
import { rupiah } from '../../lib/format';
import { useUmkmDemo } from './UmkmLayout';

export default function Cicilan() {
  const { ubah } = useApp();
  const { pinjaman } = useUmkmDemo();

  if (!pinjaman || danaCair(pinjaman) === 0) {
    return (
      <div>
        <Judul>Cicilan</Judul>
        <Card className="text-center text-sm text-muted">
          Belum ada pinjaman yang dicairkan.
          <Link to="/umkm" className="mt-2 block font-semibold text-teal">Kembali ke beranda →</Link>
        </Card>
      </div>
    );
  }

  const cicilan = cicilanPerBulan(pinjaman);
  const ke = pinjaman.cicilanDibayar + 1;

  const bayar = () =>
    ubah(
      (s) => bayarCicilan(s, pinjaman.id),
      ke >= pinjaman.tenor
        ? 'LUNAS! Terima kasih, danamu kini membantu UMKM lain 🎉'
        : 'Cicilanmu kembali ke dana bergulir dan akan membantu UMKM berikutnya 💚',
    );

  return (
    <div>
      <Judul sub="Tanpa bunga. Yang kamu bayar kembali ke kas bergulir.">Cicilan</Judul>

      <Card className="mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Sisa pinjaman</span>
          <b>{rupiah(pinjaman.nominal - pinjaman.cicilanDibayar * cicilan)}</b>
        </div>
        <div className="my-2"><Progres nilai={pinjaman.cicilanDibayar / pinjaman.tenor} warna="bg-amber" /></div>
        <div className="text-xs text-muted">{pinjaman.cicilanDibayar} dari {pinjaman.tenor} cicilan dibayar</div>

        {bisaBayar(pinjaman) ? (
          <Tombol className="mt-4 w-full" onClick={bayar}>
            <HandCoins size={16} /> Bayar Cicilan ke-{ke} · {rupiah(cicilan)} <span className="text-[10px] opacity-80">(simulasi)</span>
          </Tombol>
        ) : pinjaman.status === 'lunas' ? (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            <PartyPopper size={18} /> Pinjaman lunas!
          </div>
        ) : null}
      </Card>

      <h2 className="mb-2 text-sm font-bold">Jadwal Cicilan</h2>
      <div className="space-y-2">
        {Array.from({ length: pinjaman.tenor }, (_, i) => {
          const lunas = i < pinjaman.cicilanDibayar;
          const berikut = i === pinjaman.cicilanDibayar;
          return (
            <div key={i} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${berikut ? 'border-amber bg-amber-soft' : 'border-line bg-white'}`}>
              <span className="flex items-center gap-2">
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${lunas ? 'bg-teal text-white' : 'bg-line text-muted'}`}>
                  {lunas ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                Cicilan ke-{i + 1}
              </span>
              <span className={lunas ? 'text-teal' : berikut ? 'font-semibold text-amber-dark' : 'text-muted'}>
                {lunas ? 'Lunas' : rupiah(cicilan)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
