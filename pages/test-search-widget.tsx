import React from 'react';
import Page from '../layouts';
import { IMatomoStat } from '../clients/matomo';

interface IProps {
  stats: IMatomoStat[];
}

const TestSearchWidgetPage: React.FC<IProps> = () => (
  <Page
    small={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
    noIndex={true}
  >
    <h2 id="search">Test d’auto complétion de n° Siren</h2>
    <input
      type="text"
      className="fr-input"
      id="search-widget"
      style={{ width: '400px' }}
      placeholder="Recherchez une entreprise par son nom ou son adresse"
    />
    <div
      dangerouslySetInnerHTML={{
        __html: `
            <script src="/search-widget/index.js" defer></script>
          `,
      }}
    />
  </Page>
);

export default TestSearchWidgetPage;
