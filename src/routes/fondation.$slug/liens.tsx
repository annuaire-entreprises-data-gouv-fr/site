import { createFileRoute } from "@tanstack/react-router";
import { fondationPageTitle } from "#/utils/helpers/formatting/fondation-label";
import { meta } from "#/utils/seo";

export const Route = createFileRoute("/fondation/$slug/liens")({
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;
    return loaderData;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: meta({
            title: `Liens - ${fondationPageTitle(loaderData.fondation)}`,
            description: "Liens entre cette fondation et d’autres organismes.",
            robots: "noindex",
          }),
        }
      : meta.notFound(),
  component: () => (
    <section>
      <h2>Liens entre organismes</h2>
      <p>
        Les liens de cette fondation avec d’autres organismes seront disponibles
        prochainement.
      </p>
    </section>
  ),
});
