import { GetServerSideProps } from 'next';
import React from 'react';
import { CertificationsRGESection } from '#components/certifications-rge-section';
import { checkHasLabelsAndCertificates } from '#components/labels-and-certificates';
import { Section } from '#components/section';
import Title, { FICHE } from '#components/title-section';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  getCertificationsFromSlug,
  IRGECertification,
} from '#models/certifications';
import { IUniteLegale } from '#models/index';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  rge: IRGECertification | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const RGE: React.FC<IProps> = ({ rge, uniteLegale, metadata }) => {
  return (
    <Page
      small={true}
      title={`Labels et certifications - ${uniteLegale.nomComplet}`}
      noIndex={true}
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <div className="content-container">
        <Title ficheType={FICHE.CERTIFICATS} uniteLegale={uniteLegale} />
        {!checkHasLabelsAndCertificates(uniteLegale) && (
          <p>Cette structure ne possède aucun label ou certificat.</p>
        )}
        {uniteLegale.complements.estRge && (
          <CertificationsRGESection
            uniteLegale={uniteLegale}
            certificationsRGE={rge}
          />
        )}
        {uniteLegale.complements.estEss && (
          <Section title="ESS - Entreprise Sociale et Solidaire" />
        )}
        {uniteLegale.complements.estEntrepreneurSpectacle && (
          <Section title="Entrepreneur de spectacles vivants" />
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, rge } = await getCertificationsFromSlug(slug);

    return {
      props: {
        rge,
        uniteLegale,
      },
    };
  }
);

export default RGE;
