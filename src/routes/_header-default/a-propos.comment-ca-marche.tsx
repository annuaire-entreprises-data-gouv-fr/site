import { createFileRoute } from "@tanstack/react-router";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/a-propos/comment-ca-marche"
)({
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return <div>Hello "/_header-default/a-propos/comment-ca-marche"!</div>;
}
