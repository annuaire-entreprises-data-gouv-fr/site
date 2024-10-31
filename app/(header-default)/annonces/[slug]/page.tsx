import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { estDiffusible } from '#models/core/diffusion';
import { isAssociation } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import AnnoncesBodacc from 'app/(header-default)/annonces/[slug]/_components/bodacc';
import AnnoncesJOAFESection from 'app/(header-default)/annonces/[slug]/_components/joafe';
import { Metadata } from 'next';
import { ObservationsRNE } from './_components/observations-rne';

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
        hasRights(session, ApplicationRights.nonDiffusible) ? (
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
              <ObservationsRNE uniteLegale={uniteLegale} session={session} />
            )}
            {isAssociation(uniteLegale) && (
              <AnnoncesJOAFESection uniteLegale={uniteLegale} />
            )}
          </>
        ) : (
          <DonneesPriveesSection />
        )}
      </div>
    </>
  );
};

export default AnnoncesPage;
