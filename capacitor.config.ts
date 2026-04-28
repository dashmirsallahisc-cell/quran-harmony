import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dsinteractive.quranpro",
  appName: "Quran Pro",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: true,
  },
  android: {
    backgroundColor: "#16182a",
  },
  plugins: {
    CapacitorHttp: { enabled: true },
  },
};

export default config;
