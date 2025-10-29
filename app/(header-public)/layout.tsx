import type { Metadata } from "next";
import { NPSBanner } from "#components/banner/nps";
import TempIncidentBanner from "#components/banner/temp-incident";
import Footer from "#components/footer";
import { Header } from "#components/header/header";
import { meta } from "#components/meta/meta";
import { Question } from "#components/question";
import SocialNetworks from "#components/social-network";

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
      <TempIncidentBanner />
      <Header
        useAgentBanner={false}
        useAgentCTA={false}
        useReconnectBanner={false}
        useSearchBar={true}
      />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
