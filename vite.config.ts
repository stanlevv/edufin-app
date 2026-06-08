import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "pwa-192x192.png", "pwa-512x512.png"],
      manifest: {
        name: "EDUFIN - Manajemen Keuangan Sekolah",
        short_name: "EDUFIN",
        description: "Bayar SPP, pantau keuangan, dan berdonasi untuk sekolah secara transparan",
        theme_color: "#1677FF",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "id",
        categories: ["finance", "education"],
        icons: [
          { src: "pwa-192x192.png",      sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512x512.png",      sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "pwa-512x512.png",      sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
        ],
      },
      workbox: {
        // Hanya cache file penting — kurangi precache bloat
        globPatterns: ["**/*.{js,css,html,ico,png,woff2}"],
        globIgnores: ["**/node_modules/**", "**/dist/**"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/(api|supabase)\//],
        // Update langsung aktif tanpa tunggu tab ditutup
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Supabase API — NetworkFirst (data segar, fallback cache offline)
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 8,
            },
          },
          {
            // Google Fonts — CacheFirst (jarang berubah, hemat bandwidth)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      // Matikan PWA di dev — memperlambat HMR tanpa manfaat
      devOptions: { enabled: false },
    }),
  ],

  // ─── Build Optimization ───────────────────────────────────────────────────
  build: {
    // Target browser modern — output lebih kecil, tidak butuh polyfill lama
    target: "esnext",
    // Sudah split manual — batas warning dinaikkan
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // ── Manual Chunks ──────────────────────────────────────────────────
        // Pisah vendor agar browser bisa cache masing-masing secara terpisah.
        // Ketika kita update kode app, user tidak perlu re-download react/recharts dll.
        manualChunks(id: string) {
          // React core — paling sering di-cache, hampir tidak pernah berubah
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // React Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Supabase SDK
          if (id.includes("node_modules/@supabase")) {
            return "vendor-supabase";
          }
          // Recharts + D3 — hanya dipakai di halaman admin desktop
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
            return "vendor-recharts";
          }
          // Radix UI — banyak komponen shadcn pakai ini
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          // Tanstack React Query
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-query";
          }
          // Lucide icons — banyak ikon, chunk terpisah
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
        },
      },
    },
  },

  // ─── esbuild: strip console.log & debugger di production ─────────────────
  esbuild: {
    // Hapus semua console.* dan debugger di production build
    drop: mode === "production" ? ["console", "debugger"] : [],
    // Hapus comment lisensi dari output (kurangi ukuran)
    legalComments: "none",
  },

  css: {
    postcss: { plugins: [] },
  },

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}", "src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "src/imports/"],
    },
  },
}));