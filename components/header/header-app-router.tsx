import getSession from "#utils/server-side-helper/app/get-session";
import { HeaderCore } from "./header-core";

type IProps = {
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useAgentBanner?: boolean;
  useReconnectBanner?: boolean;
  useMap?: boolean;
  plugin?: React.JSX.Element;
  currentSearchTerm?: string;
};

export const HeaderAppRouter: React.FC<IProps> = async ({
  useLogo = false,
  useSearchBar = false,
  useMap = false,
  useAgentCTA = false,
  useAgentBanner = false,
  useReconnectBanner = true,
  plugin,
  currentSearchTerm = "",
}) => {
  const session = await getSession();

  return (
    <HeaderCore
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentBanner={useAgentBanner}
      useAgentCTA={useAgentCTA}
      useReconnectBanner={useReconnectBanner}
      plugin={plugin}
      session={session}
      currentSearchTerm={currentSearchTerm}
    />
  );
};
