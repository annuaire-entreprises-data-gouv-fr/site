import { createFileRoute } from "@tanstack/react-router";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/habilitation/prestataires"
)({
  component: RouteComponent,
  errorComponent: HeaderConnexionError,
});

function RouteComponent() {
  return <div>Hello "/_header-connexion/connexion/habilitation"!</div>;
}
