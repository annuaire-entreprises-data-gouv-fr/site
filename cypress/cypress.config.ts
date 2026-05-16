import { defineConfig } from "cypress";

export default defineConfig({
  video: !!process.env.CI,
  e2e: {
    baseUrl: "http://localhost:3000",
    video: !!process.env.CI,
  },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0",
});
