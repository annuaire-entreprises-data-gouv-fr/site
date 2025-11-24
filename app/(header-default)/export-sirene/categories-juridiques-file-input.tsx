import { useCallback, useState } from "react";
import { Error } from "#components-ui/alerts";
import FaqLink from "#components-ui/faq-link";
import { categoriesJuridiquesNiveau3 } from "#utils/helpers/formatting/metadata/categories-juridiques";
import { categoriesJuridiquesNiveau1 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-1";
import { categoriesJuridiquesNiveau2 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-2";
import { FileInput } from "./file-input";
import styles from "./styles.module.css";

type CategoriesJuridiquesFileInputProps = {
  onChangeCategoriesJuridiques: (params: {
    legalCategoriesNiveau1: string[];
    legalCategoriesNiveau2: string[];
    legalCategoriesNiveau3: string[];
  }) => void;
};

export function CategoriesJuridiquesFileInput(
  props: CategoriesJuridiquesFileInputProps
) {
  const { onChangeCategoriesJuridiques } = props;
  const [error, setError] = useState<string | null>(null);

  const processFileContent = useCallback(
    (fileContent: string) => {
      setError(null);
      const lines = fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const {
        legalCategoriesNiveau1,
        legalCategoriesNiveau2,
        legalCategoriesNiveau3,
        invalidCategories,
      } = lines.reduce(
        (acc, line) => {
          if (line in categoriesJuridiquesNiveau1) {
            acc.legalCategoriesNiveau1.push(line);
          } else if (line in categoriesJuridiquesNiveau2) {
            acc.legalCategoriesNiveau2.push(line);
          } else if (line in categoriesJuridiquesNiveau3) {
            acc.legalCategoriesNiveau3.push(line);
          } else {
            acc.invalidCategories.push(line);
          }
          return acc;
        },
        {
          legalCategoriesNiveau1: [] as string[],
          legalCategoriesNiveau2: [] as string[],
          legalCategoriesNiveau3: [] as string[],
          invalidCategories: [] as string[],
        }
      );

      if (invalidCategories.length > 0) {
        setError(
          `La liste contient ${invalidCategories.length} erreur(s) : corrigez-les puis rechargez le fichier.`
        );
      } else {
        onChangeCategoriesJuridiques({
          legalCategoriesNiveau1: [...new Set(legalCategoriesNiveau1)],
          legalCategoriesNiveau2: [...new Set(legalCategoriesNiveau2)],
          legalCategoriesNiveau3: [...new Set(legalCategoriesNiveau3)],
        });
      }
    },
    [onChangeCategoriesJuridiques]
  );

  return (
    <div>
      <label>
        Filtrer en chargeant{" "}
        <FaqLink tooltipLabel="une liste">
          Format requis :
          <ul>
            <li>fichier .txt (UTF-8)</li>
            <li>
              catégorie juridique sur 1, 2 ou 4 positions uniquement en fonction
              du niveau choisi
            </li>
            <li>un code par ligne, sans séparateur et sans ligne à vide</li>
            <li>100 lignes maximum</li>
          </ul>
          Exemple :
          <ul className={styles.fileExampleList}>
            <li>1</li>
            <li>3290</li>
            <li>4</li>
            <li>5202</li>
            <li>31</li>
          </ul>
        </FaqLink>
      </label>
      <FileInput
        description="Un code catégorie légale par ligne"
        onChange={processFileContent}
        onError={setError}
      />
      {error && (
        <Error>
          <strong>Votre fichier n’a pas pu être chargé.</strong>
          <p className="fr-my-0">{error}</p>
        </Error>
      )}
    </div>
  );
}
