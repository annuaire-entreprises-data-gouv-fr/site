import { createFileRoute } from "@tanstack/react-router";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/mentions-legales")({
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return <div>Hello "/_header-default/mentions-legales"!</div>;
}
