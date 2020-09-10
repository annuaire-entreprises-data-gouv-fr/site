import React from 'react';

import SearchBar from '../components/searchBar';
import Page from '../layouts';

const About: React.FC = () => {
  return (
    <Page>
      <div className="layout-center">
        <div className="centered-search">
          <h1>Répertoire des Sociétés</h1>
          <h2>
            Retrouvez toutes les informations publiques concernant les
            entreprises et associations de France
          </h2>
          <div className="layout-center">
            <SearchBar />
          </div>
        </div>
      </div>

      <style jsx>{`
        h1,
        h2 {
          text-align: center;
        }
        h1 {
          font-size: 3rem;
        }

        .layout-center {
          height: 100%;
        }

        .centered-search {
          padding-bottom: 10vh;
          padding-top: 10vh;
          flex-grow: 1;
        }
      `}</style>
    </Page>
  );
};

export default About;
