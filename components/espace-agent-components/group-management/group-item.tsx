import { Fragment, useMemo } from "react";
import type {
  IRolesDataRoles,
  IRolesDataUser,
} from "#clients/roles-data/interface";
import NonRenseigne from "#components/non-renseigne";
import { FullTable } from "#components/table/full";
import type { IRolesDataGroup } from "#models/authentication/group/groups";
import { formatSiret } from "#utils/helpers";
import AddUserModal from "./update-modals/add-user";
import DeleteUserButton from "./update-modals/delete-user";
import UpdateNameModal from "./update-modals/update-name";
import UpdateUserSelect from "./update-modals/update-user";

const NotAdminTable = ({
  group,
  currentUserEmail,
}: {
  group: IRolesDataGroup;
  currentUserEmail: string;
}) => (
  <FullTable
    body={group.users.map((user) => [
      <>
        {user.email}{" "}
        {user.email === currentUserEmail && (
          <span className="fr-badge fr-ml-1w fr-badge--success fr-badge--sm">
            Vous
          </span>
        )}
      </>,
      <span className="fr-badge">{user.role_name}</span>,
    ])}
    head={["Membre", "Rôle"]}
  />
);

export function GroupItem({
  currentUserEmail,
  group,
  setGroup,
  deleteGroup,
  isAdmin,
  roles,
}: {
  currentUserEmail: string;
  group: IRolesDataGroup;
  isAdmin: boolean;
  setGroup: (group: IRolesDataGroup) => void;
  deleteGroup: (groupId: number) => void;
  roles: IRolesDataRoles[];
}) {
  const defaultRoleId = roles.find((r) => r.role_name === "utilisateur")?.id;

  const handleUpdateUser = (user: IRolesDataUser) => {
    setGroup({
      ...group,
      users: group.users.map((currentUser) =>
        currentUser.email === user.email ? user : currentUser
      ),
    });
  };

  const adminCount = useMemo(
    () => group.users.filter((u) => u.is_admin).length,
    [group.users]
  );

  return (
    <div className="fr-card fr-mt-3w">
      <div className="fr-card__body">
        <div className="fr-card__content" style={{ display: "flex" }}>
          <div className="fr-mb-3w">
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
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
              <strong>Habilitation :</strong>{" "}
              {group.contract_description || <i>Aucune habilitation</i>}
              {group.contract_url && (
                <>
                  {group.contract_url && (
                    <>
                      {" "}
                      (
                      <a
                        href={group.contract_url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        consulter
                      </a>
                      )
                    </>
                  )}
                </>
              )}
            </div>
            <div>
              <strong>Organisation :</strong>{" "}
              <a
                href={`/etablissement/${group.organisation_siret}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {formatSiret(group.organisation_siret)}
              </a>
            </div>
            <div>
              <strong>Données accessibles :</strong>{" "}
              {group.scopes && group.scopes.length > 0 ? (
                group.scopes.map((scope) => (
                  <Fragment key={scope}>
                    <span className="fr-badge fr-badge--sm">{scope}</span>
                    &nbsp;
                  </Fragment>
                ))
              ) : (
                <NonRenseigne />
              )}
            </div>
            {isAdmin && group.contract_url && (
              <p>
                Votre mission ou le cadre juridique de ce groupe est modifié ?{" "}
                <a href={group.contract_url}>
                  Demandez une mise à jour de votre habilitation
                </a>{" "}
                pour accèder à des données supplémentaires.
              </p>
            )}
          </div>
          {!isAdmin ? (
            <NotAdminTable currentUserEmail={currentUserEmail} group={group} />
          ) : (
            <>
              <div style={{ alignSelf: "flex-end", marginBottom: "1rem" }}>
                <div>
                  <AddUserModal
                    addUserToGroupState={(user: IRolesDataUser) => {
                      setGroup({
                        ...group,
                        users: [...group.users, user],
                      });
                    }}
                    defaultRoleId={defaultRoleId!}
                    group={group}
                  />
                </div>
              </div>

              <FullTable
                body={group.users.map((user) => [
                  <div style={{ flexGrow: 1 }}>
                    {user.email}
                    {user.email === currentUserEmail && (
                      <span className="fr-badge fr-ml-1w fr-badge--success fr-badge--sm">
                        Vous
                      </span>
                    )}
                  </div>,
                  user.email !== currentUserEmail || adminCount >= 2 ? (
                    <UpdateUserSelect
                      groupId={group.id}
                      roles={roles}
                      updateUserFromGroupState={handleUpdateUser}
                      user={user}
                    />
                  ) : (
                    <span className="fr-badge">{user.role_name}</span>
                  ),
                  <DeleteUserButton
                    adminCount={adminCount}
                    deleteUserFromGroupState={(userEmail: string) => {
                      if (user.email === currentUserEmail) {
                        deleteGroup(group.id);
                      } else {
                        setGroup({
                          ...group,
                          users: group.users.filter(
                            (user) => user.email !== userEmail
                          ),
                        });
                      }
                    }}
                    groupId={group.id}
                    isCurrentUser={user.email === currentUserEmail}
                    user={user}
                  />,
                ])}
                columnWidths={["65%"]}
                head={[`Membres (${group.users.length})`, "Rôle", "Action"]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
