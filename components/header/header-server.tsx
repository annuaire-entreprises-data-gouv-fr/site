import usePathServer from 'hooks/use-path-server';
import useSessionServer from 'hooks/use-session-server';
import { HeaderCore } from './header-core';

type IProps = {
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useMap?: boolean;
  plugin?: JSX.Element;
};

export const HeaderServer: React.FC<IProps> = async ({
  useLogo = false,
  useSearchBar = false,
  useMap = false,
  useAgentCTA = false,
  plugin,
}) => {
  const session = await useSessionServer();
  const pathFrom = usePathServer();

  return (
    <HeaderCore
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentCTA={useAgentCTA}
      plugin={plugin}
      session={session}
      pathFrom={pathFrom}
    />
  );
};
