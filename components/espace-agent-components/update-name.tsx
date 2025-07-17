import { useState } from 'react';

export default function UpdateName({
  groupId,
  updateName,
  cancel,
}: {
  groupId: number;
  updateName: (name: string) => void;
  cancel: () => void;
}) {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    setLoading(true);

    try {
      await updateName(groupName);
      setGroupName('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-input-group">
      <label className="fr-label" htmlFor={`group-name-${groupId}`}>
        Modifier le nom de l‘équipe
      </label>
      <div className="fr-input-wrap">
        <input
          className="fr-input"
          type="text"
          id={`group-name-${groupId}`}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          disabled={loading}
        />
      </div>
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
