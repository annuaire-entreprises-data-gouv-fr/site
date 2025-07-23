import { IDRolesAddUserResponse } from '#clients/api-d-roles/interface';
import httpClient from '#utils/network';
import { useEffect, useRef, useState } from 'react';

export default function AddUserModal({
  visible,
  cancel,
  groupId,
  addNewUser,
  defaultRoleId,
}: {
  visible: boolean;
  groupId: number;
  addNewUser: (user: { email: string; id: number }) => void;
  cancel: () => void;
  defaultRoleId: number;
}) {
  const [inputEmail, setInputEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddNewUser = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!inputEmail || !inputEmail.trim()) return;
      const userEmail = inputEmail.trim();

      const user = await httpClient<IDRolesAddUserResponse>({
        url: `/api/groups/${groupId}/add-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail, roleId: defaultRoleId }),
      });

      addNewUser({ email: user.email, id: user.id });

      setInputEmail('');
      cancel();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fr-input-group">
      <label className="fr-label" htmlFor={`new-user-email-${groupId}`}>
        Ajouter un membre
      </label>
      <div className="fr-input-wrap">
        <input
          ref={inputRef}
          className="fr-input"
          type="email"
          id={`new-user-email-${groupId}`}
          placeholder="email@exemple.fr"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      {error && <p className="fr-error-text">{error}</p>}
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
