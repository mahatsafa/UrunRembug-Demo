import { Outlet } from 'react-router-dom';
import { BookOpen, CalendarCheck, Home, NotebookPen } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { useApp } from '../../store/AppState';
import { ID_UMKM_DEMO } from '../../data/seed';
import { pinjamanDemo } from '../../store/actions';

// Semua halaman UMKM memakai kerangka & menu bawah yang sama.
export default function UmkmLayout() {
  return (
    <Layout
      peran="UMKM"
      nav={[
        { ke: '/umkm', label: 'Beranda', ikon: <Home size={20} /> },
        { ke: '/umkm/edukasi', label: 'Edukasi', ikon: <BookOpen size={20} /> },
        { ke: '/umkm/cicilan', label: 'Cicilan', ikon: <CalendarCheck size={20} /> },
        { ke: '/umkm/catat', label: 'Catat Kas', ikon: <NotebookPen size={20} /> },
      ]}
    >
      <Outlet />
    </Layout>
  );
}

/** Data UMKM demo (Keripik Tempe Bu Sari) dan pinjamannya. */
export function useUmkmDemo() {
  const { state } = useApp();
  const umkm = state.umkm.find((u) => u.id === ID_UMKM_DEMO)!;
  return { umkm, pinjaman: pinjamanDemo(state) };
}
