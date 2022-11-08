import { GetServerSideProps } from 'next';
import React from 'react';
import routes from '../../clients/routes';
import Info from '../../components-ui/alerts/info';
import { Loader } from '../../components-ui/loader';
import { Tag } from '../../components-ui/tag';
import { INPI } from '../../components/administrations';
import FrontStateMachine from '../../components/front-state-machine';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';
import { formatIntFr } from '../../utils/helpers/formatting';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';

const Retry: React.FC<{}> = () => (
  <>
    <div
      dangerouslySetInnerHTML={{
        __html: `
            <div class="button-link small">
                <button onclick="window.downloadInpiPDF();">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>&nbsp;Relancer le téléchargement</span>
                </button>
            </div>
        `,
      }}
    />
  </>
);

interface IProps extends IPropsWithMetadata {
  siren: string;
}

const InpiPDF: React.FC<IProps> = ({ siren, metadata }) => {
  return (
    <Page
      small={true}
      noIndex={true}
      title="Télécharger le justificatif d’immatriculation"
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <br />
      <a href={`/justificatif/${siren}`}>
        ← Retour à la page justificatif d’immatriculation
      </a>
      <div className="content-container">
        <h1>Téléchargement du justificatif d’immatriculation</h1>
        <p>
          Le téléchargement du justificatif d’immatriculation ou “extrait{' '}
          <INPI />” a commencé pour le siren {formatIntFr(siren)}.
        </p>
        <FrontStateMachine
          id="immatriculation-pdf-status-wrapper"
          states={[
            <>
              <b>Statut du téléchargement :</b>{' '}
              <i>
                le téléchargement va commencer... (si il ne démarre pas,{' '}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`${routes.rncs.portail.pdf}?format=pdf&ids=[%22${siren}%22]`}
                >
                  cliquez ici
                </a>
                )
              </i>
            </>,
            <>
              <b>Statut du téléchargement :</b>
              <Tag>
                <Loader /> téléchargement en cours
              </Tag>
              <span style={{ color: '#777', fontWeight: 'bold' }}>
                (temps estimé entre 10 secondes et 1 minute)
              </span>
            </>,
            <>
              <b>Statut du téléchargement :</b>
              <Tag className="open">succés</Tag>
            </>,
            <>
              <b>Statut du téléchargement :</b>
              <Tag className="closed">échec</Tag>
              <p>
                Le téléchargement a échoué car le téléservice de l’
                <INPI /> n’a pas réussi à générer le document. Vous pouvez soit
                relancer le téléchargement, soit réessayer à un autre moment :
              </p>
              <div className="layout-center">
                <Retry />
              </div>
            </>,
          ]}
        />
        <br />
        <Info>
          L’Annuaire des Entreprises ne permet plus de télécharger le PDF
          complet.
          <br />
          <br />
          Le PDF qui est en cours de téléchargement est donc la version
          publique,{' '}
          <b>privée des informations personnelles et des observations</b>.
        </Info>
        <br />
        Si les informations du PDF public ne vous suffisent pas, vous pouvez
        toujours accéder au PDF complet&nbsp;:
        <ol>
          <li>
            Créez-vous un compte sur{' '}
            <a href={routes.rncs.portail.account}>data.inpi.fr</a>
          </li>
          <li>
            <b>Authentifiez-vous</b>
          </li>
          <li>
            Rendez-vous{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={routes.rncs.portail.entreprise + siren}
            >
              sur la fiche INPI
            </a>{' '}
            de cette entreprise
          </li>
          <li>
            Lancez-le téléchargement en cliquant sur l’icone télécharger{' '}
            <b>en haut à droite</b> de la fiche
          </li>
        </ol>
      </div>
    </Page>
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
