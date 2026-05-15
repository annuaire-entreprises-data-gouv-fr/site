import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/health")({
  headers: () => ({
    "Cache-Control": "no-cache",
    "Access-Control-Max-Age": "0",
  }),
  server: {
    handlers: {
      GET: async () =>
        new Response("ok", {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        }),
    },
  },
});
