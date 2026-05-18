import type React from "react";
import { Link } from "#/components/Link";
import FAQLink from "#/components-ui/faq-link";
import { estNonDiffusibleStrict } from "#/models/core/diffusion";
import { estActif, IETATADMINSTRATIF } from "#/models/core/etat-administratif";
import type { IEtablissement, IUniteLegale } from "#/models/core/types";
import {
  formatAge,
  formatDateLong,
  formatSiret,
  uniteLegaleLabel,
  uniteLegaleLabelWithPronounContracted,
} from "#/utils/helpers";

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

const statusLabel = (etatAdministratif: IETATADMINSTRATIF) => {
  if (etatAdministratif === IETATADMINSTRATIF.ACTIF) {
    return " en activité";
  }
  if (
    etatAdministratif === IETATADMINSTRATIF.CESSEE ||
    etatAdministratif === IETATADMINSTRATIF.FERME
  ) {
    return " fermé";
  }
  return " dans un état administratif inconnu";
};

export const EtablissementDescription: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
}) => {
  const ageCreation = etablissement.dateCreation
    ? formatAge(etablissement.dateCreation)
    : null;

  const ageFermeture =
    etablissement.dateDebutActivite && !estActif(etablissement)
      ? formatAge(etablissement.dateDebutActivite)
      : null;

  return (
    <>
      {!estNonDiffusibleStrict(uniteLegale) && (
        <>
          <span>
            Cet{" "}
            <FAQLink tooltipLabel="établissement">
              Une {uniteLegaleLabel(uniteLegale)} est constituée d’autant
              d’établissements qu’il y a de lieux différents où elle exerce - ou
              a exercé - son activité.
              <br />
              <br />
              Il faut bien distinguer la{" "}
              <Link
                params={{ slug: uniteLegale.chemin }}
                to="/entreprise/$slug"
              >
                fiche résumé{" "}
                {uniteLegaleLabelWithPronounContracted(uniteLegale)}
              </Link>{" "}
              et les{" "}
              <Link
                hash="etablissements"
                params={{ slug: uniteLegale.chemin }}
                to="/entreprise/$slug"
              >
                fiches de ses établissements
              </Link>
              .
            </FAQLink>
            , immatriculé sous le siret {formatSiret(etablissement.siret)}, est
            <strong>{statusLabel(etablissement.etatAdministratif)}. </strong>
            {etablissement.dateCreation && (
              <>
                {" "}
                Il a été créé le{" "}
                <strong>{formatDateLong(etablissement.dateCreation)}</strong>
                {ageCreation && <>, il y a {ageCreation}</>}.{" "}
              </>
            )}
            {etablissement.dateDebutActivite && !estActif(etablissement) && (
              <>
                Il a été fermée le{" "}
                <strong>
                  {formatDateLong(etablissement.dateDebutActivite)}
                </strong>
                {ageFermeture && <>, il y a {ageFermeture}</>}.{" "}
              </>
            )}
            C’est
            {etablissement.estSiege ? (
              <strong> le siège social</strong>
            ) : etablissement.ancienSiege ? (
              <> un ancien siège social</>
            ) : (
              <> un établissement secondaire</>
            )}{" "}
            {uniteLegaleLabelWithPronounContracted(uniteLegale)}{" "}
            <Link params={{ slug: uniteLegale.chemin }} to="/entreprise/$slug">
              {uniteLegale.nomComplet}
            </Link>
            {uniteLegale.etablissements.all.length > 1 ? (
              <>
                , qui possède{" "}
                <Link
                  hash="etablissements"
                  params={{ slug: uniteLegale.chemin }}
                  to="/entreprise/$slug"
                >
                  {uniteLegale.etablissements.nombreEtablissements - 1} autre(s)
                  établissement(s)
                </Link>
              </>
            ) : (
              <>
                {" et "}
                <Link
                  hash="etablissements"
                  params={{ slug: uniteLegale.chemin }}
                  to="/entreprise/$slug"
                >
                  son unique établissement
                </Link>
              </>
            )}
            .
          </span>
          <p>
            {etablissement.libelleActivitePrincipale && (
              <>
                Son domaine d’activité est :{" "}
                {(etablissement.libelleActivitePrincipale || "").toLowerCase()}.
              </>
            )}
            {etablissement.adresse && (
              <> Il est domicilié au {etablissement.adresse}</>
            )}
            .
          </p>
        </>
      )}
    </>
  );
};
