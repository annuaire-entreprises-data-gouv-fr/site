import { useCallback, useRef } from "react";
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const lines = content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

          const legalCategoriesNiveau1 = lines.filter(
            (line) => line in categoriesJuridiquesNiveau1
          );
          const legalCategoriesNiveau2 = lines.filter(
            (line) => line in categoriesJuridiquesNiveau2
          );
          const legalCategoriesNiveau3 = lines.filter(
            (line) => line in categoriesJuridiquesNiveau3
          );

          onChangeCategoriesJuridiques({
            legalCategoriesNiveau1,
            legalCategoriesNiveau2,
            legalCategoriesNiveau3,
          });
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
    </div>
  );
}
