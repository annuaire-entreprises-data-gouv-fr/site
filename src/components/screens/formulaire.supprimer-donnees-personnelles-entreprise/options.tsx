import clsx from "clsx";
import { type ReactNode, useState } from "react";
import ButtonLink from "#/components-ui/button";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
  isPersonneMorale,
} from "#/models/core/types";
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
  const estEntrepreneurIndividuel = isEntrepreneurIndividuel(uniteLegale);
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
      title: "Votre nom, prénom, mois et année de naissance",
      content: (
        <>
          <p>
            En tant que dirigeant, vous pouvez demander que vos nom, prénoms,
            mois et année de naissance soient masqués sur l’Annuaire des
            Entreprises en faisant une demande d’opposition. Celle-ci sera
            examinée par notre service juridique.
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
          {estEntrepreneurIndividuel && (
            <>
              <p className="fr-mt-3w">
                <strong>À savoir :</strong> si la dénomination de votre
                entreprise correspond à votre nom (c’est souvent le cas des
                entreprises individuelles), celui-ci restera visible malgré
                votre opposition. Dans ce cas, il convient plutôt de passer
                votre entreprise en <strong>diffusion partielle</strong> auprès
                de l’INSEE. Vos informations seront alors masquées sur
                l’ensemble des sites, y compris sur l’Annuaire des Entreprises.
              </p>
              <div className="layout-center">
                <ButtonLink
                  ariaLabel="Accéder à la procédure Insee, nouvelle fenêtre"
                  target="_blank"
                  to={INSEE_PROCEDURE_PERSONNE_PHYSIQUE}
                >
                  Accéder à la procédure Insee
                </ButtonLink>
              </div>
            </>
          )}
        </>
      ),
    },
    {
      id: "hide-personal-data-option-autre",
      title: "Autre donnée",
      content: (
        <>
          <p>
            Toutes les autres données qui concernent votre structure sont des
            données ouvertes et ne peuvent pas être masquées.
          </p>
          <p>
            Si vous souhaitez exercer d’autres droits vous pouvez écrire à{" "}
            <a href="mailto:mesdonnees@modernisation.gouv.fr">
              mesdonnees@modernisation.gouv.fr
            </a>
            .
          </p>
        </>
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
