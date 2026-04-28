// Pas build, riemërto capacitor.html -> index.html që Capacitor ta gjejë.
import { renameSync, existsSync } from "node:fs";
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
