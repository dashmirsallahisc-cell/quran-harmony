// Build dedicated për Capacitor (Android/iOS) — SPA statike në `dist/`.
// Përdor `capacitor.html` si entry, jo SSR / Cloudflare Workers.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";

export default defineConfig({
  // Capacitor/Android duhet t'i lexojë asset-et relativisht nga `index.html`.
  // Pa këtë, dist/index.html del me `/assets/...` dhe WebView mund të hapë
  // vetëm background-in bosh pa JavaScript/CSS.
  base: "./",
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "capacitor.html"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
