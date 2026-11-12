import { Check } from 'lucide-react';
import type { Pinjaman, Umkm } from '../data/types';
import { ID_SEMUA_MODUL } from '../data/modul';
import { checklistLengkap } from '../lib/hitung';

// Timeline status pinjaman: Diajukan -> Verifikasi -> Training -> Termin 1 -> Termin 2 -> Lunas.

export function langkahPinjaman(p: Pinjaman, u: Umkm) {
  const cair1 = ['termin1', 'termin2', 'lunas'].includes(p.status);
  const cair2 = ['termin2', 'lunas'].includes(p.status);
  return [
    { label: 'Diajukan', detail: 'Pengajuan diterima tim UrunRembug', selesai: true },
    { label: 'Verifikasi Lapangan', detail: 'Tim mengunjungi tempat usaha', selesai: checklistLengkap(p.checklist) || cair1 },
    { label: 'Training Finansial', detail: `${u.modulSelesai.length}/${ID_SEMUA_MODUL.length} modul selesai`, selesai: ID_SEMUA_MODUL.every((m) => u.modulSelesai.includes(m)) },
    { label: 'Pencairan Termin 1', detail: '50% dana dicairkan', selesai: cair1 },
    { label: 'Pencairan Termin 2', detail: 'Setelah laporan penggunaan termin 1', selesai: cair2 },
    { label: 'Lunas', detail: 'Dana kembali bergulir ke UMKM lain', selesai: p.status === 'lunas' },
  ];
}

export function Timeline({ pinjaman, umkm }: { pinjaman: Pinjaman; umkm: Umkm }) {
  const langkah = langkahPinjaman(pinjaman, umkm);
  const aktif = langkah.findIndex((l) => !l.selesai);
  return (
    <ol className="relative">
      {langkah.map((l, i) => {
        const sekarang = i === aktif;
        return (
          <li key={l.label} className="flex gap-3 pb-4 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ${
                  l.selesai ? 'border-teal bg-teal text-white'
                    : sekarang ? 'border-amber bg-amber-soft text-amber-dark' : 'border-line bg-white text-muted'
                }`}
              >
                {l.selesai ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              {i < langkah.length - 1 && <span className={`mt-1 w-0.5 flex-1 ${l.selesai ? 'bg-teal' : 'bg-line'}`} />}
            </div>
            <div className="pt-0.5">
              <div className={`text-sm font-semibold ${sekarang ? 'text-amber-dark' : l.selesai ? 'text-ink' : 'text-muted'}`}>
                {l.label} {sekarang && <span className="ml-1 rounded-full bg-amber-soft px-2 py-0.5 text-[10px]">sekarang</span>}
              </div>
              <div className="text-xs text-muted">{l.detail}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
