import { IDRolesUser } from '#clients/api-d-roles/interface';
import httpClient from '#utils/network';
import { useState } from 'react';

export default function DeleteUserButton({
  user,
  groupId,
  deleteUserFromGroupState,
}: {
  user: IDRolesUser;
  groupId: number;
  deleteUserFromGroupState: (email: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRemove = (userEmail: string) => async () => {
    setLoading(true);
    setError(null);

    try {
      await httpClient({
        url: `/api/groups/${groupId}/remove-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail }),
      });

      deleteUserFromGroupState(userEmail);
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
      {error && <p className="fr-error-text">{error}</p>}
      <button
        key={`remove-${user.email}`}
        type="button"
        className="fr-btn fr-btn--tertiary-no-outline"
        title="Supprimer"
        aria-label={`Supprimer ${user.email}`}
        onClick={handleRemove(user.email)}
        disabled={loading}
      >
        <span aria-hidden="true">🗑️</span>
      </button>
    </>
  );
}
