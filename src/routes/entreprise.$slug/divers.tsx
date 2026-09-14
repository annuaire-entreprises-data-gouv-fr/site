import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import ConventionsCollectivesSection from "#/components/conventions-collectives-section";
import { NotFound } from "#/components/screens/not-found";
import { getAllIdccWithMetadata } from "#/models/conventions-collectives";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import {
  type Siren,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";

const loadDiversPage = createServerFn()
  .validator(
    z.object({
      siren: z.string(),
    })
  )
  .handler(async ({ data: { siren } }) => {
    const sourcesLastModified =
      await getRechercheEntrepriseSourcesLastModified();
    const ccWithMetadata = await getAllIdccWithMetadata(siren as Siren);

    return { ccWithMetadata, sourcesLastModified };
  });

export const Route = createFileRoute("/entreprise/$slug/divers")({
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    const pageData = await loadDiversPage({
      data: { siren: loaderData.uniteLegale.siren },
    });

    return { ...pageData, uniteLegale: loaderData.uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}/divers`;
    return {
      meta: meta({
        title: `Conventions collectives - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
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
  const { ccWithMetadata, sourcesLastModified } = Route.useLoaderData();

  return (
    <ConventionsCollectivesSection
      ccLastModified={sourcesLastModified.idcc}
      ccWithMetadata={ccWithMetadata}
    />
  );
}
