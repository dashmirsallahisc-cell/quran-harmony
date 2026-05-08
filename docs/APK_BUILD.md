# Build APK – Quran Pro

## Skripta te shpejta (lokal)

```
npm run apk:dev       # ndertimi debug
npm run apk:release   # ndertimi release (i pa-nenshkruar)
npm run version:patch # 1.0.0 -> 1.0.1 + versionCode++
npm run version:minor
npm run version:major
```

APK-te dalin ne `dist-apk/quranpro-<version>-<variant>.apk`.

## Hapa nje-here te vetme (setup)

1. `npm install`
2. `npx cap add android` (krijon folderin `android/`)
3. Hap Android Studio dhe lejo te instalohet SDK + JDK (ose perdor JDK te embedded).
   Nese Studio te ankohet per "Gradle JDK", zgjidh **Embedded JDK**:
   `C:\Program Files\Android\Android Studio\jbr`

## Build automatik (GitHub Actions)

Ngarko ne GitHub. Aktivizo workflow `Build Android APK`:
- **workflow_dispatch** -> zgjidh `variant` (dev/release) dhe `bump` (patch/minor/major).
- ose push tag `v1.2.3` -> ndertim release.

APK shfaqet te tab-i **Artifacts** i run-it.

## Versioning

Skripti `scripts/bump-version.mjs` perditeson:
- `package.json` -> `version`
- `android/app/build.gradle` -> `versionName` + `versionCode++`

## Test pa bllokim (publish-test)

Pas cdo build-i, hap APK-ne ne pajisje dhe verifiko:
1. Hap aplikacionin -> shko te cdo menu (Home, Recituesit, Favorite, Histori, Shkarkime, Me, Cilesime).
2. Provo Play / Pause, Para / Prapa per nje sure tjeter.
3. Mbylle ekranin -> kontrollet ne lock-screen duhet te punojne (njoftim Capacitor).
4. Kthehu ne app -> nuk duhet te kete bllokim te UI-se.

Nese ndonje hap deshton, nis perseri me `npm run apk:dev` dhe shiko `adb logcat` per gabime.
