import { LabelAndCertificateBadge } from '#components-ui/badge/frequent';
import InformationTooltip from '../../components-ui/information-tooltip';
import { IUniteLegale } from '../../models';

export const checkHasLabelsAndCertificates = (uniteLegale: IUniteLegale) =>
  uniteLegale.complements.estEntrepreneurSpectacle ||
  uniteLegale.complements.estEss ||
  uniteLegale.complements.estBio ||
  uniteLegale.complements.egaproRenseignee ||
  uniteLegale.complements.estRge;

export const LabelsAndCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const {
    estEntrepreneurSpectacle,
    statutEntrepreneurSpectacle,
    estEss,
    estRge,
    estBio,
    egaproRenseignee,
  } = uniteLegale.complements;

  return (
    <>
      {estBio && (
        <InformationTooltip label="Cette structure est un professionnel du Bio">
          <LabelAndCertificateBadge label="Professionnel du Bio" />
        </InformationTooltip>
      )}
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
      {egaproRenseignee && (
        <InformationTooltip label="Cette structure a renseigné son indice d’égalité entre les femmes et les hommes">
          <LabelAndCertificateBadge label="Egapro" />
        </InformationTooltip>
      )}
      {estEntrepreneurSpectacle &&
        (statutEntrepreneurSpectacle !== 'valide' ? (
          <InformationTooltip label="Cette structure a demandé un récépissé de déclaration d’entrepreneur de spectacles vivants, mais le statut du récépissé n’est pas valide (en cours d’instruction ou invalide)">
            <LabelAndCertificateBadge label="Entrepreneur de spectacles vivants (pas de récépissé valide)" />
          </InformationTooltip>
        ) : (
          <InformationTooltip label="Cette structure possède un récépissé de déclaration d’entrepreneur de spectacles vivants">
            <LabelAndCertificateBadge label="Entrepreneur de spectacles vivants" />
          </InformationTooltip>
        ))}
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
