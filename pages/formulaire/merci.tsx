import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { LayoutDefault } from '#components/layouts/layout-default';
import { postServerSideProps } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

const ThanksPage: NextPageWithLayout<{ usager: string }> = ({ usager }) => {
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
          var _paq = window._paq || [];
          _paq.push(['setCustomDimension', '1', "${usager}"]);`,
        }}
      />
    </div>
  );
};

ThanksPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDefault searchBar={false}>{page}</LayoutDefault>;
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const usager = new URLSearchParams(
      (context.req.url ?? '').replace(/^.*\?/, '')
    ).get('usager');
    return {
      props: {
        usager,
      },
    };
  }
);

export default ThanksPage;
