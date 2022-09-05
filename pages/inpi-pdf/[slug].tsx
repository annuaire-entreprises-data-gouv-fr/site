import { GetServerSideProps } from 'next';
import React from 'react';
import routes from '../../clients/routes';
import Info from '../../components-ui/alerts/info';
import { Loader } from '../../components-ui/loader';
import { Tag } from '../../components-ui/tag';
import { INPI } from '../../components/administrations';
import Page from '../../layouts';
import { formatIntFr } from '../../utils/helpers/formatting';

const DownloadPDFScript: React.FC<{ siren: string }> = ({ siren }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `
      <script type="text/javascript" defer>
        function saveAsPdf(blob) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.style = "display: none";
            a.href = url;
            a.download = "extrait_immatriculation_inpi_${siren}.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setSuccess();
        }

        var wrapper = document.getElementById('status-wrapper');

        function setError() {
          wrapper.className="display-error"
        }
        function setStarted() {
          wrapper.className="display-started"
        }
        function setSuccess() {
          wrapper.className="display-success"
        }
        function setPending() {
          if(wrapper.className.indexOf("display-started") > -1) {
            wrapper.className = "display-pending";
          }
        }

        function downloadInpiPDF(siren) {
          setStarted();
          window.setTimeout(setPending,10000);

          if (window.fetch) {
            fetch(
              'https://data.inpi.fr/export/companies?format=pdf&ids=[%22'+siren+'%22]'
            )
              .then((res) => {
                if (!res.ok) {
                  throw new Error('Download failed : Inpi is not answering');
                }
                return res.blob();
              })
              .then(saveAsPdf)
              .catch(function (error) {
                setError();
                throw error
              });
          } else {
            setError();
            throw new Error('Download failed : browser too old');
          }
        }

        (function init() {
          window.downloadInpiPDF = downloadInpiPDF;
          window.downloadInpiPDF('${siren}');
        })();

        Sentry.captureMessage('This is a test in PDF')
      </script>
  `,
    }}
  />
);

const Retry: React.FC<{ siren: string }> = ({ siren }) => (
  <>
    <div
      dangerouslySetInnerHTML={{
        __html: `
            <div class="button-link small">
                <button onclick="window.downloadInpiPDF('${siren}');">
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

const InpiPDF: React.FC<{ siren: string }> = ({ siren }) => {
  return (
    <Page
      small={true}
      noIndex={true}
      title="Réutiliser ou partager l’Annuaire des Entreprises"
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
        <div id="status-wrapper" className="display-started">
          <div className="status-started">
            <b>Statut du téléchargement :</b>
            <Tag>
              <Loader /> téléchargement en cours
            </Tag>
          </div>
          <div className="status-pending">
            <b>Statut du téléchargement :</b>
            <Tag>
              <Loader /> téléchargement en cours
            </Tag>
            <span className="warning">
              (ne fermez pas cette page, le téléchargement peut prendre plus
              d’une minute)
            </span>
          </div>
          <div className="status-success">
            <b>Statut du téléchargement :</b>
            <Tag className="open">succés</Tag>
          </div>
          <div className="status-error">
            <b>Statut du téléchargement :</b>
            <Tag className="closed">échec</Tag>
            <p>
              Le téléchargement a échoué car le téléservice de l’
              <INPI /> n’a pas réussi à générer le document. Vous pouvez soit
              relancer le téléchargement, soit réessayer à un autre moment :
            </p>
            <div className="layout-center">
              <Retry siren={siren} />
            </div>
          </div>
        </div>
        <br />
        <Info>
          L’Annuaire des Entreprises ne permet plus de télécharger le PDF
          complet, car le téléservice de l’
          <INPI /> est devenu trop instable.
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
      <DownloadPDFScript siren={siren} />
      <style global jsx>{`
        .warning {
          color: #b97800;
          font-weight: bold;
        }
        #status-wrapper.display-started > div:not(.status-started) {
          display: none !important;
        }
        #status-wrapper.display-started > div.status-started {
          display: block;
        }
        #status-wrapper.display-pending > div:not(.status-pending) {
          display: none !important;
        }
        #status-wrapper.display-pending > div.status-pending {
          display: block;
        }

        // status success
        #status-wrapper.display-success > div:not(.status-success) {
          display: none !important;
        }
        #status-wrapper.display-success > div.status-success {
          display: block;
        }

        // status error
        #status-wrapper.display-error > div:not(.status-error) {
          display: none !important;
        }
        #status-wrapper.display-error > div.status-error {
          display: block;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  return {
    props: { siren },
  };
};

export default InpiPDF;
