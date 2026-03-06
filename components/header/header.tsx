import getSession from "#utils/server-side-helper/get-session";
import { HeaderCore } from "./header-core";

interface IProps {
  currentSearchTerm?: string;
  plugin?: React.JSX.Element;
  useAgentBanner?: boolean;
  useAgentCTA?: boolean;
  useAgentDocumentation?: boolean;
  useExportSirene?: boolean;
  useLogo?: boolean;
  useMap?: boolean;
  useReconnectBanner?: boolean;
  useSearchBar?: boolean;
}

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
