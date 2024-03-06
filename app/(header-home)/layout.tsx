import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import { meta } from '#components/meta';
import SocialNetworks from '#components/social-network';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <HeaderServer useSearchBar={false} useAgentCTA={true} />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
