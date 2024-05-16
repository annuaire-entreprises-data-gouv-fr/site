import { Icon } from '#components-ui/icon/wrapper';
import NonRenseigne from '#components/non-renseigne';
import { isAPINotResponding } from '#models/api-not-responding';
import constants from '#models/constants';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { ISession } from '#models/user/session';
import { IUniteLegale } from '../../../models/core/types';
import { LabelWithLinkToSection } from './label-with-link-to-section';

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
  hasOtherCertificates: boolean;
}> = async ({ uniteLegale, session, hasOtherCertificates }) => {
  const [opqibi, qualifelec, qualibat] = await Promise.all([
    getOpqibi(uniteLegale.siren, session?.user?.siret),
    getQualifelec(uniteLegale.siege.siret, session?.user?.siret),
    getQualibat(uniteLegale.siege.siret, session?.user?.siret),
  ]);

  if (
    isAPINotResponding(opqibi) &&
    isAPINotResponding(qualibat) &&
    isAPINotResponding(qualifelec)
  ) {
    return hasOtherCertificates ? null : <NonRenseigne />;
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
