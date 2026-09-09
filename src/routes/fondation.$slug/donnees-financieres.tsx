import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import z from "zod";
import DonneesFinancieresAssociation from "#/components/screens/donnees-financieres.$slug/donnees-financieres-association";
import DonneesFinancieresSociete from "#/components/screens/donnees-financieres.$slug/donnees-financieres-societe";
import ConformiteComptableFondationSection from "#/components/screens/fondation.$slug/donnees-financieres/conformite-comptable";
import IndicateursFinanciersFondationSection from "#/components/screens/fondation.$slug/donnees-financieres/indicateurs-financiers";
import { NotFound } from "#/components/screens/not-found";
import { useAuth } from "#/contexts/auth.context";
import { isAssociation } from "#/models/core/types";
import {
  fondationPageDescription,
  fondationPageTitle,
} from "#/utils/helpers/formatting/fondation-label";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/fondation/$slug/donnees-financieres")({
  validateSearch: z.object({
    "aides-ademe-page": z.number().min(1).optional().default(1).catch(1),
    "aides-minimis-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [
      stripSearchParams({ "aides-ademe-page": 1, "aides-minimis-page": 1 }),
    ],
  },
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
    const canonical = `https://annuaire-entreprises.data.gouv.fr/fondation/${fondation.id}/donnees-financieres`;
    return {
      meta: meta({
        title: `Données financières - ${fondationPageTitle(fondation)}`,
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
  const { fondation, uniteLegale } = Route.useLoaderData();
  const { user } = useAuth();

  const summaryItems = (
    <>
      <li>
        <a href="#indicateurs-financiers-rnf">Indicateurs financiers du RNF</a>
      </li>
      <li>
        <a href="#conformite-comptable-rnf">Conformité comptable</a>
      </li>
    </>
  );
  const rnfSections = (
    <>
      <IndicateursFinanciersFondationSection
        fondation={fondation}
        key={`indicateurs-${fondation.id}`}
        user={user}
      />
      <ConformiteComptableFondationSection
        fondation={fondation}
        key={`conformite-${fondation.id}`}
        user={user}
      />
    </>
  );

  if (!uniteLegale) {
    return (
      <>
        <nav aria-labelledby="finances-fondation-summary-title">
          <strong id="finances-fondation-summary-title">
            Informations financières disponibles :
          </strong>
          <ul>{summaryItems}</ul>
          <br />
        </nav>
        {rnfSections}
      </>
    );
  }

  return isAssociation(uniteLegale) ? (
    <DonneesFinancieresAssociation
      additionalSummaryItems={summaryItems}
      uniteLegale={uniteLegale}
      user={user}
    >
      {rnfSections}
    </DonneesFinancieresAssociation>
  ) : (
    <DonneesFinancieresSociete
      additionalSummaryItems={summaryItems}
      uniteLegale={uniteLegale}
      user={user}
    >
      {rnfSections}
    </DonneesFinancieresSociete>
  );
}
