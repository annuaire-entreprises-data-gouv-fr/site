import { Metadata } from 'next';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { meta } from '#components/meta/meta-server';
import '../style/dsfr.min.css';
import '../style/globals.css';
import { PrefetchImgs } from './component/prefetch-dsfr-imgs';
import { marianne } from './fonts';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" style={marianne.style}>
      <body>
        <PrefetchImgs />
        <BrowserIsOutdatedBanner />
        <div style={{ width: '100%' }}>{children}</div>
      </body>
    </html>
  );
}
