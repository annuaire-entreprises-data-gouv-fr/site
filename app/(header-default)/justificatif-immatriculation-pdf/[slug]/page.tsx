import { Metadata } from 'next';
import { Info } from '#components-ui/alerts';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { formatIntFr } from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import { InpiPDFDownloader } from './_components/inpi-pdf-downloader';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug } = extractParamsAppRouter(props);

  return {
    title: 'Télécharger le justificatif d’immatriculation',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/justificatif-immatriculation-pdf/${slug}`,
    },
  };
};

const InpiPDF = (props: AppRouterProps) => {
  const { slug } = extractParamsAppRouter(props);

  return (
    <>
      <br />
      <a href={`/entreprise/${slug}`}>← Retour à la fiche résumée</a>
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
            National des Entreprises (RNE) a commencé pour le SIREN{' '}
            <a href={`/entreprise/${slug}`}>{formatIntFr(slug)}</a>.
          </p>
          <TwoColumnTable
            body={[
              ['Statut du téléchargement', <InpiPDFDownloader siren={slug} />],
            ]}
          />
        </Section>
      </div>
    </>
  );
};

export default InpiPDF;
