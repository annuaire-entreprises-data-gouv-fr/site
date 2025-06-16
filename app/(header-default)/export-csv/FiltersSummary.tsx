import { getEffectifLabel } from './constants';
import { ExtendedExportCsvInput } from './ExportCsv';
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
          <strong>État administratif des établissements :</strong>{' '}
          {filters.activity === 'all'
            ? 'Établissements actifs et fermés'
            : filters.activity === 'active'
            ? 'Établissements actifs'
            : 'Établissements fermés'}
        </p>

        {filters.legalUnit === 'hq' && (
          <p>
            <strong>Type d‘établissement :</strong> L‘établissement siège
            seulement
          </p>
        )}

        {filters.headcountEnabled && (
          <p>
            <strong>Taille :</strong> {getEffectifLabel(filters.headcount.min)}{' '}
            - {getEffectifLabel(filters.headcount.max)}
          </p>
        )}

        {filters.categories && filters.categories.length > 0 && (
          <p>
            <strong>Catégorie :</strong> {filters.categories.join(', ')}
          </p>
        )}

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
