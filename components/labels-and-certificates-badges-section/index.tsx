import { LabelAndCertificateBadge } from '#components-ui/badge/frequent';
import InformationTooltip from '../../components-ui/information-tooltip';
import { IUniteLegale } from '../../models';

export const checkHasLabelsAndCertificates = (uniteLegale: IUniteLegale) =>
  uniteLegale.complements.estEntrepreneurSpectacle ||
  uniteLegale.complements.estEss ||
<<<<<<< HEAD
  uniteLegale.complements.estBio ||
=======
  uniteLegale.complements.egaproRenseignee ||
>>>>>>> ae3cc914 (feat: adding egapro data)
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
    statutBio,
  } = uniteLegale.complements;

  return (
    <>
      {estBio &&
        (statutBio === 'valide' ? (
          <InformationTooltip label="Cette structure est un professionnel du Bio">
            <LabelAndCertificateBadge label="Professionnel du Bio" />
          </InformationTooltip>
        ) : (
          <InformationTooltip label="Cette structure est un professionnel du Bio, mais n’a pas de certificat en cours de validité">
            <LabelAndCertificateBadge label="Professionnel du Bio (non certifié)" />
          </InformationTooltip>
        ))}
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
