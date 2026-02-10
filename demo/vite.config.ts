import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      // Point directly to index.ts in source directory (one level up from demo)
      netlytics: path.resolve(__dirname, "../src/index.ts"),
    },
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  optimizeDeps: {
    include: ["netlytics"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
