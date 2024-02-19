import { GetServerSideProps } from 'next';
import BreakPageForPrint from '#components-ui/print-break-page';
import BeneficiairesSection from '#components/dirigeants-section/beneficiaires';
import ResponsableSection from '#components/dirigeants-section/responsables-service-public';
import DirigeantsSection from '#components/dirigeants-section/rne-dirigeants';
import DirigeantSummary from '#components/dirigeants-section/summary';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Meta from '#components/meta';
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
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsPageRouter from '#utils/server-side-props-helper/extract-params-page-router';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent } from '#utils/session';
import { useFetchImmatriculationRNE } from 'hooks';
import useSession from 'hooks/use-session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  servicePublic: IServicePublic | IAPINotRespondingError | null;
}

const DirigeantsPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  servicePublic,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
        noIndex={true}
        title={`Dirigeants de la structure - ${uniteLegalePageTitle(
          uniteLegale,
          session
        )}`}
        description={uniteLegalePageDescription(uniteLegale, session)}
      />
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
};

function DirigeantInformation({ uniteLegale }: { uniteLegale: IUniteLegale }) {
  const immatriculationRNE = useFetchImmatriculationRNE(uniteLegale);
  const session = useSession();
  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {estDiffusible(uniteLegale) || isAgent(session) ? (
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

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsPageRouter(context);

    const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });
    const servicePublic = await getServicePublicByUniteLegale(uniteLegale, {
      isBot,
    });

    return {
      props: {
        uniteLegale: await getUniteLegaleFromSlug(slug, { isBot }),
        servicePublic,
      },
    };
  }
);

export default DirigeantsPage;
