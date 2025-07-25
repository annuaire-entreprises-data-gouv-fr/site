import { IDRolesUser } from '#clients/api-d-roles/interface';
import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import httpClient from '#utils/network';
import { useState } from 'react';

export default function DeleteUserButton({
  isCurrentUser,
  user,
  groupId,
  deleteUserFromGroupState,
}: {
  isCurrentUser: boolean;
  user: IDRolesUser;
  groupId: number;
  deleteUserFromGroupState: (email: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      setShowConfirmation(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
    setError(null);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setError(null);
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
        onClick={openConfirmation}
        disabled={loading}
      >
        <span aria-hidden="true">🗑️</span>
      </button>

      <FullScreenModal
        isVisible={showConfirmation}
        modalId="delete-user-confirmation"
        onClose={closeConfirmation}
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Confirmer la suppression</h2>
            <p className="fr-text--lg">
              Êtes-vous sûr de vouloir supprimer <strong>{user.email}</strong>{' '}
              de ce groupe ?
            </p>
            {isCurrentUser && (
              <div className="fr-alert fr-alert--warning fr-mb-3w">
                <p className="fr-alert__title">Attention</p>
                <p>
                  Vous êtes sur le point de vous supprimer vous-même de ce
                  groupe.
                </p>
              </div>
            )}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink alt onClick={closeConfirmation} disabled={loading}>
              Annuler
            </ButtonLink>
            <ButtonLink onClick={handleRemove(user.email)} disabled={loading}>
              {loading ? 'Suppression...' : 'Confirmer la suppression'}
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
