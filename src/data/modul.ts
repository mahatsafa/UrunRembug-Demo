// Materi edukasi finansial singkat untuk UMKM. Lulus = semua kuis benar.

export type Soal = { tanya: string; pilihan: string[]; benar: number; penjelasan: string };
export type Modul = { id: string; judul: string; ringkas: string; durasi: string; kartu: string[]; soal: Soal[] };

export const MODUL: Modul[] = [
  {
    id: 'pisah-uang',
    judul: 'Pisahkan Uang Usaha & Pribadi',
    ringkas: 'Kunci pertama agar usaha tahu untung atau rugi.',
    durasi: '3 menit',
    kartu: [
      'Kalau uang usaha dan uang rumah tangga dicampur, kamu tidak akan tahu apakah usahamu benar-benar untung.',
      'Mulai dengan cara sederhana: siapkan dua dompet, dua amplop, atau dua rekening. Satu untuk usaha, satu untuk pribadi.',
      'Bayar dirimu sendiri dengan "gaji" tetap dari usaha, misalnya setiap minggu. Jangan ambil uang kas usaha seenaknya.',
    ],
    soal: [
      {
        tanya: 'Kenapa uang usaha perlu dipisah dari uang pribadi?',
        pilihan: ['Supaya terlihat lebih kaya', 'Supaya tahu usaha untung atau rugi', 'Karena diwajibkan bank'],
        benar: 1,
        penjelasan: 'Dengan dipisah, semua uang masuk dan keluar usaha bisa dihitung dengan jelas.',
      },
      {
        tanya: 'Cara paling sederhana untuk memulai adalah...',
        pilihan: ['Memakai dua dompet atau amplop', 'Langsung membuka PT', 'Menyimpan semua uang di satu tempat'],
        benar: 0,
        penjelasan: 'Tidak perlu rumit. Dua dompet atau amplop sudah cukup untuk awal.',
      },
      {
        tanya: 'Bagaimana pemilik sebaiknya mengambil uang untuk kebutuhan pribadi?',
        pilihan: ['Ambil kapan saja dari kas', 'Lewat "gaji" tetap dari usaha', 'Tidak boleh sama sekali'],
        benar: 1,
        penjelasan: 'Gaji tetap membuat pengeluaran pribadi terkendali dan kas usaha tetap aman.',
      },
    ],
  },
  {
    id: 'catat-kas',
    judul: 'Mencatat Kas Harian',
    ringkas: 'Catatan kecil setiap hari, keputusan besar di kemudian hari.',
    durasi: '3 menit',
    kartu: [
      'Kas harian adalah catatan semua uang yang masuk (penjualan) dan keluar (belanja bahan, plastik, bensin) setiap hari.',
      'Catat saat itu juga, jangan menunggu malam. Simpan nota belanja sebagai bukti.',
      'Di akhir minggu, jumlahkan. Dari situ kamu bisa melihat hari paling ramai dan biaya yang paling besar.',
    ],
    soal: [
      {
        tanya: 'Yang termasuk uang KELUAR adalah...',
        pilihan: ['Hasil jualan keripik', 'Belanja tempe dan minyak', 'Pesanan dari pelanggan'],
        benar: 1,
        penjelasan: 'Belanja bahan baku adalah pengeluaran usaha.',
      },
      {
        tanya: 'Kapan waktu terbaik mencatat transaksi?',
        pilihan: ['Saat transaksi terjadi', 'Sebulan sekali', 'Kalau sempat saja'],
        benar: 0,
        penjelasan: 'Mencatat langsung membuat catatan lebih lengkap dan akurat.',
      },
      {
        tanya: 'Apa gunanya menyimpan nota belanja?',
        pilihan: ['Untuk hiasan', 'Sebagai bukti pengeluaran', 'Tidak ada gunanya'],
        benar: 1,
        penjelasan: 'Nota adalah bukti. Bukti ini juga dipakai saat melaporkan penggunaan dana pinjaman.',
      },
    ],
  },
  {
    id: 'hitung-untung',
    judul: 'Menghitung Untung',
    ringkas: 'Laku banyak belum tentu untung. Hitung dulu!',
    durasi: '4 menit',
    kartu: [
      'Rumus dasarnya: Untung = Pemasukan − Pengeluaran.',
      'Pengeluaran bukan hanya bahan. Hitung juga plastik, gas, listrik, dan ongkos kirim.',
      'Contoh: jual 100 bungkus x Rp10.000 = Rp1.000.000. Biaya total Rp700.000. Untung = Rp300.000.',
    ],
    soal: [
      {
        tanya: 'Jual 100 bungkus x Rp10.000, total biaya Rp700.000. Berapa untungnya?',
        pilihan: ['Rp1.000.000', 'Rp300.000', 'Rp700.000'],
        benar: 1,
        penjelasan: 'Rp1.000.000 − Rp700.000 = Rp300.000.',
      },
      {
        tanya: 'Mana yang sering LUPA dihitung sebagai biaya?',
        pilihan: ['Bahan utama', 'Plastik kemasan dan gas', 'Harga jual'],
        benar: 1,
        penjelasan: 'Biaya kecil seperti kemasan dan gas sering terlupa, padahal mengurangi untung.',
      },
      {
        tanya: 'Usaha disebut untung jika...',
        pilihan: ['Pemasukan lebih besar dari pengeluaran', 'Pembeli banyak', 'Stok barang banyak'],
        benar: 0,
        penjelasan: 'Ramai pembeli belum tentu untung kalau biayanya lebih besar.',
      },
    ],
  },
];

export const ID_SEMUA_MODUL = MODUL.map((m) => m.id);
