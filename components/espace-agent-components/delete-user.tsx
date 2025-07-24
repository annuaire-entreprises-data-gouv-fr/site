import httpClient from '#utils/network';
import { useState } from 'react';

export default function DeleteUserButton({
  userEmail,
  groupId,
  deleteUser,
}: {
  userEmail: string;
  groupId: number;
  deleteUser: (email: string) => void;
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

      deleteUser(userEmail);
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
        key={`remove-${userEmail}`}
        type="button"
        className="fr-btn fr-btn--tertiary-no-outline"
        title="Supprimer"
        aria-label={`Supprimer ${userEmail}`}
        onClick={handleRemove(userEmail)}
        disabled={loading}
      >
        <span aria-hidden="true">🗑️</span>
      </button>
    </>
  );
}
