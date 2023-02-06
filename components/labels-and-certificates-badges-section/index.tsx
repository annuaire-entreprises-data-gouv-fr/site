import { LabelAndCertificateBadge } from '#components-ui/badge/frequent';
import InformationTooltip from '../../components-ui/information-tooltip';
import { IUniteLegale } from '../../models';

export const checkHasLabelsAndCertificates = (uniteLegale: IUniteLegale) =>
  uniteLegale.complements.estEntrepreneurSpectacle ||
  uniteLegale.complements.estEss ||
  uniteLegale.complements.estRge;

export const LabelsAndCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { estEntrepreneurSpectacle, estEss, estRge } = uniteLegale.complements;

  return (
    <>
      {estEss && (
        <InformationTooltip
          label="Cette structure appartient au champ de
        l’Economie Sociale et Solidaire"
        >
          <LabelAndCertificateBadge label="ESS - Entreprise Sociale et Solidaire" />
        </InformationTooltip>
      )}
      {estRge && (
        <InformationTooltip label="Cette structure est Reconnue Garante de l’Environnement">
          <LabelAndCertificateBadge label="RGE - Reconnu Garant de l’Environnement" />
        </InformationTooltip>
      )}
      {estEntrepreneurSpectacle && (
        <InformationTooltip label="Cette structure a une licence d’entrepreneur de spectacles vivants">
          <LabelAndCertificateBadge label="Entrepreneur de spectacles vivants" />
        </InformationTooltip>
      )}
      {checkHasLabelsAndCertificates(uniteLegale) && (
        <>
          <br />
          <a rel="nofollow" href={`/labels-certificats/${uniteLegale.siren}`}>
            → en savoir plus
          </a>
        </>
      )}
    </>
  );
};
