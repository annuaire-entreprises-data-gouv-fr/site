import { IRolesDataRoles, IRolesDataUser } from '#clients/roles-data/interface';
import ButtonLink from '#components-ui/button';
import { FullTable } from '#components/table/full';
import { IRolesDataGroup } from '#models/authentication/group/groups';
import { Fragment, useMemo } from 'react';
import AddUserModal from './update-modals/add-user';
import DeleteUserButton from './update-modals/delete-user';
import UpdateNameModal from './update-modals/update-name';
import UpdateUserSelect from './update-modals/update-user';

const NotAdminTable = ({
  group,
  currentUserEmail,
}: {
  group: IRolesDataGroup;
  currentUserEmail: string;
}) => {
  return (
    <FullTable
      head={['Membre', 'Rôle']}
      body={group.users.map((user) => [
        <>
          {user.email}{' '}
          {user.email === currentUserEmail && (
            <span className="fr-badge fr-ml-1w fr-badge--success fr-badge--sm">
              Vous
            </span>
          )}
        </>,
        <span className="fr-badge">{user.role_name}</span>,
      ])}
    />
  );
};

export function GroupItem({
  currentUserEmail,
  group,
  setGroup,
  isAdmin,
  roles,
}: {
  currentUserEmail: string;
  group: IRolesDataGroup;
  isAdmin: boolean;
  setGroup: (group: IRolesDataGroup) => void;
  roles: IRolesDataRoles[];
}) {
  const defaultRoleId = roles.find((r) => r.role_name === 'utilisateur')?.id;

  const handleUpdateUser = (user: IRolesDataUser) => {
    setGroup({
      ...group,
      users: group.users.map((currentUser) =>
        currentUser.email === user.email ? user : currentUser
      ),
    });
  };

  const adminCount = useMemo(() => {
    return group.users.filter((u) => u.is_admin).length;
  }, [group.users]);

  return (
    <div className="fr-card fr-mt-3w">
      <div className="fr-card__body">
        <div className="fr-card__content" style={{ display: 'flex' }}>
          <div className="fr-mb-3w">
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <h2 className="fr-mt-0">{group.name}</h2>
              {isAdmin && (
                <UpdateNameModal
                  groupId={group.id}
                  initialName={group.name}
                  updateGroupNameState={(name: string) => {
                    setGroup({
                      ...group,
                      name,
                    });
                  }}
                />
              )}
            </div>
            <div>
              <strong>Habilitation :</strong>{' '}
              {group.contract_description ? (
                group.contract_url ? (
                  <a
                    href={group.contract_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {group.contract_description}
                  </a>
                ) : (
                  <strong>{group.contract_description}</strong>
                )
              ) : (
                <i>Aucune habilitation</i>
              )}
            </div>
            <div>
              <strong>Données accessibles :</strong>{' '}
              {group.scopes && group.scopes.length > 0
                ? group.scopes.map((scope) => (
                    <Fragment key={scope}>
                      <span className="fr-badge fr-badge--sm">{scope}</span>
                      &nbsp;
                    </Fragment>
                  ))
                : null}
            </div>
            {isAdmin && (
              <div>
                <p>
                  Votre mission ou le cadre juridique de ce groupe est modifié ?
                  En tant qu’administrateur, modifiez votre habilitation pour
                  accèder à des données supplémentaires.
                </p>
                <ButtonLink alt small to={group.contract_url}>
                  Modifier l’habilitation
                </ButtonLink>
              </div>
            )}
          </div>
          {!isAdmin ? (
            <NotAdminTable group={group} currentUserEmail={currentUserEmail} />
          ) : (
            <>
              <div style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
                <div>
                  <AddUserModal
                    group={group}
                    defaultRoleId={defaultRoleId!}
                    addUserToGroupState={(user: IRolesDataUser) => {
                      setGroup({
                        ...group,
                        users: [...group.users, user],
                      });
                    }}
                  />
                </div>
              </div>

              <FullTable
                head={[`Membres (${group.users.length})`, 'Rôle', 'Action']}
                columnWidths={['65%']}
                body={group.users.map((user) => [
                  <div style={{ flexGrow: 1 }}>
                    {user.email}
                    {user.email === currentUserEmail && (
                      <span className="fr-badge fr-ml-1w fr-badge--success fr-badge--sm">
                        Vous
                      </span>
                    )}
                  </div>,
                  user.email !== currentUserEmail ? (
                    <UpdateUserSelect
                      user={user}
                      groupId={group.id}
                      roles={roles}
                      updateUserFromGroupState={handleUpdateUser}
                    />
                  ) : (
                    <span className="fr-badge">{user.role_name}</span>
                  ),
                  <DeleteUserButton
                    isCurrentUser={user.email === currentUserEmail}
                    adminCount={adminCount}
                    user={user}
                    groupId={group.id}
                    deleteUserFromGroupState={(userEmail: string) => {
                      setGroup({
                        ...group,
                        users: group.users.filter(
                          (user) => user.email !== userEmail
                        ),
                      });
                    }}
                  />,
                ])}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
