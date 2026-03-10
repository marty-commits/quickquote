import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["tests/unit/**/*.test.ts"],
    exclude: ["tests/integration/**"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
