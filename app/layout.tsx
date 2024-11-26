import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { MatomoInit } from '#components/matomo-event/init';
import { meta } from '#components/meta/meta-server';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import '../style/dsfr.min.css';
import '../style/globals.css';
import { PrefetchImgs } from './_component/prefetch-dsfr-imgs';
import { marianne } from './fonts';

if (
  process.env.NEXT_PUBLIC_END2END_MOCKING === 'enabled' &&
  process.env.NEXT_RUNTIME === 'nodejs' &&
  process.env.BUILD_PHASE !== 'true'
) {
  // Mock server for Cypress, must be put here according to :
  // https://github.com/mswjs/examples/pull/101/files
  const { mockServer } = require('#cypress/mocks/server');
  mockServer.listen({
    onUnhandledRequest: 'warn',
  });
}

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
          title="L'Annuaire des Entreprises"
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
