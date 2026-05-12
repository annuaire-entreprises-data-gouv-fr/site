import { createFileRoute } from "@tanstack/react-router";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/formulaire/supprimer-donnees-personnelles-entreprise"
)({
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return (
    <div>
      Hello
      "/_header-default/formulaire/supprimer-donnees-personnelles-entreprise"!
    </div>
  );
}
