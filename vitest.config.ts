import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**"],
    setupFiles: "./tests/setup.ts",
    coverage: {
      reporter: ["text", "html"],
      include: ["components/**", "app/api/**", "lib/**", "types/**"],
      thresholds: { lines: 80 },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
})
