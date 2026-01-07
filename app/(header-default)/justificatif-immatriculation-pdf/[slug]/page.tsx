import type { Metadata } from "next";
import { use } from "react";
import { INPI } from "#components/administrations";
import { Link } from "#components/Link";
import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import { Info } from "#components-ui/alerts";
import { EAdministration } from "#models/administrations/EAdministration";
import { formatIntFr } from "#utils/helpers";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import { InpiPDFDownloader } from "./_components/inpi-pdf-downloader";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug } = await extractParamsAppRouter(props);

  return {
    title: "Télécharger le justificatif d’immatriculation",
    robots: "noindex, nofollow",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/justificatif-immatriculation-pdf/${slug}`,
    },
  };
};

export default function InpiPDF({ params }: AppRouterProps) {
  const { slug } = use(params);

  return (
    <>
      <br />
      <Link href={`/entreprise/${slug}`}>← Retour à la fiche résumée</Link>
      <div className="content-container">
        <h1>Téléchargement du justificatif d’immatriculation</h1>

        <Section
          sources={[EAdministration.INPI]}
          title="Justificatif d’immatriculation au RNE"
        >
          <Info full>
            Le téléservice de l’
            <INPI /> peut malheureusement être victime de son succès et avoir{" "}
            <strong>du mal à répondre à toutes les demandes</strong> de
            document.
            <br />
            Un téléchargement normal prend{" "}
            <strong>entre 10 et 20 secondes</strong>. <br />
            Mais quand le service est surchargé, le téléchargement peut
            atteindre plusieurs minutes <strong>voire échouer</strong>.
          </Info>
          <p>
            Le téléchargement de l’extrait d’immatriculation au Répertoire
            National des Entreprises (RNE) a commencé pour le SIREN{" "}
            <Link href={`/entreprise/${slug}`}>{formatIntFr(slug)}</Link>.
          </p>
          <TwoColumnTable
            body={[
              ["Statut du téléchargement", <InpiPDFDownloader siren={slug} />],
            ]}
          />
        </Section>
      </div>
    </>
  );
}
