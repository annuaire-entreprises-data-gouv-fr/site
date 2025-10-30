import { useCallback, useRef } from "react";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import styles from "./styles.module.css";

type Location = {
  type: "dep" | "cp";
  value: string;
  label: string;
};

type LocationsFileInputProps = {
  onChangeLocations: (params: { locations: Location[] }) => void;
};

const regexDepartementLocations = /^\d{2,3}$/;
const regexCommuneLocations = /^\d{5}$/;

export function LocationsFileInput(props: LocationsFileInputProps) {
  const { onChangeLocations } = props;
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

          const locations = lines
            .map((line) =>
              regexDepartementLocations.test(line)
                ? { type: "dep", value: line, label: `${line} - Département` }
                : regexCommuneLocations.test(line)
                  ? { type: "cp", value: line, label: `${line} - Commune` }
                  : null
            )
            .filter((line) => line !== null) as Location[];

          onChangeLocations({
            locations,
          });
        };

        reader.readAsText(file);
      }
    },
    [onChangeLocations]
  );

  return (
    <div className={styles.filterColumn}>
      <label className="fr-mb-2v" htmlFor="locations-file-input">
        Charger{" "}
        <FAQLink tooltipLabel="une liste de codes départements ou communes">
          <div>
            Votre fichier doit avoir les caractéristiques suivantes :
            <ul>
              <li>format .txt (UTF-8)</li>
              <li>code département (2 ou 3 positions)</li>
              <li>code commune (5 positions)</li>
              <li>un code par ligne, sans séparateur et sans ligne à vide</li>
            </ul>
          </div>
        </FAQLink>
      </label>
      <input
        accept=".txt"
        hidden
        id="locations-file-input"
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
