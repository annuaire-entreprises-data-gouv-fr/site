import React from 'react';
import Footer from '../components/footer';
import { Header, HeaderSearch } from '../components/header';
import Meta from '../components/meta';
import { Question } from '../components-ui/question';
import { NPSBanner } from '../components/banner/nps';
import { WeNeedYouModal } from '../components/modal/we-need-you';
import DownloadManager from '../components/download-manager';
import { MigrationBanner } from '../components/banner/entreprise-data';
import { IParams } from '../models/search-filter-params';

interface IProps {
  small?: boolean;
  currentSearchTerm?: string;
  searchFilterParams?: IParams;
  map?: boolean;
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

const Page: React.FC<IProps> = ({
  small,
  children,
  currentSearchTerm = '',
  searchFilterParams,
  map = false,
  title,
  description,
  canonical,
  noIndex = false,
}) => (
  <div id="page-layout">
    <Meta
      title={title}
      description={description}
      noIndex={noIndex}
      canonical={canonical}
    />
    {small ? <NPSBanner /> : <MigrationBanner />}
    <WeNeedYouModal />
    {small ? (
      <HeaderSearch
        currentSearchTerm={currentSearchTerm}
        map={map}
        searchFilterParams={searchFilterParams}
      />
    ) : (
      <Header />
    )}
    <main className="fr-container">{children}</main>
    <Question />
    <DownloadManager />
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
