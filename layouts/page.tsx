import React from 'react';
import Footer from '../components/footer';
import { Header } from '../components/header';
import Meta from '../components/meta';
import { Question } from '../components/question';
import { NPSBanner } from '../components/banner/nps';
import { WeNeedYouModal } from '../components/modal/we-need-you';
import DownloadManager from '../components/download-manager';
import { PageContext } from './page-context';
import { ISession } from '../utils/session/manageSession';

interface IProps {
  simpleHeader?: boolean;
  currentSearchTerm?: string;
  fullWidth?: boolean;
  map?: boolean;
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  session: ISession | null;
}

class Page extends React.Component<IProps> {
  static contextType = PageContext;

  render() {
    const {
      simpleHeader = false,
      fullWidth = false,
      children,
      currentSearchTerm = '',
      map = false,
      title,
      description,
      canonical,
      noIndex = false,
      session,
    } = this.props;
    return (
      <PageContext.Provider
        value={{
          session,
        }}
      >
        <div id="page-layout">
          <Meta
            title={title}
            description={description}
            noIndex={noIndex}
            canonical={canonical}
          />
          <NPSBanner />
          <WeNeedYouModal />
          <Header
            simpleHeader={simpleHeader}
            currentSearchTerm={currentSearchTerm}
            session={session}
            map={map}
          />
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
      </PageContext.Provider>
    );
  }
}

export default Page;
