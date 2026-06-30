import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
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
import { HeaderDefaultError } from "./-error";
import "maplibre-gl/dist/maplibre-gl.css";
import "carte-facile/carte-facile.css";
import { clientGeo } from "#/clients/api-geo";
import { CollectiviteMap } from "#/components/collectivite/map";

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
  const { uniteLegale, geoCommune } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.COLLECTIVITE}
        uniteLegale={uniteLegale}
        user={user}
      />
      {estNonDiffusibleStrict(uniteLegale) ? (
        <NonDiffusibleStrictSection />
      ) : (
        <CollectiviteMap geoCommune={geoCommune} uniteLegale={uniteLegale} />
      )}
    </div>
  );
}
