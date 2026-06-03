import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import OfflineFallback from "./components/OfflineFallback";

export default function App() {
  return (
    <>
      <OfflineFallback />
      <RouterProvider router={router} />
    </>
  );
}