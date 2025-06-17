import DualRangeSlider from '#components-ui/dual-range-slider';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { categoriesEntreprisesOptions } from '#utils/helpers/formatting/categories-entreprise';
import { Dispatch, SetStateAction } from 'react';
import { getEffectifLabel } from './constants';
import { ExtendedExportCsvInput } from './ExportCsv';
import styles from './styles.module.css';

export default function Filters({
  setFilters,
  filters,
}: {
  setFilters: Dispatch<SetStateAction<ExtendedExportCsvInput>>;
  filters: ExtendedExportCsvInput;
}) {
  const toggleCategories = (value: 'PME' | 'ETI' | 'GE') => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((cat) => cat !== value)
        : [...prev.categories, value],
    }));
  };

  return (
    <>
      <div className={styles.row}>
        <section className={styles.formSection}>
          <h2>
            Filtrer par situation administrative{' '}
            <Icon color={constants.colors.frBlue} slug="lightbulbFill" />
          </h2>

          <h3 className={styles.subsectionTitle}>Par activité</h3>
          <div className="fr-fieldset__element">
            <div className="fr-radio-group">
              <input
                type="radio"
                name="activity"
                id="activity-1"
                value="all"
                checked={filters.activity === 'all'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    activity: e.target.value as 'all' | 'active' | 'ceased',
                  }))
                }
              />
              <label htmlFor="activity-1" className={styles.radioLabel}>
                Tous
              </label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-radio-group">
              <input
                type="radio"
                name="activity"
                id="activity-2"
                value="active"
                checked={filters.activity === 'active'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    activity: e.target.value as 'all' | 'active' | 'ceased',
                  }))
                }
              />
              <label htmlFor="activity-2" className={styles.radioLabel}>
                Ouvert uniquement
              </label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-radio-group">
              <input
                type="radio"
                name="activity"
                id="activity-3"
                value="ceased"
                checked={filters.activity === 'ceased'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    activity: e.target.value as 'all' | 'active' | 'ceased',
                  }))
                }
              />
              <label htmlFor="activity-3" className={styles.radioLabel}>
                Fermé uniquement
              </label>
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>Par type d‘unité légale</h3>
          <div className="fr-checkbox-group">
            <input
              type="checkbox"
              id="legalUnit"
              name="legalUnit"
              checked={filters.legalUnit === 'hq'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  legalUnit: e.target.checked ? 'hq' : 'all',
                }))
              }
              aria-describedby="checkboxes-1-messages"
            />
            <label className="fr-label" htmlFor="legalUnit">
              Siège social uniquement
            </label>
            <div
              className="fr-messages-group"
              id="checkboxes-1-messages"
              aria-live="assertive"
            ></div>
          </div>
        </section>

        <section className={styles.formSection}>
          <h2>
            Filtrer par taille{' '}
            <Icon color={constants.colors.frBlue} slug="groupFill" />
          </h2>
          <div className={styles.sizeSliderContainer}>
            <h3 className={styles.subsectionTitle}>Effectifs</h3>
            <div className="fr-checkbox-group">
              <input
                type="checkbox"
                id="includeEmptyEffectif"
                name="includeEmptyEffectif"
                checked={!filters.headcountEnabled}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    headcountEnabled: !e.target.checked,
                  }))
                }
              />
              <label className="fr-label" htmlFor="includeEmptyEffectif">
                Tout, y compris les effectifs non renseignés
              </label>
            </div>
            <div className={styles.effectifLabels}>
              <span
                style={{
                  color: filters.headcountEnabled
                    ? constants.colors.frBlue
                    : '#e5e5e5',
                }}
              >
                {getEffectifLabel(0)}
              </span>
              <span
                style={{
                  color: filters.headcountEnabled
                    ? constants.colors.frBlue
                    : '#e5e5e5',
                }}
              >
                {getEffectifLabel(14)}
              </span>
            </div>
            <DualRangeSlider
              idPrefix="headcount"
              label="Effectifs"
              min={0}
              max={14}
              step={1}
              onChange={(value: { min: number; max: number }) =>
                setFilters((prev) => ({
                  ...prev,
                  headcount: value,
                }))
              }
              samePositionAllowed={true}
              disabled={!filters.headcountEnabled}
            />

            <div className={styles.sliderHeader}>
              <div className={styles.rangeDisplay}>
                {filters.headcountEnabled
                  ? filters.headcount.min === filters.headcount.max
                    ? getEffectifLabel(filters.headcount.min)
                    : `${getEffectifLabel(
                        filters.headcount.min
                      )} <-> ${getEffectifLabel(filters.headcount.max)}`
                  : 'Tout, y compris les effectifs non renseignés'}
              </div>
            </div>
          </div>
          <div>
            <h3 className={styles.subsectionTitle}>Catégorie</h3>
            <ul className="fr-tags-group">
              {categoriesEntreprisesOptions.map(({ label, value }) => (
                <li key={value}>
                  <button
                    type="button"
                    className="fr-tag"
                    aria-pressed={filters.categories.includes(value)}
                    onClick={() => toggleCategories(value)}
                  >
                    {label}
                  </button>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  className="fr-tag"
                  aria-pressed={filters.categories.length === 0}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: [],
                    }))
                  }
                >
                  Toutes, y compris non renseignées
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <section className={styles.formSection}>
        <h2>
          Filtrer par date{' '}
          <Icon color={constants.colors.frBlue} slug="calendarFill" />
        </h2>
        <div className={styles.dateContainer}>
          <div className={styles.dateColumn}>
            <h3>Date de création</h3>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Depuis le</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                value={filters.creationDate?.from}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    creationDate: {
                      ...prev.creationDate,
                      from: (e.target as HTMLInputElement).value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className={styles.dateLabel}>Jusqu&apos;au</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                value={filters.creationDate?.to}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    creationDate: {
                      ...prev.creationDate,
                      to: (e.target as HTMLInputElement).value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className={styles.dateColumn}>
            <h3>Date de mise à jour</h3>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Depuis le</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                value={filters.updateDate?.from}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    updateDate: {
                      ...prev.updateDate,
                      from: (e.target as HTMLInputElement).value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className={styles.dateLabel}>Jusqu&apos;au</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                value={filters.updateDate?.to}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    updateDate: {
                      ...prev.updateDate,
                      to: (e.target as HTMLInputElement).value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
