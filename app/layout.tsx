import { Metadata } from 'next';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { meta } from '#components/meta';
import '../style/dsfr.min.css';
import '../style/globals.css';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <BrowserIsOutdatedBanner />
        <div style={{ width: '100%' }}>{children}</div>
      </body>
    </html>
  );
}
