import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { Question } from "#/components/question";
import SocialNetworks from "#/components/social-network";
import { BackToTop } from "#/components-ui/back-to-top";

export const Route = createFileRoute("/_header-default")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NPSBanner />
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <Outlet />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
