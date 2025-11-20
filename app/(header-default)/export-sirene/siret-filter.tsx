"use client";

import { useState } from "react";
import { Error } from "#components-ui/alerts";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import { FileInput } from "./file-input";
import styles from "./styles.module.css";

interface SiretFilterProps {
  siretsAndSirens: string[];
  onSiretsAndSirensChange: (siretList: string[]) => void;
}

export const SiretFilter: React.FC<SiretFilterProps> = ({
  siretsAndSirens,
  onSiretsAndSirensChange,
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateSiretOrSiren = (value: string): boolean => {
    const trimmed = value.trim();
    return /^\d{9}$/.test(trimmed) || /^\d{14}$/.test(trimmed);
  };

  const processFileContent = (fileContent: string) => {
    setError(null);

    try {
      const lines = fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length > 500) {
        setError(
          "Le fichier contient plus de 500 lignes. Vous ne pouvez pas charger plus de 500 lignes."
        );
        return;
      }

      const invalidValues = lines.filter((line) => !validateSiretOrSiren(line));

      if (invalidValues.length > 0) {
        setError(
          `${invalidValues.length} valeur(s) invalide(s) détectée(s). Un SIREN doit contenir exactement 9 chiffres, un SIRET doit contenir exactement 14 chiffres.`
        );
        return;
      }

      const validValues = lines.filter((line) => validateSiretOrSiren(line));
      onSiretsAndSirensChange(validValues);

      if (validValues.length === 0) {
        setError("Aucun SIREN ou SIRET valide trouvé dans le fichier");
      }
    } catch (err) {
      setError("Erreur lors de la lecture du fichier");
    }
  };

  const clearSiretList = () => {
    onSiretsAndSirensChange([]);
    setError(null);
  };

  return (
    <section className={styles.formSection}>
      <h2>
        <Icon color={constants.colors.frBlue} slug="fileFill">
          Charger une liste de SIREN/SIRET (facultatif)
        </Icon>
      </h2>
      <div>
        Plutôt d’utiliser des critères de recherche, vous pouvez nous fournir
        directement une liste de SIREN / SIRET. Assurez-vous que la liste soit{" "}
        <FAQLink tooltipLabel="correctement mise en page">
          <div>
            <strong>Format requis :</strong>
            <ul>
              <li>Fichier .txt (UTF-8)</li>
              <li>SIREN (9 positions) ou SIRET (14 positions) uniquement</li>
              <li>
                Un SIREN ou SIRET par ligne, sans séparateur et sans ligne à
                vide
              </li>
              <li>500 lignes maximum</li>
            </ul>
            <strong>Note :</strong> Certains établissements seront éliminés si
            vous avez sélectionné d‘autres critères (localisation, activité,
            etc.).
          </div>
        </FAQLink>
      </div>
      <br />

      <div className={styles.siretContainer}>
        <FileInput
          description="Un SIREN / SIRET par ligne"
          onChange={processFileContent}
          onError={setError}
        />

        {error && (
          <Error>
            <strong>Votre fichier n’a pas pu être chargé.</strong>
            <p className="fr-my-0">{error}</p>
          </Error>
        )}

        {siretsAndSirens.length > 0 && (
          <div className={styles.siretListContainer}>
            <div className={styles.siretListHeader}>
              <h3>Sélection actuelle ({siretsAndSirens.length})</h3>
              <button
                className="fr-btn fr-btn--sm fr-btn--secondary"
                onClick={clearSiretList}
                type="button"
              >
                Effacer la liste
              </button>
            </div>

            <div className={styles.siretList}>
              {siretsAndSirens.slice(0, 10).map((siret, index) => (
                <span className="fr-tag" key={index}>
                  {siret}
                </span>
              ))}
              {siretsAndSirens.length > 10 && (
                <span className="fr-tag">
                  +{siretsAndSirens.length - 10} autres...
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SiretFilter;
