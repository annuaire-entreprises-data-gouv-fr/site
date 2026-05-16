import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}", "cypress/**/*.test.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.output/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
    ],
    setupFiles: ["./setup-vitest.ts"],
    testTimeout: 10_000,
  },
});
