import type { Metadata } from "next";
import { BannerManager } from "#components/banner/banner-manager";
import { NPSBanner } from "#components/banner/nps";
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
      <BannerManager />
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
