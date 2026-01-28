"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { addUserToGroupAction } from "server-actions/agent/group-management";
import type { IRolesDataUser } from "#clients/roles-data/interface";
import { validateEmail } from "#components/espace-agent-components/helpers/form-validation";
import ButtonLink from "#components-ui/button";
import { Modal } from "#components-ui/modal";
import { NotificationTypeEnum, useNotification } from "#hooks/use-notification";
import type { IAgentsGroup } from "#models/authentication/group";

const MODAL_ID = "add-user";

export default function AddUserModal({
  group,
  defaultRoleId,
  addUserToGroupState,
}: {
  group: IAgentsGroup;
  defaultRoleId: number;
  addUserToGroupState: (user: IRolesDataUser) => void;
}) {
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { execute, isPending } = useAction(addUserToGroupAction, {
    onSuccess: (result) => {
      addUserToGroupState(result.data);

      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Membre ajouté avec succès",
        message: `${result.data.email} a été ajouté au groupe ${group.name}`,
      });

      setInputEmail("");
      setIsVisible(false);
    },
    onError: ({ error }) => {
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de l'ajout du membre",
        message: error.serverError?.message,
      });
    },
  });

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleAddNewUser = async () => {
    setValidationErrors([]);

    const userEmail = inputEmail.trim();

    const emailValidationError = validateEmail(userEmail);
    if (emailValidationError) {
      setValidationErrors([emailValidationError]);
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Ajout impossible",
        message: emailValidationError,
      });
      return;
    }

    // Check if user already exists in group
    if (group.users.some((user: IRolesDataUser) => user.email === userEmail)) {
      setValidationErrors(["Cet utilisateur est déjà membre de ce groupe"]);
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Ajout impossible",
        message: "Cet utilisateur est déjà membre de ce groupe",
      });
      return;
    }

    execute({ groupId: group.id, userEmail, roleId: defaultRoleId });
  };

  const handleClose = () => {
    setIsVisible(false);
    setInputEmail("");
    setValidationErrors([]);
  };

  return (
    <>
      <ButtonLink onClick={() => setIsVisible(true)}>
        Ajouter un membre
      </ButtonLink>
      <Modal
        isVisible={isVisible}
        modalId={MODAL_ID}
        onClose={handleClose}
        textAlign="left"
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Ajouter un membre</h2>
            <p className="fr-text--lg">
              Les nouveaux membres ont par défaut le{" "}
              <strong>rôle d’utilisateur</strong>.
              <br />
              Vous pourrez ensuite le changer en <strong>administrateur</strong>
              , si besoin.
            </p>
          </div>

          <div
            className={`fr-input-group fr-mb-4w ${
              validationErrors.length > 0 ? "fr-input-group--error" : ""
            }`}
          >
            <label className="fr-label" htmlFor={`new-user-email-${group.id}`}>
              Adresse email du nouveau membre
            </label>
            <div className="fr-input-wrap">
              <input
                aria-describedby={
                  validationErrors.length > 0 ? `error-${group.id}` : undefined
                }
                className={`fr-input ${
                  validationErrors.length > 0 ? "fr-input--error" : ""
                }`}
                disabled={isPending}
                id={`new-user-email-${group.id}`}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputEmail?.trim() && !isPending) {
                    handleAddNewUser();
                  }
                }}
                placeholder="email@exemple.fr"
                ref={inputRef}
                type="email"
                value={inputEmail}
              />
            </div>
            {validationErrors.length > 0 && (
              <div className="fr-messages-group" id={`error-${group.id}`}>
                {validationErrors.map((errorMsg, index) => (
                  <p className="fr-message fr-message--error" key={index}>
                    {errorMsg}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink
              disabled={!inputEmail?.trim() || isPending}
              onClick={handleAddNewUser}
            >
              {isPending ? "Ajout en cours..." : "Ajouter"}
            </ButtonLink>
            <ButtonLink alt disabled={isPending} onClick={handleClose}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </Modal>
    </>
  );
}
