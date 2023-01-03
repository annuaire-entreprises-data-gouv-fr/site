import { GetServerSideProps } from 'next';
import React from 'react';
import Immatriculations from '#components/immatriculations';
import Title, { FICHE } from '#components/title-section';
import getJustificatifs, { IJustificatifs } from '#models/justificatifs';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IJustificatifs, IPropsWithMetadata {}

const JustificatifPage: React.FC<IProps> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
  metadata,
}) => (
  <Page
    small={true}
    title={`Justificatif d’immatriculation - ${uniteLegale.nomComplet}`}
    noIndex={true}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.JUSTIFICATIFS} />
      <Immatriculations
        immatriculationRNM={immatriculationRNM}
        immatriculationRNCS={immatriculationRNCS}
        immatriculationJOAFE={immatriculationJOAFE}
        uniteLegale={uniteLegale}
      />
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    return {
      props: await getJustificatifs(slug),
    };
  }
);

export default JustificatifPage;
