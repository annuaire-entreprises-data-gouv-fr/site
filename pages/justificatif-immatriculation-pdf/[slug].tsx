import { GetServerSideProps } from 'next';
import routes from '#clients/routes';
import Info from '#components-ui/alerts/info';
import { Loader } from '#components-ui/loader';
import { Tag } from '#components-ui/tag';
import { INPI } from '#components/administrations';
import FrontStateMachine from '#components/front-state-machine';
import Meta from '#components/meta';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { formatIntFr } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import { postServerSideProps } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

const InpiPDF: NextPageWithLayout<{ siren: string }> = ({ siren }) => {
  const downloadLink = `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`;
  return (
    <>
      <Meta
        title="Télécharger le justificatif d’immatriculation"
        canonical={`https://annuaire-entreprises.data.gouv.fr/justificatif-immatriculation-pdf/${siren}`}
        noIndex={true}
      />
      <br />
      <a href={`/justificatif/${siren}`}>
        ← Retour à la page justificatif d’immatriculation
      </a>
      <div className="content-container">
        <h1>Téléchargement du justificatif d’immatriculation</h1>

        <Section
          title="Justificatif d’immatriculation au RNE"
          sources={[EAdministration.INPI]}
        >
          <Info full>
            Le téléservice de l’
            <INPI /> peut malheureusement être victime de son succès et avoir{' '}
            <b>du mal à répondre à toutes les demandes</b> de document.
            <br />
            Un téléchargement normal prend <b>entre 10 et 20 secondes</b>.{' '}
            <br />
            Mais quand le service est surchargé, le téléchargement peut
            atteindre plusieurs minutes <b>voire même échouer</b>.
          </Info>
          <p>
            Le téléchargement de l’extrait d’immatriculation au Répertoire
            National des Entreprises (RNE) a commencé pour le siren{' '}
            <a href={`/entreprise/${siren}`}>{formatIntFr(siren)}</a>.
          </p>
          <TwoColumnTable
            body={[
              [
                'Statut du téléchargement',
                <FrontStateMachine
                  id="immatriculation-pdf-status-wrapper"
                  states={[
                    <i>
                      le téléchargement va commencer... (si il ne démarre pas,{' '}
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={downloadLink}
                      >
                        cliquez ici
                      </a>
                      )
                    </i>,
                    <>
                      <Tag>
                        <Loader /> téléchargement en cours
                      </Tag>
                      <span style={{ color: '#777', fontWeight: 'bold' }}>
                        (temps estimé entre 10 secondes et 1 minute)
                      </span>
                    </>,
                    <>
                      <Tag color="success">succès</Tag>
                    </>,
                    <>
                      <Tag color="error">échec</Tag>
                      <p>
                        Le téléchargement direct a échoué et nous avons relancé
                        un téléchargement dans un nouvel onglet.
                      </p>
                      Si besoin,{' '}
                      <a
                        id="download-pdf-link"
                        target="_blank"
                        rel="noreferrer noopener"
                        href={downloadLink}
                      >
                        cliquez ici pour re-lancer un téléchargement dans un
                        nouvel onglet.
                      </a>
                    </>,
                    <>
                      <Tag color="error">introuvable</Tag>
                      <p>
                        Le document que vous recherchez n’a pas été retrouvé par
                        le téléservice de l’
                        <INPI />. Si la structure est bien une entreprise,{' '}
                        <b>cela ne devrait pas arriver</b>. Vous pouvez :
                      </p>
                      <ol>
                        <li>
                          Soit essayer de télécharger le document{' '}
                          <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href={downloadLink}
                          >
                            directement sur le site de l’INPI
                          </a>
                          .
                        </li>
                        <li>
                          Soit{' '}
                          <a href="https://www.inpi.fr/contactez-nous">
                            écrire à l’INPI pour leur demander le document.
                          </a>
                        </li>
                        <p>
                          L’
                          <INPI /> est à la fois l’opérateur du Registre
                          National des Entreprises (RNE) et du téléservice qui
                          produit les justificatifs, c’est{' '}
                          <b>
                            la seule administration en mesure de résoudre le
                            problème
                          </b>
                          .
                        </p>
                      </ol>
                    </>,
                  ]}
                />,
              ],
            ]}
          />
        </Section>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    return {
      props: { siren: slug },
    };
  }
);

export default InpiPDF;
