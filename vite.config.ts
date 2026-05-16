import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { prerenderedPages } from "prerender";
import { defineConfig } from "vite";

const config = defineConfig({
  css: {
    lightningcss: {
      errorRecovery: true,
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tanstackStart({
      pages: prerenderedPages.map((path) => ({
        path,
        prerender: {
          enabled: true,
          crawlLinks: false,
          autoSubfolderIndex: false,
        },
      })),
    }),
    viteReact(),
    nitro(),
    sentryTanstackStart({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      sentryUrl: process.env.SENTRY_URL,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      release: {
        create: true,
        finalize: true,
        name: process.env.SOURCE_VERSION,
        setCommits: {
          ignoreMissing: true,
          auto: true,
        },
      },
    }),
  ],
});

export default config;
