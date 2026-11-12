import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle2, CircleAlert, ImageIcon } from 'lucide-react';
import { Card, Progres, StatusBadge, Tombol } from '../../components/ui';
import { useApp } from '../../store/AppState';
import { bolehDisetujui, cairkanTermin2, setChecklist, setujui, tolak } from '../../store/actions';
import { ID_SEMUA_MODUL } from '../../data/modul';
import type { Checklist } from '../../data/types';
import { checklistLengkap, cicilanPerBulan } from '../../lib/hitung';
import { rupiah, tanggal } from '../../lib/format';

const ITEM_CHECKLIST: { kunci: keyof Checklist; label: string }[] = [
  { kunci: 'lokasi', label: 'Lokasi usaha sesuai alamat' },
  { kunci: 'usahaBerjalan', label: 'Usaha benar-benar beroperasi' },
  { kunci: 'dokumen', label: 'KTP & surat keterangan usaha lengkap' },
  { kunci: 'foto', label: 'Foto tempat usaha diambil' },
];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, ubah } = useApp();
  const p = state.pinjaman.find((x) => x.id === id);
  const [catatan, setCatatan] = useState(p?.catatanVerifikator ?? '');

  if (!p) return <p>Pengajuan tidak ditemukan. <Link className="text-teal" to="/admin">Kembali</Link></p>;
  const u = state.umkm.find((x) => x.id === p.umkmId)!;
  const lulusTraining = ID_SEMUA_MODUL.every((m) => u.modulSelesai.includes(m));
  const bisaDiubah = p.status === 'diajukan' || p.status === 'verifikasi';
  const lengkap = checklistLengkap(p.checklist);

  const centang = (k: keyof Checklist) => ubah((s) => setChecklist(s, p.id, { ...p.checklist, [k]: !p.checklist[k] }, catatan));

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-1 text-sm font-semibold text-muted">
        <ArrowLeft size={16} /> Antrean
      </button>

      <Card>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold">{u.nama}</h1>
            <p className="text-xs text-muted">{u.pemilik} · {u.jenis} · Kec. {u.kecamatan}</p>
          </div>
          <StatusBadge status={p.status} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted">Nominal</dt><dd className="text-right font-semibold">{rupiah(p.nominal)}</dd>
          <dt className="text-muted">Tenor</dt><dd className="text-right font-semibold">{p.tenor} bulan</dd>
          <dt className="text-muted">Cicilan</dt><dd className="text-right font-semibold">{rupiah(cicilanPerBulan(p))}/bln</dd>
          <dt className="text-muted">Omzet/bulan</dt><dd className="text-right font-semibold">{rupiah(u.omzetSebelum)}</dd>
          <dt className="text-muted">Diajukan</dt><dd className="text-right font-semibold">{tanggal(p.tanggalAjuan)}</dd>
        </dl>
        <p className="mt-3 rounded-xl bg-[#f7faf9] p-3 text-sm"><span className="text-muted">Tujuan: </span>{p.tujuan}</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Training Finansial</h2>
          {lulusTraining
            ? <span className="flex items-center gap-1 text-xs font-semibold text-teal"><CheckCircle2 size={14} /> Lulus</span>
            : <span className="text-xs font-semibold text-amber-dark">{u.modulSelesai.length}/{ID_SEMUA_MODUL.length} modul</span>}
        </div>
        <div className="mt-2"><Progres nilai={u.modulSelesai.length / ID_SEMUA_MODUL.length} /></div>
      </Card>

      <Card>
        <h2 className="mb-2 font-bold">Checklist Verifikasi Lapangan</h2>
        <div className="space-y-2">
          {ITEM_CHECKLIST.map(({ kunci, label }) => (
            <label key={kunci} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${p.checklist[kunci] ? 'border-teal bg-teal-soft' : 'border-line'} ${!bisaDiubah ? 'pointer-events-none opacity-70' : ''}`}>
              <input type="checkbox" className="h-4 w-4 accent-teal" checked={p.checklist[kunci]} onChange={() => centang(kunci)} disabled={!bisaDiubah} />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`grid aspect-square place-items-center rounded-xl border border-dashed ${p.checklist.foto ? 'border-teal bg-teal-soft text-teal' : 'border-line text-muted'}`}>
              {p.checklist.foto ? <ImageIcon size={22} /> : <Camera size={20} />}
            </div>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-muted">Foto lapangan (simulasi)</p>
        <textarea
          rows={2}
          placeholder="Catatan verifikator..."
          className="mt-3 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-teal"
          value={catatan}
          disabled={!bisaDiubah}
          onChange={(e) => setCatatan(e.target.value)}
          onBlur={() => bisaDiubah && ubah((s) => setChecklist(s, p.id, p.checklist, catatan))}
        />
      </Card>

      {bisaDiubah && (
        <Card className="space-y-2">
          {!bolehDisetujui(state, p) && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-soft p-3 text-xs text-amber-dark">
              <CircleAlert size={16} className="shrink-0" />
              <span>
                Belum bisa disetujui:
                {!lengkap && ' checklist lapangan belum lengkap.'}
                {!lulusTraining && ' UMKM belum lulus training.'}
              </span>
            </div>
          )}
          <Tombol
            className="w-full"
            disabled={!bolehDisetujui(state, p)}
            onClick={() => ubah((s) => setujui(s, p.id), `Disetujui! Termin 1 ${rupiah(p.nominal / 2)} dicairkan ke ${u.nama}`)}
          >
            Setujui & Cairkan Termin 1 ({rupiah(p.nominal / 2)})
          </Tombol>
          <Tombol varian="bahaya" className="w-full" onClick={() => ubah((s) => tolak(s, p.id), 'Pengajuan ditandai belum dapat disetujui')}>
            Tolak
          </Tombol>
        </Card>
      )}

      {p.status === 'termin1' && (
        <Card className="space-y-2">
          <h2 className="font-bold">Pencairan Termin 2</h2>
          <p className="text-sm text-muted">
            {p.laporanTermin1
              ? 'UMKM sudah mengirim laporan penggunaan dana termin 1 beserta foto nota.'
              : 'Menunggu UMKM mengirim laporan penggunaan dana termin 1.'}
          </p>
          <Tombol
            varian="amber"
            className="w-full"
            disabled={!p.laporanTermin1}
            onClick={() => ubah((s) => cairkanTermin2(s, p.id), `Termin 2 ${rupiah(p.nominal / 2)} dicairkan`)}
          >
            Cairkan Termin 2 ({rupiah(p.nominal / 2)})
          </Tombol>
        </Card>
      )}

      {(p.status === 'termin2' || p.status === 'lunas' || p.status === 'termin1') && (
        <Card>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-semibold">Cicilan</span>
            <span>{p.cicilanDibayar}/{p.tenor}</span>
          </div>
          <Progres nilai={p.cicilanDibayar / p.tenor} warna="bg-amber" />
        </Card>
      )}
    </div>
  );
}
