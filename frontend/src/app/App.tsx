import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { seedDatabase } from "./data/seedData";
import OfflineFallback from "./components/OfflineFallback";

export default function App() {
  // Seed database on first load
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <>
      <OfflineFallback />
      <RouterProvider router={router} />
    </>
  );
}