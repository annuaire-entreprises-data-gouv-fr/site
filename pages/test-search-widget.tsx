import React from 'react';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const TestSearchWidgetPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Rechercher une entreprise"
      canonical="https://annuaire-entreprises.data.gouv.fr"
      noIndex
    />
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
  </>
);

export default TestSearchWidgetPage;
