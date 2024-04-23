import { Metadata } from 'next';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import { meta } from '#components/meta/meta-server';
import SocialNetworks from '#components/social-network';
import getSession from '#utils/server-side-helper/app/get-session';
import QuestionOrFeedback from 'app/_component/question-or-feedback';

export const metadata: Metadata = meta({});

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      <NPSBanner />
      <HeaderServer useSearchBar={false} useAgentCTA={true} />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <QuestionOrFeedback session={session} />
      <Footer />
    </>
  );
}
