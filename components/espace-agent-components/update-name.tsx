import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import { Icon } from '#components-ui/icon/wrapper';
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
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
      setGroupName(initialName);
    }
  }, [isVisible, initialName]);

  const handleUpdateName = async () => {
    setLoading(true);
    setError(null);

    try {
      await httpClient({
        url: `/api/groups/${groupId}/update-name`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ groupName }),
      });
      updateGroupNameState(groupName);
      setGroupName('');
      setIsVisible(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setGroupName(initialName);
    setError(null);
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
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Renommer l&apos;équipe</h2>
            <p className="fr-text--lg">
              Modifiez le nom de l‘équipe <strong>{initialName}</strong>
            </p>
          </div>

          <div className="fr-input-group fr-mb-4w">
            <div className="fr-input-wrap">
              <input
                ref={inputRef}
                className="fr-input"
                type="text"
                id={`group-name-${groupId}`}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && groupName?.trim() && !loading) {
                    handleUpdateName();
                  }
                }}
                disabled={loading}
                autoComplete="off"
              />
            </div>
            {error && <p className="fr-error-text">{error}</p>}
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
