import { GetServerSideProps } from 'next';
import React from 'react';
import { checkHasLabelsAndCertificates } from '#components/labels-and-certificates-badges-section';
import { CertificationsBioSection } from '#components/labels-and-certificates/bio';
import { EgaproSection } from '#components/labels-and-certificates/egapro';
import { CertificationsEntrepreneurSpectaclesSection } from '#components/labels-and-certificates/entrepreneur-spectacles';
import { CertificationESSSection } from '#components/labels-and-certificates/ess';
import { OrganismeDeFormation } from '#components/labels-and-certificates/organisme-de-formation';
import { CertificationsRGESection } from '#components/labels-and-certificates/rge';
import Meta from '#components/meta';
import Title, { FICHE } from '#components/title-section';
import {
  getCertificationsFromSlug,
  ICertifications,
} from '#models/certifications';
import { getNomComplet } from '#models/statut-diffusion';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, ICertifications {}

const LabelsAndCertificatsPage: NextPageWithLayout<IProps> = ({
  bio,
  rge,
  egapro,
  uniteLegale,
  entrepreneurSpectacles,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        title={`Labels et certificats - ${getNomComplet(uniteLegale)}`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.CERTIFICATS}
          uniteLegale={uniteLegale}
          session={session}
        />
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
        {uniteLegale.complements.egaproRenseignee && (
          <EgaproSection egapro={egapro} />
        )}
        {uniteLegale.complements.estEntrepreneurSpectacle && (
          <CertificationsEntrepreneurSpectaclesSection
            entrepreneurSpectacles={entrepreneurSpectacles}
          />
        )}
        {/* Can be quite long  */}
        {uniteLegale.complements.estBio && (
          <CertificationsBioSection uniteLegale={uniteLegale} bio={bio} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, rge, entrepreneurSpectacles, egapro, bio } =
      await getCertificationsFromSlug(slug);

    return {
      props: {
        bio,
        egapro,
        entrepreneurSpectacles,
        rge,
        uniteLegale,
      },
    };
  }
);

export default LabelsAndCertificatsPage;
