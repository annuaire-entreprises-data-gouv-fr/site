import DualRangeSlider from '#components-ui/dual-range-slider';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { MultiSelect } from '#components-ui/select/multi-select';
import constants from '#models/constants';
import { categoriesEntreprisesOptions } from '#utils/helpers/formatting/categories-entreprise';
import { categoriesJuridiques } from '#utils/helpers/formatting/metadata/categories-juridiques';
import { codesNAFRev2 } from '#utils/helpers/formatting/metadata/codes-NAF-rev-2';
import { codesSectionNAF } from '#utils/helpers/formatting/metadata/codes-section-NAF';
import { Dispatch, SetStateAction } from 'react';
import { getEffectifLabel } from './constants';
import { ExtendedExportCsvInput } from './ExportCsv';
import { LocationFilter } from './LocationFilter';
import LocationTags from './LocationTags';
import SiretFilter from './SiretFilter';
import styles from './styles.module.css';

export const selectedEffectifLabel = (filters: ExtendedExportCsvInput) => {
  if (filters.headcountEnabled) {
    return filters.headcount.min === filters.headcount.max
      ? `De ${getEffectifLabel(filters.headcount.min)} inclus`
      : `De ${getEffectifLabel(
          filters.headcount.min
        )} jusqu'à ${getEffectifLabel(filters.headcount.max)} inclus`;
  }
  return 'Tout, y compris les effectifs non renseignés';
};

/**
 * For the search api `nature_juridique` must be a string
 * of 4 characters.
 */
const getLegalCategories = () =>
  Object.keys(categoriesJuridiques).map((categorie) => ({
    value: categorie,
    label: categoriesJuridiques[categorie],
  }));

const todayString = new Date().toISOString().split('T')[0];

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
            Filtrer par situation administrative
            <Icon color={constants.colors.frBlue} slug="lightbulbFill" />
          </h2>

          <h3>Par état administratif</h3>
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
              <label htmlFor="activity-1">Tous</label>
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
              <label htmlFor="activity-2">En activité uniquement</label>
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
              <label htmlFor="activity-3">Cessé uniquement</label>
            </div>
          </div>

          <h3>Par type d‘établissement</h3>
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
            Filtrer par taille
            <Icon color={constants.colors.frBlue} slug="groupFill" />
          </h2>
          <div className={styles.sizeSliderContainer}>
            <h3>
              Effectifs{' '}
              <InformationTooltip
                label={
                  <div>
                    <div>
                      Pour environ la moitié des établissements, la tranche
                      d&apos;effectif salarié n&apos;est pas renseignée. Il
                      s&apos;agit principalement d&apos;établissements récents
                      (créés il y a moins de trois ans). Si vous créez une liste
                      d&apos;établissements en filtrant sur les tranches
                      d&apos;effectifs, ceux dont l&apos;effectif n&apos;est pas
                      renseigné ne seront pas sélectionnés.
                    </div>
                    <div style={{ marginTop: 8 }}>
                      Si vous souhaitez une liste d&apos;établissements récents,
                      nous vous conseillons de ne pas intervenir sur
                      l&apos;onglet Effectif.
                    </div>
                  </div>
                }
                tabIndex={0}
                width={350}
              >
                <Icon
                  color={constants.colors.frBlue}
                  size={12}
                  slug="information"
                />
              </InformationTooltip>
            </h3>
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
              defaultValue={filters.headcount}
              min={0}
              max={14}
              step={1}
              onChange={(value: { min: number; max: number }) =>
                setFilters((prev) => ({
                  ...prev,
                  headcount: value,
                  headcountEnabled: true,
                }))
              }
              samePositionAllowed={true}
              disabledColor={!filters.headcountEnabled}
            />

            <div className={styles.sliderHeader}>
              <div className={styles.rangeDisplay}>
                {selectedEffectifLabel(filters)}
              </div>
            </div>
          </div>
          <div>
            <h3>
              Catégorie{' '}
              <InformationTooltip
                label={
                  <div>
                    <div>
                      La donnée n&apos;est pas renseignée pour bon nombre
                      d&apos;établissements. Les PME comprennent les TPE.
                    </div>
                  </div>
                }
                tabIndex={0}
                width={350}
              >
                <Icon
                  color={constants.colors.frBlue}
                  size={12}
                  slug="information"
                />
              </InformationTooltip>
            </h3>
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

      <div>
        <section>
          <h2>
            Filtrer par localisation
            <Icon color={constants.colors.frBlue} slug="mapPinFill" />
            <InformationTooltip
              label={
                <div>
                  En savoir plus sur le code officiel géographique sur{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.insee.fr/fr/information/2560452"
                  >
                    le site de l‘INSEE
                  </a>
                </div>
              }
              tabIndex={0}
              width={350}
            >
              <Icon
                color={constants.colors.frBlue}
                size={12}
                slug="information"
              />
            </InformationTooltip>
          </h2>
          <div className={styles.filterContainer}>
            <div className={styles.filterColumn}>
              <LocationFilter
                onSelect={(
                  type: 'cp' | 'dep' | 'reg' | 'insee',
                  value: string,
                  label: string
                ) => {
                  setFilters((prev) => ({
                    ...prev,
                    locations: [
                      ...prev.locations.filter(
                        (loc) => !(loc.type === type && loc.value === value)
                      ),
                      { type, value, label },
                    ],
                  }));
                }}
              />
            </div>
            <div className={styles.filterColumn}>
              <LocationTags
                filters={filters}
                handleClick={(location) => {
                  setFilters((prev) => ({
                    ...prev,
                    locations: prev.locations.filter(
                      (loc) =>
                        !(
                          loc.type === location.type &&
                          loc.value === location.value
                        )
                    ),
                  }));
                }}
              />
            </div>
          </div>
        </section>
      </div>
      <div className={styles.row}>
        <section className={styles.formSection}>
          <h2>
            Filtrer par type de structure
            <Icon color={constants.colors.frBlue} slug="buildingFill" />
            <InformationTooltip
              label={
                <div>
                  En savoir plus sur les codes NAF/APE sur{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.insee.fr/fr/information/2120875"
                  >
                    le site de l‘INSEE
                  </a>
                </div>
              }
              tabIndex={0}
              width={350}
            >
              <Icon
                color={constants.colors.frBlue}
                size={12}
                slug="information"
              />
            </InformationTooltip>
          </h2>
          <div className={styles.filterContainer}>
            <div className={styles.filterColumn}>
              <label htmlFor="react-select-sap-multi-select-input">
                Domaine d‘activité (Section) :
              </label>
              <MultiSelect
                name="sap"
                defaultValue={filters.sap}
                placeholder="Choisir un domaine d'activité"
                id="sap-multi-select"
                instanceId="sap-multi-select"
                options={Object.keys(codesSectionNAF).map((k) => ({
                  value: k,
                  label: codesSectionNAF[k as keyof typeof codesSectionNAF],
                }))}
                onChange={(values) => {
                  setFilters((prev) => ({
                    ...prev,
                    sap: values,
                  }));
                }}
                menuPosition="fixed"
              />
            </div>

            <div className={styles.filterColumn}>
              <label htmlFor="react-select-naf-multi-select-input">
                Code NAF/APE (Sous-classe) :
              </label>
              <MultiSelect
                name="naf"
                defaultValue={filters.naf}
                placeholder="Choisir un code NAF/APE"
                id="naf-multi-select"
                instanceId="naf-multi-select"
                options={Object.keys(codesNAFRev2).map((code) => ({
                  value: code,
                  label: `${code} - ${
                    codesNAFRev2[code as keyof typeof codesNAFRev2]
                  }`,
                }))}
                onChange={(values) => {
                  setFilters((prev) => ({
                    ...prev,
                    naf: values,
                  }));
                }}
                menuPosition="fixed"
              />
            </div>
          </div>
        </section>
      </div>

      <div>
        <section className={styles.formSection}>
          <h2>
            Filtrer par catégorie juridique
            <Icon color={constants.colors.frBlue} slug="scaleFill" />
            <InformationTooltip
              label={
                <div>
                  En savoir plus sur les catégories juridique sur{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.insee.fr/fr/information/2028129"
                  >
                    le site de l‘INSEE
                  </a>
                </div>
              }
              tabIndex={0}
              width={350}
            >
              <Icon
                color={constants.colors.frBlue}
                size={12}
                slug="information"
              />
            </InformationTooltip>
          </h2>
          <div>
            <MultiSelect
              name="nature_juridique"
              defaultValue={filters.legalCategories}
              placeholder="Choisir une catégorie juridique"
              id="nature-juridique-multi-select"
              instanceId="nature-juridique-multi-select"
              options={getLegalCategories()}
              menuPosition="fixed"
              onChange={(values: string[]) =>
                setFilters((prev) => ({
                  ...prev,
                  legalCategories: values,
                }))
              }
            />
          </div>
        </section>
      </div>

      <div className={styles.row}>
        <section className={styles.formSection}>
          <h2>
            Filtrer par qualité
            <Icon color={constants.colors.frBlue} slug="awardFill" />
          </h2>

          <div className={styles.dateContainer}>
            <div className={styles.qualityFilterColumn}>
              <h3 style={{ marginTop: 0 }}>
                Appartenance au champ de l‘économie sociale et solidaire{' '}
                <InformationTooltip
                  label={
                    <div>
                      Pour plus d‘informations, consultez la{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/definitions/economie-sociale-et-solidaire-ess"
                      >
                        définition de l‘ESS
                      </a>
                      .
                    </div>
                  }
                  tabIndex={0}
                  width={350}
                >
                  <Icon
                    color={constants.colors.frBlue}
                    size={12}
                    slug="information"
                  />
                </InformationTooltip>
              </h3>
              <fieldset
                className="fr-fieldset"
                aria-labelledby="ess-legend ess-messages"
              >
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="ess-inclure"
                      name="ess-inclure"
                      checked={filters.ess?.inclure || false}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ess: {
                            inclure: e.target.checked,
                            inclureNo: prev.ess?.inclureNo || false,
                            inclureNonRenseigne:
                              prev.ess?.inclureNonRenseigne || false,
                          },
                        }))
                      }
                    />
                    <label className="fr-label" htmlFor="ess-inclure">
                      Oui
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="ess-inclure-no"
                      name="ess-inclure-no"
                      checked={filters.ess?.inclureNo || false}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ess: {
                            inclure: prev.ess?.inclure || false,
                            inclureNo: e.target.checked,
                            inclureNonRenseigne:
                              prev.ess?.inclureNonRenseigne || false,
                          },
                        }))
                      }
                    />
                    <label className="fr-label" htmlFor="ess-inclure-no">
                      Non
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="ess-inclure-non-renseigne"
                      name="ess-inclure-non-renseigne"
                      checked={filters.ess?.inclureNonRenseigne || false}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ess: {
                            inclure: prev.ess?.inclure || false,
                            inclureNo: prev.ess?.inclureNo || false,
                            inclureNonRenseigne: e.target.checked,
                          },
                        }))
                      }
                    />
                    <label
                      className="fr-label"
                      htmlFor="ess-inclure-non-renseigne"
                    >
                      Non renseignée
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className={styles.qualityFilterColumn}>
              <h3 style={{ marginTop: 0 }}>
                Appartenance au champ des sociétés à mission{' '}
                <InformationTooltip
                  label={
                    <div>
                      Pour plus d‘informations, consultez la{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/definitions/societe-a-mission"
                      >
                        définition de société à mission
                      </a>
                      .
                    </div>
                  }
                  tabIndex={0}
                  width={350}
                >
                  <Icon
                    color={constants.colors.frBlue}
                    size={12}
                    slug="information"
                  />
                </InformationTooltip>
              </h3>
              <fieldset
                className="fr-fieldset"
                aria-labelledby="mission-legend mission-messages"
              >
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="mission-inclure"
                      name="mission-inclure"
                      checked={filters.mission?.inclure || false}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          mission: {
                            inclure: e.target.checked,
                            inclureNo: prev.mission?.inclureNo || false,
                            inclureNonRenseigne:
                              prev.mission?.inclureNonRenseigne || false,
                          },
                        }))
                      }
                    />
                    <label className="fr-label" htmlFor="mission-inclure">
                      Oui
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="mission-inclure-no"
                      name="mission-inclure-no"
                      checked={filters.mission?.inclureNo || false}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          mission: {
                            inclure: prev.mission?.inclure || false,
                            inclureNo: e.target.checked,
                            inclureNonRenseigne:
                              prev.mission?.inclureNonRenseigne || false,
                          },
                        }))
                      }
                    />
                    <label className="fr-label" htmlFor="mission-inclure-no">
                      Non
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="mission-inclure-non-renseigne"
                      name="mission-inclure-non-renseigne"
                      checked={filters.mission?.inclureNonRenseigne || false}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          mission: {
                            inclure: prev.mission?.inclure || false,
                            inclureNo: prev.mission?.inclureNo || false,
                            inclureNonRenseigne: e.target.checked,
                          },
                        }))
                      }
                    />
                    <label
                      className="fr-label"
                      htmlFor="mission-inclure-non-renseigne"
                    >
                      Non renseignée
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.formSection}>
        <h2>
          Filtrer par date
          <Icon color={constants.colors.frBlue} slug="calendarFill" />{' '}
        </h2>
        <div className={styles.dateContainer}>
          <div>
            <h3 style={{ marginTop: 0 }}>
              Date de création{' '}
              <InformationTooltip
                label={
                  <div>
                    <div>
                      Par défaut, il n‘y a pas de sélection sur la date de
                      création.
                    </div>
                    <div style={{ marginTop: 8 }}>
                      Vous pouvez obtenir tous les établissements ou unités
                      légales créés sur une période définie (ex: entre le 1er
                      décembre 2014 et le 31 janvier 2015).
                    </div>
                    <div style={{ marginTop: 8 }}>
                      Si vous souhaitez obtenir une liste d‘unités légales, il
                      faut cocher &quot;Siège social uniquement&quot;.
                    </div>
                  </div>
                }
                tabIndex={0}
                width={350}
              >
                <Icon
                  color={constants.colors.frBlue}
                  size={12}
                  slug="information"
                />
              </InformationTooltip>
            </h3>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Depuis le</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                defaultValue={filters.creationDate?.from}
                max={filters.creationDate?.to || todayString}
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
              <label className={styles.dateLabel}>Jusqu‘au</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                defaultValue={filters.creationDate?.to}
                min={filters.creationDate?.from}
                max={todayString}
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
          <div>
            <h3 style={{ marginTop: 0 }}>
              Date de mise à jour{' '}
              <InformationTooltip
                label={
                  <div>
                    <div>
                      Par défaut, il n‘y a pas de sélection sur la date de mise
                      à jour.
                    </div>
                    <div style={{ marginTop: 8 }}>
                      Vous pouvez obtenir tous les établissements dont la date
                      de dernière mise à jour est dans une période définie (ex:
                      Depuis le 14/10/2018 18:02:11 jusqu‘au 15/10/2018).
                    </div>
                    <div style={{ marginTop: 8 }}>
                      Si vous souhaitez obtenir une liste d‘unités légales, il
                      faut cocher &quot;Siège social uniquement&quot;.
                    </div>
                  </div>
                }
                tabIndex={0}
                width={350}
              >
                <Icon
                  color={constants.colors.frBlue}
                  size={12}
                  slug="information"
                />
              </InformationTooltip>
            </h3>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Depuis le</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                defaultValue={filters.updateDate?.from}
                max={filters.updateDate?.to || todayString}
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
              <label className={styles.dateLabel}>Jusqu‘au</label>
              <input
                type="date"
                className={`fr-input ${styles.dateInput}`}
                defaultValue={filters.updateDate?.to}
                min={filters.updateDate?.from}
                max={todayString}
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

      <SiretFilter
        siretsAndSirens={filters.siretsAndSirens || []}
        onSiretsAndSirensChange={(siretsAndSirens) =>
          setFilters((prev) => ({
            ...prev,
            siretsAndSirens,
          }))
        }
      />
    </>
  );
}
