import type { Metadata } from "next";
import ConventionsCollectivesSection from "#components/conventions-collectives-section";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import { getAllIdccWithMetadata } from "#models/conventions-collectives";
import { getRechercheEntrepriseSourcesLastModified } from "#models/recherche-entreprise-modified";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import getSession from "#utils/server-side-helper/get-session";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Conventions collectives - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: "noindex",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/divers/${uniteLegale.siren}`,
    },
  };
};

export default async function ConventionCollectivePage(props: AppRouterProps) {
  const session = await getSession();
  const { slug, page, isBot } = await extractParamsAppRouter(props);

  const [uniteLegale, sourcesLastModified] = await Promise.all([
    cachedGetUniteLegale(slug, isBot, page),
    getRechercheEntrepriseSourcesLastModified(),
  ]);

  const ccWithMetadata = await getAllIdccWithMetadata(uniteLegale.siren);

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.DIVERS}
        session={session}
        uniteLegale={uniteLegale}
      />
      <ConventionsCollectivesSection
        ccLastModified={sourcesLastModified.idcc}
        ccWithMetadata={ccWithMetadata}
      />
    </div>
  );
}
