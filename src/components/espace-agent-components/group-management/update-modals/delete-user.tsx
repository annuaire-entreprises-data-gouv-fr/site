import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { IRolesDataUser } from "#/clients/roles-data/interface";
import { Warning } from "#/components-ui/alerts";
import ButtonLink from "#/components-ui/button";
import { Modal } from "#/components-ui/modal";
import {
  NotificationTypeEnum,
  useNotification,
} from "#/hooks/use-notification";
import { removeUserFromGroupFn } from "#/server-functions/agent/group-management";

export default function DeleteUserButton({
  isCurrentUser,
  user,
  adminCount,
  groupId,
  deleteUserFromGroupState,
}: {
  isCurrentUser: boolean;
  adminCount: number;
  user: IRolesDataUser;
  groupId: number;
  deleteUserFromGroupState: (email: string) => void;
}) {
  const { showNotification } = useNotification();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const mutation = useMutation({
    mutationFn: removeUserFromGroupFn,
    onSuccess: () => {
      deleteUserFromGroupState(user.email);
      setShowConfirmation(false);
    },
    onError: (error) => {
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de la suppression",
        message: error.message,
      });
    },
  });

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <ButtonLink
        alt
        aria-label={`Supprimer ${user.email}`}
        disabled={mutation.isPending || (isCurrentUser && adminCount === 1)}
        key={`remove-${user.email}`}
        onClick={openConfirmation}
        type="button"
      >
        <span aria-hidden="true">Supprimer</span>
      </ButtonLink>

      <Modal
        isVisible={showConfirmation}
        modalId="delete-user-confirmation"
        onClose={closeConfirmation}
        textAlign="left"
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Confirmer la suppression</h2>
            <p className="fr-text--lg">
              Êtes-vous sûr de vouloir supprimer <strong>{user.email}</strong>{" "}
              de ce groupe ?
            </p>
            {isCurrentUser && (
              <Warning>
                <p>
                  <strong>Attention</strong>, vous êtes sur le point de vous
                  supprimer vous-même de ce groupe.
                </p>
              </Warning>
            )}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink
              disabled={mutation.isPending}
              onClick={() =>
                mutation.mutate({ data: { groupId, userId: user.id } })
              }
            >
              {mutation.isPending
                ? "Suppression..."
                : "Confirmer la suppression"}
            </ButtonLink>
            <ButtonLink
              alt
              disabled={mutation.isPending}
              onClick={closeConfirmation}
            >
              Annuler
            </ButtonLink>
          </div>
        </div>
      </Modal>
    </>
  );
}
