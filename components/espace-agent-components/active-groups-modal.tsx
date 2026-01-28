"use client";

import ButtonLink from "#components-ui/button";
import { Loader } from "#components-ui/loader";
import { Modal } from "#components-ui/modal";
import type { IAgentsGroup } from "#models/authentication/group";
import styles from "./styles.module.css";

interface IActiveGroupsModalProps {
  groups: IAgentsGroup[];
  isVisible: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ActiveGroupsModal = ({
  groups,
  isVisible,
  isLoading,
  onConfirm,
  onCancel,
}: IActiveGroupsModalProps) => (
  <Modal
    isVisible={isVisible}
    modalId="no-groups-modal"
    onClose={onCancel}
    textAlign="left"
  >
    <div className="fr-container">
      <div className="fr-mb-4w">
        <h2 className="fr-h2">Demander une habilitation</h2>
        <p className="fr-text--lg">
          <strong>Vos habilitations</strong>
          <br />
          <br />
          Vous faites déjà partie de ce ou ces groupes habilités :
        </p>

        <div className="fr-table fr-table--no-scroll">
          <div className="fr-table__wrapper">
            <div className="fr-table__container">
              <div className="fr-table__content">
                <table>
                  <caption hidden>Vos groupes habilités</caption>
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
                          {group.users.find((user) => user.is_admin)?.email ||
                            "N/A"}
                        </td>
                        <td>
                          <ButtonLink
                            alt
                            target="_blank"
                            to={`/compte/mes-groupes#group-${group.id}`}
                          >
                            Voir
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

        <strong className="fr-text--lg">
          Vous souhaitez être habilité dans le cadre d'une autre mission ?
        </strong>
      </div>

      <div className="fr-btns-group fr-btns-group--left">
        <div style={{ width: "fit-content" }}>
          <ButtonLink onClick={onConfirm}>
            <div className={styles.loaderContainer}>
              Continuer
              {isLoading && <Loader />}
            </div>
          </ButtonLink>
        </div>
      </div>
    </div>
  </Modal>
);
