import React from 'react';
import SearchBar from '../components/search-bar';
import StructuredDataSearchAction from '../components/structured-data/search';
import Page from '../layouts';

const Index: React.FC = () => (
  <Page title="L’Annuaire des Entreprises">
    <StructuredDataSearchAction />
    <div className="layout-center">
      <div className="centered-search">
        <h1>L’Annuaire des Entreprises</h1>
        <h2>
          Retrouvez toutes les informations publiques concernant les entreprises
          françaises
        </h2>
        <div className="layout-center search">
          <SearchBar autoFocus={true} useAdvancedSearch={true} />
        </div>
      </div>
    </div>
    <style jsx>{`
      h1,
      h2 {
        text-align: center;
      }

      .search {
        margin-top: 30px;
        flex-direction: column;
      }

      .centered-search {
        margin-bottom: 32vh;
        margin-top: 10vh;
      }
    `}</style>
  </Page>
);

export default Index;
