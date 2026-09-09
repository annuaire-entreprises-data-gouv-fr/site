import { createFileRoute, notFound } from "@tanstack/react-router";
import LiensFondationSection from "#/components/screens/fondation.$slug/liens";
import { useAuth } from "#/contexts/auth.context";
import { fondationPageTitle } from "#/utils/helpers/formatting/fondation-label";
import { meta } from "#/utils/seo";

export const Route = createFileRoute("/fondation/$slug/liens")({
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;
    if (!loaderData) {
      throw notFound();
    }
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
  component: RouteComponent,
});

function RouteComponent() {
  const { fondation } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <LiensFondationSection
      fondation={fondation}
      key={fondation.id}
      user={user}
    />
  );
}
