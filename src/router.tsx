import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { GlobalError } from "./components/screens/global-error";
import { NotFound } from "./components/screens/not-found";
import { routeTree } from "./routeTree.gen";
import { initSentryClient } from "./utils/sentry/init";

declare global {
  interface Window {
    IS_OUTDATED_BROWSER: boolean;
  }
}

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    defaultPreload: false,
    defaultNotFoundComponent() {
      return <NotFound />;
    },
    defaultErrorComponent(props) {
      return <GlobalError error={props.error} />;
    },
  });

  if (!router.isServer) {
    initSentryClient();
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
