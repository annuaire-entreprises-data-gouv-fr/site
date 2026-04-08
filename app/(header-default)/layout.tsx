import type { Metadata } from "next";
import { BannerManager } from "#components/banner/banner-manager";
import { NPSBanner } from "#components/banner/nps";
import Footer from "#components/footer";
import { Header } from "#components/header/header";
import { meta } from "#components/meta/meta";
import { Question } from "#components/question";
import SocialNetworks from "#components/social-network";
import { BackToTop } from "#components-ui/back-to-top";

export const metadata: Metadata = meta({});

export default function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPSBanner />
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
