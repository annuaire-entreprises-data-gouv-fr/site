import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { EtablissementsScolairesSection } from "#/components/education-nationale";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { useAuth } from "#/contexts/auth.context";
import { getEtablissementsScolaires } from "#/models/etablissements-scolaires";
import { meta } from "#/seo";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

const loadEtablissementsScolairesPage = createServerFn()
  .inputValidator(z.object({ slug: z.string(), page: z.number() }))
  .handler(async ({ data: { slug, page } }) => {
    const uniteLegale = await getUniteLegaleFromSlugFn({
      data: { slug },
    });
    const etablissementsScolaires = await getEtablissementsScolaires(
      uniteLegale.siren,
      page
    );

    return { uniteLegale, etablissementsScolaires };
  });

export const Route = createFileRoute(
  "/_header-default/etablissements-scolaires/$slug"
)({
  validateSearch: z.object({
    page: z.number().min(1).catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ page: 1 })],
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ params, deps }) =>
    await loadEtablissementsScolairesPage({
      data: { slug: params.slug, page: deps.page },
    }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: meta({
          title: "Page non trouvée",
          robots: {
            follow: false,
          },
        }),
      };
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/etablissements-scolaires/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Établissements scolaires - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: {
          follow: true,
          index: false,
        },
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
});

function RouteComponent() {
  const { uniteLegale, etablissementsScolaires } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.ETABLISSEMENTS_SCOLAIRES}
        uniteLegale={uniteLegale}
        user={user}
      />
      <EtablissementsScolairesSection
        etablissements={etablissementsScolaires}
      />
    </div>
  );
}
