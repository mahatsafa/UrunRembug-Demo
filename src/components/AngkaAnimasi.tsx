import { useEffect, useRef, useState, type ReactNode } from 'react';

// Angka yang "berlari" dari nilai lama ke nilai baru, plus kilatan pada kartu.
// Dipakai di dashboard Donor supaya perubahan real-time terlihat jelas di video.

export function useAngkaBerlari(target: number, durasi = 900) {
  const [tampil, setTampil] = useState(target);
  const dari = useRef(target);

  useEffect(() => {
    const awal = dari.current;
    if (awal === target) return;
    const mulai = performance.now();
    let frame = 0;
    const langkah = (t: number) => {
      const k = Math.min(1, (t - mulai) / durasi);
      const halus = 1 - Math.pow(1 - k, 3); // ease-out
      setTampil(awal + (target - awal) * halus);
      if (k < 1) frame = requestAnimationFrame(langkah);
      else dari.current = target;
    };
    frame = requestAnimationFrame(langkah);
    return () => {
      cancelAnimationFrame(frame);
      dari.current = target;
    };
  }, [target, durasi]);

  return tampil;
}

export function KpiCard({
  label, nilai, format, ikon, aksen = 'teal', keterangan,
}: {
  label: string;
  nilai: number;
  format: (n: number) => string;
  ikon: ReactNode;
  aksen?: 'teal' | 'amber';
  keterangan?: string;
}) {
  const tampil = useAngkaBerlari(nilai);
  const [kunciKilat, setKunciKilat] = useState(0);
  const sebelumnya = useRef(nilai);

  useEffect(() => {
    if (sebelumnya.current !== nilai) {
      sebelumnya.current = nilai;
      setKunciKilat((k) => k + 1); // ganti key -> animasi CSS diputar ulang
    }
  }, [nilai]);

  return (
    <div key={kunciKilat} className={`rounded-2xl border border-line bg-white p-3.5 shadow-sm ${kunciKilat ? 'kilat' : ''}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${aksen === 'teal' ? 'bg-teal-soft text-teal' : 'bg-amber-soft text-amber-dark'}`}>
          {ikon}
        </span>
        {label}
      </div>
      <div className="mt-2 text-lg font-extrabold tracking-tight text-ink tabular-nums">{format(tampil)}</div>
      {keterangan && <div className="mt-0.5 text-[11px] text-muted">{keterangan}</div>}
    </div>
  );
}
