import { useCallback, useState } from "react";
import { Error } from "#components-ui/alerts";
import { categoriesJuridiquesNiveau3 } from "#utils/helpers/formatting/metadata/categories-juridiques";
import { categoriesJuridiquesNiveau1 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-1";
import { categoriesJuridiquesNiveau2 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-2";
import { FileInput } from "./file-input";

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
          legalCategoriesNiveau1,
          legalCategoriesNiveau2,
          legalCategoriesNiveau3,
        });
      }
    },
    [onChangeCategoriesJuridiques]
  );

  return (
    <div>
      <label className="fr-mb-2v">Filtrer en chargeant une liste</label>
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
