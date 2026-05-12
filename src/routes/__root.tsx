import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { BrowserIsOutdatedBanner } from "#/components/banner/browser-is-outdated";
import { MatomoInit } from "#/components/matomo-event/init";
import { meta } from "#/seo";
import dsfrCss from "#/style/dsfr.min.css?url";
import appCss from "#/style/globals.css?url";
import { getCurrentSession } from "#/utils/session";

const rootLoader = createServerFn().handler(async () => {
  const session = await getCurrentSession();
  return { session: session.data };
});

export const Route = createRootRoute({
  loader: async () => {
    const { session } = await rootLoader();

    return { session };
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
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { session } = Route.useLoaderData();

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {process.env.NODE_ENV === "production" &&
          process.env.MATOMO_SITE_ID && <MatomoInit session={session} />}
        <BrowserIsOutdatedBanner>{children}</BrowserIsOutdatedBanner>
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
