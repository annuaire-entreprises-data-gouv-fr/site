import {
  LabelAndCertificateBadge,
  QualiteBadge,
} from '#components-ui/badge/frequent';
import { EAdministration } from '#models/administrations';
import InformationTooltip from '../../components-ui/information-tooltip';
import { IUniteLegale } from '../../models';

export const checkHasQualities = (uniteLegale: IUniteLegale) =>
  qualitiesSources(uniteLegale).length > 0;

export const qualitiesSources = (uniteLegale: IUniteLegale) => {
  const sources = [];
  const { estEss, estSocieteMission } = uniteLegale.complements;
  if (estEss || estSocieteMission) sources.push(EAdministration.INSEE);

  return sources;
};

export const QualitiesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { estEss, estSocieteMission } = uniteLegale.complements;

  return (
    <>
      {estEss && (
        <InformationTooltip label="Cette structure appartient au champ de l’Économie Sociale et Solidaire">
          <QualiteBadge label="ESS - Économie Sociale et Solidaire" />
        </InformationTooltip>
      )}
      {estSocieteMission && (
        <InformationTooltip label="Cette structure est une société à mission">
          <QualiteBadge label="Société à mission" />
        </InformationTooltip>
      )}

      {checkHasQualities(uniteLegale) && (
        <>
          <br />
          <a href={`/labels-certificats/${uniteLegale.siren}`}>
            → en savoir plus
          </a>
        </>
      )}
    </>
  );
};
