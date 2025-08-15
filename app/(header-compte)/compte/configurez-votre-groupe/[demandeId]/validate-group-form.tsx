'use client';

import ButtonLink from '#components-ui/button';
import {
  validateEmails,
  validateGroupName,
} from '#components/espace-agent-components/group-management/update-modals/form-validation';
import { showErrorNotification } from '#components/notification-center';
import { IDRolesGroup } from '#models/authentication/group/groups';
import httpClient from '#utils/network';
import { useState } from 'react';
import FinalStep from './FinalStep';

export default function ValidateGroupForm({
  demandeId,
}: {
  demandeId: string;
}) {
  const [inputGroupName, setInputGroupName] = useState('');
  const [inputEmails, setInputEmails] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [newGroup, setNewGroup] = useState<IDRolesGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ groupName?: string; emails?: string }>(
    {}
  );

  const handleAddMembers = () => {
    const groupName = inputGroupName.trim();

    const groupNameValidationError = validateGroupName(groupName);
    if (groupNameValidationError) {
      setErrors({ groupName: groupNameValidationError });
      showErrorNotification('Ajout impossible', groupNameValidationError);
      return;
    }

    setAddMembers(true);
  };

  const cancelAddMembers = () => {
    setAddMembers(false);
    setInputEmails('');
    setErrors((e) => ({ ...e, emails: undefined }));
  };

  const handleValidateGroup = async () => {
    const groupName = inputGroupName.trim();
    const emails = inputEmails.trim();

    const groupNameValidationError = validateGroupName(groupName);
    const emailsValidationError = validateEmails(emails);

    if (groupNameValidationError || emailsValidationError) {
      setErrors({
        groupName: groupNameValidationError ?? undefined,
        emails: emailsValidationError ?? undefined,
      });
      const firstError = groupNameValidationError || emailsValidationError;
      if (firstError) {
        showErrorNotification('Ajout impossible', firstError);
      }
      return;
    }

    setLoading(true);
    try {
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
      showErrorNotification("Erreur lors de l'ajout du membre", error.message);
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
              errors.emails ? 'fr-input-group--error' : ''
            }`}
          >
            <label className="fr-label" htmlFor={'group-emails'}>
              Membres du groupe
              <span className="fr-hint-text">
                Ajoutez plusieurs emails séparés par une virgule
              </span>
            </label>
            <div className="fr-input-wrap">
              <textarea
                className={`fr-input ${errors.emails ? 'fr-input--error' : ''}`}
                id={`group-emails`}
                value={inputEmails}
                onChange={(e) => {
                  setInputEmails(e.target.value);
                  if (errors.emails) {
                    setErrors((prev) => ({ ...prev, emails: undefined }));
                  }
                }}
                disabled={loading}
                autoComplete="off"
                rows={6}
                aria-describedby={
                  errors.emails ? 'group-emails-error' : undefined
                }
              />
            </div>
            {errors.emails && (
              <p className="fr-error-text" id="group-emails-error">
                {errors.emails}
              </p>
            )}
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
            errors.groupName ? 'fr-input-group--error' : ''
          }`}
        >
          <label className="fr-label" htmlFor={'group-name'}>
            Nom du groupe habilité
            <span className="fr-hint-text">(entre 2 et 100 caractères)</span>
          </label>
          <div className="fr-input-wrap">
            <input
              className={`fr-input ${
                errors.groupName ? 'fr-input--error' : ''
              }`}
              type="text"
              id={`group-name`}
              value={inputGroupName}
              onChange={(e) => {
                setInputGroupName(e.target.value);
                if (errors.groupName) {
                  setErrors((prev) => ({ ...prev, groupName: undefined }));
                }
              }}
              disabled={loading}
              autoComplete="off"
              minLength={2}
              maxLength={100}
              aria-describedby={
                errors.groupName ? 'group-name-error' : undefined
              }
            />
          </div>
          {errors.groupName && (
            <p className="fr-error-text" id="group-name-error">
              {errors.groupName}
            </p>
          )}
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
