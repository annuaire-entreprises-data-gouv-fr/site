import type { Metadata } from "next";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import { isAssociation } from "#models/core/types";
import { uniteLegalePageTitle } from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import getSession from "#utils/server-side-helper/get-session";
import DonneesFinancieresAssociation from "./_components/donnees-financieres-association";
import DonneesFinancieresSociete from "./_components/donnees-financieres-societe";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    robots: "noindex",
    title: `Données financières - ${uniteLegalePageTitle(uniteLegale)}`,
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/donnees-financieres/${uniteLegale.siren}`,
    },
  };
};

const FinancePage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = await extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return (
    <>
      <div className="content-container">
        <Title
          ficheType={FICHE.FINANCES}
          session={session}
          uniteLegale={uniteLegale}
        />
        {isAssociation(uniteLegale) ? (
          <DonneesFinancieresAssociation uniteLegale={uniteLegale} />
        ) : (
          <DonneesFinancieresSociete
            session={session}
            uniteLegale={uniteLegale}
          />
        )}
      </div>
    </>
  );
};

export default FinancePage;
