import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderAppRouter } from '#components/header/header-app-router';
import { meta } from '#components/meta/meta-server';
import { Question } from '#components/question';
import SocialNetworks from '#components/social-network';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <HeaderAppRouter
        useSearchBar={false}
        useAgentCTA={true}
        useAgentBanner={false}
      />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
