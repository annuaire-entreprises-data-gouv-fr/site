import type { ExtendedExportCsvInput } from "./export-csv";
import styles from "./styles.module.css";

export const LocationTags = ({
  filters,
  handleClick,
}: {
  filters: ExtendedExportCsvInput;
  handleClick: (location: {
    type: "cp" | "dep" | "reg" | "insee";
    value: string;
    label: string;
  }) => void;
}) => (
  <div className={styles.selectedLocations}>
    <div className={styles.locationTitle}>Localisations sélectionnées</div>
    {!filters.locations?.length ? (
      <p className={styles.noLocations}>Aucune localisation sélectionnée</p>
    ) : (
      <ul className="fr-tags-group">
        {filters.locations.map((location) => (
          <li key={`${location.type}-${location.value}`}>
            <button
              aria-label={`Retirer ${location.label}`}
              className="fr-tag fr-tag--dismiss"
              onClick={() => handleClick(location)}
              type="button"
            >
              {location.label}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default LocationTags;
