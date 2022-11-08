import React, { PropsWithChildren } from 'react';
import Footer from '../components/footer';
import { Header, HeaderWithSearch } from '../components/header';
import Meta from '../components/meta';
import { Question } from '../components-ui/question';
import { NPSBanner } from '../components/banner/nps';
import { WeNeedYouModal } from '../components/modal/we-need-you';
import { IParams } from '../models/search-filter-params';
import { BrowserIsOutdatedBanner } from '../components/banner/browser-is-outdated';

interface IProps {
  small?: boolean;
  currentSearchTerm?: string;
  searchFilterParams?: IParams;
  map?: boolean;
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  isBrowserOutdated?: boolean;
  useAdvancedSearch?: boolean;
}

const Page: React.FC<PropsWithChildren<IProps>> = ({
  small,
  children,
  currentSearchTerm = '',
  searchFilterParams,
  map = false,
  title,
  description,
  canonical,
  noIndex = false,
  isBrowserOutdated = false,
  useAdvancedSearch = false,
}) => (
  <div id="page-layout">
    <Meta
      title={title}
      description={description}
      noIndex={noIndex}
      canonical={canonical}
    />
    {isBrowserOutdated && <BrowserIsOutdatedBanner />}
    <NPSBanner />
    <WeNeedYouModal />
    {small ? (
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

export default Page;
