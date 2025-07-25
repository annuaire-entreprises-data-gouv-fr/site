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

  return (
    <>
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: 0,
        }}
      >
        {initialName}
        <button
          className="fr-btn fr-btn--tertiary-no-outline"
          onClick={() => setIsVisible(true)}
        >
          <Icon slug="ballPenFill" />
        </button>
      </h2>
      <FullScreenModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        modalId={`update-name-${groupId}`}
      >
        <div className="fr-input-group">
          <label className="fr-label" htmlFor={`group-name-${groupId}`}>
            Renommer l‘équipe
          </label>
          <div className="fr-input-wrap">
            <input
              ref={inputRef}
              className="fr-input"
              type="text"
              id={`group-name-${groupId}`}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>
          {error && <p className="fr-error-text">{error}</p>}
          <div
            className="fr-mt-2w"
            style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            <ButtonLink
              onClick={handleUpdateName}
              disabled={!groupName?.trim() || loading}
            >
              Sauvegarder
            </ButtonLink>
            <ButtonLink
              alt
              onClick={() => setIsVisible(false)}
              disabled={loading}
            >
              Annuler
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
