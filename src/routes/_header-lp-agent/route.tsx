import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { NotificationProvider } from "#/components/notification-provider";

export const Route = createFileRoute("/_header-lp-agent")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <NotificationProvider>
      <Header
        useAgentBanner={false}
        useAgentCTA={true}
        useAgentDocumentation={true}
        useSearchBar={true}
      />
      <main className="fr-container">
        <Outlet />
      </main>
      <Footer />
    </NotificationProvider>
  );
}
