import { useCallback, useState } from "react";
import { Error } from "#components-ui/alerts";
import { FileInput } from "./file-input";

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
  const [error, setError] = useState<string | null>(null);

  const processFileContent = useCallback(
    (fileContent: string) => {
      setError(null);
      const lines = fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const { locations, invalidLocations } = lines.reduce(
        (acc, line) => {
          if (regexDepartementLocations.test(line)) {
            acc.locations.push({
              type: "dep",
              value: line,
              label: `${line} - Département`,
            });
          } else if (regexCommuneLocations.test(line)) {
            acc.locations.push({
              type: "cp",
              value: line,
              label: `${line} - Commune`,
            });
          } else {
            acc.invalidLocations.push(line);
          }
          return acc;
        },
        { locations: [] as Location[], invalidLocations: [] as string[] }
      );

      if (invalidLocations.length > 0) {
        setError(
          `La liste contient ${invalidLocations.length} erreur(s) : corrigez-les puis rechargez le fichier.`
        );
      } else {
        onChangeLocations({
          locations,
        });
      }
    },
    [onChangeLocations]
  );

  return (
    <div>
      <label className="fr-mb-2v">Filtrer en chargeant une liste</label>
      <FileInput
        description="Un code département ou commune par ligne"
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
