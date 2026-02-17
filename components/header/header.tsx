import getSession from "#utils/server-side-helper/get-session";
import { HeaderCore } from "./header-core";

type IProps = {
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useAgentBanner?: boolean;
  useAgentDocumentation?: boolean;
  useReconnectBanner?: boolean;
  useMap?: boolean;
  useExportSirene?: boolean;
  plugin?: React.JSX.Element;
  currentSearchTerm?: string;
};

export const Header: React.FC<IProps> = async ({
  useLogo = false,
  useSearchBar = false,
  useMap = false,
  useAgentCTA = false,
  useAgentBanner = false,
  useAgentDocumentation = false,
  useReconnectBanner = true,
  plugin,
  currentSearchTerm = "",
  useExportSirene = false,
}) => {
  const session = await getSession();

  return (
    <HeaderCore
      currentSearchTerm={currentSearchTerm}
      plugin={plugin}
      session={session}
      useAgentBanner={useAgentBanner}
      useAgentCTA={useAgentCTA}
      useAgentDocumentation={useAgentDocumentation}
      useExportSirene={useExportSirene}
      useLogo={useLogo}
      useMap={useMap}
      useReconnectBanner={useReconnectBanner}
      useSearchBar={useSearchBar}
    />
  );
};
