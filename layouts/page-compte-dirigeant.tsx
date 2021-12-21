import React from 'react';
import Meta from '../components/meta';
import DownloadManager from '../components/download-manager';

interface IProps {
  title: string;
  description?: string;
  canonical?: string;
}

const PageCompteDirigeant: React.FC<IProps> = ({
  children,
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
        max-width: 100%;
      }
    `}</style>
  </div>
);

export default PageCompteDirigeant;
