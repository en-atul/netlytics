import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      netlytics: path.resolve(__dirname, "../../dist/index.js"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
