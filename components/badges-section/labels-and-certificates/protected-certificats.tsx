import { isAPINotResponding } from '#models/api-not-responding';
import { IProtectedCertificatsEntreprise } from '#models/espace-agent/certificats';
import { isNotAuthorized } from '#models/user/rights';
import { IUniteLegale } from '../../../models/core/types';
import { LabelWithLinkToSection } from './label-with-link-to-section';

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
  protectedCertificats: IProtectedCertificatsEntreprise;
}> = ({ uniteLegale, protectedCertificats }) => {
  const { opqibi, qualibat, qualifelec } = protectedCertificats;

  return (
    <>
      {!isNotAuthorized(opqibi) && !isAPINotResponding(opqibi) && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure possède une certification délivrée par l'association OPQIBI, attestant de ses différentes qualifications d'ingénierie"
          label="OPQIBI - Ingénierie"
          sectionId="opqibi"
          siren={uniteLegale.siren}
        />
      )}
      {!isNotAuthorized(qualibat) && !isAPINotResponding(qualibat) && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure a obtenue un label de fiabilité QUALIBAT, garantissant sa qualification dans le bâtiment"
          label="QUALIBAT - Bâtiment"
          sectionId="qualibat"
          siren={uniteLegale.siren}
        />
      )}
      {!isNotAuthorized(qualifelec) && !isAPINotResponding(qualifelec) && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure est certifiée par QUALIFELEC, attestant de ses qualifications dans le domaine du génie électrique et énergétique"
          label="QUALIFELEC - Génie électrique"
          sectionId="qualifelec"
          siren={uniteLegale.siren}
        />
      )}
    </>
  );
};
