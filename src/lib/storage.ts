// Persistent storage helpers — wraps Capacitor Preferences when available, falls back to localStorage.
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

const isNative = () => Capacitor.isNativePlatform();

export async function storageGet<T>(key: string, fallback: T): Promise<T> {
  try {
    if (isNative()) {
      const { value } = await Preferences.get({ key });
      return value ? (JSON.parse(value) as T) : fallback;
    }
    if (typeof window === "undefined") return fallback;
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  const v = JSON.stringify(value);
  try {
    if (isNative()) await Preferences.set({ key, value: v });
    else if (typeof window !== "undefined") window.localStorage.setItem(key, v);
  } catch { /* noop */ }
}

export async function storageRemove(key: string): Promise<void> {
  try {
    if (isNative()) await Preferences.remove({ key });
    else if (typeof window !== "undefined") window.localStorage.removeItem(key);
  } catch { /* noop */ }
}
