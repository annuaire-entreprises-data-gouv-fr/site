import { TwoColumnTable } from "#/components/table/simple";
import type { IFondationsRestreintes } from "#/models/espace-agent/fondations-restreintes/types";
import { formatDateLong } from "#/utils/helpers";
import styles from "./styles.module.css";

type DirigeantFondation = IFondationsRestreintes["dirigeants"][number];

export const NoDirigeantsFondation = () => (
  <p>Aucun dirigeant n’a été retrouvé pour cette fondation.</p>
);

function DirigeantFondationCard({
  dirigeant,
}: {
  dirigeant: DirigeantFondation;
}) {
  const nomComplet = [dirigeant.prenom, dirigeant.nom?.toUpperCase()]
    .filter(Boolean)
    .join(" ");
  const adresse = dirigeant.adresseDomiciliation;
  const adresseComplete = [
    adresse?.adresseComplete ||
      [
        adresse?.complement,
        [adresse?.numeroVoie, adresse?.typeVoie, adresse?.libelleVoie]
          .filter(Boolean)
          .join(" "),
        adresse?.distribution,
        [adresse?.codePostal, adresse?.commune].filter(Boolean).join(" "),
      ]
        .filter(Boolean)
        .join(", "),
    adresse?.pays,
  ]
    .filter(Boolean)
    .join(", ");

  const informations = [
    ["Fonction", dirigeant.fonction],
    ["Qualité", dirigeant.qualite],
    [
      "Fondateur",
      dirigeant.fondateur == null ? null : dirigeant.fondateur ? "Oui" : "Non",
    ],
    [
      "Date d’entrée en fonction",
      dirigeant.dateEntreeFonction &&
        formatDateLong(dirigeant.dateEntreeFonction),
    ],
    [
      "Date de sortie de fonction",
      dirigeant.dateSortieFonction &&
        formatDateLong(dirigeant.dateSortieFonction),
    ],
    [
      "Date de naissance",
      dirigeant.dateNaissance && formatDateLong(dirigeant.dateNaissance),
    ],
    ["Nationalité", dirigeant.nationalite],
    ["Profession", dirigeant.profession],
    ["Pays de résidence", dirigeant.paysResidence],
    ["Adresse de domiciliation", adresseComplete],
  ].filter(([, value]) => value);
  const personneMorale = dirigeant.personneMorale;
  const representation = [
    ["Dénomination", personneMorale?.nom],
    ["Type d’organisme", personneMorale?.type],
    ["Identifiant", personneMorale?.identifiant],
    ["Pays", personneMorale?.pays],
  ].filter(([, value]) => value);

  return (
    <article className={styles.dirigeant}>
      <h3>{nomComplet || "Identité non renseignée"}</h3>
      {informations.length > 0 ? (
        <TwoColumnTable body={informations} />
      ) : (
        <p>Aucune information complémentaire renseignée.</p>
      )}
      {representation.length > 0 && (
        <>
          <h4>Personne morale représentée</h4>
          <TwoColumnTable body={representation} />
        </>
      )}
    </article>
  );
}

export function DirigeantsFondationContent({
  dirigeants,
}: Pick<IFondationsRestreintes, "dirigeants">) {
  if (dirigeants.length === 0) {
    return <NoDirigeantsFondation />;
  }

  return (
    <>
      <p>
        {dirigeants.length} dirigeant{dirigeants.length > 1 ? "s" : ""}{" "}
        enregistré{dirigeants.length > 1 ? "s" : ""} au Répertoire national des
        fondations (RNF).
      </p>
      {dirigeants.map((dirigeant, index) => (
        <DirigeantFondationCard
          dirigeant={dirigeant}
          key={`${dirigeant.nom}-${dirigeant.prenom}-${dirigeant.dateEntreeFonction}-${index}`}
        />
      ))}
    </>
  );
}
