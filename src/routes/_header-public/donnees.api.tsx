import { createFileRoute } from "@tanstack/react-router";
import { HeaderPublicError } from "./-error";

export const Route = createFileRoute("/_header-public/donnees/api")({
  component: RouteComponent,
  errorComponent: HeaderPublicError,
});

function RouteComponent() {
  return <div>Hello "/_header-public/donnees/api"!</div>;
}
