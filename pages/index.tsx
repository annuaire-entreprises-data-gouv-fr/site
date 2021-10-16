import React from 'react';

import SearchBar from '../components/search-bar';
import Page from '../layouts';

const About: React.FC = () => {
  return (
    <Page title="L’Annuaire des Entreprises">
      <div className="layout-center">
        <div className="centered-search">
          <h1>L’Annuaire des Entreprises</h1>
          <h2>
            Retrouvez toutes les informations publiques concernant les
            entreprises françaises
          </h2>
          <div className="layout-center search">
            <SearchBar autoFocus={true} />
          </div>
        </div>
      </div>
      heeey
      <div x-data="{ open: false }">
        <div x-data="{ label: 'Content:' }">
          <span x-text="label"></span>
          <span x-show="open"></span>
        </div>
      </div>
      <style jsx>{`
        h1,
        h2 {
          text-align: center;
        }

        .search {
          margin-top: 30px;
        }

        .centered-search {
          margin-bottom: 32vh;
          margin-top: 10vh;
        }
      `}</style>
    </Page>
  );
};

export default About;
