import React from 'react';
import Footer from '../components/footer';
import { Header, HeaderSmall } from '../components/header';
import Meta from '../components/meta';
import { Question } from '../components/question';
import { NPSBanner } from '../components/banner/nps';
import { WeNeedYouModal } from '../components/modal/we-need-you';
import DownloadManager from '../components/download-manager';

interface IProps {
  headerWithSearch?: boolean;
  currentSearchTerm?: string;
  fullWidth?: boolean;
  map?: boolean;
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

const Page: React.FC<IProps> = ({
  headerWithSearch = true,
  fullWidth = false,
  children,
  currentSearchTerm = '',
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
    <NPSBanner />
    <WeNeedYouModal />
    {headerWithSearch ? (
      <HeaderSmall currentSearchTerm={currentSearchTerm} map={map} />
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
        max-width: ${map || fullWidth ? '100%' : ''};
      }
    `}</style>
  </div>
);

export default Page;
