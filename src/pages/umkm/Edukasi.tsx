import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { Card, Judul, Progres } from '../../components/ui';
import { MODUL } from '../../data/modul';
import { useUmkmDemo } from './UmkmLayout';

export default function Edukasi() {
  const { umkm } = useUmkmDemo();
  const lulus = umkm.modulSelesai.length;

  return (
    <div>
      <Judul sub="Selesaikan 3 modul singkat. Lulus kuis = training selesai.">Edukasi Finansial</Judul>
      <Card className="mb-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold">Progres training</span>
          <span className="text-teal">{lulus}/{MODUL.length}</span>
        </div>
        <Progres nilai={lulus / MODUL.length} />
      </Card>
      <div className="space-y-3">
        {MODUL.map((m, i) => {
          const selesai = umkm.modulSelesai.includes(m.id);
          return (
            <Link key={m.id} to={`/umkm/edukasi/${m.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-extrabold ${selesai ? 'bg-teal text-white' : 'bg-amber-soft text-amber-dark'}`}>
                {selesai ? <CheckCircle2 size={22} /> : i + 1}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{m.judul}</span>
                <span className="block text-xs text-muted">{m.ringkas}</span>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-muted"><Clock size={11} /> {m.durasi} · 3 soal</span>
              </span>
              <ChevronRight size={18} className="text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
