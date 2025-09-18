'use client';

import { IRolesDataUser } from '#clients/roles-data/interface';
import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import { validateEmail } from '#components/espace-agent-components/helpers/form-validation';
import { NotificationTypeEnum, useNotification } from '#hooks/use-notification';
import { IRolesDataGroup } from '#models/authentication/group/groups';
import httpClient from '#utils/network';
import { useEffect, useRef, useState } from 'react';

const MODAL_ID = 'add-user';

export default function AddUserModal({
  group,
  defaultRoleId,
  addUserToGroupState,
}: {
  group: IRolesDataGroup;
  defaultRoleId: number;
  addUserToGroupState: (user: IRolesDataUser) => void;
}) {
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
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
    setValidationErrors([]);

    try {
      const userEmail = inputEmail.trim();

      const emailValidationError = validateEmail(userEmail);
      if (emailValidationError) {
        setValidationErrors([emailValidationError]);
        showNotification({
          type: NotificationTypeEnum.ERROR,
          title: 'Ajout impossible',
          message: emailValidationError,
        });
        return;
      }

      // Check if user already exists in group
      if (
        group.users.some((user: IRolesDataUser) => user.email === userEmail)
      ) {
        setValidationErrors(['Cet utilisateur est déjà membre de ce groupe']);
        showNotification({
          type: NotificationTypeEnum.ERROR,
          title: 'Ajout impossible',
          message: 'Cet utilisateur est déjà membre de ce groupe',
        });
        return;
      }

      const user = await httpClient<IRolesDataUser>({
        url: `/api/groups/${group.id}/add-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail, roleId: defaultRoleId }),
      });

      addUserToGroupState(user);

      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: 'Membre ajouté avec succès',
        message: `${userEmail} a été ajouté au groupe ${group.name}`,
      });

      setInputEmail('');
      setIsVisible(false);
    } catch (error: any) {
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de l'ajout du membre",
        message: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setInputEmail('');
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
        textAlign="left"
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Ajouter un membre</h2>
            <p className="fr-text--lg">
              Les nouveaux membres ont par défaut le{' '}
              <strong>rôle d’utilisateur</strong>.
              <br />
              Vous pourrez ensuite le changer en <strong>administrateur</strong>
              , si besoin.
            </p>
          </div>

          <div
            className={`fr-input-group fr-mb-4w ${
              validationErrors.length > 0 ? 'fr-input-group--error' : ''
            }`}
          >
            <label className="fr-label" htmlFor={`new-user-email-${group.id}`}>
              Adresse email du nouveau membre
            </label>
            <div className="fr-input-wrap">
              <input
                ref={inputRef}
                className={`fr-input ${
                  validationErrors.length > 0 ? 'fr-input--error' : ''
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
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputEmail?.trim() && !loading) {
                    handleAddNewUser();
                  }
                }}
                disabled={loading}
                aria-describedby={
                  validationErrors.length > 0 ? `error-${group.id}` : undefined
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
