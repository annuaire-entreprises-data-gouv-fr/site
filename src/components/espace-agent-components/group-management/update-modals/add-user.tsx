import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import type { IRolesDataUser } from "#/clients/roles-data/interface";
import { validateEmail } from "#/components/espace-agent-components/helpers/form-validation";
import ButtonLink from "#/components-ui/button";
import { Modal } from "#/components-ui/modal";
import {
  NotificationTypeEnum,
  useNotification,
} from "#/hooks/use-notification";
import type { IAgentsGroupDetails } from "#/models/authentication/group";
import {
  addUsersToGroupFn,
  addUserToGroupFn,
} from "#/server-functions/agent/group-management";
import { MAX_USERS_PER_BATCH } from "#/server-functions/agent/group-management/schemas";
import {
  type IParsedEmailsFile,
  isAcceptedEmailsFile,
  parseEmailsFile,
} from "./parse-emails-file";

const MODAL_ID = "add-user";
const USER_ALREADY_IN_GROUP_ERROR =
  "Cet utilisateur est déjà membre de ce groupe";
const NO_USER_ADDED = "Aucun membre n’a été ajouté.";
const BATCH_ERRORS = {
  USER_ALREADY_IN_GROUP: `Au moins une des adresses est déjà membre de ce groupe. ${NO_USER_ADDED} Retirez du fichier les membres existants puis réessayez.`,
  DUPLICATE_EMAILS: `Le fichier contient des adresses en double. ${NO_USER_ADDED}`,
  GROUP_OR_ROLE_NOT_FOUND: `Le groupe ou le rôle utilisateur est introuvable. ${NO_USER_ADDED}`,
} as const;

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count > 1 ? pluralForm : singular}`;

export default function AddUserModal({
  group,
  defaultRoleId,
  addUsersToGroupState,
}: {
  // users only holds the members of the displayed page
  group: Pick<IAgentsGroupDetails, "id" | "name" | "users">;
  defaultRoleId: number;
  addUsersToGroupState: (users: IRolesDataUser[]) => void;
}) {
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [batch, setBatch] = useState<
    (IParsedEmailsFile & { fileName: string }) | null
  >(null);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addUserToGroup = useServerFn(addUserToGroupFn);
  const addUsersToGroup = useServerFn(addUsersToGroupFn);

  const mutation = useMutation({
    mutationFn: addUserToGroup,
    onSuccess: (result) => {
      if ("error" in result) {
        setValidationErrors([USER_ALREADY_IN_GROUP_ERROR]);
        showNotification({
          type: NotificationTypeEnum.ERROR,
          title: "Ajout impossible",
          message: USER_ALREADY_IN_GROUP_ERROR,
        });
        return;
      }

      addUsersToGroupState([result]);

      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Membre ajouté avec succès",
        message: `${result.email} a été ajouté au groupe ${group.name}`,
      });

      setInputEmail("");
      setIsVisible(false);
    },
    onError: (error) => {
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de l'ajout du membre",
        message: error.message,
      });
    },
  });

  const batchMutation = useMutation({
    mutationFn: addUsersToGroup,
    onSuccess: (result) => {
      if ("error" in result) {
        const message = BATCH_ERRORS[result.error];
        setFileErrors([message]);
        showNotification({
          type: NotificationTypeEnum.ERROR,
          title: "Ajout impossible",
          message,
        });
        return;
      }

      addUsersToGroupState(result);

      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Membres ajoutés avec succès",
        message: `${plural(result.length, "membre a été ajouté", "membres ont été ajoutés")} au groupe ${group.name}`,
      });

      handleClose();
    },
    onError: (error) => {
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de l'ajout des membres",
        message: error.message,
      });
    },
  });

  const isPending = mutation.isPending || batchMutation.isPending;
  const userEmail = inputEmail.trim();
  const isUserAlreadyInGroup =
    group.users.some(
      (user) => user.email.trim().toLowerCase() === userEmail.toLowerCase()
    ) || validationErrors.includes(USER_ALREADY_IN_GROUP_ERROR);
  const emailErrors = isUserAlreadyInGroup
    ? [USER_ALREADY_IN_GROUP_ERROR]
    : validationErrors;
  const isAddDisabled = !userEmail || isPending || isUserAlreadyInGroup;
  const isBatchAddDisabled = !batch || batch.emails.length === 0 || isPending;

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleAddNewUser = () => {
    if (isAddDisabled) {
      return;
    }

    setValidationErrors([]);

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

    mutation.mutate({
      data: { groupId: group.id, userEmail, roleId: defaultRoleId },
    });
  };

  const handleAddNewUsers = () => {
    if (isBatchAddDisabled) {
      return;
    }
    setFileErrors([]);
    batchMutation.mutate({
      data: {
        groupId: group.id,
        userEmails: batch.emails,
        // always add as simple users, never as admin
        roleId: defaultRoleId,
      },
    });
  };

  const resetFile = () => {
    setBatch(null);
    setFileErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setBatch(null);
    setFileErrors([]);
    if (!file) {
      return;
    }
    if (!isAcceptedEmailsFile(file)) {
      setFileErrors(["Veuillez sélectionner un fichier .txt ou .csv"]);
      return;
    }
    try {
      const parsed = parseEmailsFile(
        await file.text(),
        group.users.map((user) => user.email)
      );
      if (parsed.emails.length > MAX_USERS_PER_BATCH) {
        setFileErrors([
          `Le fichier contient ${parsed.emails.length} adresses : vous pouvez en ajouter ${MAX_USERS_PER_BATCH.toLocaleString("fr-FR")} au maximum à la fois`,
        ]);
        return;
      }
      setBatch({ ...parsed, fileName: file.name });
      if (parsed.emails.length === 0) {
        setFileErrors(["Aucune nouvelle adresse email valide à ajouter"]);
      }
    } catch {
      setFileErrors(["Impossible de lire le fichier"]);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setInputEmail("");
    setValidationErrors([]);
    setBatch(null);
    setFileErrors([]);
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
              emailErrors.length > 0 ? "fr-input-group--error" : ""
            }`}
          >
            <label className="fr-label" htmlFor={`new-user-email-${group.id}`}>
              Adresse email du nouveau membre
            </label>
            <div className="fr-input-wrap">
              <input
                aria-describedby={
                  emailErrors.length > 0 ? `error-${group.id}` : undefined
                }
                className={`fr-input ${
                  emailErrors.length > 0 ? "fr-input--error" : ""
                }`}
                disabled={isPending || batch !== null}
                id={`new-user-email-${group.id}`}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isAddDisabled) {
                    handleAddNewUser();
                  }
                }}
                placeholder="email@exemple.fr"
                ref={inputRef}
                type="email"
                value={inputEmail}
              />
            </div>
            {emailErrors.length > 0 && (
              <div className="fr-messages-group" id={`error-${group.id}`}>
                {emailErrors.map((errorMsg, index) => (
                  <p className="fr-message fr-message--error" key={index}>
                    {errorMsg}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div
            className={`fr-upload-group fr-mb-4w ${
              fileErrors.length > 0 ? "fr-input-group--error" : ""
            }`}
          >
            <label className="fr-label" htmlFor={`new-users-file-${group.id}`}>
              Ou importer une liste de membres
              <span className="fr-hint-text">
                Fichier .txt ou .csv, avec une adresse email par ligne (
                {MAX_USERS_PER_BATCH.toLocaleString("fr-FR")} au maximum). Les
                adresses invalides ou en double sont ignorées.
              </span>
            </label>
            <input
              accept=".txt,.csv,text/plain,text/csv"
              aria-describedby={
                fileErrors.length > 0 ? `file-error-${group.id}` : undefined
              }
              className="fr-upload"
              disabled={isPending}
              id={`new-users-file-${group.id}`}
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />
            {fileErrors.length > 0 && (
              <div className="fr-messages-group" id={`file-error-${group.id}`}>
                {fileErrors.map((errorMsg, index) => (
                  <p className="fr-message fr-message--error" key={index}>
                    {errorMsg}
                  </p>
                ))}
              </div>
            )}
            {batch && (
              <div aria-live="polite" className="fr-mt-2w">
                <p className="fr-mb-1w">
                  <strong>
                    {plural(
                      batch.emails.length,
                      "nouveau membre",
                      "nouveaux membres"
                    )}
                  </strong>{" "}
                  à ajouter depuis le fichier {batch.fileName}
                </p>
                {(
                  [
                    [batch.invalid, "adresse invalide", "adresses invalides"],
                    [batch.duplicates, "doublon", "doublons"],
                    [
                      batch.alreadyInGroup,
                      "adresse déjà membre du groupe",
                      "adresses déjà membres du groupe",
                    ],
                  ] as const
                )
                  .filter(([emails]) => emails.length > 0)
                  .map(([emails, singular, pluralForm]) => (
                    <p className="fr-text--sm fr-mb-1w" key={singular}>
                      {plural(emails.length, singular, pluralForm)} ignorée
                      {emails.length > 1 ? "s" : ""} : {emails.join(", ")}
                    </p>
                  ))}
                <button
                  className="fr-btn fr-btn--tertiary fr-btn--sm fr-mt-1w"
                  disabled={isPending}
                  onClick={resetFile}
                  type="button"
                >
                  Retirer le fichier
                </button>
              </div>
            )}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            {batch ? (
              <ButtonLink
                disabled={isBatchAddDisabled}
                onClick={handleAddNewUsers}
              >
                {batchMutation.isPending
                  ? "Ajout en cours..."
                  : `Ajouter ${plural(batch.emails.length, "membre", "membres")}`}
              </ButtonLink>
            ) : (
              <ButtonLink disabled={isAddDisabled} onClick={handleAddNewUser}>
                {mutation.isPending ? "Ajout en cours..." : "Ajouter"}
              </ButtonLink>
            )}
            <ButtonLink alt disabled={isPending} onClick={handleClose}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </Modal>
    </>
  );
}
