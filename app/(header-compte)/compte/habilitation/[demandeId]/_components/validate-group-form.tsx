'use client';

import ButtonLink from '#components-ui/button';
import {
  validateEmails,
  validateGroupName,
} from '#components/espace-agent-components/helpers/form-validation';
import { showErrorNotification } from '#components/notification-center';
import httpClient from '#utils/network';
import { ICreateRolesDataGroup } from 'app/api/groups/route';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function ValidateGroupForm({
  demandeId,
}: {
  demandeId: string;
}) {
  const router = useRouter();
  const inputGroup = useRef<HTMLInputElement>(null);
  const inputEmails = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [showAddMember, setShowAddMembers] = useState(false);
  const [errors, setErrors] = useState<{ groupName?: string; emails?: string }>(
    {}
  );

  const submitAndCreateGroup = async () => {
    const groupName = (inputGroup.current?.value || '').trim();
    const emails = (inputEmails.current?.value || '').trim();

    const groupNameValidationError = validateGroupName(groupName);
    const emailsValidationError = validateEmails(emails);

    if (groupNameValidationError || emailsValidationError) {
      setErrors({
        groupName: groupNameValidationError ?? undefined,
        emails: emailsValidationError ?? undefined,
      });
      showErrorNotification(
        'Impossible de configurer vos droits',
        groupNameValidationError || emailsValidationError || ''
      );
      return;
    }

    setLoading(true);

    try {
      const response = await httpClient<ICreateRolesDataGroup>({
        url: `/api/groups`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ groupName, demandeId, emails }),
      });
      if (response.error) {
        showErrorNotification(
          'Impossible de configurer vos droits',
          response.error || ''
        );
      }

      router.push(
        `/compte/habilitation/${demandeId}/succes?scopes=${encodeURIComponent(
          response.newScopes || ''
        )}`
      );
    } catch (error: any) {
      showErrorNotification('Impossible de configurer vos droits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="fr-card__title">Configurez vos nouveaux droits</h1>
      <p>
        Votre habilitation a été validée. Nous allons configurer ensemble vos
        nouveaux droits. Pour cela, nous allons vous créer un groupe. Vous en
        serez l’administrateur. Ce groupe bénéficiera de vos droits et vous
        pourrez l’utiliser pour travailler en équipe.
      </p>
      <div className="fr-col-8">
        <div
          className={`fr-card__desc fr-input-group fr-mb-4w ${
            errors.groupName ? 'fr-input-group--error' : ''
          }`}
        >
          <label className="fr-label" htmlFor={'group-name'}>
            Nom du groupe
            <span className="fr-hint-text">(entre 2 et 100 caractères)</span>
          </label>
          <div className="fr-input-wrap">
            <input
              className={`fr-input ${
                errors.groupName ? 'fr-input--error' : ''
              }`}
              type="text"
              id={`group-name`}
              ref={inputGroup}
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
      </div>

      {showAddMember ? (
        <>
          <p>
            Vos collègues auront accès aux mêmes droits que vous. Vous êtes le
            seul administrateur du groupe. Vous pourrez nommer d’autres
            administrateurs ultérieurement.
          </p>
          <div className="fr-col-8">
            <div
              className={`fr-card__desc fr-input-group fr-mb-4w ${
                errors.emails ? 'fr-input-group--error' : ''
              }`}
            >
              <label className="fr-label" htmlFor={'group-emails'}>
                Vos collègues
                <span className="fr-hint-text">
                  Ajoutez les emails professionnels de vos collègues, séparés
                  par une virgule
                </span>
              </label>
              <div className="fr-input-wrap">
                <textarea
                  className={`fr-input ${
                    errors.emails ? 'fr-input--error' : ''
                  }`}
                  id={`group-emails`}
                  ref={inputEmails}
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
          </div>
        </>
      ) : (
        <p>
          Si vous le désirez, vous pouvez ajouter des collègues dès maintenant.
        </p>
      )}
      <ul className="fr-card__desc fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
        {!showAddMember && (
          <li>
            <ButtonLink onClick={() => setShowAddMembers(true)} alt small>
              Ajouter mes collègues
            </ButtonLink>
          </li>
        )}
        <li>
          <ButtonLink onClick={submitAndCreateGroup} disabled={loading} small>
            Configurer mes droits{' '}
            {!showAddMember && 'sans ajouter de collègues'}
          </ButtonLink>
        </li>
      </ul>
    </>
  );
}
