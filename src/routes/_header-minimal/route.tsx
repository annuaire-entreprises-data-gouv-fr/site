import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "#/components/header/header";
import { Question } from "#/components/question";

export const Route = createFileRoute("/_header-minimal")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header useAgentBanner={false} useAgentCTA={false} useSearchBar={false} />
      <main className="fr-container">
        <Outlet />
      </main>
      <Question />
    </>
  );
}
