import { useState } from 'react';

export default function AddUser({
  groupId,
  addNewUser,
  cancel,
}: {
  groupId: number;
  addNewUser: (email: string) => void;
  cancel: () => void;
}) {
  const [inputEmail, setInputEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNewUser = async () => {
    setLoading(true);

    try {
      await addNewUser(inputEmail);
      setInputEmail('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-input-group">
      <label className="fr-label" htmlFor={`new-user-email-${groupId}`}>
        Ajouter un membre
      </label>
      <div className="fr-input-wrap">
        <input
          className="fr-input"
          type="email"
          id={`new-user-email-${groupId}`}
          placeholder="email@exemple.fr"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="fr-mt-1w">
        <button
          type="button"
          className="fr-btn fr-btn--primary fr-mt-1w"
          onClick={handleAddNewUser}
          disabled={!inputEmail?.trim() || loading}
        >
          Ajouter
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
