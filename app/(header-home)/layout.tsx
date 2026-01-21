import type { Metadata } from "next";
import { NPSBanner } from "#components/banner/nps";
import Proconnect2FABanner from "#components/banner/proconnect-2fa";
import TempIncidentBanner from "#components/banner/temp-incident";
import Footer from "#components/footer";
import { Header } from "#components/header/header";
import { meta } from "#components/meta/meta";
import { Question } from "#components/question";
import SocialNetworks from "#components/social-network";

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <TempIncidentBanner />
      <Proconnect2FABanner />
      <Header
        useAgentBanner={false}
        useAgentCTA
        useExportSirene
        useSearchBar={false}
      />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
