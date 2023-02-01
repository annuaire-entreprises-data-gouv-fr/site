import React from 'react';
import { HomeH1 } from '#components-ui/logo/home-h1';
import SearchBar from '#components/search-bar';
import StructuredDataSearchAction from '#components/structured-data/search';

export default function Page() {
  return (
    <>
      <StructuredDataSearchAction />
      <div className="layout-center">
        <form
          className="centered-search"
          id="search-bar-form"
          action={'/rechercher'}
          method="get"
        >
          <HomeH1 />
          <h2>
            Vérifiez les informations légales publiques des entreprises,
            associations et services publics en France
          </h2>
          <div className="search-bar-wrapper">
            <SearchBar
              placeholder="Nom, adresse, n° SIRET/SIREN..."
              defaultValue=""
              autoFocus={true}
            />
          </div>
          <br />
          <div className="layout-center">
            <a href="/rechercher">→ Effectuer une recherche avancée</a>
          </div>
        </form>
      </div>
      <style jsx>{`
        h2 {
          text-align: center;
          margin-top: 30px;
        }

        .centered-search {
          margin-bottom: 32vh;
          margin-top: 10vh;
          max-width: 900px;
        }

        .search-bar-wrapper {
          margin: auto;
          margin-top: 30px;
          flex-direction: column;
          width: 100%;
          max-width: 450px;
        }
      `}</style>
    </>
  );
}
