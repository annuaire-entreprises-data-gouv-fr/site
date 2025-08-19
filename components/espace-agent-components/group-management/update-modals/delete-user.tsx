import { IRolesDataUser } from '#clients/roles-data/interface';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import {
  showErrorNotification,
  showSuccessNotification,
} from '#components/notification-center';
import httpClient from '#utils/network';
import { useState } from 'react';

export default function DeleteUserButton({
  isCurrentUser,
  user,
  adminCount,
  groupId,
  deleteUserFromGroupState,
}: {
  isCurrentUser: boolean;
  adminCount: number;
  user: IRolesDataUser;
  groupId: number;
  deleteUserFromGroupState: (email: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRemove = (userEmail: string) => async () => {
    setLoading(true);

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

      // Show success notification
      showSuccessNotification(
        'Membre supprimé',
        `${userEmail} a été retiré du groupe`
      );
    } catch (error: any) {
      showErrorNotification('Erreur lors de la suppression', error?.message);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <ButtonLink
        key={`remove-${user.email}`}
        type="button"
        aria-label={`Supprimer ${user.email}`}
        onClick={openConfirmation}
        disabled={loading || (isCurrentUser && adminCount === 1)}
        alt
      >
        <span aria-hidden="true">Supprimer</span>
      </ButtonLink>

      <FullScreenModal
        isVisible={showConfirmation}
        modalId="delete-user-confirmation"
        onClose={closeConfirmation}
        textAlign="left"
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Confirmer la suppression</h2>
            <p className="fr-text--lg">
              Êtes-vous sûr de vouloir supprimer <strong>{user.email}</strong>{' '}
              de ce groupe ?
            </p>
            {isCurrentUser && (
              <Warning>
                <p>
                  <strong>Attention</strong>, vous êtes sur le point de vous
                  supprimer vous-même de ce groupe.
                </p>
              </Warning>
            )}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink onClick={handleRemove(user.email)} disabled={loading}>
              {loading ? 'Suppression...' : 'Confirmer la suppression'}
            </ButtonLink>
            <ButtonLink alt onClick={closeConfirmation} disabled={loading}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
