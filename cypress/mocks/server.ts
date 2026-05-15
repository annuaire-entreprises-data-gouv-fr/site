import { setupServer } from "msw/node";
import { routesHandlers } from "./routes";

const mockServer = setupServer(...routesHandlers);

const shouldBypassUnhandledMockRequest = (request: Request) => {
  const url = new URL(request.url);

  return (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]" ||
    url.hostname.endsWith(".localhost") ||
    url.protocol === "ws:" ||
    url.protocol === "wss:" ||
    url.hostname.endsWith(".sentry.io")
  );
};

mockServer.listen({
  onUnhandledRequest: (request, print) => {
    if (shouldBypassUnhandledMockRequest(request)) {
      return;
    }

    print.warning();
  },
});
