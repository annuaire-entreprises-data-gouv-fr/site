'use client';

import ButtonLink from '#components-ui/button';
import httpClient from '#utils/network';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function ValidateGroupForm({
  demandeId,
}: {
  demandeId: string;
}) {
  const [groupName, setGroupName] = useState('');
  const [emails, setEmails] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleValidateGroup = async () => {
    setLoading(true);
    setValidationErrors([]);

    try {
      await httpClient({
        url: `/api/groups/validate`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ groupName, demandeId, emails }),
      });
      router.push('/compte/mes-groupes');
    } catch (error: any) {
      setValidationErrors([error.message || 'Une erreur est survenue']);
      return;
    } finally {
      setLoading(false);
    }
  };

  if (addMembers) {
    return (
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <strong className="fr-card__title">Ajoutez des membres</strong>
            <p className="fr-card__desc">
              Les nouveaux membres auront accès aux mêmes données
              supplémentaires que vous.
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
                <input
                  className={`fr-input ${
                    validationErrors.length > 0 ? 'fr-input--error' : ''
                  }`}
                  type="text-area"
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
                <ButtonLink
                  alt
                  onClick={() => {
                    setAddMembers(false);
                  }}
                  disabled={loading}
                >
                  Annuler
                </ButtonLink>
              </li>
              <li>
                <ButtonLink onClick={handleValidateGroup}>
                  Ajouter des membres
                </ButtonLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fr-card">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <strong className="fr-card__title">Configurez votre groupe</strong>
          <p className="fr-card__desc">
            L‘habilitation liée à votre mission temptemp est validée !
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
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && groupName?.trim() && !loading) {
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
              <ButtonLink
                onClick={() => {
                  setAddMembers(true);
                }}
              >
                Ajouter des membres
              </ButtonLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
