import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderWithAdvancedSearch } from '#components/header/header-advanced-search';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import { Question } from '#components/question';
import SocialNetworks from '#components/social-network';
import { IParams } from '#models/search-filter-params';

type IProps = {
  currentSearchTerm?: string;
  map?: boolean;
  searchFilterParams?: IParams;
};

/**
 * This Layout should be use only for the page /recherche and /rechercher/carte who use
 * advanced filter with react activated
 */
export const LayoutSearch = ({ children, map }: PropsWithChildren<IProps>) => {
  const router = useRouter();
  const { terme, ...rest } = router.query;

  return (
    <div id="page-layout">
      <WeNeedYouModal />
      <NPSBanner />

      <HeaderWithAdvancedSearch
        currentSearchTerm={(terme || '') as string}
        useMap={map}
        searchParams={rest}
        useAdvancedSearch={true}
        useSearchBar={true}
        useLogo={true}
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
        main.fr-container {
          ${map ? 'max-width: 100%;' : ''}
        }
      `}</style>
    </div>
  );
};
