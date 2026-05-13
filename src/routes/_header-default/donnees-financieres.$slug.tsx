import { createFileRoute } from "@tanstack/react-router";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/donnees-financieres/$slug"
)({
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return <div>Hello "/_header-default/donnees-financieres/$slug"!</div>;
}
