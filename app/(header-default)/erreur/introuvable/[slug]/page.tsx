import type { Metadata } from "next";
import { use } from "react";
import { INPI, INSEE } from "#components/administrations";
import { Link } from "#components/Link";
import MatomoEvent from "#components/matomo-event";
import {
  formatIntFr,
  formatSiret,
  isLuhnValid,
  isSiren,
  isSiret,
} from "#utils/helpers";
import type { AppRouterProps } from "#utils/server-side-helper/extract-params";

export const metadata: Metadata = {
  title: "Numéro d’identification introuvable",
  robots: "noindex, nofollow",
};

const SirenOrSiretNotFoundPage = (props: AppRouterProps) => {
  const params = use(props.params);

  const slug = params.slug;

  if (!isSiren(slug) && !isSiret(slug)) {
    return {
      redirect: {
        destination: "/not-found",
        permanent: false,
      },
    };
  }

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
              <Link href="/faq">non-diffusible</Link>.
            </li>
            <li>
              Ce numéro fait peut-être référence à une structure publique dont
              les informations sont protégées (Ministère de Défense,
              Gendarmerie, parlementaire etc.)
            </li>
            <li>
              Ce numéro fait peut-être référence à une entreprise crée récemment
              et{" "}
              <Link href="/faq">
                nos informations ne sont pas encore à jour
              </Link>
              .
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
};

export default SirenOrSiretNotFoundPage;
