import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/etablissement/$slug")({
  beforeLoad: async ({ params }) => {
    const slug = params.slug;
    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(slug);

    if (isLikelyASiren(sirenOrSiretSlug)) {
      throw redirect({
        to: "/entreprise/$slug",
        params: { slug: sirenOrSiretSlug },
      });
    }
    if (!isLikelyASiret(sirenOrSiretSlug)) {
      throw notFound();
    }
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return <div>Hello "/_header-default/etablissement/$slug"!</div>;
}
