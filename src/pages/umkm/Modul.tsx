import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Tombol } from '../../components/ui';
import { MODUL } from '../../data/modul';
import { ID_UMKM_DEMO } from '../../data/seed';
import { useApp } from '../../store/AppState';
import { lulusModul } from '../../store/actions';

export default function Modul() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ubah } = useApp();
  const modul = MODUL.find((m) => m.id === id);
  const [tahap, setTahap] = useState<'materi' | 'kuis'>('materi');
  const [jawaban, setJawaban] = useState<(number | null)[]>([null, null, null]);
  const [dicek, setDicek] = useState(false);

  if (!modul) return <p>Modul tidak ditemukan. <Link to="/umkm/edukasi" className="text-teal">Kembali</Link></p>;

  const semuaBenar = modul.soal.every((s, i) => jawaban[i] === s.benar);
  const semuaDijawab = jawaban.every((j) => j !== null);

  const periksa = () => {
    setDicek(true);
    if (semuaBenar) ubah((s) => lulusModul(s, ID_UMKM_DEMO, modul.id), `Selamat! Modul "${modul.judul}" selesai 🎉`);
  };

  return (
    <div>
      <button onClick={() => navigate('/umkm/edukasi')} className="mb-3 flex items-center gap-1 text-sm font-semibold text-muted">
        <ArrowLeft size={16} /> Semua modul
      </button>
      <h1 className="text-xl font-bold">{modul.judul}</h1>
      <p className="mb-4 text-sm text-muted">{modul.ringkas}</p>

      {tahap === 'materi' && (
        <div className="space-y-3">
          {modul.kartu.map((k, i) => (
            <Card key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-soft text-sm font-bold text-amber-dark">{i + 1}</span>
              <p className="text-sm leading-relaxed">{k}</p>
            </Card>
          ))}
          <Tombol className="w-full" onClick={() => setTahap('kuis')}>Mulai Kuis</Tombol>
        </div>
      )}

      {tahap === 'kuis' && (
        <div className="space-y-3">
          {modul.soal.map((s, i) => (
            <Card key={i}>
              <p className="mb-2 text-sm font-semibold">{i + 1}. {s.tanya}</p>
              <div className="space-y-2">
                {s.pilihan.map((p, j) => {
                  const dipilih = jawaban[i] === j;
                  const benar = dicek && j === s.benar && dipilih;
                  const salah = dicek && dipilih && j !== s.benar;
                  return (
                    <button
                      key={j}
                      onClick={() => { setDicek(false); setJawaban((a) => a.map((x, k) => (k === i ? j : x))); }}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm ${
                        benar ? 'border-teal bg-teal-soft' : salah ? 'border-red-300 bg-red-50' : dipilih ? 'border-teal bg-teal-soft/50' : 'border-line'
                      }`}
                    >
                      {p}
                      {benar && <CheckCircle2 size={16} className="text-teal" />}
                      {salah && <XCircle size={16} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
              {dicek && jawaban[i] === s.benar && <p className="mt-2 text-xs text-teal">{s.penjelasan}</p>}
              {dicek && jawaban[i] !== s.benar && <p className="mt-2 text-xs text-red-600">Belum tepat, coba pilih jawaban lain.</p>}
            </Card>
          ))}

          {dicek && semuaBenar ? (
            <Tombol varian="amber" className="w-full" onClick={() => navigate('/umkm/edukasi')}>Lanjut ke modul lain</Tombol>
          ) : (
            <Tombol className="w-full" disabled={!semuaDijawab} onClick={periksa}>Periksa Jawaban</Tombol>
          )}
        </div>
      )}
    </div>
  );
}
