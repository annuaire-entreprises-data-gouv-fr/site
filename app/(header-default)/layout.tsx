import { NPSBanner } from "#components/banner/nps";
import TempIncidentBanner from "#components/banner/temp-incident";
import Footer from "#components/footer";
import { HeaderAppRouter } from "#components/header/header-app-router";
import { Question } from "#components/question";
import SocialNetworks from "#components/social-network";

export default function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <TempIncidentBanner />
      <HeaderAppRouter
        useAgentBanner={true}
        useAgentCTA={true}
        useSearchBar={true}
      />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
