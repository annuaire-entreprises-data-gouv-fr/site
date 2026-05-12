import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { meta } from "#/seo";
import dsfrCss from "#/style/dsfr.min.css?url";
import appCss from "#/style/globals.css?url";

export const Route = createRootRoute({
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
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
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
