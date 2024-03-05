import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import { meta } from '#components/meta';
import SocialNetworks from '#components/social-network';
import '../../style/dsfr.min.css';
import '../../style/globals.css';

export const metadata: Metadata = meta({});

export default async function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{ width: '100%' }}>
          <NPSBanner />
          <HeaderServer useSearchBar={false} useAgentCTA={true} useLogo />
          <main className="fr-container">{children}</main>
          <SocialNetworks />
          <Question />
          <Footer />
        </div>
      </body>
    </html>
  );
}
