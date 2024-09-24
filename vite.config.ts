import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  root: "./",
  plugins: [react()],
  // For production build, the size of the biggest chunk is over 600kb
  build: { chunkSizeWarningLimit: 800 },
});
