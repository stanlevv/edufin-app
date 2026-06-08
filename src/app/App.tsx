import React, { lazy, Suspense } from "react";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import OfflineFallback from "./components/OfflineFallback";
import { queryClient } from "../lib/queryClient";
import { Toaster } from "./components/ui/sonner";

// DevTools hanya di-load saat development — tidak masuk production bundle
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineFallback />
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}