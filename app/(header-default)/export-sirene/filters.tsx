import type { Dispatch, SetStateAction } from "react";
import DualRangeSlider from "#components-ui/dual-range-slider";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import { MultiSelect } from "#components-ui/select/multi-select";
import constants from "#models/constants";
import { categoriesEntreprisesOptions } from "#utils/helpers/formatting/categories-entreprise";
import { categoriesJuridiquesNiveau3 } from "#utils/helpers/formatting/metadata/categories-juridiques";
import { categoriesJuridiquesNiveau1 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-1";
import { categoriesJuridiquesNiveau2 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-2";
import { codesNAFRev2 } from "#utils/helpers/formatting/metadata/codes-NAF-rev-2";
import { codesSectionNAF } from "#utils/helpers/formatting/metadata/codes-section-NAF";
import { CategoriesJuridiquesFileInput } from "./categories-juridiques-file-input";
import { getEffectifLabel } from "./constants";
import type { ExtendedExportCsvInput } from "./export-csv";
import { LocationFilter } from "./location-filter";
import LocationTags from "./location-tags";
import SiretFilter from "./siret-filter";
import styles from "./styles.module.css";

export const selectedEffectifLabel = (filters: ExtendedExportCsvInput) => {
  if (filters.headcountEnabled) {
    return filters.headcount.min === filters.headcount.max
      ? `De ${getEffectifLabel(filters.headcount.min)} inclus`
      : `De ${getEffectifLabel(
          filters.headcount.min
        )} jusqu'à ${getEffectifLabel(filters.headcount.max)} inclus`;
  }
  return "Tout, y compris les effectifs non renseignés";
};

/**
 * For the search api `nature_juridique` must be a string
 * of 4 characters.
 */
const getLegalCategoriesNiveau3 = () =>
  Object.keys(categoriesJuridiquesNiveau3).map((categorie) => ({
    value: categorie,
    label: `${categorie} - ${categoriesJuridiquesNiveau3[categorie]}`,
  }));

const getLegalCategoriesNiveau2 = () =>
  Object.keys(categoriesJuridiquesNiveau2).map((categorie) => ({
    value: categorie,
    label: `${categorie} - ${categoriesJuridiquesNiveau2[categorie]}`,
  }));

const getLegalCategoriesNiveau1 = () =>
  Object.keys(categoriesJuridiquesNiveau1).map((categorie) => ({
    value: categorie,
    label: `${categorie} - ${categoriesJuridiquesNiveau1[categorie]}`,
  }));

const todayString = new Date().toISOString().split("T")[0];

export default function Filters({
  setFilters,
  filters,
}: {
  setFilters: Dispatch<SetStateAction<ExtendedExportCsvInput>>;
  filters: ExtendedExportCsvInput;
}) {
  const toggleCategories = (value: "PME" | "ETI" | "GE") => {
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
            <Icon color={constants.colors.frBlue} slug="lightbulbFill">
              Filtrer par situation administrative
            </Icon>
          </h2>

          <h3>Par état administratif</h3>
          <div className="fr-fieldset__element">
            <div className="fr-radio-group">
              <input
                checked={filters.activity === "all"}
                id="activity-1"
                name="activity"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    activity: e.target.value as "all" | "active" | "ceased",
                  }))
                }
                type="radio"
                value="all"
              />
              <label htmlFor="activity-1">Tous</label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-radio-group">
              <input
                checked={filters.activity === "active"}
                id="activity-2"
                name="activity"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    activity: e.target.value as "all" | "active" | "ceased",
                  }))
                }
                type="radio"
                value="active"
              />
              <label htmlFor="activity-2">En activité uniquement</label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-radio-group">
              <input
                checked={filters.activity === "ceased"}
                id="activity-3"
                name="activity"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    activity: e.target.value as "all" | "active" | "ceased",
                  }))
                }
                type="radio"
                value="ceased"
              />
              <label htmlFor="activity-3">Cessé uniquement</label>
            </div>
          </div>

          <h3>Par type d‘établissement</h3>
          <div className="fr-checkbox-group">
            <input
              aria-describedby="checkboxes-1-messages"
              checked={filters.legalUnit === "hq"}
              id="legalUnit"
              name="legalUnit"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  legalUnit: e.target.checked ? "hq" : "all",
                }))
              }
              type="checkbox"
            />
            <label className="fr-label" htmlFor="legalUnit">
              Siège social uniquement
            </label>
            <div
              aria-live="assertive"
              className="fr-messages-group"
              id="checkboxes-1-messages"
            />
          </div>
        </section>

        <section className={styles.formSection}>
          <h2>
            <Icon color={constants.colors.frBlue} slug="groupFill">
              Filtrer par taille
            </Icon>
          </h2>
          <div className={styles.sizeSliderContainer}>
            <h3>
              <FAQLink tooltipLabel="Effectifs">
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
                    nous vous conseillons de ne pas intervenir sur l&apos;onglet
                    Effectif.
                  </div>
                </div>
              </FAQLink>
            </h3>
            <div className="fr-checkbox-group">
              <input
                checked={!filters.headcountEnabled}
                id="includeEmptyEffectif"
                name="includeEmptyEffectif"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    headcountEnabled: !e.target.checked,
                  }))
                }
                type="checkbox"
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
                    : "#e5e5e5",
                }}
              >
                {getEffectifLabel(0)}
              </span>
              <span
                style={{
                  color: filters.headcountEnabled
                    ? constants.colors.frBlue
                    : "#e5e5e5",
                }}
              >
                {getEffectifLabel(14)}
              </span>
            </div>
            <DualRangeSlider
              defaultValue={filters.headcount}
              disabledColor={!filters.headcountEnabled}
              idPrefix="headcount"
              label="Effectifs"
              max={14}
              min={0}
              onChange={(value: { min: number; max: number }) =>
                setFilters((prev) => ({
                  ...prev,
                  headcount: value,
                  headcountEnabled: true,
                }))
              }
              samePositionAllowed={true}
              step={1}
            />

            <div className={styles.sliderHeader}>
              <div className={styles.rangeDisplay}>
                {selectedEffectifLabel(filters)}
              </div>
            </div>
          </div>
          <div>
            <h3>
              <FAQLink tooltipLabel="Catégorie">
                <div>
                  <div>
                    La donnée n&apos;est pas renseignée pour bon nombre
                    d&apos;établissements. Les PME comprennent les TPE.
                  </div>
                </div>
              </FAQLink>
            </h3>
            <ul className="fr-tags-group">
              {categoriesEntreprisesOptions.map(({ label, value }) => (
                <li key={value}>
                  <button
                    aria-pressed={filters.categories.includes(value)}
                    className="fr-tag"
                    onClick={() => toggleCategories(value)}
                    type="button"
                  >
                    {label}
                  </button>
                </li>
              ))}

              <li>
                <button
                  aria-pressed={filters.categories.length === 0}
                  className="fr-tag"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: [],
                    }))
                  }
                  type="button"
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
            <Icon color={constants.colors.frBlue} slug="mapPinFill">
              Filtrer par{" "}
              <FAQLink tooltipLabel="localisation">
                <div>
                  En savoir plus sur le code officiel géographique sur{" "}
                  <a
                    href="https://www.insee.fr/fr/information/2560452"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    le site de l‘INSEE
                  </a>
                </div>
              </FAQLink>
            </Icon>
          </h2>
          <div className={styles.inputContainer}>
            <div className={styles.filterColumn}>
              <LocationFilter
                onSelect={(
                  type: "cp" | "dep" | "reg" | "insee",
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
            <Icon color={constants.colors.frBlue} slug="buildingFill">
              Filtrer par{" "}
              <FAQLink tooltipLabel="activité économique">
                <div>
                  En savoir plus sur les codes NAF/APE sur{" "}
                  <a
                    href="https://www.insee.fr/fr/information/2120875"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    le site de l‘INSEE
                  </a>
                </div>
              </FAQLink>
            </Icon>
          </h2>
          <div className={styles.inputContainer}>
            <div className={styles.filterColumn}>
              <label htmlFor="sap-multi-select">
                Domaine d‘activité (Section) :
              </label>
              <MultiSelect
                defaultValue={filters.sap}
                id="sap-multi-select"
                instanceId="sap-multi-select"
                menuPosition="fixed"
                name="sap"
                onChange={(values) => {
                  setFilters((prev) => ({
                    ...prev,
                    sap: values,
                  }));
                }}
                options={Object.keys(codesSectionNAF).map((code) => ({
                  value: code,
                  label: `${code} - ${codesSectionNAF[code]}`,
                }))}
                placeholder="Choisir un domaine d'activité"
              />
            </div>

            <div className={styles.filterColumn}>
              <label htmlFor="naf-multi-select">
                Code NAF/APE (Sous-classe) :
              </label>
              <MultiSelect
                defaultValue={filters.naf}
                id="naf-multi-select"
                instanceId="naf-multi-select"
                menuPosition="fixed"
                name="naf"
                onChange={(values) => {
                  setFilters((prev) => ({
                    ...prev,
                    naf: values,
                  }));
                }}
                options={Object.keys(codesNAFRev2).map((code) => ({
                  value: code,
                  label: `${code} - ${
                    codesNAFRev2[code as keyof typeof codesNAFRev2]
                  }`,
                }))}
                placeholder="Choisir un code NAF/APE"
              />
            </div>
          </div>
        </section>
      </div>

      <div>
        <section className={styles.formSection}>
          <h2>
            <Icon color={constants.colors.frBlue} slug="scaleFill">
              Filtrer par{" "}
              <FAQLink tooltipLabel="catégorie juridique">
                <div>
                  En savoir plus sur les catégories juridique sur{" "}
                  <a
                    href="https://www.insee.fr/fr/information/2028129"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    le site de l‘INSEE
                  </a>
                </div>
              </FAQLink>
            </Icon>
          </h2>
          <div className={styles.inputContainer}>
            <div className={styles.filterColumn}>
              <label htmlFor="nature-juridique-niveau-1-multi-select">
                Catégorie juridique (Niveau 1) :
              </label>
              <MultiSelect
                defaultValue={filters.legalCategoriesNiveau1}
                id="nature-juridique-niveau-1-multi-select"
                instanceId="nature-juridique-niveau-1-multi-select"
                menuPosition="fixed"
                name="nature_juridique"
                onChange={(values: string[]) =>
                  setFilters((prev) => ({
                    ...prev,
                    legalCategoriesNiveau1: values,
                  }))
                }
                options={getLegalCategoriesNiveau1()}
                placeholder="Choisir une catégorie juridique"
                value={filters.legalCategoriesNiveau1}
              />
            </div>

            <div className={styles.filterColumn}>
              <label htmlFor="nature-juridique-niveau-2-multi-select">
                Catégorie juridique (Niveau 2) :
              </label>
              <MultiSelect
                defaultValue={filters.legalCategoriesNiveau2}
                id="nature-juridique-niveau-2-multi-select"
                instanceId="nature-juridique-niveau-2-multi-select"
                menuPosition="fixed"
                name="nature_juridique"
                onChange={(values: string[]) =>
                  setFilters((prev) => ({
                    ...prev,
                    legalCategoriesNiveau2: values,
                  }))
                }
                options={getLegalCategoriesNiveau2()}
                placeholder="Choisir une catégorie juridique"
                value={filters.legalCategoriesNiveau2}
              />
            </div>

            <div className={styles.filterColumn}>
              <label htmlFor="nature-juridique-niveau-3-multi-select">
                Catégorie juridique (Niveau 3) :
              </label>
              <MultiSelect
                defaultValue={filters.legalCategoriesNiveau3}
                id="nature-juridique-niveau-3-multi-select"
                instanceId="nature-juridique-niveau-3-multi-select"
                menuPosition="fixed"
                name="nature_juridique"
                onChange={(values: string[]) =>
                  setFilters((prev) => ({
                    ...prev,
                    legalCategoriesNiveau3: values,
                  }))
                }
                options={getLegalCategoriesNiveau3()}
                placeholder="Choisir une catégorie juridique"
                value={filters.legalCategoriesNiveau3}
              />
            </div>

            <CategoriesJuridiquesFileInput
              onChangeCategoriesJuridiques={(params) => {
                setFilters((prev) => ({
                  ...prev,
                  ...params,
                }));
              }}
            />
          </div>
        </section>
      </div>

      <div className={styles.row}>
        <section className={styles.formSection}>
          <h2>
            <Icon color={constants.colors.frBlue} slug="awardFill">
              Filtrer par qualité
            </Icon>
          </h2>

          <div className={styles.inputContainer}>
            <div>
              <h3 style={{ marginTop: 0 }}>
                Appartenance au{" "}
                <FAQLink tooltipLabel="champ de l‘économie sociale et solidaire">
                  <div>
                    Pour plus d‘informations, consultez la{" "}
                    <a
                      href="/definitions/economie-sociale-et-solidaire-ess"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      définition de l‘ESS
                    </a>
                    .
                  </div>
                </FAQLink>
              </h3>
              <fieldset
                aria-labelledby="ess-legend ess-messages"
                className="fr-fieldset"
              >
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      checked={filters.ess?.inclure || false}
                      id="ess-inclure"
                      name="ess-inclure"
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
                      type="checkbox"
                    />
                    <label className="fr-label" htmlFor="ess-inclure">
                      Oui
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      checked={filters.ess?.inclureNo || false}
                      id="ess-inclure-no"
                      name="ess-inclure-no"
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
                      type="checkbox"
                    />
                    <label className="fr-label" htmlFor="ess-inclure-no">
                      Non
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      checked={filters.ess?.inclureNonRenseigne || false}
                      id="ess-inclure-non-renseigne"
                      name="ess-inclure-non-renseigne"
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
                      type="checkbox"
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

            <div>
              <h3 style={{ marginTop: 0 }}>
                Appartenance au{" "}
                <FAQLink tooltipLabel="champ des sociétés à mission">
                  <div>
                    Pour plus d‘informations, consultez la{" "}
                    <a
                      href="/definitions/societe-a-mission"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      définition de société à mission
                    </a>
                    .
                  </div>
                </FAQLink>
              </h3>
              <fieldset
                aria-labelledby="mission-legend mission-messages"
                className="fr-fieldset"
              >
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      checked={filters.mission?.inclure || false}
                      id="mission-inclure"
                      name="mission-inclure"
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
                      type="checkbox"
                    />
                    <label className="fr-label" htmlFor="mission-inclure">
                      Oui
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      checked={filters.mission?.inclureNo || false}
                      id="mission-inclure-no"
                      name="mission-inclure-no"
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
                      type="checkbox"
                    />
                    <label className="fr-label" htmlFor="mission-inclure-no">
                      Non
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      checked={filters.mission?.inclureNonRenseigne || false}
                      id="mission-inclure-non-renseigne"
                      name="mission-inclure-non-renseigne"
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
                      type="checkbox"
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
          <Icon color={constants.colors.frBlue} slug="calendarFill">
            Filtrer par date
          </Icon>
        </h2>
        <div className={styles.inputContainer}>
          <div>
            <h3 style={{ marginTop: 0 }}>
              <FAQLink tooltipLabel="Date de création">
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
              </FAQLink>
            </h3>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Depuis le</label>
              <input
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
                type="date"
              />
            </div>
            <div>
              <label className={styles.dateLabel}>Jusqu‘au</label>
              <input
                className={`fr-input ${styles.dateInput}`}
                defaultValue={filters.creationDate?.to}
                max={todayString}
                min={filters.creationDate?.from}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    creationDate: {
                      ...prev.creationDate,
                      to: (e.target as HTMLInputElement).value,
                    },
                  }))
                }
                type="date"
              />
            </div>
          </div>
          <div>
            <h3 style={{ marginTop: 0 }}>
              <FAQLink tooltipLabel="Date de mise à jour">
                <div>
                  <div>
                    Par défaut, il n‘y a pas de sélection sur la date de mise à
                    jour.
                  </div>
                  <div style={{ marginTop: 8 }}>
                    Vous pouvez obtenir tous les établissements dont la date de
                    dernière mise à jour est dans une période définie (ex:
                    Depuis le 14/10/2018 18:02:11 jusqu‘au 15/10/2018).
                  </div>
                  <div style={{ marginTop: 8 }}>
                    Si vous souhaitez obtenir une liste d‘unités légales, il
                    faut cocher &quot;Siège social uniquement&quot;.
                  </div>
                </div>
              </FAQLink>
            </h3>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Depuis le</label>
              <input
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
                type="date"
              />
            </div>
            <div>
              <label className={styles.dateLabel}>Jusqu‘au</label>
              <input
                className={`fr-input ${styles.dateInput}`}
                defaultValue={filters.updateDate?.to}
                max={todayString}
                min={filters.updateDate?.from}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    updateDate: {
                      ...prev.updateDate,
                      to: (e.target as HTMLInputElement).value,
                    },
                  }))
                }
                type="date"
              />
            </div>
          </div>
        </div>
      </section>

      <SiretFilter
        onSiretsAndSirensChange={(siretsAndSirens) =>
          setFilters((prev) => ({
            ...prev,
            siretsAndSirens,
          }))
        }
        siretsAndSirens={filters.siretsAndSirens || []}
      />
    </>
  );
}
