import React from 'react';
import { HomeH1 } from '#components-ui/logo/home-h1';
import SearchBar from '#components/search-bar';
import styles from './styles.module.scss';
import './globals.css';
import '../frontend/style/dsfr.min.css';

export default function Page() {
  return (
    <>
      <div className="layout-center">
        <form
          className={styles['centered-search']}
          id="search-bar-form"
          action={'/rechercher'}
          method="get"
        >
          <HomeH1 />
          <h2 className={styles.title}>
            Vérifiez les informations légales publiques des entreprises,
            associations et services publics en France
          </h2>
          <div className={styles['search-bar-wrapper']}>
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
    </>
  );
}
