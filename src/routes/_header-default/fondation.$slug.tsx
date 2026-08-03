import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import z from "zod";
import EspaceAgentSummarySection from "#/components/espace-agent-components/summary-section";
import EtablissementListeSection from "#/components/etablissement-liste-section";
import EtablissementSection from "#/components/etablissement-section";
import FondationRNFSection from "#/components/screens/fondation.$slug/rnf-section";
import FondationSummarySection from "#/components/screens/fondation.$slug/summary-section";
import { NotFound } from "#/components/screens/not-found";
import { TitleFondation } from "#/components/title-fondation-section";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getFondationFromSlugFn } from "#/server-functions/public/fondation";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { extractSirenFromSiret } from "#/utils/helpers";
import {
  fondationPageDescription,
  fondationPageTitle,
} from "#/utils/helpers/formatting/fondation-label";
import { meta } from "#/utils/seo";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "./-error";

const loadFondationPage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      slug: z.string(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ data: { slug, page } }) => {
    const [fondation, sourcesLastModified] = await Promise.all([
      getFondationFromSlugFn({ data: { slug, page } }),
      getRechercheEntrepriseSourcesLastModified(),
    ]);

    let uniteLegale: IUniteLegale | null = null;

    if (fondation.siret) {
      const siren = extractSirenFromSiret(fondation.siret);

      uniteLegale = await getUniteLegaleFromSlugFn({
        data: {
          slug: siren,
          page,
        },
      }).catch(() => null);
    }

    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    return {
      fondation,
      uniteLegale,
      isBot,
      sourcesLastModified,
    };
  });

export const Route = createFileRoute("/_header-default/fondation/$slug")({
  validateSearch: z.object({
    page: z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        page: 1,
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  loader: async ({ params, deps }) => {
    const result = await loadFondationPage({
      data: {
        slug: params.slug,
        page: deps.page,
      },
    });

    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { fondation } = loaderData;

    const canonical = `https://annuaire-entreprises.data.gouv.fr/fondation/${fondation.id}`;

    return {
      meta: meta({
        title: fondationPageTitle(fondation),
        description: fondationPageDescription(fondation),
        robots: "index, follow",
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
  const { fondation, uniteLegale } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container">
      <TitleFondation
        fondation={fondation}
        uniteLegale={uniteLegale}
        user={user}
      />
      <FondationSummarySection
        fondation={fondation}
        uniteLegale={uniteLegale}
        user={user}
      />
      <FondationRNFSection fondation={fondation} />
      {!!uniteLegale && (
        <>
          {hasRights({ user }, ApplicationRights.isAgent) && (
            <EspaceAgentSummarySection uniteLegale={uniteLegale} user={user} />
          )}
          <HorizontalSeparator />
          {uniteLegale.siege && (
            <EtablissementSection
              etablissement={uniteLegale.siege}
              uniteLegale={uniteLegale}
              usedInEntreprisePage={true}
              user={user}
              withDenomination={false}
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
        </>
      )}
    </div>
  );
}
