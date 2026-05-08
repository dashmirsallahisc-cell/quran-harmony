// Build i njejtuar per APK (dev ose release) me copy automatik te artifaktit.
// Perdorimi:
//   node scripts/build-apk.mjs dev
//   node scripts/build-apk.mjs release
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, readFileSync } from "node:fs";
import path from "node:path";

const variant = (process.argv[2] || "dev").toLowerCase();
if (!["dev", "release"].includes(variant)) {
  console.error("Variant duhet 'dev' ose 'release'");
  process.exit(1);
}

const root = process.cwd();
const androidDir = path.join(root, "android");
if (!existsSync(androidDir)) {
  console.error("[apk] folderi 'android/' mungon. Hap njehere: npx cap add android");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version || "0.0.0";

function run(cmd, cwd = root) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

// 1) Build web + sync
run("npm run build:capacitor");
run("npx cap sync android");

// 2) Gradle build
const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const task = variant === "release" ? "assembleRelease" : "assembleDebug";
run(`${gradlew} ${task}`, androidDir);

// 3) Copy APK te dist-apk/
const outDir = path.join(root, "dist-apk");
mkdirSync(outDir, { recursive: true });
const srcApk =
  variant === "release"
    ? path.join(androidDir, "app", "build", "outputs", "apk", "release", "app-release-unsigned.apk")
    : path.join(androidDir, "app", "build", "outputs", "apk", "debug", "app-debug.apk");

if (!existsSync(srcApk)) {
  console.error(`[apk] APK nuk u gjet: ${srcApk}`);
  process.exit(1);
}

const dstApk = path.join(outDir, `quranpro-${version}-${variant}.apk`);
copyFileSync(srcApk, dstApk);
console.log(`\n[apk] OK -> ${dstApk}`);
