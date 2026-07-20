import type { IAgentInfo } from "#/models/authentication/agent";
import { isLoggedIn } from "#/models/authentication/user/rights";
import type { ISession } from "#/models/authentication/user/session";
import { EspaceAgentLink } from "./espace-agent-link";
import { LoggedInMenu } from "./logged-in-menu";

const Menu: React.FC<{
  user: ISession["user"] | null;
  useAgentCTA: boolean;
}> = ({ user, useAgentCTA }) =>
  isLoggedIn({ user }) ? (
    <LoggedInMenu user={user as IAgentInfo} />
  ) : useAgentCTA ? (
    <EspaceAgentLink />
  ) : null;

export default Menu;
