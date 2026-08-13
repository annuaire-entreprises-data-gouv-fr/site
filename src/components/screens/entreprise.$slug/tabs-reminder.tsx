import { Link } from "#/components/link";
import { FICHE, getUniteLegaleTabs } from "#/components/title-section/tabs";
import { PrintNever } from "#/components-ui/print-visibility";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  type IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isServicePublic,
  isServicePublicImmatriculeeAuRNE,
} from "#/models/core/types";
import styles from "./tabs-reminder.module.css";

interface ITabsReminderProps {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}

const getLabelsAndCertificatesPreview = (
  uniteLegale: IUniteLegale
): string[] => {
  const {
    bilanGesRenseigne,
    egaproRenseignee,
    estAchatsResponsables,
    estAlimConfiance,
    estBio,
    estEntrepriseInclusive,
    estEntrepreneurSpectacle,
    estEss,
    estFiness,
    estOrganismeFormation,
    estPatrimoineVivant,
    estQualiopi,
    estRge,
    estSocieteMission,
  } = uniteLegale.complements;

  return [
    estRge && "RGE",
    estQualiopi && "Qualiopi",
    estBio && "Professionnel du Bio",
    estEss && "Économie sociale et solidaire",
    estSocieteMission && "Société à mission",
    estEntrepriseInclusive && "Entreprise inclusive",
    estFiness && "Établissements sanitaires et sociaux",
    estOrganismeFormation && !estQualiopi && "Organisme de formation",
    egaproRenseignee && "Égalité professionnelle",
    estEntrepreneurSpectacle && "Entrepreneur de spectacles",
    estAchatsResponsables && "Achats responsables",
    estPatrimoineVivant && "Entreprise du patrimoine vivant",
    estAlimConfiance && "Alim’Confiance",
    bilanGesRenseigne && "Bilans GES",
  ].filter((label): label is string => Boolean(label));
};

const getTabPreview = (
  ficheType: FICHE,
  uniteLegale: IUniteLegale
): string[] => {
  switch (ficheType) {
    case FICHE.DOCUMENTS:
      return ["Justificatifs d’immatriculation", "Actes et statuts"];
    case FICHE.DIRIGEANTS:
      if (isCollectiviteTerritoriale(uniteLegale)) {
        return ["Élus", "Organigramme"];
      }
      if (
        isServicePublic(uniteLegale) &&
        !isServicePublicImmatriculeeAuRNE(uniteLegale)
      ) {
        return ["Responsables", "Organigramme"];
      }
      if (isAssociation(uniteLegale)) {
        return ["Dirigeants de l’association", "Bénéficiaires effectifs"];
      }
      return ["Dirigeants inscrits au RNE", "Bénéficiaires effectifs"];
    case FICHE.FINANCES:
      if (
        isServicePublic(uniteLegale) ||
        isEntrepreneurIndividuel(uniteLegale)
      ) {
        return [
          uniteLegale.complements.aAideMinimis && "Aides Minimis",
          uniteLegale.complements.aAideADEME && "Aides ADEME",
        ].filter((label): label is string => Boolean(label));
      }
      return ["Indicateurs financiers", "Bilans et comptes"];
    case FICHE.ANNONCES:
      return [
        "Annonces au BODACC",
        uniteLegale.dateMiseAJourInpi && "Observations au RNE",
        isAssociation(uniteLegale) && "Annonces au JOAFE",
      ].filter((label): label is string => Boolean(label));
    case FICHE.EFFECTIFS:
      return ["Effectifs annuels"];
    case FICHE.CERTIFICATS: {
      const labels = getLabelsAndCertificatesPreview(uniteLegale);
      return labels.length > 0
        ? labels.slice(0, 2)
        : ["Certificats professionnels"];
    }
    case FICHE.ETABLISSEMENTS_SCOLAIRES:
      return ["Liste des établissements scolaires"];
    case FICHE.DIVERS:
      return ["Détail des conventions collectives"];
    default:
      return [];
  }
};

export const TabsReminder = ({ uniteLegale, user }: ITabsReminderProps) => {
  const tabs = getUniteLegaleTabs(uniteLegale, user).filter(
    ({ ficheType, shouldDisplay }) =>
      shouldDisplay && ficheType !== FICHE.INFORMATION
  );

  return (
    <PrintNever>
      <section
        aria-labelledby="tabs-reminder-title"
        className={styles.tabsReminder}
      >
        <h2 id="tabs-reminder-title">
          À découvrir aussi pour cette structure&nbsp;:
        </h2>
        <ul className={styles.cards}>
          {tabs.map(({ ficheType, label, noFollow, params, to }) => (
            <li key={ficheType}>
              <Link
                className={`${styles.card} no-style-link`}
                params={params}
                rel={noFollow ? "nofollow" : undefined}
                to={to}
              >
                <h3>{label}</h3>
                <ul className={styles.preview}>
                  {getTabPreview(ficheType, uniteLegale).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className={styles.viewAll}>→ Tout voir</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PrintNever>
  );
};
