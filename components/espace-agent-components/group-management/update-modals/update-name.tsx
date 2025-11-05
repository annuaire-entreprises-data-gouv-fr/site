import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { updateGroupNameAction } from "server-actions/agent/group-management";
import { validateGroupName } from "#components/espace-agent-components/helpers/form-validation";
import ButtonLink from "#components-ui/button";
import { FullScreenModal } from "#components-ui/full-screen-modal";
import { Icon } from "#components-ui/icon/wrapper";
import { NotificationTypeEnum, useNotification } from "#hooks/use-notification";

export default function UpdateNameModal({
  groupId,
  initialName,
  updateGroupNameState,
}: {
  groupId: number;
  initialName: string;
  updateGroupNameState: (name: string) => void;
}) {
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [groupName, setGroupName] = useState(initialName);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { execute, isPending } = useAction(updateGroupNameAction, {
    onSuccess: () => {
      updateGroupNameState(groupName);
      setIsVisible(false);

      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Nom du groupe mis à jour",
        message: `Le groupe a été renommé "${groupName}"`,
      });
    },
    onError: ({ error }) => {
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de la mise à jour du nom",
        message: error.serverError?.message,
      });
    },
  });

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
      setGroupName(initialName);
    }
  }, [isVisible, initialName]);

  const handleUpdateName = async () => {
    setValidationErrors([]);

    // Client-side validation
    const nameValidationError = validateGroupName(groupName);
    if (nameValidationError) {
      setValidationErrors([nameValidationError]);
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Nom invalide",
        message: nameValidationError,
      });
      return;
    }

    execute({ groupId, groupName });
  };

  const handleCancel = () => {
    setIsVisible(false);
    setGroupName(initialName);
    setValidationErrors([]);
  };

  return (
    <>
      <h2
        className="fr-mt-0"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <button
          className="fr-btn fr-btn--tertiary-no-outline"
          onClick={() => setIsVisible(true)}
        >
          (
          <i>
            <Icon slug="ballPenFill">renommer</Icon>
          </i>
          )
        </button>
      </h2>
      <FullScreenModal
        isVisible={isVisible}
        modalId={`update-name-${groupId}`}
        onClose={handleCancel}
        textAlign="left"
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Renommer le groupe</h2>
            <p className="fr-text--lg">
              Modifiez le nom du groupe <strong>{initialName}</strong>
            </p>
          </div>

          <div
            className={`fr-input-group fr-mb-4w ${
              validationErrors.length > 0 ? "fr-input-group--error" : ""
            }`}
          >
            <label className="fr-label" htmlFor={`group-name-${groupId}`}>
              Nom du groupe
              <span className="fr-hint-text">(entre 2 et 100 caractères)</span>
            </label>
            <div className="fr-input-wrap">
              <input
                aria-describedby={
                  validationErrors.length > 0
                    ? `error-name-${groupId}`
                    : undefined
                }
                autoComplete="off"
                className={`fr-input ${
                  validationErrors.length > 0 ? "fr-input--error" : ""
                }`}
                disabled={isPending}
                id={`group-name-${groupId}`}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && groupName?.trim() && !isPending) {
                    handleUpdateName();
                  }
                }}
                ref={inputRef}
                type="text"
                value={groupName}
              />
            </div>
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink
              disabled={!groupName?.trim() || isPending}
              onClick={handleUpdateName}
            >
              {isPending ? "Sauvegarde..." : "Sauvegarder"}
            </ButtonLink>
            <ButtonLink alt disabled={isPending} onClick={handleCancel}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
