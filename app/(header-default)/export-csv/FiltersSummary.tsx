import { getEffectifLabel } from './constants';
import { ExtendedExportCsvInput } from './ExportCsv';
import styles from './styles.module.css';

export default function FiltersSummary({
  filters,
}: {
  filters: ExtendedExportCsvInput;
}) {
  const min =
    filters.headcount.min <= filters.headcount.max
      ? filters.headcount.min
      : filters.headcount.max;
  const max =
    filters.headcount.min <= filters.headcount.max
      ? filters.headcount.max
      : filters.headcount.min;
  return (
    <>
      <div className={styles.filtersRecap}>
        <h2>Récapitulatif des filtres :</h2>
        {/* Activité */}
        <p>
          <strong>État administratif des établissements :</strong>{' '}
          {filters.activity === 'all'
            ? 'Établissements actifs et fermés'
            : filters.activity === 'active'
            ? 'Établissements actifs'
            : 'Établissements fermés'}
        </p>

        {/* Type d'unité légale */}
        {filters.legalUnit === 'hq' && (
          <p>
            <strong>Type d‘établissement :</strong> L‘établissement siège
            seulement
          </p>
        )}

        {/* Taille */}
        {filters.headcountEnabled && (
          <p>
            <strong>Taille :</strong> {getEffectifLabel(min)} -{' '}
            {getEffectifLabel(max)}
          </p>
        )}

        {/* Catégorie */}
        {filters.categories && filters.categories.length > 0 && (
          <p>
            <strong>Catégorie :</strong> {filters.categories.join(', ')}
          </p>
        )}

        {/* Dates de création */}
        {(filters.creationDate?.from || filters.creationDate?.to) && (
          <p>
            <strong>Date de création :</strong>
            {filters.creationDate?.from &&
              ` Depuis le ${new Date(
                filters.creationDate.from
              ).toLocaleDateString()}`}
            {filters.creationDate.to &&
              ` Jusqu'au ${new Date(
                filters.creationDate.to
              ).toLocaleDateString()}`}
          </p>
        )}

        {/* Dates de mise à jour */}
        {(filters.updateDate?.from || filters.updateDate?.to) && (
          <p>
            <strong>Date de mise à jour :</strong>
            {filters.updateDate.from &&
              ` Depuis le ${new Date(
                filters.updateDate.from
              ).toLocaleDateString()}`}
            {filters.updateDate.to &&
              ` Jusqu'au ${new Date(
                filters.updateDate.to
              ).toLocaleDateString()}`}
          </p>
        )}
      </div>
    </>
  );
}
