"use client";

import ButtonLink from "#components-ui/button";
import { FullScreenModal } from "#components-ui/full-screen-modal";
import type { IAgentsOrganizationGroup } from "#models/authentication/group";

interface IOrganisationGroupsModalProps {
  groups: IAgentsOrganizationGroup[];
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const OrganisationGroupsModal = ({
  groups,
  isVisible,
  onConfirm,
  onCancel,
}: IOrganisationGroupsModalProps) => (
  <FullScreenModal
    isVisible={isVisible}
    modalId="organisation-groups-modal"
    onClose={onCancel}
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
                      <th scope="col">Administrateur</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr key={group.id}>
                        <td>{group.name}</td>
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
  </FullScreenModal>
);
