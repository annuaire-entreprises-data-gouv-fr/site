'use client';

import { IDRolesUser } from '#clients/roles-data/interface';
import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import { showError, showSuccess } from '#hooks/use-notifications';
import { IDRolesGroup } from '#models/authentication/group/groups';
import { validateEmail } from '#utils/form-validation';
import httpClient from '#utils/network';
import { useEffect, useRef, useState } from 'react';

const MODAL_ID = 'add-user';

export default function AddUserModal({
  group,
  defaultRoleId,
  addUserToGroupState,
}: {
  group: IDRolesGroup;
  defaultRoleId: number;
  addUserToGroupState: (user: IDRolesUser) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleAddNewUser = async () => {
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const userEmail = inputEmail.trim();

      // Client-side validation
      const emailValidation = validateEmail(userEmail);
      if (!emailValidation.isValid) {
        setValidationErrors(emailValidation.errors);
        return;
      }

      // Check if user already exists in group
      if (group.users.some((user: IDRolesUser) => user.email === userEmail)) {
        setValidationErrors([
          'Cet utilisateur est déjà membre de cette équipe',
        ]);
        return;
      }

      const user = await httpClient<IDRolesUser>({
        url: `/api/groups/${group.id}/add-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail, roleId: defaultRoleId }),
      });

      addUserToGroupState(user);

      // Show success notification
      showSuccess(
        'Membre ajouté avec succès',
        `${userEmail} a été ajouté à l'équipe ${group.name}`
      );

      setInputEmail('');
      setIsVisible(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      setError(errorMessage);
      showError("Erreur lors de l'ajout du membre", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setInputEmail('');
    setError(null);
    setValidationErrors([]);
  };

  return (
    <>
      <ButtonLink onClick={() => setIsVisible(true)}>
        Ajouter un membre
      </ButtonLink>
      <FullScreenModal
        isVisible={isVisible}
        modalId={MODAL_ID}
        onClose={handleClose}
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Ajouter un membre</h2>
            <p className="fr-text--lg">
              Invitez un nouvel utilisateur à rejoindre cette équipe
            </p>
          </div>

          <div
            className={`fr-input-group fr-mb-4w ${
              validationErrors.length > 0 || error
                ? 'fr-input-group--error'
                : ''
            }`}
          >
            <label className="fr-label" htmlFor={`new-user-email-${group.id}`}>
              Adresse email du nouveau membre
              <span className="fr-hint-text">
                L’utilisateur doit avoir un compte ProConnect pour rejoindre
                l’équipe
              </span>
            </label>
            <div className="fr-input-wrap">
              <input
                ref={inputRef}
                className={`fr-input ${
                  validationErrors.length > 0 || error ? 'fr-input--error' : ''
                }`}
                type="email"
                id={`new-user-email-${group.id}`}
                placeholder="email@exemple.fr"
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                  if (error) {
                    setError(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputEmail?.trim() && !loading) {
                    handleAddNewUser();
                  }
                }}
                disabled={loading}
                aria-describedby={
                  validationErrors.length > 0 || error
                    ? `error-${group.id}`
                    : undefined
                }
              />
            </div>
            {validationErrors.length > 0 && (
              <div id={`error-${group.id}`} className="fr-messages-group">
                {validationErrors.map((errorMsg, index) => (
                  <p key={index} className="fr-message fr-message--error">
                    {errorMsg}
                  </p>
                ))}
              </div>
            )}
            {error && !validationErrors.length && (
              <div id={`error-${group.id}`} className="fr-messages-group">
                <p className="fr-message fr-message--error">{error}</p>
              </div>
            )}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink
              onClick={handleAddNewUser}
              disabled={!inputEmail?.trim() || loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </ButtonLink>
            <ButtonLink alt onClick={handleClose} disabled={loading}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
