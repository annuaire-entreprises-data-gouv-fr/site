import { createFileRoute } from "@tanstack/react-router";
import { HeaderHomeError } from "./-error";

export const Route = createFileRoute("/_header-home/")({
  component: RouteComponent,
  errorComponent: HeaderHomeError,
});

function RouteComponent() {
  return <div>Hello "/_header-home/"!</div>;
}
