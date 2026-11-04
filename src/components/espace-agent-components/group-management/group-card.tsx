import ButtonLink from "#/components-ui/button";
import type { IAgentsGroup } from "#/models/authentication/group";
import { GroupInfos } from "./group-infos";
import styles from "./styles.module.css";
import UpdateNameModal from "./update-modals/update-name";

export function GroupCard({
  group,
  updateGroupNameState,
}: {
  group: IAgentsGroup;
  updateGroupNameState: (name: string) => void;
}) {
  const isAdmin = group.current_user_role.is_admin;

  return (
    <div className="fr-card fr-mt-3w" id={`group-${group.id}`}>
      <div className="fr-card__body">
        <div className={`fr-card__content ${styles.groupCard}`}>
          <div className={styles.groupCardHeader}>
            <h2 className="fr-my-0">{group.name}</h2>
            {isAdmin && (
              <UpdateNameModal
                groupId={group.id}
                initialName={group.name}
                updateGroupNameState={updateGroupNameState}
              />
            )}
          </div>
          <div className={styles.groupCardBody}>
            <div className="fr-mb-1w">
              <span className="fr-badge fr-badge--info fr-badge--sm">
                Votre rôle : {group.current_user_role.role_name}
              </span>
            </div>
            <GroupInfos group={group} isAdmin={isAdmin} />
            <div className="fr-mt-1w">
              <strong>
                Administrateur{group.admins.length > 1 ? "s" : ""} :
              </strong>{" "}
              {group.admins.length > 0 ? (
                group.admins.map((admin) => admin.email).join(", ")
              ) : (
                <i>Aucun administrateur</i>
              )}
            </div>
          </div>
          <div className={styles.groupCardAction}>
            <ButtonLink alt to={`/compte/mes-groupes/${group.id}`}>
              {isAdmin ? "Gérer le groupe" : "Voir le groupe"}
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
