import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { LabelWithLinkToSection } from './label-with-link-to-section';

export const checkHasQuality = (uniteLegale: IUniteLegale) =>
  uniteLegale.complements.estEss ||
  uniteLegale.complements.estSocieteMission ||
  uniteLegale.complements.estEntrepriseInclusive;

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
    estEntrepriseInclusive,
    estAchatsResponsables,
    estPatrimoineVivant,
    estAlimConfiance,
    bilanGesRenseigne,
  } = uniteLegale.complements;
  if (estEntrepreneurSpectacle) sources.push(EAdministration.MC);
  if (estEss || estSocieteMission) sources.push(EAdministration.INSEE);
  if (estBio) sources.push(EAdministration.AGENCE_BIO);
  if (egaproRenseignee || estOrganismeFormation || estQualiopi)
    sources.push(EAdministration.MTPEI);
  if (estRge) sources.push(EAdministration.ADEME);
  if (estEntrepriseInclusive) sources.push(EAdministration.MARCHE_INCLUSION);
  if (estAchatsResponsables) sources.push(EAdministration.MEF);
  if (estPatrimoineVivant) sources.push(EAdministration.MEF);
  if (estAlimConfiance) sources.push(EAdministration.MAA);
  if (bilanGesRenseigne) sources.push(EAdministration.ADEME);
  return sources;
};

export const checkHasLabelsAndCertificates = (uniteLegale: IUniteLegale) =>
  labelsAndCertificatesSources(uniteLegale).length > 0;

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
    estEntrepriseInclusive,
    typeEntrepriseInclusive,
    estAchatsResponsables,
    estPatrimoineVivant,
    estAlimConfiance,
    bilanGesRenseigne,
  } = uniteLegale.complements;

  return (
    <>
      {estEss && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure appartient au champ de l’Economie Sociale et Solidaire"
          label="ESS - Économie Sociale et Solidaire"
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
      {estEntrepriseInclusive && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure est une Entreprise Inclusive"
          label={`Entreprise Sociale Inclusive (${typeEntrepriseInclusive})`}
          sectionId="entreprise-inclusive"
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
      {estAchatsResponsables && (
        <LabelWithLinkToSection
          informationTooltipLabel="Ce label distingue les structures ayant fait la preuve de relations durables et équilibrées avec leurs fournisseurs."
          label="Achats Responsables"
          sectionId="achats-responsables"
          siren={uniteLegale.siren}
        />
      )}
      {estPatrimoineVivant && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure est labelisée Entreprise du Patrimoine Vivant"
          label="Entreprise du Patrimoine Vivant"
          sectionId="patrimoine-vivant"
          siren={uniteLegale.siren}
        />
      )}
      {estAlimConfiance && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure dispose de résultats de contrôles sanitaires (Alim'Confiance)"
          label="Alim'Confiance"
          sectionId="alim-confiance"
          siren={uniteLegale.siren}
        />
      )}
      {bilanGesRenseigne && (
        <LabelWithLinkToSection
          informationTooltipLabel="Cette structure dispose de bilans GES disponibles (Gaz à Effet de Serre)"
          label="Bilans GES (Gaz à Effet de Serre)"
          sectionId="bilan-ges"
          siren={uniteLegale.siren}
        />
      )}
    </>
  );
};
