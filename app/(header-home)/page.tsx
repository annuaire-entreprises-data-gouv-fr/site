import { Metadata } from 'next';
import { LogoAnnuaire } from '#components-ui/logo-annuaire/logo-annuaire';
import Favourites from '#components/favourites';
import SearchBar from '#components/search-bar';
import StructuredDataSearchAction from '#components/structured-data/search';

export const metadata: Metadata = {
  title:
    'L’Annuaire des Entreprises françaises : les informations légales officielles de l’administration',
  description:
    'L’administration permet aux particuliers, entrepreneurs et agents publics de vérifier les informations informations légales des entreprises, associations et services publics en France.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr',
  },
};

const Index = () => (
  <>
    <StructuredDataSearchAction />
    <div className="layout-center">
      <form
        style={{
          marginBottom: '16vh',
          marginTop: '11vh',
          maxWidth: '900px',
        }}
        id="search-bar-form"
        action={'/rechercher'}
        method="get"
      >
        <LogoAnnuaire />
        <h2 style={{ textAlign: 'center', marginTop: '30px' }}>
          Vérifiez les informations légales publiques des entreprises,
          associations et services publics en France
        </h2>
        <div
          style={{
            margin: 'auto',
            marginTop: '30px',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '450px',
          }}
        >
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
    <div style={{ height: '25vh', maxHeight: '150px' }}>
      <Favourites />
    </div>
  </>
);

export default Index;
