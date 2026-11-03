import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import type { IRolesDataUser } from "#/clients/roles-data/interface";
import { validateEmail } from "#/components/espace-agent-components/helpers/form-validation";
import ButtonLink from "#/components-ui/button";
import { Icon } from "#/components-ui/icon/wrapper";
import { Modal } from "#/components-ui/modal";
import { useFeatureFlag } from "#/hooks/use-feature-flag";
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
import styles from "./add-user.module.css";
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
  FEATURE_DISABLED: `L’import de membres par fichier n’est pas disponible pour le moment. ${NO_USER_ADDED}`,
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
  const { isEnabled: isBatchAddEnabled } = useFeatureFlag(
    "group_users_batch_add_enabled"
  );
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
    // the file replaces the email typed above
    setInputEmail("");
    setValidationErrors([]);
    if (!isAcceptedEmailsFile(file)) {
      setFileErrors(["Veuillez sélectionner un fichier .txt ou .csv"]);
      return;
    }
    try {
      const parsed = parseEmailsFile(await file.text());
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
          <h2 className={`fr-h4 fr-mb-2w ${styles.title}`}>
            <Icon size={28} slug="userAddFill" />
            {isBatchAddEnabled
              ? "Ajouter un ou des membres"
              : "Ajouter un membre"}
          </h2>
          <p className="fr-mb-3w">
            Par défaut, les nouveaux membres sont <strong>utilisateur</strong>.
            <br />
            Vous pourrez modifier leur rôle en <strong>administrateur</strong>{" "}
            ensuite.
          </p>

          {isBatchAddEnabled && (
            <h3 className="fr-h6 fr-mb-2w">Ajouter un membre</h3>
          )}
          <div
            className={`fr-input-group fr-mb-0 ${
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
                disabled={isPending}
                id={`new-user-email-${group.id}`}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                  // the email replaces the selected file
                  if (batch || fileErrors.length > 0) {
                    resetFile();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isAddDisabled) {
                    handleAddNewUser();
                  }
                }}
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

          {isBatchAddEnabled && (
            <>
              <div className={styles.separator}>ou</div>

              <h3 className="fr-h6 fr-mb-2w">
                Ajouter plusieurs membres en important un fichier
              </h3>
              <div
                className={`fr-upload-group ${
                  fileErrors.length > 0 ? "fr-input-group--error" : ""
                }`}
              >
                <label
                  className="fr-label"
                  htmlFor={`new-users-file-${group.id}`}
                >
                  Ajouter un fichier
                  <span className="fr-hint-text">
                    Formats supportés : txt, csv. Un email par ligne,{" "}
                    {MAX_USERS_PER_BATCH.toLocaleString("fr-FR")} au maximum.
                    Les adresses invalides, en double ou déjà membres du groupe
                    sont ignorées.
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
                  <div
                    className="fr-messages-group"
                    id={`file-error-${group.id}`}
                  >
                    {fileErrors.map((errorMsg, index) => (
                      <p className="fr-message fr-message--error" key={index}>
                        {errorMsg}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {batch && <BatchSummary batch={batch} />}
            </>
          )}

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-mt-4w">
            {isBatchAddEnabled && batch ? (
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

const EmailsDetails = ({
  emails,
  label,
  className,
  icon,
}: {
  emails: string[];
  label: string;
  className?: string;
  icon?: React.ReactNode;
}) => (
  <details>
    <summary className={className}>
      {icon}
      {label}
      <span className={styles.chevron}>
        <Icon size={16} slug="chevronDown" />
      </span>
    </summary>
    <ul>
      {emails.map((email) => (
        <li key={email}>{email}</li>
      ))}
    </ul>
  </details>
);

/**
 * What the selected file adds, and the emails it ignores
 */
function BatchSummary({ batch }: { batch: IParsedEmailsFile }) {
  const ignored = [
    [
      batch.duplicates,
      plural(batch.duplicates.length, "email", "emails") +
        (batch.duplicates.length > 1
          ? " en doublon ignorés"
          : " en doublon ignoré"),
      undefined,
    ],
    [
      batch.invalid,
      plural(batch.invalid.length, "email invalide", "emails invalides"),
      styles.invalid,
    ],
  ] as const;

  return (
    <div aria-live="polite" className={styles.summary}>
      {batch.emails.length > 0 && (
        <EmailsDetails
          className={styles.newMembers}
          emails={batch.emails}
          icon={
            <Icon
              color="var(--text-default-success)"
              size={20}
              slug="successFill"
            />
          }
          label={`${plural(
            batch.emails.length,
            "nouveau membre",
            "nouveaux membres"
          )} à ajouter`}
        />
      )}
      {ignored
        .filter(([emails]) => emails.length > 0)
        .map(([emails, label, className]) => (
          <EmailsDetails
            className={className}
            emails={emails}
            key={label}
            label={label}
          />
        ))}
    </div>
  );
}
