import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ClientProviders } from "#/client-providers";
import { getCurrentUserFn } from "#/server-functions/public/auth";
import dsfrCss from "#/style/dsfr.min.css?url";
import appCss from "#/style/globals.css?url";
import { getDefaultHeaders } from "#/utils/headers/default";
import { meta } from "#/utils/seo";

export const Route = createRootRoute({
  loader: async () => {
    const user = await getCurrentUserFn();

    return { user };
  },
  head: () => ({
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
    ],
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
