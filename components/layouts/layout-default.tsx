import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderPageRouter } from '#components/header/header-page-router';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import { Question } from '#components/question';
import SocialNetworks from '#components/social-network';
import { PropsWithChildren } from 'react';

type IProps = {
  searchBar?: boolean;
};

export const LayoutDefault = ({
  children,
  searchBar = true,
}: PropsWithChildren<IProps>) => {
  return (
    <div id="page-layout">
      <WeNeedYouModal />
      <NPSBanner />
      <HeaderPageRouter
        useSearchBar={searchBar}
        useMap={false}
        useAgentCTA={true}
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
