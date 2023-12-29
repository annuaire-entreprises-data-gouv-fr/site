import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { HomeH1 } from '#components-ui/logo/home-h1';
import { LayoutDefault } from '#components/layouts/layout-default';
import Meta from '#components/meta';
import SearchBar from '#components/search-bar';
import StructuredDataSearchAction from '#components/structured-data/search';
import { postServerSideProps } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from './_app';

const Index: NextPageWithLayout = () => (
  <>
    <Meta
      title="L’Annuaire des Entreprises françaises : les informations légales officielles de l’administration"
      description="L’administration permet aux particuliers, entrepreneurs et agents publics de vérifier les informations informations légales des entreprises, associations et services publics en France."
      canonical="https://annuaire-entreprises.data.gouv.fr"
    />
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

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  // server side props for session initialization

  async () => {
    return {
      props: {},
    };
  }
);

Index.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <LayoutDefault searchBar={false}>{page}</LayoutDefault>
    </>
  );
};

export default Index;
