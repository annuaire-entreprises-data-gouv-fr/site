import { Icon } from '#components-ui/icon/wrapper';
import { isAPINotResponding } from '#models/api-not-responding';
import constants from '#models/constants';
import { IProtectedCertificatsEntreprise } from '#models/espace-agent/certificats';
import { IUniteLegale } from '../../../models/core/types';
import { LabelWithLinkToSection } from './label-with-link-to-section';

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
  protectedCertificats: IProtectedCertificatsEntreprise | null;
}> = ({ uniteLegale, protectedCertificats }) => {
  if (!protectedCertificats) {
    return null;
  }
  const { opqibi, qualibat, qualifelec } = protectedCertificats;

  if (
    isAPINotResponding(opqibi) &&
    isAPINotResponding(qualibat) &&
    isAPINotResponding(qualifelec)
  ) {
    return null;
  }

  return (
    <div
      style={{
        borderRadius: '30px',
        border: `2px solid ${constants.colors.espaceAgentPastel}`,
        paddingLeft: '8px',
        display: 'inline-block',
      }}
    >
      <Icon slug="lockFill" color={constants.colors.espaceAgent}>
        {!isAPINotResponding(opqibi) && (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure possède une certification délivrée par l'association OPQIBI, attestant de ses différentes qualifications d'ingénierie"
            label="OPQIBI - Ingénierie"
            sectionId="opqibi"
            siren={uniteLegale.siren}
          />
        )}
        {!isAPINotResponding(qualibat) && (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure a obtenue un label de fiabilité QUALIBAT, garantissant sa qualification dans le bâtiment"
            label="QUALIBAT - Bâtiment"
            sectionId="qualibat"
            siren={uniteLegale.siren}
          />
        )}
        {!isAPINotResponding(qualifelec) && (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure est certifiée par QUALIFELEC, attestant de ses qualifications dans le domaine du génie électrique et énergétique"
            label="QUALIFELEC - Génie électrique"
            sectionId="qualifelec"
            siren={uniteLegale.siren}
          />
        )}
      </Icon>
    </div>
  );
};
