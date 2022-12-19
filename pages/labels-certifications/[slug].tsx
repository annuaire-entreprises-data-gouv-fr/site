import { CertificationsEntrepreneurSpectaclesSection } from '#components/labels-and-certificates/entrepreneur-spectacles';
import { CertificationESSSection } from '#components/labels-and-certificates/ess';
import { CertificationsRGESection } from '#components/labels-and-certificates/rge';
import Title, { FICHE } from '#components/title-section';
import { checkHasLabelsAndCertificates } from '#components/unite-legale-section/labels-and-certificates';
import {
  getCertificationsFromSlug,
  ICertifications,
} from '#models/certifications';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { GetServerSideProps } from 'next';
import React from 'react';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata, ICertifications {}

const RGE: React.FC<IProps> = ({
  rge,
  uniteLegale,
  entrepreneurSpectacles,
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
        {!checkHasLabelsAndCertificates(uniteLegale) && (
          <p>Cette structure ne possède aucun label ou certificat.</p>
        )}
        {uniteLegale.complements.estRge && (
          <CertificationsRGESection
            uniteLegale={uniteLegale}
            certificationsRGE={rge}
          />
        )}
        {uniteLegale.complements.estEss && <CertificationESSSection />}
        {uniteLegale.complements.estEntrepreneurSpectacle && (
          <CertificationsEntrepreneurSpectaclesSection
            entrepreneurSpectacles={entrepreneurSpectacles}
          />
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, rge, entrepreneurSpectacles } =
      await getCertificationsFromSlug(slug);

    return {
      props: {
        rge,
        uniteLegale,
        entrepreneurSpectacles,
      },
    };
  }
);

export default RGE;
