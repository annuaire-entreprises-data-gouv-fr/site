import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { NonDiffusibleStrictSection } from "#/components/non-diffusible-section";
import { NotFound } from "#/components/screens/not-found";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { useAuth } from "#/contexts/auth.context";
import { estNonDiffusibleStrict } from "#/models/core/diffusion";
import { isCollectiviteTerritoriale } from "#/models/core/types";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import "maplibre-gl/dist/maplibre-gl.css";
import "carte-facile/carte-facile.css";
import { clientGeo } from "#/clients/api-geo";
import { CollectiviteSidenav } from "#/components/collectivite/sidenav";
import { getUniteLegaleTheme } from "#/utils/get-unite-legale-theme";
import { HeaderDefaultError } from "../-error";

const loadEntreprisePage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      slug: z.string(),
    })
  )
  .handler(async ({ data: { slug } }) => {
    const [uniteLegale, sourcesLastModified] = await Promise.all([
      getUniteLegaleFromSlugFn({ data: { slug } }),
      getRechercheEntrepriseSourcesLastModified(),
    ]);

    if (
      !isCollectiviteTerritoriale(uniteLegale) ||
      uniteLegale.colter.niveau !== "Commune"
    ) {
      throw redirect({
        to: "/entreprise/$slug",
        params: { slug: uniteLegale.siren },
      });
    }

    const geoCommune = await clientGeo(uniteLegale.colter.codeInsee);

    return { uniteLegale, sourcesLastModified, geoCommune };
  });

export const Route = createFileRoute("/_header-default/collectivite/$slug")({
  beforeLoad: async ({ params }) => {
    const slug = params.slug;
    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(slug);

    if (isLikelyASiret(sirenOrSiretSlug)) {
      throw redirect({
        to: "/etablissement/$slug",
        params: { slug: sirenOrSiretSlug },
      });
    }
    if (!isLikelyASiren(sirenOrSiretSlug)) {
      throw notFound();
    }
  },
  loader: async ({ params }) => {
    const result = await loadEntreprisePage({
      data: {
        slug: params.slug,
      },
    });

    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;

    const canonical = `https://annuaire-entreprises.data.gouv.fr/collectivite/${uniteLegale.siren}`;

    return {
      meta: meta({
        title: `Collectivité - ${uniteLegalePageTitle(uniteLegale)}`,
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
  const { uniteLegale } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container" style={getUniteLegaleTheme(uniteLegale)}>
      <Title
        ficheType={FICHE.COLLECTIVITE}
        uniteLegale={uniteLegale}
        user={user}
      />
      {estNonDiffusibleStrict(uniteLegale) ? (
        <NonDiffusibleStrictSection />
      ) : (
        <div className="fr-grid-row fr-grid-row--gutters fr-mt-4w">
          <div className="fr-col-12 fr-col-md-9">
            <Outlet />
          </div>
          <div className="fr-col-12 fr-col-md-3">
            <CollectiviteSidenav slug={uniteLegale.siren} />
          </div>
        </div>
      )}
    </div>
  );
}
