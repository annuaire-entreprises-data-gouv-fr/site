import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "#/components/header/header";

export const Route = createFileRoute("/_header-connexion")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header
        useAgentCTA={false}
        useLogo={true}
        useMap={false}
        useSearchBar={false}
      />
      <div>
        <Outlet />
      </div>
    </>
  );
}
