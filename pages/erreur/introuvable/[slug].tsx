import { INPI, INSEE } from '#components/administrations';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta/meta-client';
import { formatIntFr, formatSiret, isLuhnValid } from '#utils/helpers';
import { GetServerSideProps } from 'next';
import { NextPageWithLayout } from 'pages/_app';

type SirenOrSiretNotFoundPageProps = {
  slug?: string;
};

const SirenOrSiretNotFoundPage: NextPageWithLayout<
  SirenOrSiretNotFoundPageProps
> = ({ slug = '' }) => {
  const isSiren = slug.length === 9;
  const type = isSiren ? 'SIREN' : 'SIRET';
  const formatted = isSiren ? formatIntFr(slug) : formatSiret(slug);

  if (isLuhnValid(slug)) {
    return (
      <>
        <Meta title="Numéro d’identification introuvable" noIndex={true} />
        <MatomoEvent category="error" action="sirenOrSiretNotFound" name="" />
        <h1>
          Le numéro {type} “{formatted}” est introuvable
        </h1>
        <div>
          <p>
            Nous n’avons pas retrouvé ce numéro {type} dans les registres
            officiels (<INPI />, <INSEE />
            ).
          </p>
          <p>Il existe plusieurs explications possibles :</p>
          <ul>
            <li>
              Vous avez peut-être commis une erreur en tapant votre numéro{' '}
              {type}.
            </li>
            <li>
              Ce numéro fait peut-être référence à une entreprise{' '}
              <a href="/faq">non-diffusible</a>.
            </li>
            <li>
              Ce numéro fait peut-être référence à une structure publique dont
              les informations sont protégées (Ministère de Défense,
              Gendarmerie, parlementaire etc.)
            </li>
            <li>
              Ce numéro fait peut-être référence à une entreprise crée récemment
              et <a href="/faq">nos informations ne sont pas encore à jour</a>.
            </li>
          </ul>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Meta title="Numéro d’identification invalide" noIndex={true} />
        <MatomoEvent category="error" action="sirenOrSiretInvalid" name="" />
        <h1>
          Le numéro {type} “{formatted}” est invalide
        </h1>
        <div>
          <p>
            Nous n’avons pas retrouvé ce numéro {type} dans les registres
            officiels (<INPI />, <INSEE />
            ).
          </p>
          <p>
            De plus, ce numéro <strong>ne respecte pas</strong>{' '}
            <a
              href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
              target="_blank"
              rel="noreferrer noopener"
            >
              l’algorithme de vérification
            </a>{' '}
            des numéros {type}. En conséquence, nous vous invitons à la plus
            grande vigilance,{' '}
            <strong>car il peut s’agir d’un numéro frauduleux</strong>&nbsp;:
          </p>
          <ul>
            <li>
              Vérifiez que vous n’avez pas commis de faute de frappe en
              recopiant le numéro.
            </li>
            <li>
              Vérifiez ce numéro auprès de l’organisme ou l’entreprise qui vous
              l’a transmis.
            </li>
          </ul>
        </div>
      </>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 404;
  const slug = (context?.params?.slug || '') as string;

  return { props: { slug } };
};

export default SirenOrSiretNotFoundPage;
