import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      // Point directly to index.ts in source directory (one level up from demo)
      // This alias takes precedence over the linked package in node_modules
      netlytics: path.resolve(__dirname, "../src/index.ts"),
    },
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  optimizeDeps: {
    // Exclude netlytics from pre-bundling since we're using source files via alias
    exclude: ["netlytics"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        usage: path.resolve(__dirname, "usage.html"),
      },
    },
  },
});
