import clsx from "clsx";
import { type ReactNode, useState } from "react";
import ButtonLink from "#/components-ui/button";
import { type IUniteLegale, isPersonneMorale } from "#/models/core/types";
import styles from "./styles.module.css";

const INSEE_PROCEDURE_PERSONNE_PHYSIQUE =
  "https://statut-diffusion-sirene.insee.fr/";
const INSEE_PROCEDURE_PERSONNE_MORALE =
  "https://www.insee.fr/fr/information/7456564";
const DEMARCHE_NUMERIQUE_PROCEDURE =
  "https://demarche.numerique.gouv.fr/commencer/demande-de-suppression-de-donnees-personnelles";

interface IOption {
  content: ReactNode;
  id: string;
  title: string;
}

const getOptions = (uniteLegale: IUniteLegale): IOption[] => {
  const estPersonneMorale = isPersonneMorale(uniteLegale);

  return [
    {
      id: "hide-personal-data-option-insee",
      title: estPersonneMorale
        ? "Domiciliation (adresse)"
        : "Dénomination et/ou domiciliation (adresse)",
      content: (
        <>
          <p>
            {estPersonneMorale
              ? "Pour que l’adresse de votre structure soit masquée de l’Annuaire des Entreprises"
              : "Pour que le nom de votre structure et son adresse soient masqués de l’Annuaire des Entreprises"}
            , vous devez demander la modification du statut de diffusion de
            votre structure auprès de l’INSEE.
          </p>
          <div className="layout-center">
            <ButtonLink
              ariaLabel="Accéder à la procédure INSEE, nouvelle fenêtre"
              target="_blank"
              to={
                estPersonneMorale
                  ? INSEE_PROCEDURE_PERSONNE_MORALE
                  : INSEE_PROCEDURE_PERSONNE_PHYSIQUE
              }
            >
              Accéder à la procédure INSEE
            </ButtonLink>
          </div>
        </>
      ),
    },
    {
      id: "hide-personal-data-option-dirigeant",
      title: "Nom, prénom, mois et année de naissance d’un dirigeant",
      content: (
        <>
          <p>
            Pour que les nom, prénom, mois et année de naissance du dirigeant de
            cette structure soient masqués de l’Annuaire des Entreprises,
            remplissez une demande qui sera étudiée par notre service juridique.
          </p>
          <div className="layout-center">
            <ButtonLink
              ariaLabel="Remplir une demande sur Démarche Numérique, nouvelle fenêtre"
              target="_blank"
              to={DEMARCHE_NUMERIQUE_PROCEDURE}
            >
              Remplir une demande
            </ButtonLink>
          </div>
        </>
      ),
    },
    {
      id: "hide-personal-data-option-autre",
      title: "Autre donnée",
      content: (
        <p>
          Toutes les autres données qui concernent votre structure sont des
          données ouvertes et ne peuvent pas être masquées.
        </p>
      ),
    },
  ];
};

export function HidePersonalDataOptions({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const options = getOptions(uniteLegale);

  return (
    <>
      <p className={styles.question}>Quelle donnée voulez-vous masquer ?</p>
      <div className="fr-accordions-group">
        {options.map(({ id, title, content }) => {
          const isExpanded = expandedId === id;
          return (
            <section
              className={clsx("fr-accordion", styles.accordion)}
              key={id}
            >
              <h3
                className={clsx("fr-accordion__title", styles.accordionTitle)}
              >
                <button
                  aria-controls={id}
                  aria-expanded={isExpanded}
                  className={clsx("fr-accordion__btn", styles.accordionButton)}
                  onClick={() => setExpandedId(isExpanded ? null : id)}
                  type="button"
                >
                  {title}
                </button>
              </h3>
              <div
                className={clsx(
                  "fr-collapse",
                  isExpanded && "fr-collapse--expanded"
                )}
                id={id}
              >
                {content}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
