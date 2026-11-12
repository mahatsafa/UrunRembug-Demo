import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ClipboardCheck, Landmark, RotateCcw, Store } from 'lucide-react';
import { BadgePrototipe, Toast } from '../components/Layout';
import { useApp } from '../store/AppState';
import { rupiah } from '../lib/format';
import { ringkasan } from '../lib/hitung';

const PERAN = [
  { ke: '/umkm', judul: 'Saya UMKM', isi: 'Ajukan modal 0% bunga, belajar keuangan, bayar cicilan.', ikon: Store, warna: 'bg-amber-soft text-amber-dark' },
  { ke: '/admin', judul: 'Saya Admin', isi: 'Verifikasi lapangan dan setujui pencairan dana.', ikon: ClipboardCheck, warna: 'bg-blue-50 text-blue-700' },
  { ke: '/donor', judul: 'Saya Donor CSR', isi: 'Pantau dana bergulir dan dampaknya secara real-time.', ikon: Landmark, warna: 'bg-teal-soft text-teal' },
];

export default function Landing() {
  const { state, reset } = useApp();
  const r = ringkasan(state);
  const [yakin, setYakin] = useState(false); // klik dua kali untuk reset, agar tidak terhapus tanpa sengaja

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-[#f7faf9] shadow-xl">
      <BadgePrototipe />
      <div className="px-5 pb-10 pt-8">
        <img src="/logo-panjang.png" alt="UrunRembug — Fair Funding for the Backbone of Indonesia" className="mx-auto w-full max-w-[320px]" />

        <p className="mt-6 text-center text-[15px] leading-relaxed text-muted">
          Dana <b className="text-teal">CSR & ZIS</b> dipinjamkan ke UMKM <b className="text-amber-dark">tanpa bunga</b>,
          dikembalikan, lalu <b className="text-ink">bergulir</b> ke UMKM berikutnya.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-teal p-3 text-white">
            <div className="text-[11px] opacity-80">Kas bergulir</div>
            <div className="text-base font-extrabold">{rupiah(r.kasBergulir)}</div>
          </div>
          <div className="rounded-2xl bg-amber p-3 text-ink">
            <div className="text-[11px] opacity-80">UMKM dibiayai</div>
            <div className="text-base font-extrabold">{r.jumlahDibiayai} usaha</div>
          </div>
        </div>

        <h2 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wide text-muted">Masuk sebagai</h2>
        <div className="space-y-3">
          {PERAN.map(({ ke, judul, isi, ikon: Ikon, warna }) => (
            <Link
              key={ke}
              to={ke}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${warna}`}>
                <Ikon size={24} />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-ink">{judul}</span>
                <span className="block text-xs text-muted">{isi}</span>
              </span>
              <ChevronRight className="text-muted" size={20} />
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-line p-4 text-xs text-muted">
          <b className="text-ink">Tips demo:</b> buka <b>/admin</b> dan <b>/donor</b> di dua jendela berdampingan.
          Aksi di satu jendela langsung mengubah jendela lainnya.
        </div>

        <button
          onClick={() => {
            if (yakin) { reset(); setYakin(false); } else setYakin(true);
          }}
          className={`mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold ${yakin ? 'text-red-600' : 'text-muted hover:text-ink'}`}
        >
          <RotateCcw size={13} /> {yakin ? 'Yakin? Klik sekali lagi untuk reset' : 'Reset data demo'}
        </button>

        <p className="mt-6 text-center text-[11px] text-muted">
          Tim Inovasi Generasi · SMK Telkom Malang · Moklet Idea Challenge 2026
        </p>
      </div>
      <Toast />
    </div>
  );
}
