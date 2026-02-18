"use client";

import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import ButtonLink from "#components-ui/button";
import { Icon } from "#components-ui/icon/wrapper";
import { Modal } from "#components-ui/modal";
import { Tag } from "#components-ui/tag";
import type { IAgentsOrganizationGroup } from "#models/authentication/group";
import {
  ApplicationRights,
  getRightsForGroupScopes,
} from "#models/authentication/user/rights";
import styles from "./styles.module.css";

interface IOrganisationGroupsModalProps {
  groups: IAgentsOrganizationGroup[];
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const rewordedRights = {
  [ApplicationRights.nonDiffusible]: "Données des entreprises non diffusibles",
  [ApplicationRights.actesRne]: "Actes au RNE",
  [ApplicationRights.bilansRne]: "Bilans au RNE",
  [ApplicationRights.documentsRne]: "Documents au RNE",
  [ApplicationRights.protectedCertificats]:
    "Certificats Qualifelec, Qualibat et OPQIBI",
  [ApplicationRights.associationProtected]:
    "Actes, statuts et données des dirigeants des associations",
  [ApplicationRights.mandatairesRCS]: "État civil des dirigeants d’entreprise",
  [ApplicationRights.beneficiaires]: "Registre des bénéficiaires effectifs",
  [ApplicationRights.conformiteFiscale]: "Attestations de conformité fiscale",
  [ApplicationRights.conformiteSociale]: "Attestations de conformité sociale",
  [ApplicationRights.subventionsAssociation]: "Subventions des associations",
  [ApplicationRights.effectifsAnnuels]: "Effectifs annuels (RCD)",
  [ApplicationRights.bilansBDF]: "Bilans (Banque de France)",
  [ApplicationRights.chiffreAffaires]: "Chiffres d’affaires (DGFiP)",
  [ApplicationRights.liensCapitalistiques]: "Lens capitalistiques (DGFiP)",
  [ApplicationRights.travauxPublics]: "Données relatives aux travaux publics",
  [ApplicationRights.liassesFiscales]: "Liasses fiscales (DGFiP)",
};

const ExpandableGroupRow = ({ group }: { group: IAgentsOrganizationGroup }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const rights = useMemo(
    () =>
      getRightsForGroupScopes(group.scopes).filter(
        (scope) =>
          scope !== ApplicationRights.isAgent &&
          scope !== ApplicationRights.opendata &&
          scope !== ApplicationRights.administrateur
      ),
    [group.scopes]
  );

  const handleJoinGroupClicked = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.stopPropagation();
    },
    []
  );

  const mailtoUrl = `${group.adminEmails.join(",") || ""}?subject=${encodeURIComponent(`Demande d'accès au groupe « ${group.name} »`)}&body=${encodeURIComponent(`Bonjour,

Serait-il possible de m'ajouter au groupe « ${group.name} » sur l'espace agent de l'Annuaire des Entreprises
(${process.env.NEXT_PUBLIC_BASE_URL}/compte/mes-groupes#group-${group.id}) ?

Cet accès me permettra de consulter les données auxquelles vous êtes habilités.

Je vous remercie par avance pour votre aide.

Cordialement,`)}`;

  return (
    <>
      <tr
        className={styles.groupRow}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td>{group.name}</td>
        <td>
          {group.adminEmails.length > 0 ? group.adminEmails.join(", ") : "N/A"}
        </td>
        <td>
          <div className={styles.joinGroupButton}>
            <ButtonLink
              alt
              onClick={handleJoinGroupClicked}
              small
              to={mailtoUrl}
            >
              Rejoindre
            </ButtonLink>
          </div>
        </td>
        <td>
          <div className={styles.chevronContainer}>
            <Icon slug={isExpanded ? "chevronUp" : "chevronDown"} />
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td
            colSpan={4}
            style={{ backgroundColor: "var(--background-alt-grey)" }}
          >
            <p className="fr-text--bold fr-pt-1w">
              Données accessibles par le groupe :
            </p>
            <div className={clsx(styles.expandedGroupRow, "fr-py-1w")}>
              <div className={styles.expandedGroupRowRights}>
                {rights.map((right) => (
                  <Tag color="success" key={right} size="small">
                    {rewordedRights[right]}
                  </Tag>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const OrganisationGroupsModal = ({
  groups,
  isVisible,
  onConfirm,
  onCancel,
}: IOrganisationGroupsModalProps) => (
  <Modal
    isVisible={isVisible}
    modalId="organisation-groups-modal"
    onClose={onCancel}
    size="full"
    textAlign="left"
  >
    <div className="fr-container">
      <div className="fr-mb-4w">
        <h2 className="fr-h2">Demander une habilitation</h2>
        <p className="fr-text--lg">
          <strong>Rejoindre un groupe existant</strong>
          <br />
          <br />
          Certains groupes existent déjà au sein de votre organisation.
        </p>

        <div className="fr-table fr-table--no-scroll">
          <div className={clsx(styles.tableFullWidth, "fr-table__wrapper")}>
            <div className="fr-table__container">
              <div className="fr-table__content">
                <table className={styles.tableFullWidth}>
                  <caption hidden>Groupes existants</caption>
                  <thead>
                    <tr>
                      <th className={styles.groupNameColumn} scope="col">
                        Nom du groupe
                      </th>
                      <th className={styles.adminColumn} scope="col">
                        Administrateur
                      </th>
                      <th className={styles.actionColumn} scope="col">
                        <span className="fr-sr-only">Actions</span>
                      </th>
                      <th className={styles.chevronColumn} scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <ExpandableGroupRow group={group} key={group.id} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <p className="fr-text--lg">
          <strong>OU</strong>
          <br />
          <br />
          <strong>Créer un nouveau groupe</strong>
          <br />
          <br />
          Votre groupe n'est pas répertorié ? Faites une demande d'habilitation
          pour en créer un nouveau.
        </p>
      </div>

      <div className="fr-btns-group fr-btns-group--left">
        <div style={{ width: "fit-content" }}>
          <ButtonLink onClick={onConfirm}>
            Faire une demande d'habilitation
          </ButtonLink>
        </div>
      </div>
    </div>
  </Modal>
);
