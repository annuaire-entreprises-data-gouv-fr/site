import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import { Question } from '#components-ui/question';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { InfoBanner } from '#components/banner/info-banner';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { Header } from '#components/header';
import SocialNetworks from '#components/social-network';
import { IParams } from '#models/search-filter-params';
import { ISession } from '#utils/session';

type IProps = {
  currentSearchTerm?: string;
  isBrowserOutdated: boolean;
  map?: boolean;
  searchFilterParams?: IParams;
  session?: ISession | null;
};

/**
 * This Layout should be use only for the page /recherche and /rechercher/carte who use
 * advanced filter with react activated
 */
export const LayoutSearch = ({
  children,
  isBrowserOutdated,
  map,
  session = null,
}: PropsWithChildren<IProps>) => {
  const router = useRouter();
  const { terme, ...rest } = router.query;

  return (
    <div id="page-layout">
      {isBrowserOutdated && <BrowserIsOutdatedBanner />}

      <NPSBanner />
      <InfoBanner />

      <Header
        currentSearchTerm={(terme || '') as string}
        useMap={map}
        searchParams={rest}
        useAdvancedSearch={true}
        useSearchBar={true}
        useLogo={true}
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
        main.fr-container {
          max-width: ${map ? '100%' : ''};
        }
      `}</style>
    </div>
  );
};
