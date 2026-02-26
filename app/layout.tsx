import type { Metadata } from "next";
import { BrowserIsOutdatedBanner } from "#components/banner/browser-is-outdated";
import { MatomoInit } from "#components/matomo-event/init";
import { meta } from "#components/meta/meta";
import getSession from "#utils/server-side-helper/get-session";
import "../style/dsfr.min.css";
import "../style/globals.css";
import { PrefetchImgs } from "./_component/prefetch-dsfr-imgs";
import { ClientProviders } from "./client-providers";
import { marianne } from "./fonts";

export const metadata: Metadata = meta({});

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="fr" style={marianne.style} suppressHydrationWarning>
      <head>
        <link
          href="https://annuaire-entreprises.data.gouv.fr/opensearch.xml"
          rel="search"
          title="L'Annuaire des Entreprises"
          type="application/opensearchdescription+xml"
        />
      </head>
      <body>
        {process.env.NODE_ENV === "production" &&
          process.env.MATOMO_SITE_ID && <MatomoInit session={session} />}
        <PrefetchImgs />
        <BrowserIsOutdatedBanner>
          <ClientProviders>
            <div style={{ width: "100%" }}>{children}</div>
          </ClientProviders>
        </BrowserIsOutdatedBanner>
      </body>
    </html>
  );
}
