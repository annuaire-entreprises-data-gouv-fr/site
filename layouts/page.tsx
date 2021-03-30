import React from 'react';
import Footer from '../components/footer';
import { Header, HeaderSmall } from '../components/header';
import Meta from '../components/meta';
import { Question } from '../components/question';
import { NPSBanner } from '../components/banner/nps';
import { WeNeedYouModal } from '../components/modal/we-need-you';

interface IProps {
  small?: boolean;
  currentSearchTerm?: string;
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
    {small ? (
      <HeaderSmall currentSearchTerm={currentSearchTerm} map={map} />
    ) : (
      <Header />
    )}
    <main className="rf-container">{children}</main>
    <Question />
    <Footer />
    <style global jsx>{`
      #page-layout {
        width: 100%;
      }

      main.rf-container {
        max-width: ${map ? '100%' : ''};
      }
    `}</style>
  </div>
);

export default Page;
