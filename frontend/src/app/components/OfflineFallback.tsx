import React, { useEffect, useState } from "react";

export default function OfflineFallback() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 mb-6 text-slate-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3l18 18M9.172 9.172a4 4 0 015.656 0M11 21h2M12 17v4m-5.657-2.343a8 8 0 010-11.314"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Anda Sedang Offline</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Sepertinya Anda kehilangan koneksi internet. EDUFIN tidak bisa mengambil data terbaru saat offline. Mohon sambungkan kembali ke Wi-Fi atau Data Seluler.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95"
      >
        Coba Lagi
      </button>
    </div>
  );
}
