import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { StatusPinjaman } from '../data/types';

// Komponen tampilan kecil yang dipakai berulang di banyak halaman.

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

type Varian = 'utama' | 'amber' | 'garis' | 'bahaya';

export function Tombol({
  varian = 'utama', className = '', ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { varian?: Varian }) {
  const gaya: Record<Varian, string> = {
    utama: 'bg-teal text-white hover:bg-teal-dark',
    amber: 'bg-amber text-ink hover:bg-amber-dark',
    garis: 'border border-teal text-teal bg-white hover:bg-teal-soft',
    bahaya: 'border border-red-300 text-red-600 bg-white hover:bg-red-50',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition
        disabled:cursor-not-allowed disabled:opacity-40 ${gaya[varian]} ${className}`}
    />
  );
}

export const LABEL_STATUS: Record<StatusPinjaman, string> = {
  diajukan: 'Baru',
  verifikasi: 'Diverifikasi',
  termin1: 'Termin 1 cair',
  termin2: 'Dana cair penuh',
  lunas: 'Lunas',
  ditolak: 'Ditolak',
};

export function StatusBadge({ status }: { status: StatusPinjaman }) {
  const warna: Record<StatusPinjaman, string> = {
    diajukan: 'bg-amber-soft text-amber-dark',
    verifikasi: 'bg-blue-50 text-blue-700',
    termin1: 'bg-teal-soft text-teal',
    termin2: 'bg-teal-soft text-teal',
    lunas: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-red-50 text-red-600',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${warna[status]}`}>{LABEL_STATUS[status]}</span>;
}

export function Judul({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-3">
      <h1 className="text-xl font-bold text-ink">{children}</h1>
      {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export function Progres({ nilai, warna = 'bg-teal' }: { nilai: number; warna?: string }) {
  const p = Math.max(0, Math.min(1, nilai));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
      <div className={`h-full rounded-full ${warna} transition-all duration-700`} style={{ width: `${p * 100}%` }} />
    </div>
  );
}
