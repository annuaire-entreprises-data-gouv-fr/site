import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

if (
  import.meta.env.DEV &&
  process.env.VITE_END2END_MOCKING === "enabled" &&
  process.env.BUILD_PHASE !== "true"
) {
  import("../cypress/mocks/server").then(({ mockServer }) => {
    mockServer.listen({
      onUnhandledRequest: "error",
    });
  });
}

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      return handler.fetch(request);
    },
  })
);
