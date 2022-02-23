import React from 'react';

const DownloadLink: React.FC<{ to: string; label?: string }> = ({
  to,
  label,
}) => (
  <a target="_blank" rel="noopener noreferrer nofollow" href={to}>
    <span className="fr-fi-download-line" aria-hidden="true">
      {label || 'Télécharger'}
    </span>
    <style jsx>{`
      a > span:before {
        font-size: inherit;
        margin-right: 5px;
      }
      a:after {
        content: none;
      }
    `}</style>
  </a>
);

export default DownloadLink;
