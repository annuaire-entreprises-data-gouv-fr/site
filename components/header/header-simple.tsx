'use client';

import { PrintNever } from '#components-ui/print-visibility';
import constants from '#models/constants';
import { isLoggedIn } from '#utils/session';
import usePathFromRouter from 'hooks/use-path-from-router';
import useSession from 'hooks/use-session';
import { HeaderCore } from './header-core';

type IProps = {
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useMap?: boolean;
  plugin?: JSX.Element;
};

export const HeaderSimple: React.FC<IProps> = ({
  useLogo = false,
  useSearchBar = false,
  useMap = false,
  useAgentCTA = false,
  plugin = null,
}) => {
  const session = useSession();
  const pathFrom = usePathFromRouter();
  return (
    <header
      role="banner"
      className="fr-header"
      style={{ filter: !useSearchBar ? 'none !important' : undefined }}
    >
      <div
        id="loader-bar"
        style={{
          background: isLoggedIn(session)
            ? constants.colors.espaceAgent
            : 'transparent',
        }}
      />
      <PrintNever>
        <form
          id="search-bar-form"
          action={useMap ? '/rechercher/carte' : '/rechercher'}
          method="get"
        >
          <HeaderCore
            useSearchBar={useSearchBar}
            useLogo={useLogo}
            useAgentCTA={useAgentCTA}
            pathFrom={pathFrom}
            session={session}
          />
          {plugin}
        </form>
      </PrintNever>
    </header>
  );
};
