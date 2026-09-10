import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { EtablissementsScolairesSection } from "#/components/education-nationale";
import { NotFound } from "#/components/screens/not-found";
import { getEtablissementsScolaires } from "#/models/etablissements-scolaires";
import {
  type Siren,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";

const loadEtablissementsScolairesPage = createServerFn()
  .validator(z.object({ siren: z.string(), page: z.number() }))
  .handler(async ({ data: { siren, page } }) => {
    const etablissementsScolaires = await getEtablissementsScolaires(
      siren as Siren,
      page
    );

    return { etablissementsScolaires };
  });

export const Route = createFileRoute(
  "/entreprise/$slug/etablissements-scolaires"
)({
  validateSearch: z.object({
    page: z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ page: 1 })],
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ parentMatchPromise, deps }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    const { uniteLegale } = loaderData;

    const pageData = await loadEtablissementsScolairesPage({
      data: { siren: uniteLegale.siren, page: deps.page },
    });

    return { ...pageData, uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}/etablissements-scolaires`;
    return {
      meta: meta({
        title: `Établissements scolaires - ${uniteLegalePageTitle(uniteLegale)}`,
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
  const { etablissementsScolaires } = Route.useLoaderData();

  return (
    <EtablissementsScolairesSection etablissements={etablissementsScolaires} />
  );
}
