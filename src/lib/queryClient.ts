/**
 * queryClient.ts
 * 
 * Singleton TanStack Query client untuk seluruh aplikasi EDUFIN.
 * Import dari sini — JANGAN buat QueryClient baru di tempat lain.
 * 
 * Konfigurasi:
 * - staleTime: 2 menit → data dianggap fresh selama 2 menit (tidak re-fetch)
 * - retry: 1 → coba ulang 1x jika gagal (default 3x terlalu banyak)
 * - Global error handler → toast otomatis untuk semua mutation error
 */

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data dianggap "fresh" selama 2 menit → tidak re-fetch jika masih fresh
      staleTime: 1000 * 60 * 2,

      // Coba ulang 1x saja jika fetch gagal (bukan 3x default)
      retry: 1,

      // Jangan re-fetch saat user kembali ke tab (hemat request)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Global error handler: semua mutasi yang gagal otomatis tampil toast
      // (bisa di-override per mutasi jika butuh handling khusus)
      onError: (error: Error) => {
        const message = error?.message || 'Terjadi kesalahan, coba lagi.';
        
        // Abaikan error autentikasi (ditangani oleh AuthContext)
        if (message.includes('JWT') || message.includes('not authenticated')) {
          return;
        }
        
        toast.error(message, {
          duration: 4000,
          position: 'top-center',
        });
      },
    },
  },
});
