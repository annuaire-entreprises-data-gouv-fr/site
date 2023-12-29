import { GetServerSideProps } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from '#components/labels-and-certificates-badges-section';
import { CertificationsBioSection } from '#components/labels-and-certificates/bio';
import { EgaproSection } from '#components/labels-and-certificates/egapro';
import { CertificationsEntrepreneurSpectaclesSection } from '#components/labels-and-certificates/entrepreneur-spectacles';
import { CertificationESSSection } from '#components/labels-and-certificates/ess';
import { OrganismeDeFormationSection } from '#components/labels-and-certificates/organismes-de-formation';
import { CertificationsRGESection } from '#components/labels-and-certificates/rge';
import { CertificationSocieteMission } from '#components/labels-and-certificates/societe-mission';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import {
  ICertifications,
  getCertificationsFromSlug,
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
  organismesDeFormation,
  ess,
  metadata: { session },
}) => {
  const {
    estEss,
    estRge,
    estSocieteMission,
    estOrganismeFormation,
    egaproRenseignee,
    estBio,
    estEntrepreneurSpectacle,
  } = uniteLegale.complements;

  return (
    <>
      <Meta
        title={`Labels et certificats - ${getNomComplet(uniteLegale, session)}`}
        canonical={`https://annuaire-entreprises.data.gouv.fr/labels-certificats/${uniteLegale.siren}`}
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
        {estEss && <CertificationESSSection ess={ess} />}
        {estSocieteMission && <CertificationSocieteMission />}
        {checkHasQuality(uniteLegale) && <HorizontalSeparator />}
        {estRge && (
          <CertificationsRGESection
            uniteLegale={uniteLegale}
            certificationsRGE={rge}
            session={session}
          />
        )}
        {estOrganismeFormation && (
          <OrganismeDeFormationSection
            organismesDeFormation={organismesDeFormation}
            uniteLegale={uniteLegale}
          />
        )}
        {egaproRenseignee && <EgaproSection egapro={egapro} />}
        {estEntrepreneurSpectacle && (
          <CertificationsEntrepreneurSpectaclesSection
            entrepreneurSpectacles={entrepreneurSpectacles}
          />
        )}
        {/* Can be quite long  */}
        {estBio && (
          <CertificationsBioSection uniteLegale={uniteLegale} bio={bio} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsFromContext(context);

    const {
      uniteLegale,
      rge,
      entrepreneurSpectacles,
      egapro,
      bio,
      organismesDeFormation,
      ess,
    } = await getCertificationsFromSlug(slug, isBot);

    return {
      props: {
        bio,
        egapro,
        entrepreneurSpectacles,
        rge,
        uniteLegale,
        organismesDeFormation,
        ess,
      },
    };
  }
);

export default LabelsAndCertificatsPage;
