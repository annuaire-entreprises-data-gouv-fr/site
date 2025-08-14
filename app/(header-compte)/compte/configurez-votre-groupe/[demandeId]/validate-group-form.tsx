'use client';

import ButtonLink from '#components-ui/button';
import { validateGroupName } from '#components/espace-agent-components/group-management/update-modals/form-validation';
import { showErrorNotification } from '#components/notification-center';
import { IDRolesGroup } from '#models/authentication/group/groups';
import httpClient from '#utils/network';
import { useRef, useState } from 'react';
import FinalStep from './FinalStep';

export default function ValidateGroupForm({
  demandeId,
}: {
  demandeId: string;
}) {
  const [newGroup, setNewGroup] = useState<IDRolesGroup | null>(null);
  const [inputGroupName, setInputGroupName] = useState('');
  const [emails, setEmails] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddMembers = () => {
    const groupName = inputGroupName.trim();

    const groupNameValidationError = validateGroupName(groupName);
    if (groupNameValidationError) {
      setValidationErrors([groupNameValidationError]);
      showErrorNotification('Ajout impossible', groupNameValidationError);
      return;
    }

    setAddMembers(true);
  };

  const cancelAddMembers = () => {
    setAddMembers(false);
    setEmails('');
  };

  const handleValidateGroup = async () => {
    setLoading(true);
    setValidationErrors([]);

    try {
      const groupName = inputGroupName.trim();

      const groupNameValidationError = validateGroupName(groupName);
      if (groupNameValidationError) {
        setValidationErrors([groupNameValidationError]);
        showErrorNotification('Ajout impossible', groupNameValidationError);
        return;
      }

      const result = await httpClient<IDRolesGroup>({
        url: `/api/groups/validate`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ groupName, demandeId, emails }),
      });
      setNewGroup(result);
    } catch (error: any) {
      setValidationErrors([error.message || 'Une erreur est survenue']);
      return;
    } finally {
      setLoading(false);
    }
  };

  if (newGroup) {
    return <FinalStep newGroup={newGroup} />;
  }

  if (addMembers) {
    return (
      <>
        <div className="fr-col-4">
          <img src="/images/compte/add-members.svg" alt="" height="280px" />
        </div>
        <div className="fr-col-8">
          <strong className="fr-card__title">Ajoutez des membres</strong>
          <p className="fr-card__desc">
            Les nouveaux membres auront accès aux mêmes données supplémentaires
            que vous.
          </p>
          <div
            className={`fr-card__desc fr-input-group fr-mb-4w ${
              validationErrors.length > 0 ? 'fr-input-group--error' : ''
            }`}
          >
            <label className="fr-label" htmlFor={'group-name'}>
              Membres du groupe
              <span className="fr-hint-text">
                Ajoutez plusieurs emails séparés par une virgule
              </span>
            </label>
            <div className="fr-input-wrap">
              <textarea
                className={`fr-input ${
                  validationErrors.length > 0 ? 'fr-input--error' : ''
                }`}
                id={`group-name`}
                value={emails}
                onChange={(e) => {
                  setEmails(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && emails?.trim() && !loading) {
                    handleValidateGroup();
                  }
                }}
                disabled={loading}
                autoComplete="off"
                aria-describedby={
                  validationErrors.length > 0 ? 'error-name' : undefined
                }
              />
            </div>
          </div>
          <ul className="fr-card__desc fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
            <li>
              <ButtonLink alt onClick={cancelAddMembers} disabled={loading}>
                Annuler
              </ButtonLink>
            </li>
            <li>
              <ButtonLink onClick={handleValidateGroup} disabled={loading}>
                Ajouter des membres
              </ButtonLink>
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fr-col-4">
        <img src="/images/compte/configure-team.svg" alt="" height="280px" />
      </div>
      <div className="fr-col-8">
        <strong className="fr-card__title">Configurez votre groupe</strong>
        <p className="fr-card__desc">
          L‘habilitation liée à votre mission est validée !
        </p>
        <p className="fr-card__desc">
          Par défaut, vous êtes administrateur du groupe habilité. Pour
          travailler en équipe, invitez vos collègues et modifiez leur rôle à
          tout moment.
        </p>
        <div
          className={`fr-card__desc fr-input-group fr-mb-4w ${
            validationErrors.length > 0 ? 'fr-input-group--error' : ''
          }`}
        >
          <label className="fr-label" htmlFor={'group-name'}>
            Nom du groupe habilité
            <span className="fr-hint-text">(entre 2 et 100 caractères)</span>
          </label>
          <div className="fr-input-wrap">
            <input
              ref={inputRef}
              className={`fr-input ${
                validationErrors.length > 0 ? 'fr-input--error' : ''
              }`}
              type="text"
              id={`group-name`}
              value={inputGroupName}
              onChange={(e) => {
                setInputGroupName(e.target.value);
                if (validationErrors.length > 0) {
                  setValidationErrors([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputGroupName?.trim() && !loading) {
                  handleValidateGroup();
                }
              }}
              disabled={loading}
              autoComplete="off"
              aria-describedby={
                validationErrors.length > 0 ? 'error-name' : undefined
              }
            />
          </div>
        </div>
        <ul className="fr-card__desc fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
          <li>
            <ButtonLink alt onClick={handleValidateGroup} disabled={loading}>
              Continuer sans ajouter de membre
            </ButtonLink>
          </li>
          <li>
            <ButtonLink onClick={handleAddMembers} disabled={loading}>
              Ajouter des membres
            </ButtonLink>
          </li>
        </ul>
      </div>
    </>
  );
}
