import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppState } from '../data/types';
import { buatSeed, VERSI_DATA } from '../data/seed';

// "Store" = tempat menyimpan seluruh data aplikasi.
//
// Cara kerja sinkron real-time antar jendela:
//   1. Setiap perubahan disimpan ke localStorage (penyimpanan kecil di browser).
//   2. Browser otomatis mengirim event "storage" ke SEMUA tab/jendela lain
//      yang membuka situs yang sama.
//   3. Tab lain (misalnya dashboard Donor) mendengar event itu lalu memuat
//      data terbaru, sehingga angkanya berubah tanpa refresh.

const KUNCI = 'urunrembug-demo';

function muat(): AppState {
  try {
    const teks = localStorage.getItem(KUNCI);
    if (teks) {
      const data = JSON.parse(teks) as AppState;
      if (data.versi === VERSI_DATA) return data;
    }
  } catch {
    // localStorage bisa gagal (mode privat, data rusak). Kalau begitu pakai data awal.
  }
  return buatSeed();
}

function simpan(state: AppState) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(state));
  } catch {
    // Abaikan: demo tetap jalan, hanya tidak tersinkron.
  }
}

type Toast = { id: number; pesan: string };

type Konteks = {
  state: AppState;
  /** Jalankan sebuah aksi dari store/actions.ts, opsional sambil menampilkan pesan. */
  ubah: (aksi: (s: AppState) => AppState, pesan?: string) => void;
  reset: () => void;
  toast: Toast | null;
  tampilkanToast: (pesan: string) => void;
};

const AppContext = createContext<Konteks | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(muat);
  const [toast, setToast] = useState<Toast | null>(null);

  const tampilkanToast = useCallback((pesan: string) => {
    const id = Date.now();
    setToast({ id, pesan });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3500);
  }, []);

  const ubah = useCallback(
    (aksi: (s: AppState) => AppState, pesan?: string) => {
      setState((lama) => {
        const baru = aksi(lama);
        if (baru !== lama) simpan(baru);
        return baru;
      });
      if (pesan) tampilkanToast(pesan);
    },
    [tampilkanToast],
  );

  const reset = useCallback(() => {
    const awal = buatSeed();
    simpan(awal);
    setState(awal);
    tampilkanToast('Data demo dikembalikan ke kondisi awal');
  }, [tampilkanToast]);

  // Dengarkan perubahan dari tab/jendela lain.
  useEffect(() => {
    const dengar = (e: StorageEvent) => {
      if (e.key === KUNCI) setState(muat());
    };
    window.addEventListener('storage', dengar);
    return () => window.removeEventListener('storage', dengar);
  }, []);

  return (
    <AppContext.Provider value={{ state, ubah, reset, toast, tampilkanToast }}>{children}</AppContext.Provider>
  );
}

export function useApp(): Konteks {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp harus dipakai di dalam <AppProvider>');
  return ctx;
}
