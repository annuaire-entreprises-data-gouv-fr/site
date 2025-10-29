import type { Metadata } from "next";
import { EtablissementsScolairesSection } from "#components/education-nationale";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import { getEtablissementsScolaires } from "#models/etablissements-scolaires";
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
  const { slug, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    title: `Établissements scolaires - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: "noindex",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/etablissements-scolaires/${uniteLegale.siren}`,
    },
  };
};

const EtablissementsScolairesPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot, page } = await extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const etablissementsScolaires = await getEtablissementsScolaires(
    uniteLegale.siren,
    page
  );

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.ETABLISSEMENTS_SCOLAIRES}
        session={session}
        uniteLegale={uniteLegale}
      />
      <EtablissementsScolairesSection
        etablissements={etablissementsScolaires}
      />
    </div>
  );
};

export default EtablissementsScolairesPage;
