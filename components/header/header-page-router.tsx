import usePageRouterSession from 'hooks/use-page-router-session';
import { HeaderCore } from './header-core';

type IProps = {
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useMap?: boolean;
  plugin?: JSX.Element;
  currentSearchTerm?: string;
};
export const HeaderPageRouter: React.FC<IProps> = ({
  useLogo = false,
  useSearchBar = false,
  useMap = false,
  useAgentCTA = false,
  plugin,
  currentSearchTerm = '',
}) => {
  const session = usePageRouterSession();

  return (
    <HeaderCore
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentCTA={useAgentCTA}
      plugin={plugin}
      session={session}
      currentSearchTerm={currentSearchTerm}
    />
  );
};
