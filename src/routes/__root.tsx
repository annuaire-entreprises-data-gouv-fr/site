import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ClientProviders } from "#/client-providers";
import { getAgentUserType } from "#/models/authentication/user/helpers";
import { getCurrentUserFn } from "#/server-functions/public/auth";
import dsfrCss from "#/style/dsfr.min.css?url";
import appCss from "#/style/globals.css?url";
import { getDefaultHeaders } from "#/utils/headers/default";
import { meta } from "#/utils/seo";

const isMatomoEnabled =
  import.meta.env.PROD && import.meta.env.VITE_MATOMO_SITE_ID;

export const Route = createRootRoute({
  loader: async () => {
    const user = await getCurrentUserFn();

    return { user };
  },
  head: ({ loaderData }) => ({
    meta: meta({}),
    links: [
      {
        rel: "stylesheet",
        href: dsfrCss,
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "search",
        href: "https://annuaire-entreprises.data.gouv.fr/opensearch.xml",
        title: "L'Annuaire des Entreprises",
        type: "application/opensearchdescription+xml",
      },
      {
        rel: "icon",
        href: "/favicons/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "shortcut icon",
        href: "/favicons/favicon.ico",
        type: "image/x-icon",
      },
      {
        rel: "manifest",
        href: "/favicons/manifest.webmanifest",
        crossOrigin: "use-credentials",
      },
      {
        rel: "apple-touch-icon",
        href: "/favicons/apple-touch-icon.png",
      },
    ],
    scripts: isMatomoEnabled
      ? [
          {
            src: "/matomo-init.js",
            "data-user-type": getAgentUserType({ user: loaderData?.user }),
            "data-site-id": import.meta.env.VITE_MATOMO_SITE_ID,
            type: "text/javascript",
          },
          {
            src: "https://stats.data.gouv.fr/piwik.js",
            type: "text/javascript",
          },
        ]
      : [],
  }),
  headers: () => getDefaultHeaders(),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useLoaderData();

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ClientProviders user={user}>{children}</ClientProviders>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
