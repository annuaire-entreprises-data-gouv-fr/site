import type { IRolesDataGroupUser } from "#/clients/roles-data/interface";
import InformationTooltip from "#/components-ui/information-tooltip";

/**
 * A group member's email, telling who added them to the group when
 * roles.data knows it
 */
export function MemberEmail({
  user,
}: {
  user: Pick<IRolesDataGroupUser, "email" | "added_by_email">;
}) {
  if (!user.added_by_email) {
    return user.email;
  }
  return (
    <InformationTooltip
      cursor="help"
      horizontalOrientation="left"
      label={
        // long emails must not overflow the tooltip
        <span style={{ overflowWrap: "anywhere" }}>
          Ajouté par {user.added_by_email}
        </span>
      }
      left="0"
      tabIndex={0}
    >
      <span>{user.email}</span>
    </InformationTooltip>
  );
}
