import { Metadata } from 'next';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { MatomoInit } from '#components/matomo-event/init';
import { meta } from '#components/meta/meta-server';
import getSession from '#utils/server-side-helper/app/get-session';
import '../style/dsfr.min.css';
import '../style/globals.css';
import { PrefetchImgs } from './component/prefetch-dsfr-imgs';
import { marianne } from './fonts';

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
          rel="search"
          type="application/opensearchdescription+xml"
          title="Annuaire des Entreprises"
          href="https://annuaire-entreprises.data.gouv.fr/opensearch.xml"
        />
      </head>
      <body>
        {process.env.NODE_ENV === 'production' &&
          process.env.MATOMO_SITE_ID && <MatomoInit session={session} />}
        <PrefetchImgs />
        <BrowserIsOutdatedBanner>
          <div style={{ width: '100%' }}>{children}</div>
        </BrowserIsOutdatedBanner>
      </body>
    </html>
  );
}
