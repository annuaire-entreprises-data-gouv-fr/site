import { GetServerSideProps } from 'next';
import ButtonLink from '#components-ui/button';
import Meta from '#components/meta/meta-client';
import { NextPageWithLayout } from 'pages/_app';

const Forbidden: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Accès refusé" />
      <h1>Accès refusé 🚫</h1>
      <p>
        Notre algorithme de détection pense que vous êtes un robot. <br />
        Par conséquent, l’accès à cette page vous est refusé.
      </p>
      <p>
        Vous pouvez continuer a naviguer sur le site. Si vous n’êtes pas un
        robot et que le problème se reproduit, vous pouvez nous contacter via
        notre FAQ.
      </p>
      <ul className="fr-btns-group fr-btns-group--inline-md">
        <li>
          <ButtonLink to="/faq" alt>
            Accéder à la FAQ
          </ButtonLink>
        </li>
        <li>
          <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
        </li>
      </ul>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 403;
  return { props: {} };
};

export default Forbidden;
