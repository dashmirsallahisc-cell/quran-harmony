// Pas build, riemërto capacitor.html -> index.html që Capacitor ta gjejë.
// Pastaj sigurohu që asset-et janë relative, sepse Android WebView nuk i hap
// rrugët absolute si `/assets/...` kur app-i lexohet nga filesystem-i lokal.
import { renameSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(process.cwd(), "dist");
const src = path.join(dist, "capacitor.html");
const dst = path.join(dist, "index.html");

if (existsSync(src)) {
  renameSync(src, dst);
  console.log("[capacitor] Renamed dist/capacitor.html -> dist/index.html");
} else if (existsSync(dst)) {
  console.log("[capacitor] dist/index.html already exists, skipping.");
} else {
  console.error("[capacitor] ERROR: dist/capacitor.html not found after build!");
  process.exit(1);
}

const html = readFileSync(dst, "utf8")
  .replace(/(src|href)="\/assets\//g, '$1="./assets/');
writeFileSync(dst, html);
console.log("[capacitor] Normalized asset paths for Android WebView");
