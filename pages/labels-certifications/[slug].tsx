import { GetServerSideProps } from 'next';
import React from 'react';
import { CertificationsRGESection } from '#components/certifications-rge-section';
import Title, { FICHE } from '#components/title-section';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  getRGECertificationsFromSlug,
  IRGECompanyCertifications,
} from '#models/certifications';
import { IUniteLegale } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  certificationsRGE: IRGECompanyCertifications | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const RGE: React.FC<IProps> = ({
  certificationsRGE,
  uniteLegale,
  metadata,
}) => {
  return (
    <Page
      small={true}
      title={`Labels et certifications - ${uniteLegale.nomComplet}`}
      noIndex={true}
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <div className="content-container">
        <Title ficheType={FICHE.CERTIFICATS} uniteLegale={uniteLegale} />
        <CertificationsRGESection
          uniteLegale={uniteLegale}
          certificationsRGE={certificationsRGE}
        />
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    const uniteLegale = await getUniteLegaleFromSlug(slug);
    const certificationsRGE = await getRGECertificationsFromSlug(slug);
    return {
      props: {
        certificationsRGE,
        uniteLegale,
      },
    };
  }
);

export default RGE;
