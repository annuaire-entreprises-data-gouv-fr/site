import React from 'react';
import Meta from '../components/meta';
import DownloadManager from '../components/download-manager';

interface IProps {
  small?: boolean;
  currentSearchTerm?: string;
  map?: boolean;
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

const ApplicationPage: React.FC<IProps> = ({
  children,
  map = false,
  title,
  description,
  canonical,
}) => (
  <div id="page-layout">
    <Meta
      title={title}
      description={description}
      noIndex={true}
      canonical={canonical}
    />
    <main className="fr-container">{children}</main>
    <DownloadManager />
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

export default ApplicationPage;
