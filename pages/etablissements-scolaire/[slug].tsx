import { GetServerSideProps } from 'next';
import React from 'react';
import { EducationNationaleEtablisssmentsSection } from '#components/education-nationale';
import Title, { FICHE } from '#components/title-section';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  getUaiFromSlug,
  IEducationNationaleEtablissement,
} from '#models/education-nationale';
import { IUniteLegale } from '#models/index';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  uai: IEducationNationaleEtablissement[] | IAPINotRespondingError;
}

const EtablissementScolaire: React.FC<IProps> = ({
  uniteLegale,
  metadata,
  uai,
}) => {
  return (
    <Page
      small={true}
      title={'Établissement scolaire'}
      noIndex={true}
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <div className="content-container">
        <Title
          ficheType={FICHE.ETABLISSEMENTS_SCOLAIRE}
          uniteLegale={uniteLegale}
        />
        <EducationNationaleEtablisssmentsSection etablissements={uai} />
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    const { uniteLegale, uai } = await getUaiFromSlug(slug);
    return {
      props: {
        uniteLegale,
        uai,
      },
    };
  }
);

export default EtablissementScolaire;
