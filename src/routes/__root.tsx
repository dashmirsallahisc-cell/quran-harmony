import { Outlet, createRootRoute, HeadContent, Scripts, Link, Navigate } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import appCss from "../styles.css?url";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { AdBanner } from "@/components/AdBanner";

function NotFoundComponent() {
  if (typeof window !== "undefined" && window.location.pathname === "/index") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-gold-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" },
      { name: "theme-color", content: "#16182a" },
      { title: "Quran Pro — Listen to the Holy Quran" },
      { name: "description", content: "Quran Pro — listen to over 100 reciters, translations in 30+ languages, downloads & background playback. By DS Interactive." },
      { name: "author", content: "DS Interactive — Dashmir Sallahi" },
      { property: "og:title", content: "Quran Pro" },
      { property: "og:description", content: "Holy Quran audio with 100+ reciters, 30+ translations, downloads & lock-screen controls." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://api.alquran.cloud" },
      { rel: "preconnect", href: "https://cdn.islamic.network" },
      { rel: "preload", as: "font", href: "https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHpUrtLYS6pNLAjk.woff2", type: "font/woff2", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <SettingsProvider>
        <PlayerProvider>
          <AppShell />
        </PlayerProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-2">
        <Outlet />
      </main>
      <MiniPlayer />
      <BottomNav />
      <AdBanner />
    </div>
  );
}
