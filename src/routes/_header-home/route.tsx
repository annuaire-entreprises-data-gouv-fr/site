import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { Question } from "#/components/question";
import SocialNetworks from "#/components/social-network";

export const Route = createFileRoute("/_header-home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NPSBanner />
      <BannerManager />
      <Header
        useAgentBanner={false}
        useAgentCTA={true}
        useExportSirene={true}
        useSearchBar={false}
      />
      <main className="fr-container">
        <Outlet />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
    </>
  );
}
