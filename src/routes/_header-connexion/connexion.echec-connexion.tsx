import { createFileRoute } from "@tanstack/react-router";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/echec-connexion"
)({
  component: RouteComponent,
  errorComponent: HeaderConnexionError,
});

function RouteComponent() {
  return <div>Hello "/_header-connexion/connexion/echec-connexion"!</div>;
}
