import { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { LayoutDefault } from '#components/layouts/layout-default';
import { NextPageWithLayout } from 'pages/_app';

const ThanksPage: NextPageWithLayout = () => {
  return (
    <div id="layout">
      <main>
        <div className="layout-center">
          <h1>Merci beaucoup pour vos suggestions 🙂 !</h1>
        </div>
        <br />
        <div className="fr-container" style={{ textAlign: 'center' }}>
          Notre équipe prend en charge votre demande et nous vous répondrons dès
          que possible.
        </div>
        <br />
        <br />
        <div className="layout-center">
          <ButtonLink to="/">Retourner au moteur de recherche</ButtonLink>
        </div>
      </main>
    </div>
  );
};

ThanksPage.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return (
    <LayoutDefault isBrowserOutdated={isBrowserOutdated} searchBar={false}>
      {page}
    </LayoutDefault>
  );
};

export default ThanksPage;
