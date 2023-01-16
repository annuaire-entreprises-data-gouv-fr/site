import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import { Question } from '#components-ui/question';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderWithSearch } from '#components/header';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import SocialNetworks from '#components/social-network';
import { IParams } from '#models/search-filter-params';

interface IProps {
  currentSearchTerm?: string;
  isBrowserOutdated: boolean;
  map?: boolean;
  searchFilterParams?: IParams;
}

/**
 * This Layout should be use only for the page /recherche and /rechercher/carte who use
 * advanced filter with react activated
 */
export const Layout = ({
  children,
  isBrowserOutdated,
  map,
  searchFilterParams,
}: PropsWithChildren<IProps>) => {
  const router = useRouter();
  return (
    <div id="page-layout">
      {isBrowserOutdated && <BrowserIsOutdatedBanner />}
      <NPSBanner />
      <WeNeedYouModal />
      <HeaderWithSearch
        currentSearchTerm={(router.query.terme || '') as string}
        map={map}
        searchParams={searchFilterParams}
        useAdvancedSearch={true}
      />
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
