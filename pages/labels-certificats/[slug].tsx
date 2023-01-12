import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';
import { CertificationsEntrepreneurSpectaclesSection } from '#components/labels-and-certificates/entrepreneur-spectacles';
import { CertificationESSSection } from '#components/labels-and-certificates/ess';
import { CertificationsRGESection } from '#components/labels-and-certificates/rge';
import { Layout } from '#components/layout';
import Meta from '#components/meta';
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
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, ICertifications {}

const RGE: NextPageWithLayout<IProps> = ({
  rge,
  uniteLegale,
  entrepreneurSpectacles,
  metadata,
}) => {
  return (
    <>
      <Meta
        title={`Labels et certificats - ${uniteLegale.nomComplet}`}
        noIndex={true}
      />
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
    </>
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

RGE.getLayout = function getLayout(page: ReactElement, isBrowserOutdated) {
  return <Layout isBrowserOutdated={isBrowserOutdated}>{page}</Layout>;
};

export default RGE;
