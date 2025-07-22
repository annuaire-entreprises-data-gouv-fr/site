import { useEffect, useRef, useState } from 'react';

export default function UpdateName({
  groupId,
  initialName,
  updateName,
  cancel,
}: {
  groupId: number;
  initialName: string;
  updateName: (name: string) => void;
  cancel: () => void;
}) {
  const [groupName, setGroupName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleUpdateName = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateName(groupName);
      setGroupName('');
      cancel();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        />
      </div>
      {error && <p className="fr-error-text">{error}</p>}
      <div className="fr-mt-1w">
        <button
          type="button"
          className="fr-btn fr-btn--primary fr-mt-1w"
          onClick={handleUpdateName}
          disabled={!groupName?.trim() || loading}
        >
          Sauvegarder
        </button>
        <button
          type="button"
          className="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-ml-1w"
          onClick={cancel}
          disabled={loading}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
