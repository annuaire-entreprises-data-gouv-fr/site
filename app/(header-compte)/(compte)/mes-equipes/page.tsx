import ButtonLink from '#components-ui/button';
import { FullTable } from '#components/table/full';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { Group } from '#models/group';
import { Groups } from '#models/groups';
import getSession from '#utils/server-side-helper/app/get-session';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

const MyTeamsPage = async () => {
  const session = await getSession();

  if (!hasRights(session, ApplicationRights.isAgent)) {
    return redirect('/lp/agent-public');
  }

  const groups = await Groups.find(session?.user?.email ?? '');

  const handleUpdateName = (groupId: number) => async (groupName: string) => {
    const group = new Group(groupId);

    await group.updateName(groupName);
  };

  const handleAdd =
    (groupId: number, userEmail: string) => async (roleId: number) => {
      const adminEmail = session?.user?.email;

      if (!adminEmail) {
        return;
      }

      const group = new Group(groupId);

      await group.addUser(adminEmail, userEmail, roleId);
    };

  const handleUpdate =
    (groupId: number, userEmail: string) => async (roleId: number) => {
      const adminEmail = session?.user?.email;

      if (!adminEmail) {
        return;
      }

      const group = new Group(groupId);

      await group.updateUser(adminEmail, userEmail, roleId);
    };

  const handleRemove = (groupId: number, userEmail: string) => async () => {
    const adminEmail = session?.user?.email;

    if (!adminEmail) {
      return;
    }

    const group = new Group(groupId);

    await group.removeUserFromGroup(adminEmail, userEmail);
  };

  return (
    <Fragment>
      <div className="fr-container" style={{ marginTop: 32 }}>
        <div
          className="fr-grid-row fr-grid-row--gutters fr-mb-4w"
          style={{ alignItems: 'center' }}
        >
          <div className="fr-col">
            <h1 className="fr-h1">Mes équipes</h1>
          </div>
          <div className="fr-col-auto">
            <ButtonLink type="button">Nouvelle équipe</ButtonLink>
          </div>
        </div>
        {groups.map((group) => (
          <div className="fr-card fr-card--no-border fr-mb-4w">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <div
                  className="fr-grid-row fr-grid-row--gutters fr-mb-2w"
                  style={{ alignItems: 'center' }}
                >
                  <div className="fr-col">
                    <div className="fr-text--xl fr-text--bold fr-mb-1v">
                      {group.name}
                    </div>
                    {/* <div className="fr-text--sm fr-mb-1v">
                      Habilité - {group.habilite}
                    </div> */}
                    <div className="fr-text--sm fr-mb-1v">
                      {group.users.length} membres
                    </div>
                  </div>
                  <div className="fr-col-auto">
                    <ButtonLink type="button">Modifier</ButtonLink>
                  </div>
                </div>
                <FullTable
                  head={['Membre', 'Rôle', 'Statut', '']}
                  body={group.users.map((user) => [
                    <div
                      className="fr-grid-row fr-grid-row--gutters"
                      style={{ alignItems: 'center' }}
                    >
                      <div className="fr-col-auto">
                        <span
                          className="fr-icon-user-line"
                          aria-hidden="true"
                          style={{ fontSize: 24 }}
                        />
                      </div>
                      <div className="fr-col">
                        <div className="fr-text--md fr-text--bold">
                          {user.email}
                        </div>
                        {/* <div
                          className="fr-text--xs fr-text--regular"
                          style={{ color: '#888' }}
                        >
                          {user.email}
                        </div> */}
                      </div>
                    </div>,
                    <>
                      {user.role_name} <span aria-hidden="true">▼</span>
                    </>,
                    user.is_email_confirmed ? 'Inscrit' : 'Invitation envoyée',
                    <button
                      type="button"
                      className="fr-btn fr-btn--tertiary-no-outline"
                      title="Supprimer"
                      aria-label={`Supprimer ${user.email}`}
                      onClick={handleRemove(group.id, user.email)}
                    >
                      <span aria-hidden="true">🗑️</span>
                    </button>,
                  ])}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default MyTeamsPage;
