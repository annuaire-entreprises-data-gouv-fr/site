import { GetServerSideProps } from 'next';
import Immatriculations from '#components/immatriculations';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import getJustificatifs, { IJustificatifs } from '#models/justificatifs';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { useFetchImmatriculationRNE } from 'hooks';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IJustificatifs, IPropsWithMetadata {}

const JustificatifPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  immatriculationJOAFE,
  metadata: { session },
}) => {
  const immatriculationRNE = useFetchImmatriculationRNE(uniteLegale);
  return (
    <>
      <Meta
        title={`Justificatif d’immatriculation - ${uniteLegalePageTitle(
          uniteLegale,
          session
        )}`}
        description={uniteLegalePageDescription(uniteLegale, session)}
        canonical={`https://annuaire-entreprises.data.gouv.fr/justificatif/${uniteLegale.siren}`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.JUSTIFICATIFS}
          session={session}
        />
        <Immatriculations
          immatriculationJOAFE={immatriculationJOAFE}
          immatriculationRNE={immatriculationRNE}
          uniteLegale={uniteLegale}
          session={session}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsFromContext(context);

    return {
      props: {
        ...(await getJustificatifs(slug, isBot)),
      },
    };
  }
);

export default JustificatifPage;
