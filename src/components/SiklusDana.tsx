import { rupiahSingkat } from '../lib/format';

// Visual "dana bergulir": 4 titik pada sebuah lingkaran berputar,
// sama seperti panah melingkar di logo UrunRembug.

export function SiklusDana({ masuk, disalurkan, kembali, kas }: { masuk: number; disalurkan: number; kembali: number; kas: number }) {
  // Label diletakkan DI LUAR lingkaran (atas, kanan, bawah, kiri) agar tidak tertimpa panah.
  const titik = [
    { baris: ['Dana masuk'], nilai: masuk, x: 160, y: 40, warna: '#007a75', lx: 160, ly: -6 },
    { baris: ['Disalurkan', 'ke UMKM'], nilai: disalurkan, x: 280, y: 160, warna: '#fea11d', lx: 338, ly: 202 },
    { baris: ['Kembali lewat', 'cicilan'], nilai: kembali, x: 160, y: 280, warna: '#007a75', lx: 160, ly: 328 },
    { baris: ['Siap disalurkan', 'lagi'], nilai: kas, x: 40, y: 160, warna: '#fea11d', lx: -18, ly: 202 },
  ];

  return (
    <svg viewBox="-62 -22 444 370" className="mx-auto w-full max-w-[340px]" role="img" aria-label="Siklus dana bergulir">
      <defs>
        <marker id="panah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#007a75" />
        </marker>
      </defs>
      {/* Lingkaran putus-putus yang berputar pelan = dana terus bergerak */}
      <g className="putar-lambat">
        <circle cx="160" cy="160" r="120" fill="none" stroke="#cfe6e4" strokeWidth="10" strokeDasharray="18 14" />
      </g>
      {/* Panah searah jarum jam di antara titik */}
      {[
        'M 194 46 A 120 120 0 0 1 274 126',
        'M 274 194 A 120 120 0 0 1 194 274',
        'M 126 274 A 120 120 0 0 1 46 194',
        'M 46 126 A 120 120 0 0 1 126 46',
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke="#007a75" strokeWidth="3" markerEnd="url(#panah)" />
      ))}
      <circle cx="160" cy="160" r="38" fill="#fea11d" />
      <text x="160" y="170" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff">Rp</text>
      {titik.map((t) => (
        <g key={t.baris.join(' ')}>
          <circle cx={t.x} cy={t.y} r="30" fill="#fff" stroke={t.warna} strokeWidth="3" />
          <text x={t.x} y={t.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1d2b2a">
            {rupiahSingkat(t.nilai).replace('Rp', '')}
          </text>
          <text x={t.lx} y={t.ly} textAnchor="middle" fontSize="11" fontWeight="600" fill="#64716f">
            {t.baris.map((b, i) => (
              <tspan key={b} x={t.lx} dy={i === 0 ? 0 : 13}>{b}</tspan>
            ))}
          </text>
        </g>
      ))}
    </svg>
  );
}
