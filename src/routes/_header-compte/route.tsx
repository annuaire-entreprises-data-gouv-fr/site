import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { NotificationProvider } from "#/components/notification-provider";

export const Route = createFileRoute("/_header-compte")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <NotificationProvider>
      <Header useAgentBanner={false} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <Outlet />
      </main>
      <Footer />
    </NotificationProvider>
  );
}
