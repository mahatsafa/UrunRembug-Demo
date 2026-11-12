// Bentuk data (model) yang dipakai seluruh aplikasi.
// Semua data hanyalah SIMULASI untuk keperluan demo MIC 2026.

export type StatusPinjaman =
  | 'diajukan' // UMKM baru mengirim pengajuan
  | 'verifikasi' // admin sedang mengisi checklist lapangan
  | 'termin1' // disetujui, 50% dana sudah cair
  | 'termin2' // 100% dana sudah cair
  | 'lunas' // semua cicilan sudah dibayar
  | 'ditolak';

export type Checklist = {
  lokasi: boolean; // lokasi usaha sesuai alamat
  usahaBerjalan: boolean; // usaha benar-benar beroperasi
  dokumen: boolean; // KTP & surat keterangan usaha lengkap
  foto: boolean; // foto tempat usaha sudah diambil
};

export type Umkm = {
  id: string;
  nama: string; // nama usaha
  pemilik: string;
  jenis: string;
  kecamatan: string;
  omzetSebelum: number; // omzet per bulan sebelum bergabung
  omzetSekarang: number; // omzet per bulan saat ini
  modulSelesai: string[]; // id modul edukasi yang sudah lulus
};

export type Pinjaman = {
  id: string;
  umkmId: string;
  nominal: number;
  tenor: 5 | 10; // jumlah bulan cicilan
  tujuan: string;
  status: StatusPinjaman;
  checklist: Checklist;
  catatanVerifikator: string;
  laporanTermin1: boolean; // UMKM sudah melaporkan penggunaan termin 1
  cicilanDibayar: number; // berapa kali sudah membayar
  cicilanJatuhTempo: number; // berapa cicilan yang seharusnya sudah dibayar
  tanggalAjuan: string; // ISO date
};

export type Donor = { id: string; nama: string; danaMasuk: number };

export type TipeAktivitas = 'ajuan' | 'lulus' | 'verifikasi' | 'setuju' | 'tolak' | 'cair' | 'bayar' | 'laporan';

export type Aktivitas = { id: string; waktu: string; teks: string; tipe: TipeAktivitas };

export type Transaksi = {
  id: string;
  tanggal: string; // ISO date (yyyy-mm-dd)
  tipe: 'masuk' | 'keluar';
  nominal: number;
  keterangan: string;
};

export type PengembalianBulanan = { bulan: string; nominal: number };

export type AppState = {
  versi: number;
  umkm: Umkm[];
  pinjaman: Pinjaman[];
  donor: Donor[];
  aktivitas: Aktivitas[];
  transaksiDemo: Transaksi[]; // buku kas UMKM demo (Keripik Tempe Bu Sari)
  riwayatPengembalian: PengembalianBulanan[];
};
