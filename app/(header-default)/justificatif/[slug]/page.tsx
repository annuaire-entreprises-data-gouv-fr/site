import { Metadata } from 'next';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { UniteLegaleErrorSection } from '#components/unite-legale-error-section';
import { cachedGetUniteLegale } from '#models/core/unite-legale-cache';
import { hasError } from '#models/core/unite-legale-errors';
import { getImmatriculationJOAFE } from '#models/immatriculation/joafe';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import Immatriculations from './_components';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return {
    title: `Justificatif d’immatriculation - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/justificatif/${uniteLegale.siren}`,
    },
  };
};

const JustificatifPage = async (props: AppRouterProps) => {
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  if (hasError(uniteLegale)) {
    return <UniteLegaleErrorSection uniteLegale={uniteLegale} />;
  }

  const immatriculationJOAFE = await getImmatriculationJOAFE(uniteLegale);
  const session = await getSession();
  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.JUSTIFICATIFS}
          session={session}
        />
        <Immatriculations
          uniteLegale={uniteLegale}
          immatriculationJOAFE={immatriculationJOAFE}
          session={session}
        />
      </div>
    </>
  );
};

export default JustificatifPage;
