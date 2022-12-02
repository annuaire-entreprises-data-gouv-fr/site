import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import { IUniteLegale } from '../../models';
import ElusSection from '../../components/dirigeants-section/elus-section';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const ElusPage: React.FC<IProps> = ({ uniteLegale, metadata }) => {
  return (
    <Page
      small={true}
      title={`Élus de ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
      canonical={`https://annuaire-entreprises.data.gouv.fr/elus/${uniteLegale.siren}`}
      noIndex={true}
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <div className="content-container">
        <Title uniteLegale={uniteLegale} ficheType={FICHE.ELUS} />
        <ElusSection uniteLegale={uniteLegale} />
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    const uniteLegale = await getUniteLegaleFromSlug(slug);

    return {
      props: { uniteLegale },
    };
  }
);

export default ElusPage;
