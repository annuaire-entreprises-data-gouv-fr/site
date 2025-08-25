import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import { Icon } from '#components-ui/icon/wrapper';
import { validateGroupName } from '#components/espace-agent-components/helpers/form-validation';
import {
  showErrorNotification,
  showSuccessNotification,
} from '#components/notification-center';
import httpClient from '#utils/network';
import { useEffect, useRef, useState } from 'react';

export default function UpdateNameModal({
  groupId,
  initialName,
  updateGroupNameState,
}: {
  groupId: number;
  initialName: string;
  updateGroupNameState: (name: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [groupName, setGroupName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
      setGroupName(initialName);
    }
  }, [isVisible, initialName]);

  const handleUpdateName = async () => {
    setLoading(true);
    setValidationErrors([]);

    try {
      // Client-side validation
      const nameValidationError = validateGroupName(groupName);
      if (nameValidationError) {
        setValidationErrors([nameValidationError]);
        showErrorNotification('Nom invalide', nameValidationError);
        return;
      }

      await httpClient({
        url: `/api/groups/${groupId}/update-name`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ groupName }),
      });

      updateGroupNameState(groupName);
      setIsVisible(false);

      showSuccessNotification(
        'Nom du groupe mis à jour',
        `Le groupe a été renommé "${groupName}"`
      );
    } catch (error: any) {
      showErrorNotification(
        'Erreur lors de la mise à jour du nom',
        error?.message
      );
    } finally {
      setLoading(false);
    }
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
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
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
              validationErrors.length > 0 ? 'fr-input-group--error' : ''
            }`}
          >
            <label className="fr-label" htmlFor={`group-name-${groupId}`}>
              Nom du groupe
              <span className="fr-hint-text">(entre 2 et 100 caractères)</span>
            </label>
            <div className="fr-input-wrap">
              <input
                ref={inputRef}
                className={`fr-input ${
                  validationErrors.length > 0 ? 'fr-input--error' : ''
                }`}
                type="text"
                id={`group-name-${groupId}`}
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && groupName?.trim() && !loading) {
                    handleUpdateName();
                  }
                }}
                disabled={loading}
                autoComplete="off"
                aria-describedby={
                  validationErrors.length > 0
                    ? `error-name-${groupId}`
                    : undefined
                }
              />
            </div>
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink
              onClick={handleUpdateName}
              disabled={!groupName?.trim() || loading}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </ButtonLink>
            <ButtonLink alt onClick={handleCancel} disabled={loading}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
