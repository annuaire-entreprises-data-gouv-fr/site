import { useCallback, useState } from "react";
import { Error } from "#components-ui/alerts";
import FaqLink from "#components-ui/faq-link";
import { codesNAFRev2 } from "#utils/helpers/formatting/metadata/codes-NAF-rev-2";
import { FileInput } from "./file-input";
import styles from "./styles.module.css";

type NAFFileInputProps = {
  onChangeNAF: (params: { naf: string[] }) => void;
};

const regexNAFWithoutDot = /^\d{4}[A-Z]$/;

export function NAFFileInput(props: NAFFileInputProps) {
  const { onChangeNAF } = props;
  const [error, setError] = useState<string | null>(null);

  const processFileContent = useCallback(
    (fileContent: string) => {
      setError(null);
      const lines = fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const formattedLines = lines.map((line) =>
        regexNAFWithoutDot.test(line)
          ? `${line.slice(0, 2)}.${line.slice(2)}`
          : line
      );

      const { naf, invalidNAF } = formattedLines.reduce(
        (acc, line) => {
          if (line in codesNAFRev2) {
            acc.naf.push(line);
          } else {
            acc.invalidNAF.push(line);
          }
          return acc;
        },
        { naf: [] as string[], invalidNAF: [] as string[] }
      );

      if (invalidNAF.length > 0) {
        setError(
          `La liste contient ${invalidNAF.length} erreur(s) : corrigez-les puis rechargez le fichier.`
        );
      } else {
        onChangeNAF({
          naf,
        });
      }
    },
    [onChangeNAF]
  );

  return (
    <div>
      <label>
        Filtrer en chargeant{" "}
        <FaqLink tooltipLabel="une liste">
          Votre fichier doit avoir les caractéristiques suivantes :
          <ul>
            <li>format .txt (UTF-8)</li>
            <li>code NAF complet (4 chiffres et une lettre)</li>
            <li>un code par ligne, sans séparateur et sans ligne à vide</li>
          </ul>
          Exemple :
          <ul className={styles.fileExampleList}>
            <li>0124Z</li>
            <li>2120Z</li>
            <li>4765Z</li>
          </ul>
        </FaqLink>
      </label>
      <FileInput
        description="Un code NAF/APE par ligne"
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
