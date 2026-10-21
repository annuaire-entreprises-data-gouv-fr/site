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
    url.hostname.endsWith(".sentry.io")
  );
};

mockServer.listen({
  onUnhandledFrame: ({ frame, defaults }) => {
    // WebSocket connections (e.g. Vite HMR) are never mocked
    if (frame.protocol !== "http") {
      return;
    }

    const { request } = frame.data as { request: Request };
    if (shouldBypassUnhandledMockRequest(request)) {
      return;
    }

    defaults.warn();
  },
});
