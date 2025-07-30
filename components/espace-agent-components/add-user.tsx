'use client';

import { IDRolesUser } from '#clients/roles-data/interface';
import ButtonLink from '#components-ui/button';
import { FullScreenModal } from '#components-ui/full-screen-modal';
import { IDRolesGroup } from '#models/authentication/group/groups';
import httpClient from '#utils/network';
import { useEffect, useRef, useState } from 'react';

const MODAL_ID = 'add-user';

export default function AddUserModal({
  group,
  defaultRoleId,
  addUserToGroupState,
}: {
  group: IDRolesGroup;
  defaultRoleId: number;
  addUserToGroupState: (user: IDRolesUser) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleAddNewUser = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!inputEmail || !inputEmail.trim()) return;
      const userEmail = inputEmail.trim();

      if (group.users.some((user: IDRolesUser) => user.email === userEmail)) {
        setError('Cet utilisateur est déjà membre de cette équipe');
        return;
      }

      const user = await httpClient<IDRolesUser>({
        url: `/api/groups/${group.id}/add-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail, roleId: defaultRoleId }),
      });

      addUserToGroupState(user);

      setInputEmail('');
      setIsVisible(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setInputEmail('');
    setError(null);
  };

  return (
    <>
      <ButtonLink onClick={() => setIsVisible(true)}>
        Ajouter un membre
      </ButtonLink>
      <FullScreenModal
        isVisible={isVisible}
        modalId={MODAL_ID}
        onClose={handleClose}
      >
        <div className="fr-container">
          <div className="fr-mb-4w">
            <h2 className="fr-h2">Ajouter un membre</h2>
            <p className="fr-text--lg">
              Invitez un nouvel utilisateur à rejoindre cette équipe
            </p>
          </div>

          <div className="fr-input-group fr-mb-4w">
            <div className="fr-input-wrap">
              <input
                ref={inputRef}
                className="fr-input"
                type="email"
                id={`new-user-email-${group.id}`}
                placeholder="email@exemple.fr"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputEmail?.trim() && !loading) {
                    handleAddNewUser();
                  }
                }}
                disabled={loading}
              />
            </div>
            {error && <p className="fr-error-text">{error}</p>}
          </div>

          <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse">
            <ButtonLink
              onClick={handleAddNewUser}
              disabled={!inputEmail?.trim() || loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </ButtonLink>
            <ButtonLink alt onClick={handleClose} disabled={loading}>
              Annuler
            </ButtonLink>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
}
