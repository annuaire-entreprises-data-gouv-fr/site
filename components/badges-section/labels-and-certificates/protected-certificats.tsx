'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { Loader } from '#components-ui/loader';
import NonRenseigne from '#components/non-renseigne';
import { isAPILoading } from '#models/api-loading';
import { isAPINotResponding } from '#models/api-not-responding';
import constants from '#models/constants';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import {
  LabelsAndCertificatesBadgesSection,
  checkHasLabelsAndCertificates,
} from '.';
import { IUniteLegale } from '../../../models/core/types';
import { LabelWithLinkToSection } from './label-with-link-to-section';

export const ProtectedCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const hasOtherCertificates = checkHasLabelsAndCertificates(uniteLegale);
  const opqibi = useAPIRouteData('espace-agent/opqibi', uniteLegale.siren);
  const qualibat = useAPIRouteData(
    'espace-agent/qualibat',
    uniteLegale.siege.siret
  );
  const qualifelec = useAPIRouteData(
    'espace-agent/qualifelec',
    uniteLegale.siege.siret
  );

  if (
    isAPINotResponding(opqibi) &&
    isAPINotResponding(qualibat) &&
    isAPINotResponding(qualifelec)
  ) {
    return hasOtherCertificates ? (
      <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />
    ) : (
      <NonRenseigne />
    );
  }

  if (
    isAPILoading(opqibi) ||
    isAPILoading(qualibat) ||
    isAPILoading(qualifelec)
  ) {
    return <Loader />;
  }

  return (
    <>
      <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />
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
    </>
  );
};
