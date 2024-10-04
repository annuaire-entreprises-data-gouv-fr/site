import getSession from '#utils/server-side-helper/app/get-session';
import usePathServer from 'hooks/use-path-server';
import { HeaderCore } from './header-core';

type IProps = {
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useAgentBanner?: boolean;
  useMap?: boolean;
  plugin?: JSX.Element;
  currentSearchTerm?: string;
};

export const HeaderAppRouter: React.FC<IProps> = async ({
  useLogo = false,
  useSearchBar = false,
  useMap = false,
  useAgentCTA = false,
  useAgentBanner = false,
  plugin,
  currentSearchTerm = '',
}) => {
  const session = await getSession();
  const pathFrom = usePathServer();

  return (
    <HeaderCore
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentBanner={useAgentBanner}
      useAgentCTA={useAgentCTA}
      plugin={plugin}
      session={session}
      pathFrom={pathFrom}
      currentSearchTerm={currentSearchTerm}
    />
  );
};
