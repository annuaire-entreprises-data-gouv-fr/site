import { Metadata } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from '#components/badges-section/labels-and-certificates';
import { OpqibiSection } from '#components/espace-agent-components/certifications/opqibi-section';
import { QualibatSection } from '#components/espace-agent-components/certifications/qualibat-section';
import { QualifelecSection } from '#components/espace-agent-components/certifications/qualifelec-section';
import { CertificationsBioSection } from '#components/labels-and-certificates/bio';
import { EgaproSection } from '#components/labels-and-certificates/egapro';
import { CertificationsEntrepreneurSpectaclesSection } from '#components/labels-and-certificates/entrepreneur-spectacles';
import { EntrepriseInclusiveSection } from '#components/labels-and-certificates/entreprise-inclusive';
import { CertificationESSSection } from '#components/labels-and-certificates/ess';
import { OrganismeDeFormationSection } from '#components/labels-and-certificates/organismes-de-formation';
import { CertificationsRGESection } from '#components/labels-and-certificates/rge';
import { CertificationSocieteMission } from '#components/labels-and-certificates/societe-mission';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getCertificationsFromSlug } from '#models/certifications';
import {
  getProtectedCertificats,
  hasProtectedCertificatsEntreprise,
} from '#models/espace-agent/certificats';
import { isNotAuthorized } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return {
    title: `Qualités, labels et certificats - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/labels-certificats/${uniteLegale.siren}`,
    },
  };
};

const LabelsAndCertificatsPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  const {
    estEss,
    estRge,
    estSocieteMission,
    estOrganismeFormation,
    egaproRenseignee,
    estBio,
    estEntrepreneurSpectacle,
    estEntrepriseInclusive,
  } = uniteLegale.complements;

  const [
    {
      rge,
      entrepreneurSpectacles,
      egapro,
      bio,
      organismesDeFormation,
      ess,
      entrepriseInclusive,
    },
    protectedCertificats,
  ] = await Promise.all([
    getCertificationsFromSlug(uniteLegale),
    getProtectedCertificats(uniteLegale, session),
  ]);

  return (
    <>
      <div className="content-container">
        <Title
          ficheType={FICHE.CERTIFICATS}
          uniteLegale={uniteLegale}
          session={session}
        />
        {!checkHasLabelsAndCertificates(uniteLegale) &&
          !hasProtectedCertificatsEntreprise(protectedCertificats) && (
            <p>Cette structure ne possède aucun label ou certificat.</p>
          )}
        {estEss && <CertificationESSSection ess={ess} />}
        {estSocieteMission && <CertificationSocieteMission />}
        {estEntrepriseInclusive && (
          <EntrepriseInclusiveSection
            entrepriseInclusive={entrepriseInclusive}
          />
        )}
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
        {estBio && (
          <CertificationsBioSection uniteLegale={uniteLegale} bio={bio} />
        )}
        {!isNotAuthorized(protectedCertificats.qualifelec) && (
          <QualifelecSection qualifelec={protectedCertificats.qualifelec} />
        )}
        {!isNotAuthorized(protectedCertificats.qualibat) && (
          <QualibatSection qualibat={protectedCertificats.qualibat} />
        )}
        {!isNotAuthorized(protectedCertificats.opqibi) && (
          <OpqibiSection opqibi={protectedCertificats.opqibi} />
        )}
      </div>
    </>
  );
};

export default LabelsAndCertificatsPage;
