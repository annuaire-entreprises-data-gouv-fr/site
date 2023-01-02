import React from 'react';
import Logo from '#components-ui/logo';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import HomePageAdvancedSearch from '#components/advanced-search/home-page';
import SearchBar from '#components/search-bar';
import StructuredDataSearchAction from '#components/structured-data/search';
import Page from '../layouts';

const Index: React.FC = () => (
  <Page
    title="Bienvenue sur L’Annuaire des Entreprises"
    canonical="https://annuaire-entreprises.data.gouv.fr"
    description="L’administration permet aux particuliers et agents publics de vérifier les informations juridiques officielles d’une entreprise : SIREN, SIRET, TVA Intracommunautaire, code APE/NAF, capital social, justificatif d’immatriculation, dirigeants, convention collective…"
  >
    <StructuredDataSearchAction />
    <div className="layout-center">
      <form
        className="centered-search"
        id="search-bar-form"
        action={'/rechercher'}
        method="get"
      >
        <Logo
          title="Logo de l’Annuaire des Entreprises"
          slug="annuaire-entreprises"
          width={270}
          height={112}
        />
        <HiddenH1 title="Bienvenue sur L’Annuaire des Entreprises" />
        <h2>
          Vérifiez toutes les informations juridiques publiques d’une entreprise
          française
        </h2>
        <div className="search-bar-wrapper">
          <SearchBar
            placeholder="Nom, adresse, n° SIRET/SIREN..."
            defaultValue=""
            autoFocus={true}
          />
        </div>
        <br />
        <HomePageAdvancedSearch />
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
  </Page>
);

export default Index;
