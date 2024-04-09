import { cache } from 'react';
import BreakPageForPrint from '#components-ui/print-break-page';
import BeneficiairesSection from '#components/dirigeants-section/beneficiaires';
import ResponsableSection from '#components/dirigeants-section/responsables-service-public';
import DirigeantsSection from '#components/dirigeants-section/rne-dirigeants';
import DirigeantSummary from '#components/dirigeants-section/summary';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { estDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  IServicePublic,
  getServicePublicByUniteLegale,
} from '#models/service-public';
import { EScope, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { useFetchImmatriculationRNE } from 'hooks';
import useSession from 'hooks/use-session';

const generateMetadata = async (appRouterProps: AppRouterProps) => {
  const props = await getServerSideProps(appRouterProps);
  const session = await getSession();
  return {
    title: `Dirigeants de la structure - ${uniteLegalePageTitle(
      props.uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(props.uniteLegale, session),
    canonical: `https://annuaire-entreprises.data.gouv.fr/dirigeants/${props.uniteLegale.siren}`,
    noIndex: true,
  };
};
async function DirigeantsPage(props: AppRouterProps) {
  const { uniteLegale, servicePublic } = await getServerSideProps(props);
  const session = await getSession();
  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DIRIGEANTS}
          session={session}
        />
        {servicePublic ? (
          <ResponsableSection servicePublic={servicePublic} />
        ) : (
          <DirigeantInformation uniteLegale={uniteLegale} />
        )}
      </div>
    </>
  );
}

function DirigeantInformation({ uniteLegale }: { uniteLegale: IUniteLegale }) {
  const immatriculationRNE = useFetchImmatriculationRNE(uniteLegale);
  const session = useSession();
  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {estDiffusible(uniteLegale) ||
      hasRights(session, EScope.nonDiffusible) ? (
        <>
          <DirigeantsSection
            immatriculationRNE={immatriculationRNE}
            uniteLegale={uniteLegale}
          />
          <BreakPageForPrint />
          <BeneficiairesSection
            immatriculationRNE={immatriculationRNE}
            uniteLegale={uniteLegale}
          />
        </>
      ) : (
        <DonneesPriveesSection />
      )}
    </>
  );
}

type IProps = {
  uniteLegale: IUniteLegale;
  servicePublic: IServicePublic | IAPINotRespondingError | null;
};
const getServerSideProps = cache(async function getServerSideProps(
  props: AppRouterProps
): Promise<IProps> {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });
  const servicePublic = await getServicePublicByUniteLegale(uniteLegale, {
    isBot,
  });

  return {
    uniteLegale: await getUniteLegaleFromSlug(slug, { isBot }),
    servicePublic,
  };
});

export default DirigeantsPage;
