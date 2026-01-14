"use client";

import ButtonLink from "#components-ui/button";
import { FullScreenModal } from "#components-ui/full-screen-modal";

interface INoGroupsModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const NoGroupsModal = ({
  isVisible,
  onConfirm,
  onCancel,
}: INoGroupsModalProps) => (
  <FullScreenModal
    isVisible={isVisible}
    modalId="no-groups-modal"
    onClose={onCancel}
    textAlign="left"
  >
    <div className="fr-container">
      <div className="fr-mb-4w">
        <h2 className="fr-h2">Demander une habilitation</h2>
        <p>
          <strong className="fr-text--lg">
            Une seule habilitation pour toute votre équipe !
          </strong>
          <br />
          <br />
          <strong>
            L'habilitation que vous êtes sur le point de demander couvre toute
            votre équipe.
          </strong>
          <br />
          Vous pourrez pourrez ajouter des membres à votre groupe habilité, sans
          que chacun ait besoin de faire une demande individuelle.
          <br />
          <br />
          <strong>
            Vous êtes la première personne à effectuer la demande ?
          </strong>
          <br />
          Vous pourrez ensuite transférer vos droits d'administration à un ou
          une autre responsable si nécessaire.
        </p>
      </div>

      <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
        <div style={{ width: "fit-content" }}>
          <ButtonLink onClick={onConfirm}>Continuer</ButtonLink>
        </div>
      </div>
    </div>
  </FullScreenModal>
);
