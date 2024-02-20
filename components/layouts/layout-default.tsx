import { PropsWithChildren } from 'react';
import { Question } from '#components-ui/question';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderWithAdvancedSearch } from '#components/header/header-advanced-search';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import SocialNetworks from '#components/social-network';

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

      <HeaderWithAdvancedSearch
        useSearchBar={searchBar}
        useAdvancedSearch={false}
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
