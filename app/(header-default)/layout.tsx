import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import { meta } from '#components/meta/meta-server';
import SocialNetworks from '#components/social-network';

export const metadata: Metadata = meta({});

export default async function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <HeaderServer useSearchBar={true} useAgentCTA={true} />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
