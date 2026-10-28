import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CompteRoutePendingSkeleton } from "#/components/espace-agent-components/skeleton";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { NotificationProvider } from "#/components/notification-provider";
import { getAgentGroupsFn } from "#/server-functions/agent/group-management";
import { HeaderCompteError } from "./-error";

export const Route = createFileRoute("/_header-compte")({
  // Every child route guards its access in beforeLoad, which always runs
  // before this loader
  loader: async () => {
    const groups = await getAgentGroupsFn();

    return { groups };
  },
  // Groups are shared by all the compte pages: always fetch them when entering
  // the compte pages, then only when they are older than staleTime while moving
  // between them. Pages updating a group call router.invalidate() to refresh them.
  shouldReload: ({ cause }) => (cause === "enter" ? true : undefined),
  staleTime: 2 * 60 * 1000,
  component: RouteComponent,
  // Show the skeleton almost immediately instead of blocking navigation
  // until the groups are fetched (default pendingMs is 1000)
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: () => (
    <CompteLayout>
      <CompteRoutePendingSkeleton />
    </CompteLayout>
  ),
  errorComponent: ({ error }) => (
    <CompteLayout>
      <HeaderCompteError error={error} />
    </CompteLayout>
  ),
});

function RouteComponent() {
  return (
    <CompteLayout>
      <Outlet />
    </CompteLayout>
  );
}

function CompteLayout({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <Header useAgentBanner={false} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">{children}</main>
      <Footer />
    </NotificationProvider>
  );
}
