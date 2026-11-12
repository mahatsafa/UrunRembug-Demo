import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import UmkmLayout from './pages/umkm/UmkmLayout';
import Beranda from './pages/umkm/Beranda';
import Ajukan from './pages/umkm/Ajukan';
import Edukasi from './pages/umkm/Edukasi';
import Modul from './pages/umkm/Modul';
import Cicilan from './pages/umkm/Cicilan';
import Catat from './pages/umkm/Catat';
import Antrean from './pages/admin/Antrean';
import Detail from './pages/admin/Detail';
import Dashboard from './pages/donor/Dashboard';
import Laporan from './pages/donor/Laporan';

// Daftar semua halaman (route). URL -> komponen yang ditampilkan.

function GulirKeAtas() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminLayout() {
  return (
    <Layout peran="Admin">
      <Outlet />
    </Layout>
  );
}

// key={id} membuat halaman detail "mulai dari nol" saat pindah ke pengajuan lain.
function DetailBerkunci() {
  const { id } = useParams();
  return <Detail key={id} />;
}

export default function App() {
  return (
    <>
      <GulirKeAtas />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/umkm" element={<UmkmLayout />}>
          <Route index element={<Beranda />} />
          <Route path="ajukan" element={<Ajukan />} />
          <Route path="edukasi" element={<Edukasi />} />
          <Route path="edukasi/:id" element={<Modul />} />
          <Route path="cicilan" element={<Cicilan />} />
          <Route path="catat" element={<Catat />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Antrean />} />
          <Route path=":id" element={<DetailBerkunci />} />
        </Route>
        <Route path="/donor" element={<Dashboard />} />
        <Route path="/donor/laporan" element={<Laporan />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
