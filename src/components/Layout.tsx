import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowLeftRight, FlaskConical } from 'lucide-react';
import { useApp } from '../store/AppState';

export type ItemNav = { ke: string; label: string; ikon: ReactNode };

// Badge kejujuran: wajib terlihat di semua halaman.
export function BadgePrototipe() {
  return (
    <div className="no-print flex items-center justify-center gap-1.5 bg-amber-soft px-3 py-1 text-[11px] font-semibold text-amber-dark">
      <FlaskConical size={12} /> Prototipe — data simulasi
    </div>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div key={toast.id} className="masuk max-w-sm rounded-2xl bg-ink px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
        {toast.pesan}
      </div>
    </div>
  );
}

/**
 * Kerangka halaman untuk setiap peran.
 * lebar="hp" -> kolom 430px (cocok untuk rekaman 9:16).
 * lebar="lebar" -> melebar di layar besar (dashboard donor).
 */
export function Layout({
  peran, nav, children, lebar = 'hp',
}: {
  peran: string;
  nav?: ItemNav[];
  children: ReactNode;
  lebar?: 'hp' | 'lebar';
}) {
  const maks = lebar === 'hp' ? 'max-w-[430px]' : 'max-w-[430px] lg:max-w-6xl';
  return (
    <div className={`mx-auto min-h-screen ${maks} bg-[#f7faf9] shadow-xl`}>
      <BadgePrototipe />
      <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/95 px-4 py-2.5 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icon.png" alt="Logo UrunRembug" className="h-8 w-auto" />
          <span className="text-base font-extrabold">
            <span className="text-teal">Urun</span>
            <span className="text-amber">Rembug</span>
          </span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1.5 text-xs font-semibold text-teal"
          title="Ganti peran"
        >
          {peran} <ArrowLeftRight size={13} />
        </Link>
      </header>

      <main className={`px-4 pt-4 ${nav ? 'pb-28' : 'pb-10'}`}>{children}</main>

      {nav && (
        <nav className={`no-print fixed inset-x-0 bottom-0 z-30 mx-auto ${maks} border-t border-line bg-white`}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${nav.length}, 1fr)` }}>
            {nav.map((n) => (
              <NavLink
                key={n.ke}
                to={n.ke}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${isActive ? 'text-teal' : 'text-muted'}`
                }
              >
                {n.ikon}
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
      <Toast />
    </div>
  );
}
