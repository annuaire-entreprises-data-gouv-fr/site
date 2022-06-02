import React from 'react';
import { PrintNever } from '../print-visibility';

export const MigrationBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      id="migration-modal"
      role="dialog"
      aria-label="Décommission des API entreprise.data.gouv.fr"
    >
      <div className="fr-container">
        <div>
          Vous utilisez les API entreprise.data.gouv.fr ? Elles seront
          déclassées et arrêtées le 1er Septembre 2022.{' '}
          <a
            href="https://api.gouv.fr/guides/migration-entreprise-data"
            target="_blank"
            rel="noreferrer noopener"
          >
            Découvrez le guide de migration
          </a>
          .
        </div>
      </div>
    </div>
    <style>{`
        #migration-modal {
            padding-top: 15px;
            padding-bottom: 15px;
            font-size: 0.9rem;
            width: 100%;
            background-color: #e6f3ff;
            font-family: 'Marianne', sans-serif;
            border-bottom: 2px solid #000091;
          }
          #migration-modal .fr-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
    `}</style>
  </PrintNever>
);
