import ButtonLink from '#components-ui/button';

export const metadata = {
  title: 'Merci beaucoup pour votre retour',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/formulaire/merci',
  },
};

const MerciPage = () => {
  return (
    <div id="layout">
      <main>
        <div className="layout-center">
          <h1>Merci beaucoup pour votre retour 🙂 !</h1>
        </div>
        <br />
        <div className="layout-center">
          <ButtonLink to="/">Retourner au moteur de recherche</ButtonLink>
        </div>
      </main>
    </div>
  );
};

export default MerciPage;
