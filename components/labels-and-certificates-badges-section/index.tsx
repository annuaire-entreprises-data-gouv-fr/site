import { LabelAndCertificateBadge } from '#components-ui/badge/frequent';
import { EAdministration } from '#models/administrations';
import InformationTooltip from '../../components-ui/information-tooltip';
import { IUniteLegale } from '../../models';

export const checkHasQuality = (uniteLegale: IUniteLegale) =>
  uniteLegale.complements.estEss || uniteLegale.complements.estSocieteMission;

export const checkHasLabelsAndCertificates = (uniteLegale: IUniteLegale) =>
  labelsAndCertificatesSources(uniteLegale).length > 0;

export const labelsAndCertificatesSources = (uniteLegale: IUniteLegale) => {
  const sources = [];
  const {
    estEntrepreneurSpectacle,
    estEss,
    estBio,
    egaproRenseignee,
    estOrganismeFormation,
    estSocieteMission,
    estQualiopi,
    estRge,
  } = uniteLegale.complements;
  if (estEntrepreneurSpectacle) sources.push(EAdministration.MC);
  if (estEss || estSocieteMission) sources.push(EAdministration.INSEE);
  if (estBio) sources.push(EAdministration.AGENCE_BIO);
  if (egaproRenseignee || estOrganismeFormation || estQualiopi)
    sources.push(EAdministration.MTPEI);
  if (estRge) sources.push(EAdministration.ADEME);

  return sources;
};

export const LabelsAndCertificatesBadgesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const {
    estEntrepreneurSpectacle,
    statutEntrepreneurSpectacle,
    estEss,
    estRge,
    estOrganismeFormation,
    estQualiopi,
    estBio,
    egaproRenseignee,
    estSocieteMission,
  } = uniteLegale.complements;

  return (
    <>
      {estEss && (
        <InformationTooltip label="Cette structure appartient au champ de l’Economie Sociale et Solidaire">
          <LabelAndCertificateBadge label="ESS - Entreprise Sociale et Solidaire" />
        </InformationTooltip>
      )}
      {estSocieteMission && (
        <InformationTooltip label="Cette structure est une société à mission">
          <LabelAndCertificateBadge label="Société à mission" />
        </InformationTooltip>
      )}
      {estOrganismeFormation &&
        (estQualiopi ? (
          <InformationTooltip label="Cette structure est déclarée en tant qu’organisme de formation et elle est certifiée Qualiopi">
            <LabelAndCertificateBadge label="Organisme de formation (certifié Qualiopi)" />
          </InformationTooltip>
        ) : (
          <InformationTooltip label="Cette structure est déclarée en tant qu’organisme de formation">
            <LabelAndCertificateBadge label="Organisme de formation" />
          </InformationTooltip>
        ))}
      {estBio && (
        <InformationTooltip label="Cette structure est un professionnel du Bio">
          <LabelAndCertificateBadge label="Professionnel du Bio" />
        </InformationTooltip>
      )}
      {egaproRenseignee && (
        <InformationTooltip label="Cette structure a renseigné ses déclarations d’égalité entre les femmes et les hommes">
          <LabelAndCertificateBadge label="Égalité professionnelle" />
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
          <a href={`/labels-certificats/${uniteLegale.siren}`}>
            → en savoir plus
          </a>
        </>
      )}
    </>
  );
};
