import { createFileRoute } from "@tanstack/react-router";
import { APISlugNotFound, pingAPIClient } from "#/clients/ping-api-clients";
import { Exception } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";

export const Route = createFileRoute("/api/ping/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { test, status = 500 } = await pingAPIClient(params.slug || "");

          if (test) {
            return Response.json({ message: "ok" }, { status: 200 });
          }
          return Response.json({ message: "ko", status }, { status: 500 });
        } catch (e) {
          if (e instanceof APISlugNotFound) {
            return Response.json(
              { message: "API slug not found", status: 404 },
              { status: 404 }
            );
          }
          logErrorInSentry(new Exception({ name: "Ping API", cause: e }));
          return Response.json(
            { message: "server error", status: 500 },
            { status: 500 }
          );
        }
      },
    },
  },
});
