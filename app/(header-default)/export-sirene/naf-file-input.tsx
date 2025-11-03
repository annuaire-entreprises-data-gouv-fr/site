import { useCallback, useRef, useState } from "react";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { codesNAFRev2 } from "#utils/helpers/formatting/metadata/codes-NAF-rev-2";
import styles from "./styles.module.css";

type NAFFileInputProps = {
  onChangeNAF: (params: { naf: string[] }) => void;
};

const regexNAFWithoutDot = /^\d{4}[A-Z]$/;

export function NAFFileInput(props: NAFFileInputProps) {
  const { onChangeNAF } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [invalidNAF, setInvalidNAF] = useState<string[]>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setInvalidNAF([]);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const lines = content
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
            setInvalidNAF(invalidNAF);
          } else {
            onChangeNAF({
              naf,
            });
          }
        };

        reader.readAsText(file);
      }
    },
    [onChangeNAF]
  );

  return (
    <div className={styles.filterColumn}>
      <label className="fr-mb-2v" htmlFor="naf-file-input">
        Charger{" "}
        <FAQLink tooltipLabel="une liste de codes NAF/APE">
          <div>
            Votre fichier doit avoir les caractéristiques suivantes :
            <ul>
              <li>format .txt (UTF-8)</li>
              <li>
                code NAF sur 4 positions et une lettre (ex: 0112Z ou 01.12Z)
              </li>
              <li>un code par ligne, sans séparateur et sans ligne à vide</li>
            </ul>
          </div>
        </FAQLink>
      </label>
      <input
        accept=".txt"
        hidden
        id="naf-file-input"
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
      {invalidNAF.length > 0 && (
        <div className={styles.errorMessage}>
          <FAQLink
            tooltipLabel={`${invalidNAF.length} code(s) NAF/APE invalide(s)`}
          >
            <ul>
              {invalidNAF.slice(0, 5).map((naf) => (
                <li key={naf}>{naf}</li>
              ))}
              {invalidNAF.length > 5 && <li>...</li>}
            </ul>
          </FAQLink>{" "}
          détecté(s).
        </div>
      )}
    </div>
  );
}
