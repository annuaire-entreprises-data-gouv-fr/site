import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import z from "zod";
import { DonneesPriveesSection } from "#/components/donnees-privees-section";
import AnnoncesBodacc from "#/components/screens/annonces.$slug/bodacc";
import AnnoncesJOAFESection from "#/components/screens/annonces.$slug/joafe";
import { ObservationsRNE } from "#/components/screens/annonces.$slug/observations-rne";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estDiffusible } from "#/models/core/diffusion";
import { isAssociation } from "#/models/core/types";
import { meta } from "#/seo";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/annonces/$slug")({
  validateSearch: z.object({
    "annonces-bodacc-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ "annonces-bodacc-page": 1 })],
  },
  loader: async ({ params }) => {
    const uniteLegale = await getUniteLegaleFromSlugFn({
      data: { slug: params.slug },
    });

    return { uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/annonces/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Annonces légales (BODACC, JOAFE) - ${uniteLegalePageTitle(
          uniteLegale
        )}`,
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
});

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();

  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title ficheType={FICHE.ANNONCES} uniteLegale={uniteLegale} user={user} />
      {estDiffusible(uniteLegale) ||
      hasRights({ user }, ApplicationRights.nonDiffusible) ? (
        <>
          <ul>
            <li>
              <a href="#annonces-bodacc">Annonces au BODACC</a>
            </li>
            {uniteLegale.dateMiseAJourInpi && (
              <li>
                <a href="#observations-rne">Observations au RNE</a>
              </li>
            )}
            {isAssociation(uniteLegale) && (
              <li>
                <a href="#annonces-joafe">Annonces au JOAFE</a>
              </li>
            )}
          </ul>
          <AnnoncesBodacc uniteLegale={uniteLegale} />
          {uniteLegale.dateMiseAJourInpi && (
            <ObservationsRNE uniteLegale={uniteLegale} />
          )}
          {isAssociation(uniteLegale) && (
            <AnnoncesJOAFESection uniteLegale={uniteLegale} />
          )}
        </>
      ) : (
        <DonneesPriveesSection title="Annonces" />
      )}
    </div>
  );
}
