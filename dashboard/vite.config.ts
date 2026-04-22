import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { squadWatcherPlugin } from "./src/plugin/squadWatcher";
import { carouselPlugin } from "./src/plugin/carouselPlugin";

export default defineConfig({
  plugins: [react(), squadWatcherPlugin(), carouselPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
