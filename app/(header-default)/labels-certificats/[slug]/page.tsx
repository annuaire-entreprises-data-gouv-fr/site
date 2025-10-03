import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from "#components/badges-section/labels-and-certificates";
import { LabelAchatsResponsables } from "#components/labels-and-certificates/achats-responsables";
import BilanGesSection from "#components/labels-and-certificates/bilan-ges";
import { CertificationsBioSection } from "#components/labels-and-certificates/bio";
import { EgaproSection } from "#components/labels-and-certificates/egapro";
import { CertificationsEntrepreneurSpectaclesSection } from "#components/labels-and-certificates/entrepreneur-spectacles";
import { EntrepriseInclusiveSection } from "#components/labels-and-certificates/entreprise-inclusive";
import { CertificationESSSection } from "#components/labels-and-certificates/ess";
import { OrganismeDeFormationSection } from "#components/labels-and-certificates/organismes-de-formation";
import { LabelPatrimoineVivant } from "#components/labels-and-certificates/patrimoine-vivant";
import { CertificationsRGESection } from "#components/labels-and-certificates/rge";
import { CertificationSocieteMission } from "#components/labels-and-certificates/societe-mission";
import { OpqibiSection } from "#components/protected-certificates/opqibi-section";
import { QualibatSection } from "#components/protected-certificates/qualibat-section";
import { QualifelecSection } from "#components/protected-certificates/qualifelec-section";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import { getCertificationsFromSlug } from "#models/certifications";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/app/cached-methods";
import extractParamsAppRouter, {
  AppRouterProps,
} from "#utils/server-side-helper/app/extract-params";
import getSession from "#utils/server-side-helper/app/get-session";
import AlimConfianceSection from "app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/alim-confiance/section";
import { Metadata } from "next";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    title: `Qualités, labels et certificats - ${uniteLegalePageTitle(
      uniteLegale
    )}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: "noindex",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/labels-certificats/${uniteLegale.siren}`,
    },
  };
};

const LabelsAndCertificatsPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = await extractParamsAppRouter(props);
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
    estAchatsResponsables,
    estPatrimoineVivant,
    estAlimConfiance,
    bilanGesRenseigne,
  } = uniteLegale.complements;

  const {
    rge,
    entrepreneurSpectacles,
    egapro,
    bio,
    organismesDeFormation,
    ess,
    entrepriseInclusive,
  } = await getCertificationsFromSlug(uniteLegale);

  return (
    <>
      <div className="content-container">
        <Title
          ficheType={FICHE.CERTIFICATS}
          uniteLegale={uniteLegale}
          session={session}
        />
        {!checkHasLabelsAndCertificates(uniteLegale) &&
          !hasRights(session, ApplicationRights.protectedCertificats) && (
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
        {hasRights(session, ApplicationRights.protectedCertificats) && (
          <>
            <QualibatSection session={session} uniteLegale={uniteLegale} />
            <QualifelecSection session={session} uniteLegale={uniteLegale} />
            <OpqibiSection session={session} uniteLegale={uniteLegale} />
          </>
        )}
        {estOrganismeFormation && (
          <OrganismeDeFormationSection
            organismesDeFormation={organismesDeFormation}
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
        {estAchatsResponsables && <LabelAchatsResponsables />}
        {estPatrimoineVivant && <LabelPatrimoineVivant />}
        {estAlimConfiance && (
          <AlimConfianceSection uniteLegale={uniteLegale} session={session} />
        )}
        {bilanGesRenseigne && (
          <BilanGesSection uniteLegale={uniteLegale} session={session} />
        )}
      </div>
    </>
  );
};

export default LabelsAndCertificatsPage;
