import React, { PropsWithChildren } from 'react';
import { Question } from '#components-ui/question';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { Header, HeaderWithSearch } from '#components/header';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import SocialNetworks from '#components/social-network';
import { IParams } from '#models/search-filter-params';

interface IProps {
  currentSearchTerm?: string;
  isBrowserOutdated: boolean;
  map?: boolean;
  searchFilterParams?: IParams;
  searchBar?: boolean;
  useAdvancedSearch?: boolean;
}

export const Layout = ({
  children,
  currentSearchTerm,
  isBrowserOutdated,
  map,
  searchFilterParams,
  searchBar = true,
  useAdvancedSearch,
}: PropsWithChildren<IProps>) => {
  return (
    <div id="page-layout">
      {isBrowserOutdated && <BrowserIsOutdatedBanner />}
      <NPSBanner />
      <WeNeedYouModal />
      {searchBar ? (
        <HeaderWithSearch
          currentSearchTerm={currentSearchTerm}
          map={map}
          searchParams={searchFilterParams}
          useAdvancedSearch={useAdvancedSearch}
        />
      ) : (
        <Header />
      )}
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
      <style global jsx>{`
        #page-layout {
          width: 100%;
        }
        main.fr-container {
          max-width: ${map ? '100%' : ''};
        }
      `}</style>
    </div>
  );
};
