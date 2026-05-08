// Bump versionin per Android (versionCode + versionName) dhe package.json.
// Perdorimi:
//   node scripts/bump-version.mjs            -> patch (1.0.0 -> 1.0.1)
//   node scripts/bump-version.mjs minor      -> minor
//   node scripts/bump-version.mjs major      -> major
//   node scripts/bump-version.mjs set 1.2.3  -> set te sakte
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const pkgPath = path.join(root, "package.json");
const gradlePath = path.join(root, "android", "app", "build.gradle");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const cur = pkg.version || "1.0.0";
const [a, b, c] = cur.split(".").map((n) => parseInt(n, 10) || 0);

const arg = process.argv[2] || "patch";
let next;
if (arg === "set") next = process.argv[3];
else if (arg === "major") next = `${a + 1}.0.0`;
else if (arg === "minor") next = `${a}.${b + 1}.0`;
else next = `${a}.${b}.${c + 1}`;

if (!next || !/^\d+\.\d+\.\d+$/.test(next)) {
  console.error("Invalid version:", next);
  process.exit(1);
}

pkg.version = next;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`[version] package.json: ${cur} -> ${next}`);

if (existsSync(gradlePath)) {
  let g = readFileSync(gradlePath, "utf8");
  const codeMatch = g.match(/versionCode\s+(\d+)/);
  const nextCode = codeMatch ? parseInt(codeMatch[1], 10) + 1 : 1;
  g = g
    .replace(/versionCode\s+\d+/, `versionCode ${nextCode}`)
    .replace(/versionName\s+"[^"]*"/, `versionName "${next}"`);
  writeFileSync(gradlePath, g);
  console.log(`[version] android: versionCode=${nextCode}, versionName=${next}`);
} else {
  console.log("[version] android/app/build.gradle not found, skipping native bump");
}
