import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Question } from "#/components/question";

export const Route = createFileRoute("/_header-search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <Question />
    </>
  );
}
