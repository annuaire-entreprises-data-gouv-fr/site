import { createFileRoute, notFound } from "@tanstack/react-router";
import DirigeantsFondationSection from "#/components/screens/fondation.$slug/dirigeants";
import { NotFound } from "#/components/screens/not-found";
import { useAuth } from "#/contexts/auth.context";
import {
  fondationPageDescription,
  fondationPageTitle,
} from "#/utils/helpers/formatting/fondation-label";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/fondation/$slug/dirigeants")({
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    return loaderData;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { fondation } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/fondation/${fondation.id}/dirigeants`;
    return {
      meta: meta({
        title: `Dirigeants - ${fondationPageTitle(fondation)}`,
        description: fondationPageDescription(fondation),
        robots: "noindex",
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { fondation } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <DirigeantsFondationSection
      fondation={fondation}
      key={fondation.id}
      user={user}
    />
  );
}
