import { Metadata } from 'next';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { MatomoInit } from '#components/matomo-event/init';
import { meta } from '#components/meta/meta-server';
import useSessionServer from 'hooks/use-session-server';
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
  const session = await useSessionServer();
  return (
    <html lang="fr" style={marianne.style}>
      {process.env.NODE_ENV === 'production' && process.env.MATOMO_SITE_ID && (
        <MatomoInit session={session} />
      )}
      <body>
        <PrefetchImgs />
        <BrowserIsOutdatedBanner />
        <div style={{ width: '100%' }}>{children}</div>
      </body>
    </html>
  );
}
