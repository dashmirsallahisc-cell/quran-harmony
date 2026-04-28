// Entry point për build-in Capacitor (SPA, jo SSR).
// Në Android duhet Browser/Hash history që navigimi të mbetet brenda WebView.
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {},
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
  },
});

function BootError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-5 text-center text-foreground">
      <div className="max-w-sm rounded-xl border border-border bg-surface p-5 shadow-card">
        <h1 className="text-xl font-bold text-gold">Quran Pro</h1>
        <p className="mt-3 text-sm text-muted-foreground">Aplikacioni nuk u hap si duhet.</p>
        <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-left text-xs text-destructive">
          {message}
        </pre>
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");

try {
  if (!rootEl) throw new Error("Root element not found");

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
} catch (error) {
  console.error("Quran Pro boot failed", error);
  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(
      <BootError message={error instanceof Error ? error.message : String(error)} />,
    );
  }
}
