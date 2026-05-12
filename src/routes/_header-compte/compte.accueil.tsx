import { createFileRoute } from "@tanstack/react-router";
import { HeaderCompteError } from "./-error";

export const Route = createFileRoute("/_header-compte/compte/accueil")({
  component: RouteComponent,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  return <div>Hello "/_header-compte/compte/accueil"!</div>;
}
