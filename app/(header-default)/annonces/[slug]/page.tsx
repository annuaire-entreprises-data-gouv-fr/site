import { Metadata } from 'next';
import AnnoncesBodacc from '#components/annonces-section/annonces/bodacc';
import AnnoncesJOAFESection from '#components/annonces-section/annonces/joafe';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { estDiffusible } from '#models/core/diffusion';
import { isAssociation } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    title: `Annonces légales (BODACC, JOAFE) - ${uniteLegalePageTitle(
      uniteLegale
    )}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/annonces/${uniteLegale.siren}`,
    },
  };
};
const AnnoncesPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return (
    <>
      <div className="content-container">
        <Title
          ficheType={FICHE.ANNONCES}
          uniteLegale={uniteLegale}
          session={session}
        />
        {estDiffusible(uniteLegale) ||
        hasRights(session, EScope.nonDiffusible) ? (
          <AnnoncesBodacc uniteLegale={uniteLegale} />
        ) : (
          <DonneesPriveesSection />
        )}
        {isAssociation(uniteLegale) && (
          <AnnoncesJOAFESection uniteLegale={uniteLegale} />
        )}
      </div>
    </>
  );
};

export default AnnoncesPage;
