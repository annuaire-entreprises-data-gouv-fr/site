import { Metadata } from 'next';
import AnnoncesBodacc from '#components/annonces-section/annonces/bodacc';
import AnnoncesJOAFESection from '#components/annonces-section/annonces/joafe';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { UniteLegaleErrorSection } from '#components/unite-legale-error-section';
import { estDiffusible } from '#models/core/statut-diffusion';
import { isAssociation } from '#models/core/types';
import { cachedGetUniteLegale } from '#models/core/unite-legale-cache';
import { hasError } from '#models/core/unite-legale-errors';
import { EScope, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return {
    title: `Annonces légales (BODACC, JOAFE) - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/annonces/${uniteLegale.siren}`,
    },
  };
};
const AnnoncesPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  if (hasError(uniteLegale)) {
    return <UniteLegaleErrorSection uniteLegale={uniteLegale} />;
  }

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
