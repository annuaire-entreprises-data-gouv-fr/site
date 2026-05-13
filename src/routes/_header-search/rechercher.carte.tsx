import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { queryString } from "#/utils/query";
import { HeaderSearchError } from "./-error";
import { beforeLoadCheckTerme } from "./-loader";

export const Route = createFileRoute("/_header-search/rechercher/carte")({
  validateSearch: z.object({
    terme: queryString.optional(),
  }),
  loaderDeps: ({ search }) => ({ terme: search.terme }),
  beforeLoad: async (ctx) => {
    const searchTerm = ctx.search.terme;

    beforeLoadCheckTerme(searchTerm);
  },
  component: RouteComponent,
  errorComponent: HeaderSearchError,
});

function RouteComponent() {
  return <div>Hello "/_header-search/rechercher/carte"!</div>;
}
