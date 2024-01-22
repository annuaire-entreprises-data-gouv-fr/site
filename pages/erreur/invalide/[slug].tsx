import { GetServerSideProps } from 'next';
import ButtonLink from '#components-ui/button';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta';
import constants from '#models/constants';
import { NextPageWithLayout } from 'pages/_app';

type SirenOrSiretInvalidPageProps = {
  slug?: string;
};

const SirenOrSiretInvalidPage: NextPageWithLayout<
  SirenOrSiretInvalidPageProps
> = ({ slug = '' }) => {
  return (
    <>
      <Meta title="Numéro invalide" noIndex={true} />
      <MatomoEvent category="error" action="sirenOrSiretInvalid" name="" />
      <h1>⚠️ Attention : le numéro d’identification “{slug}” est invalide</h1>
      <div>
        <p>
          Si vous voyez cette page, c’est que le numéro que vous recherchez
          ressemble à un numéro SIREN/SIRET par sa forme (9 chiffres pour le
          siren ou 14 chiffres pour le SIRET) mais qu’il ne respecte pas{' '}
          <a
            href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
            target="_blank"
            rel="noreferrer noopener"
          >
            l’algorithme de vérification.
          </a>
        </p>
        <p>
          Nous vous invitons à la plus grande vigilance,{' '}
          <strong>car il peut s’agir d’un numéro frauduleux</strong>&nbsp;:
        </p>
        <ul>
          <li>
            Vérifiez que vous n’avez pas commis de faute de frappe en recopiant
            le numéro.
          </li>
          <li>
            Vérifiez ce numéro auprès de l’organisme ou l’entreprise qui vous
            l’a transmis.
          </li>
        </ul>
        <p>
          Si vous avez effectué ces deux vérifications et que cette page
          s’affiche toujours, n’hésitez pas à nous contacter via{' '}
          <a href={constants.links.mailto}>{constants.links.mail}</a>.
        </p>
      </div>
      <div className="layout-center">
        <ButtonLink to="/">Retourner à l’écran d’accueil</ButtonLink>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 400;
  const slug = (context?.params?.slug || '') as string;

  return {
    props: {
      slug,
    },
  };
};

export default SirenOrSiretInvalidPage;
