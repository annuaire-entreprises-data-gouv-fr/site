import { GetServerSideProps } from 'next';
import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import { Loader } from '#components-ui/loader';
import { Tag } from '#components-ui/tag';
import { INPI } from '#components/administrations';
import Meta from '#components/meta/meta-client';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { isAPILoading } from '#models/api-loading';
import { isAPI404, isAPINotResponding } from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import { formatIntFr } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import extractParamsPageRouter from '#utils/server-side-helper/page/extract-params';
import { postServerSideProps } from '#utils/server-side-helper/page/post-server-side-props';
import usePDFDownloader from 'hooks/fetch/download-pdf';
import { NextPageWithLayout } from 'pages/_app';

function saveAsPdf(blob: Blob, siren: string) {
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  //@ts-ignore
  a.style = 'display: none';
  a.href = url;
  a.download = 'extrait_immatriculation_inpi_' + siren + '.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function PDFFailed({ downloadLink }: { downloadLink: string }) {
  return (
    <>
      <Tag color="error">échec</Tag>
      <p>
        Le téléchargement direct a échoué et nous avons relancé un
        téléchargement dans un nouvel onglet.
      </p>
      Si besoin,{' '}
      <a
        id="download-pdf-link"
        target="_blank"
        rel="noreferrer noopener"
        href={downloadLink}
        //@ts-ignore
        onClick={window.open(downloadLink, '_blank', 'noopener,noreferrer')}
      >
        cliquez ici pour re-lancer un téléchargement dans un nouvel onglet.
      </a>
    </>
  );
}

function InpiPDFDownloader({ siren }: { siren: string }) {
  const downloadLink = `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`;

  const pdf = usePDFDownloader(downloadLink);

  if (isAPILoading(pdf)) {
    return (
      <>
        <Tag>
          <Loader /> téléchargement en cours
        </Tag>
        <span style={{ color: '#777', fontWeight: 'bold' }}>
          (temps estimé entre 10 secondes et 1 minute)
        </span>
      </>
    );
  }

  if (isAPI404(pdf)) {
    return (
      <>
        <Tag color="error">introuvable</Tag>
        <p>
          Le document que vous recherchez n’a pas été retrouvé par le
          téléservice de l’
          <INPI />. Si la structure est bien une entreprise,{' '}
          <strong>cela ne devrait pas arriver</strong>. Vous pouvez :
        </p>
        <ol>
          <li>
            Soit essayer de télécharger le document{' '}
            <a target="_blank" rel="noreferrer noopener" href={downloadLink}>
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
            <INPI /> est à la fois l’opérateur du Registre National des
            Entreprises (RNE) et du téléservice qui produit les justificatifs,
            c’est{' '}
            <strong>
              la seule administration en mesure de résoudre le problème
            </strong>
            .
          </p>
        </ol>
      </>
    );
  }

  if (isAPINotResponding(pdf)) {
    return <PDFFailed downloadLink={downloadLink} />;
  }
  try {
    saveAsPdf(pdf, siren);
  } catch (e) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'PDFDownloadException',
        message: 'Failed to save blob as PDF',
        administration: EAdministration.INPI,
        cause: e,
      })
    );

    return <PDFFailed downloadLink={downloadLink} />;
  }

  return (
    <>
      <Tag color="success">succès</Tag>
    </>
  );
}

const InpiPDF: NextPageWithLayout<{ siren: string }> = ({ siren }) => {
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
            <strong>du mal à répondre à toutes les demandes</strong> de
            document.
            <br />
            Un téléchargement normal prend{' '}
            <strong>entre 10 et 20 secondes</strong>. <br />
            Mais quand le service est surchargé, le téléchargement peut
            atteindre plusieurs minutes <strong>voire même échouer</strong>.
          </Info>
          <p>
            Le téléchargement de l’extrait d’immatriculation au Répertoire
            National des Entreprises (RNE) a commencé pour le siren{' '}
            <a href={`/entreprise/${siren}`}>{formatIntFr(siren)}</a>.
          </p>
          <TwoColumnTable
            body={[
              ['Statut du téléchargement', <InpiPDFDownloader siren={siren} />],
            ]}
          />
        </Section>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsPageRouter(context);
    return {
      props: { siren: slug },
    };
  }
);

export default InpiPDF;
