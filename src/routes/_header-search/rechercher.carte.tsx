import { createFileRoute } from "@tanstack/react-router";
import { HeaderSearchError } from "./-error";

export const Route = createFileRoute("/_header-search/rechercher/carte")({
  component: RouteComponent,
  errorComponent: HeaderSearchError,
});

function RouteComponent() {
  return <div>Hello "/_header-search/rechercher/carte"!</div>;
}
