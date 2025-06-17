import { ExtendedExportCsvInput } from './ExportCsv';
import { selectedEffectifLabel } from './Filters';
import styles from './styles.module.css';

export default function FiltersSummary({
  filters,
}: {
  filters: ExtendedExportCsvInput;
}) {
  return (
    <>
      <div className={styles.filtersRecap}>
        <h2>Récapitulatif des filtres :</h2>
        <p>
          <strong>État administratif :</strong>{' '}
          {filters.activity === 'all'
            ? 'Établissements en activité et cessés'
            : filters.activity === 'active'
            ? 'Établissements en activité'
            : 'Établissements cessés'}
        </p>

        {filters.legalUnit === 'hq' && (
          <p>
            <strong>Type d‘établissement :</strong> L‘établissement siège
            seulement
          </p>
        )}

        {filters.headcountEnabled && (
          <p>
            <strong>Effectifs :</strong> {selectedEffectifLabel(filters)}
          </p>
        )}

        {filters.categories && filters.categories.length > 0 && (
          <p>
            <strong>Catégorie :</strong> {filters.categories.join(', ')}
          </p>
        )}

        {(filters.creationDate?.from || filters.creationDate?.to) && (
          <p>
            <strong>Date de création :</strong>{' '}
            {filters.creationDate?.from &&
              `Depuis le ${new Date(
                filters.creationDate.from
              ).toLocaleDateString()}`}
            {filters.creationDate?.from && filters.creationDate?.to
              ? ' jusqu‘au '
              : 'Jusqu‘au '}
            {filters.creationDate.to &&
              `${new Date(filters.creationDate.to).toLocaleDateString()}`}
          </p>
        )}

        {(filters.updateDate?.from || filters.updateDate?.to) && (
          <p>
            <strong>Date de mise à jour :</strong>
            {filters.updateDate.from &&
              ` Depuis le ${new Date(
                filters.updateDate.from
              ).toLocaleDateString()}`}
            {filters.updateDate?.from && filters.updateDate?.to
              ? ' jusqu‘au '
              : 'Jusqu‘au '}
            {filters.updateDate.to &&
              `${new Date(filters.updateDate.to).toLocaleDateString()}`}
          </p>
        )}
      </div>
    </>
  );
}
