import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/cafo-explorer/",
  plugins: [],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        map: resolve(__dirname, 'map/index.html'),
      },
    },
  },
});
