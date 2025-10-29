import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import { getAgentGroups } from "#models/authentication/group";
import {
  ApplicationRights,
  getGroupsGrantingRights,
  hasRights,
} from "#models/authentication/user/rights";
import getSession from "#utils/server-side-helper/get-session";

export const HabilitationsTable = async () => {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const groups = await getAgentGroups();

  const appRights = Object.values(ApplicationRights)
    .filter(
      (scope) =>
        scope !== ApplicationRights.isAgent &&
        scope !== ApplicationRights.opendata
    )
    .map((scope) => {
      const hasRight = hasRights(session, scope);
      let habilitation: React.ReactNode;
      if (hasRight) {
        const groupsGrantingRight = getGroupsGrantingRights(groups, scope);
        if (groupsGrantingRight.length > 0) {
          habilitation = (
            <div className="fr-grid-row">
              {groupsGrantingRight.map((group) => (
                <Tag
                  color="success"
                  key={group.id}
                  link={{
                    href: `/compte/mes-groupes#group-${group.id}`,
                    "aria-label": `Voir le groupe ${group.name}`,
                  }}
                >
                  <Icon slug="groupFill">{group.name}</Icon>
                </Tag>
              ))}
            </div>
          );
        } else {
          habilitation = (
            <Tag color="info">
              <Icon slug="checkLine">Agent Public</Icon>
            </Tag>
          );
        }
      } else {
        habilitation = (
          <Tag color="error">
            <Icon slug="closeCircleFill">Non Habilité</Icon>
          </Tag>
        );
      }

      return [scope, habilitation];
    }) as [ApplicationRights, React.ReactNode][];

  return (
    <div className="fr-table fr-table--no-scroll">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption>Vos accès</caption>
              <thead>
                <tr>
                  <th scope="col">Nom de la donnée</th>
                  <th scope="col">Vos habilitations</th>
                </tr>
              </thead>
              <tbody>
                {appRights.map(([a, b]) => (
                  <tr key={a}>
                    <td>{a}</td>
                    <td>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
