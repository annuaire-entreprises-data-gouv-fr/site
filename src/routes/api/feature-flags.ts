import { createFileRoute } from "@tanstack/react-router";
import { Exception } from "#/models/exceptions";
import { getFeatureFlagsList } from "#/models/feature-flags";
import logErrorInSentry from "#/utils/sentry";

export const Route = createFileRoute("/api/feature-flags")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const featureFlags = await getFeatureFlagsList();
          return Response.json({ featureFlags });
        } catch (error) {
          logErrorInSentry(
            new Exception({ name: "Feature Flags API", cause: error })
          );

          return Response.json(
            { message: "server error", status: 500 },
            { status: 500 }
          );
        }
      },
    },
  },
});
