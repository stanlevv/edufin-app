import React from "react";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./routes";
import OfflineFallback from "./components/OfflineFallback";
import { queryClient } from "../lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineFallback />
      <RouterProvider router={router} />
      {/* DevTools hanya muncul saat development — tidak masuk production build */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}