import { Link } from 'react-router-dom';
import { BookOpen, FileCheck2, HandCoins, Sparkles } from 'lucide-react';
import { Card, Progres, StatusBadge, Tombol } from '../../components/ui';
import { Timeline } from '../../components/Timeline';
import { useApp } from '../../store/AppState';
import { kirimLaporanTermin1 } from '../../store/actions';
import { ID_SEMUA_MODUL } from '../../data/modul';
import { bisaBayar, cicilanPerBulan, danaCair } from '../../lib/hitung';
import { rupiah } from '../../lib/format';
import { useUmkmDemo } from './UmkmLayout';

export default function Beranda() {
  const { ubah } = useApp();
  const { umkm, pinjaman } = useUmkmDemo();
  const modulLulus = umkm.modulSelesai.length;
  const trainingSelesai = ID_SEMUA_MODUL.every((m) => umkm.modulSelesai.includes(m));
  const punyaPinjamanAktif = pinjaman && pinjaman.status !== 'ditolak';

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted">Halo, Bu {umkm.pemilik.split(' ')[0]} 👋</p>
        <h1 className="text-xl font-bold">{umkm.nama}</h1>
        <p className="text-xs text-muted">{umkm.jenis} · Kec. {umkm.kecamatan}, Malang</p>
      </div>

      {!punyaPinjamanAktif && (
        <div className="rounded-2xl bg-gradient-to-br from-teal to-teal-dark p-5 text-white shadow-md">
          <Sparkles className="text-amber" />
          <h2 className="mt-2 text-lg font-bold">Butuh modal usaha tanpa bunga?</h2>
          <p className="mt-1 text-sm text-white/85">
            Pinjaman 0% dari dana CSR & ZIS. Tanpa agunan, didampingi sampai usahamu tumbuh.
          </p>
          {pinjaman?.status === 'ditolak' && (
            <p className="mt-2 rounded-lg bg-white/15 p-2 text-xs">
              Pengajuan sebelumnya belum dapat disetujui. Kamu bisa mengajukan kembali.
            </p>
          )}
          <Link to="/umkm/ajukan">
            <Tombol varian="amber" className="mt-4 w-full">Ajukan Pinjaman</Tombol>
          </Link>
        </div>
      )}

      {punyaPinjamanAktif && pinjaman && (
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted">Pinjaman 0% bunga</div>
              <div className="text-2xl font-extrabold">{rupiah(pinjaman.nominal)}</div>
              <div className="text-xs text-muted">
                {pinjaman.tenor} bulan · cicilan {rupiah(cicilanPerBulan(pinjaman))}/bulan
              </div>
            </div>
            <StatusBadge status={pinjaman.status} />
          </div>
          {danaCair(pinjaman) > 0 && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>Cicilan dibayar</span>
                <span>{pinjaman.cicilanDibayar}/{pinjaman.tenor}</span>
              </div>
              <Progres nilai={pinjaman.cicilanDibayar / pinjaman.tenor} warna="bg-amber" />
              <div className="mt-1 text-xs text-muted">Dana diterima: {rupiah(danaCair(pinjaman))}</div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {!trainingSelesai && (
              <Link to="/umkm/edukasi"><Tombol varian="amber" className="w-full"><BookOpen size={16} /> Lanjutkan Training ({modulLulus}/{ID_SEMUA_MODUL.length})</Tombol></Link>
            )}
            {pinjaman.status === 'termin1' && !pinjaman.laporanTermin1 && (
              <Tombol
                varian="garis"
                className="w-full"
                onClick={() => ubah((s) => kirimLaporanTermin1(s, pinjaman.id), 'Laporan & foto nota terkirim. Tim akan memproses termin 2.')}
              >
                <FileCheck2 size={16} /> Kirim Laporan Penggunaan Termin 1
              </Tombol>
            )}
            {pinjaman.status === 'termin1' && pinjaman.laporanTermin1 && (
              <p className="rounded-xl bg-teal-soft p-2.5 text-center text-xs font-medium text-teal">
                Laporan terkirim ✓ Menunggu pencairan termin 2
              </p>
            )}
            {bisaBayar(pinjaman) && (
              <Link to="/umkm/cicilan"><Tombol className="w-full"><HandCoins size={16} /> Bayar Cicilan</Tombol></Link>
            )}
          </div>
        </Card>
      )}

      {punyaPinjamanAktif && pinjaman && (
        <Card>
          <h2 className="mb-3 font-bold">Status Pengajuan</h2>
          <Timeline pinjaman={pinjaman} umkm={umkm} />
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Training Finansial</h2>
          <span className="text-xs font-semibold text-teal">{modulLulus}/{ID_SEMUA_MODUL.length} modul</span>
        </div>
        <p className="mb-3 mt-1 text-xs text-muted">Wajib diselesaikan sebelum dana dicairkan.</p>
        <Progres nilai={modulLulus / ID_SEMUA_MODUL.length} />
        <Link to="/umkm/edukasi" className="mt-3 block text-sm font-semibold text-teal">
          {trainingSelesai ? 'Lihat materi lagi →' : 'Mulai belajar →'}
        </Link>
      </Card>
    </div>
  );
}
