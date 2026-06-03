import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [],
    },
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
});