import { useCallback, useRef, useState } from "react";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { categoriesJuridiquesNiveau3 } from "#utils/helpers/formatting/metadata/categories-juridiques";
import { categoriesJuridiquesNiveau1 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-1";
import { categoriesJuridiquesNiveau2 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-2";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [invalidCategories, setInvalidCategories] = useState<string[]>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setInvalidCategories([]);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const lines = content
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
            setInvalidCategories(invalidCategories);
          } else {
            onChangeCategoriesJuridiques({
              legalCategoriesNiveau1,
              legalCategoriesNiveau2,
              legalCategoriesNiveau3,
            });
          }
        };

        reader.readAsText(file);
      }
    },
    [onChangeCategoriesJuridiques]
  );

  return (
    <div className={styles.filterColumn}>
      <label className="fr-mb-2v" htmlFor="categories-juridiques-file-input">
        Charger{" "}
        <FAQLink tooltipLabel="une liste de catégories juridiques">
          <div>
            Votre fichier doit avoir les caractéristiques suivantes :
            <ul>
              <li>format .txt (UTF-8)</li>
              <li>
                catégorie juridique sur 1, 2 ou 4 positions en fonction du
                niveau choisi
              </li>
              <li>un code par ligne, sans séparateur et sans ligne à vide</li>
            </ul>
          </div>
        </FAQLink>
      </label>
      <input
        accept=".txt"
        hidden
        id="categories-juridiques-file-input"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
      <ButtonLink
        alt
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        Sélectionner un fichier .txt
      </ButtonLink>
      {invalidCategories.length > 0 && (
        <div className={styles.errorMessage}>
          <FAQLink
            tooltipLabel={`${invalidCategories.length} catégorie(s) invalide(s)`}
          >
            <ul>
              {invalidCategories.slice(0, 5).map((category) => (
                <li key={category}>{category}</li>
              ))}
              {invalidCategories.length > 5 && <li>...</li>}
            </ul>
          </FAQLink>{" "}
          détectée(s).
        </div>
      )}
    </div>
  );
}
