"use client";

import ButtonLink from "#components-ui/button";
import { Modal } from "#components-ui/modal";
import { Tag } from "#components-ui/tag";
import type { IAgentsOrganizationGroup } from "#models/authentication/group";
import {
  ApplicationRights,
  getRightsForGroupScopes,
} from "#models/authentication/user/rights";

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
  [ApplicationRights.beneficiaires]: "Registre des Bénéficiaires Effectifs",
  [ApplicationRights.conformite]:
    "Attestations de conformité fiscale et sociale",
  [ApplicationRights.subventionsAssociation]: "Subventions des associations",
  [ApplicationRights.effectifsAnnuels]: "Effectifs annuels (RCD)",
  [ApplicationRights.bilansBDF]: "Bilans (Banque de France)",
  [ApplicationRights.chiffreAffaires]: "Chiffres d’affaires (DGFiP)",
  [ApplicationRights.liensCapitalistiques]: "Lens capitalistiques (DGFiP)",
  [ApplicationRights.travauxPublics]: "Données relatives aux travaux publics",
  [ApplicationRights.liassesFiscales]: "Liasses fiscales (DGFiP)",
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
          <div className="fr-table__wrapper">
            <div className="fr-table__container">
              <div className="fr-table__content">
                <table>
                  <caption hidden>Groupes existants</caption>
                  <thead>
                    <tr>
                      <th scope="col">Nom du groupe</th>
                      <th scope="col">Habilitations</th>
                      <th scope="col">Administrateur</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr key={group.id}>
                        <td>{group.name}</td>
                        <td className="fr-grid-row">
                          {getRightsForGroupScopes(group.scopes)
                            .filter(
                              (scope) =>
                                scope !== ApplicationRights.isAgent &&
                                scope !== ApplicationRights.opendata &&
                                scope !== ApplicationRights.administrateur
                            )
                            .map((right) => (
                              <Tag color="success" key={right}>
                                {rewordedRights[right]}
                              </Tag>
                            ))}
                        </td>
                        <td>
                          {group.adminEmails.length > 0
                            ? group.adminEmails.join(", ")
                            : "N/A"}
                        </td>
                        <td>
                          <ButtonLink
                            alt
                            to={`${group.adminEmails.join(",")}?subject=${encodeURIComponent(`Demande d'accès au groupe « ${group.name} »`)}&body=${encodeURIComponent(`Bonjour,

Serait-il possible de m'ajouter au groupe « ${group.name} » sur l'espace agent de l'Annuaire des Entreprises
                            (${process.env.NEXT_PUBLIC_BASE_URL}/compte/mes-groupes#group-${group.id}) ?

Cet accès me permettra de consulter les données auxquelles vous êtes habilités.

Je vous remercie par avance pour votre aide.

Cordialement,`)}`}
                          >
                            Rejoindre
                          </ButtonLink>
                        </td>
                      </tr>
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
