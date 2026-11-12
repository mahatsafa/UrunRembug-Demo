import { describe, expect, it } from 'vitest';
import { buatSeed, ID_UMKM_DEMO } from '../src/data/seed';
import { ID_SEMUA_MODUL } from '../src/data/modul';
import {
  ajukanPinjaman, bayarCicilan, bolehDisetujui, cairkanTermin2, kirimLaporanTermin1,
  lulusModul, pinjamanDemo, setChecklist, setujui,
} from '../src/store/actions';
import { ringkasan } from '../src/lib/hitung';
import { rupiah } from '../src/lib/format';

// Uji otomatis untuk logika bisnis. Jalankan: npm test

const lengkap = { lokasi: true, usahaBerjalan: true, dokumen: true, foto: true };

describe('data awal', () => {
  it('angka konsisten dengan proposal', () => {
    const r = ringkasan(buatSeed());
    expect(r.totalMasuk).toBe(100_000_000);
    expect(r.totalDisalurkan).toBe(16_500_000);
    expect(r.totalKembali).toBe(8_350_000);
    expect(r.kasBergulir).toBe(91_850_000);
    expect(r.tingkatPengembalian).toBeGreaterThan(0.9);
    expect(r.tingkatPengembalian).toBeLessThan(0.93);
  });

  it('riwayat pengembalian per bulan sama dengan total cicilan dibayar', () => {
    const s = buatSeed();
    const total = s.riwayatPengembalian.reduce((a, b) => a + b.nominal, 0);
    expect(total).toBe(ringkasan(s).totalKembali);
  });
});

describe('alur demo lengkap', () => {
  it('ajukan -> training -> verifikasi -> cair -> bayar mengubah angka donor', () => {
    let s = buatSeed();
    s = ajukanPinjaman(s, {
      namaUsaha: 'Keripik Tempe Bu Sari', jenis: 'Makanan ringan', kecamatan: 'Sukun',
      omzet: 3_500_000, nominal: 2_000_000, tenor: 10, tujuan: 'Spinner dan kemasan',
    });
    const p = pinjamanDemo(s)!;
    expect(p.status).toBe('diajukan');

    // Checklist lengkap tetapi belum training -> belum boleh disetujui.
    s = setChecklist(s, p.id, lengkap, '');
    expect(bolehDisetujui(s, pinjamanDemo(s)!)).toBe(false);
    expect(setujui(s, p.id)).toBe(s);

    for (const m of ID_SEMUA_MODUL) s = lulusModul(s, ID_UMKM_DEMO, m);
    expect(bolehDisetujui(s, pinjamanDemo(s)!)).toBe(true);

    const kasSebelum = ringkasan(s).kasBergulir;
    s = setujui(s, p.id);
    expect(pinjamanDemo(s)!.status).toBe('termin1');
    expect(ringkasan(s).kasBergulir).toBe(kasSebelum - 1_000_000);

    // Termin 2 hanya setelah laporan penggunaan termin 1.
    expect(cairkanTermin2(s, p.id)).toBe(s);
    s = kirimLaporanTermin1(s, p.id);
    s = cairkanTermin2(s, p.id);
    expect(pinjamanDemo(s)!.status).toBe('termin2');

    const sebelumBayar = ringkasan(s);
    s = bayarCicilan(s, p.id);
    const sesudahBayar = ringkasan(s);
    expect(sesudahBayar.totalKembali).toBe(sebelumBayar.totalKembali + 200_000);
    expect(sesudahBayar.kasBergulir).toBe(sebelumBayar.kasBergulir + 200_000);
    expect(s.aktivitas[0].teks).toContain('cicilan ke-1');
  });

  it('cicilan terakhir membuat status lunas dan tidak bisa bayar lagi', () => {
    let s = buatSeed();
    // p8: Nasi Pecel, tenor 5, sudah bayar 1 kali, status termin1
    for (let i = 0; i < 4; i++) s = bayarCicilan(s, 'p8');
    const p8 = s.pinjaman.find((p) => p.id === 'p8')!;
    expect(p8.status).toBe('lunas');
    expect(bayarCicilan(s, 'p8')).toBe(s);
  });
});

describe('format', () => {
  it('rupiah memakai titik ribuan', () => {
    expect(rupiah(2_000_000)).toBe('Rp2.000.000');
    expect(rupiah(Number.NaN)).toBe('Rp0');
  });
});
