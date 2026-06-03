import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { seedDatabase } from "./data/seedData";

export default function App() {
  // Seed database on first load
  useEffect(() => {
    seedDatabase();
  }, []);

  return <RouterProvider router={router} />;
}