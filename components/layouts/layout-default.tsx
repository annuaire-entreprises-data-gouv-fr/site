import { PropsWithChildren } from 'react';
import { Question } from '#components-ui/question';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { Header } from '#components/header';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import SocialNetworks from '#components/social-network';
import { ISession } from '#utils/session';

type IProps = {
  isBrowserOutdated: boolean;
  searchBar?: boolean;
  session?: ISession | null;
};

export const LayoutDefault = ({
  children,
  isBrowserOutdated,
  searchBar = true,
  session = null,
}: PropsWithChildren<IProps>) => {
  return (
    <div id="page-layout">
      {isBrowserOutdated && <BrowserIsOutdatedBanner />}
      <WeNeedYouModal />
      <NPSBanner />

      <Header
        useSearchBar={searchBar}
        useAdvancedSearch={false}
        useMap={false}
        session={session}
      />
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
      <style global jsx>{`
        #page-layout {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
