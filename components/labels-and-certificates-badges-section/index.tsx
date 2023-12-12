import { LabelAndCertificateBadge } from '#components-ui/badge/frequent';
import { EAdministration } from '#models/administrations/EAdministration';
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
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure appartient au champ de l’Economie Sociale et Solidaire"
          label="ESS - Entreprise Sociale et Solidaire"
          sectionId="ess"
          siren={uniteLegale.siren}
        />
      )}
      {estSocieteMission && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure est une société à mission"
          label="Société à mission"
          sectionId="societe-a-mission"
          siren={uniteLegale.siren}
        />
      )}
      {estOrganismeFormation &&
        (estQualiopi ? (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure est déclarée en tant qu’organisme de formation et elle est certifiée Qualiopi"
            label="Organisme de formation (certifié Qualiopi)"
            sectionId="organisme-de-formation"
            siren={uniteLegale.siren}
          />
        ) : (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure est déclarée en tant qu’organisme de formation"
            label="Organisme de formation"
            sectionId="organisme-de-formation"
            siren={uniteLegale.siren}
          />
        ))}
      {estBio && (
        <LabelWithLinkToSection
          label="Professionnel du Bio"
          informationTooltipLabel="Cette structure est un professionnel du Bio"
          sectionId="professionnel-du-bio"
          siren={uniteLegale.siren}
        />
      )}
      {egaproRenseignee && (
        <LabelWithLinkToSection
          label="Égalité professionnelle"
          informationTooltipLabel="Cette structure a renseigné ses déclarations d’égalité entre les femmes et les hommes"
          sectionId="egalite-professionnelle"
          siren={uniteLegale.siren}
        />
      )}
      {estRge && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure est Reconnue Garante de l’Environnement"
          label="RGE - Reconnu Garant de l’Environnement"
          sectionId="rge"
          siren={uniteLegale.siren}
        />
      )}
      {estEntrepreneurSpectacle &&
        (statutEntrepreneurSpectacle !== 'valide' ? (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure a demandé un récépissé de déclaration d’entrepreneur de spectacles vivants, mais le statut du récépissé n’est pas valide (en cours d’instruction ou invalide)"
            label="Entrepreneur de spectacles vivants (pas de récépissé valide)"
            sectionId="entrepreneur-spectacles"
            siren={uniteLegale.siren}
          />
        ) : (
          <LabelWithLinkToSection
            informationTooltipLabel="Cette structure possède un récépissé de déclaration d’entrepreneur de spectacles vivants"
            label="Entrepreneur de spectacles vivants"
            sectionId="entrepreneur-spectacles"
            siren={uniteLegale.siren}
          />
        ))}
    </>
  );
};

function LabelWithLinkToSection({
  label,
  informationTooltipLabel,
  sectionId,
  siren,
}: {
  label: string;
  informationTooltipLabel: string;
  sectionId: string;
  siren: string;
}) {
  return (
    <InformationTooltip label={informationTooltipLabel} cursor="pointer">
      <LabelAndCertificateBadge
        label={label}
        link={{
          href: `/labels-certificats/${siren}#${sectionId}`,
          'aria-label': `Consulter la section ${label} pour cette structure`,
        }}
      />
    </InformationTooltip>
  );
}
