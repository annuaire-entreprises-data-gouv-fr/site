import { useState } from "react";

export const FilterStructure = ({
  type = "",
  label = "",
}: {
  type?: string;
  label?: string;
}) => {
  const [selected, setSelected] = useState(label ? label.split(",") : []);
  return (
    <>
      <fieldset>
        <legend>Type de structure :</legend>
        {[
          ["", "Tous"],
          ["ct", "Collectivité territoriale"],
          ["asso", "Association"],
          ["sp", "Service public"],
          ["ei", "Entreprise individuelle"],
        ].map(([value, text]) => (
          <label className="fr-label fr-mb-1w" key={value}>
            <input
              defaultChecked={type === value}
              name="type"
              type="radio"
              value={value}
            />{" "}
            {text}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Qualités, labels et certificats :</legend>
        <input name="label" type="hidden" value={selected.join(",")} />
        <button
          className="fr-btn fr-btn--tertiary fr-mb-2w"
          onClick={() => setSelected([])}
          type="button"
        >
          Effacer les labels sélectionnés
        </button>
        {[
          ["ess", "ESS - Économie Sociale et Solidaire"],
          ["sm", "Société à mission"],
          ["siae", "Entreprise Inclusive"],
          ["finess", "Établissements sanitaires et sociaux (Finess)"],
          ["bio", "Professionnels du Bio"],
          ["egapro", "Égalité professionnelle"],
          ["rge", "RGE - Reconnu Garant de l’Environnement"],
          ["of", "Organisme de formation"],
          ["qualiopi", "Qualiopi"],
          ["esv", "Entrepreneur de spectacles vivants"],
          ["achats_responsables", "Achats Responsables"],
          ["patrimoine_vivant", "Entreprise du Patrimoine Vivant"],
        ].map(([value, text]) => (
          <label className="fr-label fr-mb-1w" key={value}>
            <input
              checked={selected.includes(value)}
              onChange={(event) =>
                setSelected(
                  event.target.checked
                    ? [...selected, value]
                    : selected.filter((item) => item !== value)
                )
              }
              type="checkbox"
            />{" "}
            {text}
          </label>
        ))}
      </fieldset>
    </>
  );
};
