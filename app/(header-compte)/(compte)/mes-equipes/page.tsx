import { FullTable } from '#components/table/full';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { Group } from '#models/group';
import { Groups } from '#models/groups';
import getSession from '#utils/server-side-helper/app/get-session';
import { redirect } from 'next/navigation';

const MyTeamsPage = async () => {
  const session = await getSession();

  if (
    !hasRights(session, ApplicationRights.isAgent) ||
    !session?.user?.email ||
    !session?.user?.userId
  ) {
    return redirect('/lp/agent-public');
  }

  const groups = await Groups.find(session.user.email, session.user.userId);

  const handleUpdateName = (groupId: number) => async (groupName: string) => {
    const adminEmail = session?.user?.email;
    const adminSub = session?.user?.userId;

    if (!adminEmail || !adminSub) {
      return;
    }

    const group = new Group(groupId);

    await group.updateName(adminEmail, adminSub, groupName);
  };

  const handleAdd =
    (groupId: number, userEmail: string) => async (roleId: number) => {
      const adminEmail = session?.user?.email;
      const adminSub = session?.user?.userId;

      if (!adminEmail || !adminSub) {
        return;
      }

      const group = new Group(groupId);

      await group.addUser(adminEmail, adminSub, userEmail, roleId);
    };

  const handleUpdate =
    (groupId: number, userEmail: string) => async (roleId: number) => {
      const adminEmail = session?.user?.email;
      const adminSub = session?.user?.userId;

      if (!adminEmail || !adminSub) {
        return;
      }

      const group = new Group(groupId);

      await group.updateUser(adminEmail, adminSub, userEmail, roleId);
    };

  const handleRemove = (groupId: number, userEmail: string) => async () => {
    const adminEmail = session?.user?.email;
    const adminSub = session?.user?.userId;

    if (!adminEmail || !adminSub) {
      return;
    }

    const group = new Group(groupId);

    await group.removeUserFromGroup(adminEmail, adminSub, userEmail);
  };

  return (
    <>
      <h1>Mes équipes</h1>
      {/* <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ButtonLink type="button">Nouvelle équipe</ButtonLink>
      </div> */}

      {groups.map((group) => (
        <div className="fr-card">
          <div className="fr-card__body">
            <div className="fr-card__content">
              <div
                className="fr-grid-row fr-grid-row--gutters"
                style={{ alignItems: 'center' }}
              >
                <div className="fr-col">
                  <div className="fr-text--xl fr-text--bold">{group.name}</div>
                  {/* <div className="fr-text--sm">
                      Habilité - {group.habilite}
                    </div> */}
                  <div className="fr-text--sm">
                    {group.users.length} membres
                  </div>
                </div>
                {/* <div className="fr-col-auto">
                    <ButtonLink type="button">Modifier</ButtonLink>
                  </div> */}
              </div>
              <FullTable
                head={['Membre', 'Rôle', 'Statut', '']}
                body={group.users.map((user) => [
                  user.email,
                  user.role_name,
                  user.is_email_confirmed ? 'Inscrit' : 'Invitation envoyée',
                  // <button
                  //   type="button"
                  //   className="fr-btn fr-btn--tertiary-no-outline"
                  //   title="Supprimer"
                  //   aria-label={`Supprimer ${user.email}`}
                  //   onClick={handleRemove(group.id, user.email)}
                  // >
                  //   <span aria-hidden="true">🗑️</span>
                  // </button>,
                ])}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MyTeamsPage;
