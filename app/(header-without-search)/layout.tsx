import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import { meta } from '#components/meta/meta-server';
import SocialNetworks from '#components/social-network';
import getSession from '#utils/server-side-helper/app/get-session';
import QuestionOrFeedback from 'app/_component/question-or-feedback';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

export default async function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      <NPSBanner />
      <HeaderServer useSearchBar={false} useAgentCTA={true} useLogo />
      <main className="fr-container" id="contenu">
        {children}
      </main>
      <SocialNetworks />
      <QuestionOrFeedback session={session} />
      <Footer />
    </>
  );
}
