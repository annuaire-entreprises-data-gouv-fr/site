import { createFileRoute } from "@tanstack/react-router";
import routes from "#/clients/routes";
import { INPI } from "#/components/administrations";
import { Link } from "#/components/Link";
import { InpiPDFDownloader } from "#/components/screens/justificatif-immatriculation-pdf.$slug/inpi-pdf-downloader";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import { Info } from "#/components-ui/alerts";
import ButtonLink from "#/components-ui/button";
import { Icon } from "#/components-ui/icon/wrapper";
import { EAdministration } from "#/models/administrations/EAdministration";
import { meta } from "#/seo";
import { formatIntFr } from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/justificatif-immatriculation-pdf/$slug"
)({
  head: ({ params }) => {
    const canonical = `https://annuaire-entreprises.data.gouv.fr/justificatif-immatriculation-pdf/${params.slug}`;
    return {
      meta: meta({
        title: "Télécharger le justificatif d’immatriculation",
        robots: {
          follow: false,
          index: false,
        },
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

const SHOULD_DIRECT_DOWNLOAD = true;

function RouteComponent() {
  const { slug } = Route.useParams();

  return (
    <>
      <br />
      <Link params={{ slug }} to="/entreprise/$slug">
        ← Retour à la fiche résumée
      </Link>
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
          {SHOULD_DIRECT_DOWNLOAD ? (
            <div className="fr-btns-group fr-btns-group--inline-md fr-btns-group--center fr-py-2v">
              <ButtonLink
                target="_blank"
                to={`${routes.rne.portail.pdf}?format=pdf&ids=[${slug}]`}
              >
                <Icon slug="download">
                  Télécharger le justificatif d’immatriculation
                </Icon>
              </ButtonLink>
            </div>
          ) : (
            <>
              <p>
                Le téléchargement de l’extrait d’immatriculation au Répertoire
                National des Entreprises (RNE) a commencé pour le SIREN{" "}
                <Link params={{ slug }} to="/entreprise/$slug">
                  {formatIntFr(slug)}
                </Link>
                .
              </p>
              <TwoColumnTable
                body={[
                  [
                    "Statut du téléchargement",
                    <InpiPDFDownloader siren={slug} />,
                  ],
                ]}
              />
            </>
          )}
        </Section>
      </div>
    </>
  );
}
