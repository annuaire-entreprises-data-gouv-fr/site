import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderAppRouter } from '#components/header/header-app-router';
import { meta } from '#components/meta/meta-server';
import { Question } from '#components/question';
import SocialNetworks from '#components/social-network';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

/**
 * Layout component designed for pages without authentication.
 * It is mainly used for static pages as they can't access the session.
 **/
export default function LayoutPublic({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <HeaderAppRouter
        useSearchBar={true}
        useAgentCTA={false}
        useAgentBanner={false}
        useReconnectBanner={false}
      />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
