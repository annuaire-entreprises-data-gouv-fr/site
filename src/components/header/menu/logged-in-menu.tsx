import { useAgentHeaderAbTest } from "#/hooks/use-ab-test";
import type { IAgentInfo } from "#/models/authentication/agent";
import { LoggedInMenuOriginal } from "./logged-in-menu-original";
import { LoggedInMenuVariationA } from "./logged-in-menu-variation-a";

interface ILoggedInMenuProps {
  user: IAgentInfo;
}

export function LoggedInMenu({ user }: ILoggedInMenuProps) {
  const variation = useAgentHeaderAbTest();

  if (variation === "VariationA") {
    return <LoggedInMenuVariationA user={user} />;
  }

  return <LoggedInMenuOriginal user={user} />;
}
