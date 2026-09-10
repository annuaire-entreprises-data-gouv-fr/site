import { Link } from "#/components/link";
import { FICHE, getUniteLegaleTabs } from "#/components/title-section/tabs";
import { Icon } from "#/components-ui/icon/wrapper";
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

interface ITabPreview {
  isProtected?: boolean;
  label: string;
}

const AGENT_ONLY_LABEL = "Réservé aux agents publics";

const getLabelsAndCertificatesPreview = (
  uniteLegale: IUniteLegale
): ITabPreview[] => {
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

  const labels = [
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

  return labels.map((label) => ({ label }));
};

const getTabPreview = (
  ficheType: FICHE,
  uniteLegale: IUniteLegale
): ITabPreview[] => {
  switch (ficheType) {
    case FICHE.DOCUMENTS:
      return [
        { label: "Justificatifs d’immatriculation" },
        { isProtected: true, label: "Actes et statuts" },
      ];
    case FICHE.DIRIGEANTS:
      if (isCollectiviteTerritoriale(uniteLegale)) {
        return [{ label: "Élus" }, { label: "Organigramme" }];
      }
      if (
        isServicePublic(uniteLegale) &&
        !isServicePublicImmatriculeeAuRNE(uniteLegale)
      ) {
        return [{ label: "Responsables" }, { label: "Organigramme" }];
      }
      if (isAssociation(uniteLegale)) {
        return [{ isProtected: true, label: "Dirigeants de l’association" }];
      }
      return [
        { label: "Dirigeants inscrits au RNE" },
        { isProtected: true, label: "Bénéficiaires effectifs" },
      ];
    case FICHE.FINANCES:
      if (
        isServicePublic(uniteLegale) ||
        isEntrepreneurIndividuel(uniteLegale)
      ) {
        return [
          uniteLegale.complements.aAideMinimis && {
            isProtected: true,
            label: "Aides Minimis",
          },
          uniteLegale.complements.aAideADEME && { label: "Aides ADEME" },
        ].filter((item): item is ITabPreview => Boolean(item));
      }
      if (isAssociation(uniteLegale)) {
        return [
          { label: "Indicateurs financiers" },
          { isProtected: true, label: "Subventions reçues" },
        ];
      }
      return [
        { label: "Indicateurs financiers" },
        { isProtected: true, label: "Bilans au format PDF" },
      ];
    case FICHE.ANNONCES:
      return [
        { label: "Annonces au BODACC" },
        uniteLegale.dateMiseAJourInpi && { label: "Observations au RNE" },
        isAssociation(uniteLegale) && { label: "Annonces au JOAFE" },
      ].filter((item): item is ITabPreview => Boolean(item));
    case FICHE.EFFECTIFS:
      return [{ isProtected: true, label: "Effectifs annuels" }];
    case FICHE.CERTIFICATS: {
      const labels = getLabelsAndCertificatesPreview(uniteLegale);
      return labels.length > 0
        ? labels.slice(0, 2)
        : [{ isProtected: true, label: "Certificats professionnels" }];
    }
    case FICHE.ETABLISSEMENTS_SCOLAIRES:
      return [{ label: "Liste des établissements scolaires" }];
    case FICHE.DIVERS:
      return [{ label: "Détail des conventions collectives" }];
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
                    <li className={styles.previewItem} key={item.label}>
                      <span>{item.label}</span>
                      {item.isProtected && (
                        <span
                          aria-label={AGENT_ONLY_LABEL}
                          className={styles.protectedIcon}
                          role="img"
                          title={AGENT_ONLY_LABEL}
                        >
                          <Icon size={12} slug="lockFill" />
                        </span>
                      )}
                    </li>
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
