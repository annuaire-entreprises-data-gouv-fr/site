import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-minimal/formulaire/nps")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_header-minimal/formulaire/nps"!</div>;
}
