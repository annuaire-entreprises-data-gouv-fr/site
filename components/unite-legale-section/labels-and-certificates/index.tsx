import InformationTooltip from '../../../components-ui/information-tooltip';
import { VerifiedTag } from '../../../components-ui/verified-tag';
import { IUniteLegale } from '../../../models';

export const checkHasLabelsAndCertificates = (uniteLegale: IUniteLegale) =>
  uniteLegale.complements.estEntrepreneurSpectacle ||
  uniteLegale.complements.estEss ||
  uniteLegale.complements.estRge;

export const LabelsAndCertificates: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  const { estEntrepreneurSpectacle, estEss, estRge } = uniteLegale.complements;

  return (
    <>
      {estEss && (
        <>
          <InformationTooltip
            label="Cette structure appartient au champ de
        l’Economie Sociale et Solidaire"
          >
            <VerifiedTag>ESS - Entreprise Sociale et Solidaire</VerifiedTag>
          </InformationTooltip>
          <br />
        </>
      )}
      {estRge && (
        <>
          <InformationTooltip label="Cette structure est Reconnue Garante de l’Environnement">
            <VerifiedTag>RGE - Reconnu Garant de l’Environnement</VerifiedTag>
          </InformationTooltip>
          <br />
        </>
      )}
      {estEntrepreneurSpectacle && (
        <>
          <InformationTooltip label="Cette structure a une licence d’entrepreneur de spectacles vivants">
            <VerifiedTag>Entrepreneur de spectacles vivants</VerifiedTag>
          </InformationTooltip>
          <br />
        </>
      )}
    </>
  );
};
