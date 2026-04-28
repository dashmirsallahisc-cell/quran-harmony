// Entry point për build-in Capacitor (SPA, jo SSR).
// Përdor memory history sepse WebView e Capacitor hap file:// dhe rrugët bazohen
// në navigim brenda aplikacionit, jo në URL të browser-it.
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

const rootEl = document.getElementById("root")!;
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
