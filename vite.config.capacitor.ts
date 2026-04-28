// Build dedicated për Capacitor (Android/iOS).
// Prodhon një SPA statike në `dist/` me index.html që WebView mund ta ngarkojë.
// NUK përdor Cloudflare/SSR — vetëm React + TanStack Router në modalitet client-side.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

// Plugin i vogël që krijon index.html për SPA mode pas build
function capacitorIndexHtml() {
  return {
    name: "capacitor-index-html",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
      const html = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
    <meta name="theme-color" content="#16182a" />
    <title>Quran Pro</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" />
    <script type="module" src="/src/capacitor-entry.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
      writeFileSync(path.join(distDir, "index.html"), html);
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
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
