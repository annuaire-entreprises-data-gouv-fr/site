import { createFileRoute, notFound } from "@tanstack/react-router";
import { INPI, INSEE } from "#/components/administrations";
import { Link } from "#/components/Link";
import MatomoEvent from "#/components/matomo-event";
import { meta } from "#/seo";
import {
  formatIntFr,
  formatSiret,
  isLuhnValid,
  isSiren,
  isSiret,
} from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/erreur/introuvable/$slug"
)({
  head: () => ({
    meta: meta({
      title: "Numéro d’identification introuvable",
      robots: {
        follow: false,
        index: false,
      },
    }),
  }),
  beforeLoad: async ({ params }) => {
    const slug = params.slug;

    if (!isSiren(slug) && !isSiret(slug)) {
      throw notFound();
    }
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  const slugIsSiren = isSiren(slug);
  const type = slugIsSiren ? "SIREN" : "SIRET";
  const formatted = slugIsSiren ? formatIntFr(slug) : formatSiret(slug);

  if (isLuhnValid(slug)) {
    return (
      <>
        <MatomoEvent action="sirenOrSiretNotFound" category="error" name="" />
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
              Vous avez peut-être commis une erreur en tapant votre numéro{" "}
              {type}.
            </li>
            <li>
              Ce numéro fait peut-être référence à une entreprise{" "}
              <Link to="/faq">non-diffusible</Link>.
            </li>
            <li>
              Ce numéro fait peut-être référence à une structure publique dont
              les informations sont protégées (Ministère de Défense,
              Gendarmerie, parlementaire etc.)
            </li>
            <li>
              Ce numéro fait peut-être référence à une entreprise crée récemment
              et{" "}
              <Link to="/faq">nos informations ne sont pas encore à jour</Link>.
            </li>
          </ul>
        </div>
      </>
    );
  }
  return (
    <>
      <MatomoEvent action="sirenOrSiretInvalid" category="error" name="" />
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
          De plus, ce numéro <strong>ne respecte pas</strong>{" "}
          <a
            href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
            rel="noreferrer noopener"
            target="_blank"
          >
            l’algorithme de vérification
          </a>{" "}
          des numéros {type}. En conséquence, nous vous invitons à la plus
          grande vigilance,{" "}
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
      </div>
    </>
  );
}
