import { useAuth } from "#/contexts/auth.context";
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

export const Header: React.FC<IProps> = ({
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
  const { user } = useAuth();

  return (
    <HeaderCore
      currentSearchTerm={currentSearchTerm}
      plugin={plugin}
      useAgentBanner={useAgentBanner}
      useAgentCTA={useAgentCTA}
      useAgentDocumentation={useAgentDocumentation}
      useExportSirene={useExportSirene}
      useLogo={useLogo}
      useMap={useMap}
      useReconnectBanner={useReconnectBanner}
      user={user}
      useSearchBar={useSearchBar}
    />
  );
};
