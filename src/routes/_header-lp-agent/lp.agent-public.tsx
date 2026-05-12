import { createFileRoute } from "@tanstack/react-router";
import { HeaderLpAgentError } from "./-error";

export const Route = createFileRoute("/_header-lp-agent/lp/agent-public")({
  component: RouteComponent,
  errorComponent: HeaderLpAgentError,
});

function RouteComponent() {
  return <div>Hello "/_header-lp-agent/lp/agent-public"!</div>;
}
