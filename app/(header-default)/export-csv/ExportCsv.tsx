'use client';

import { SireneSearchParams } from '#clients/sirene-fr';
import ButtonLink from '#components-ui/button';
import DualRangeSlider from '#components-ui/dual-range-slider';
import { Icon } from '#components-ui/icon/wrapper';
import { MultiChoice } from '#components-ui/multi-choice';
import { Select } from '#components-ui/select';
import TextWrapper from '#components-ui/text-wrapper';
import { useState } from 'react';
import styles from './styles.module.css';

export default function ExportCsv() {
  const [size, setSize] = useState({ min: 0, max: 14 });
  const [category, setCategory] = useState('PME');
  const [activity, setActivity] = useState<'all' | 'active' | 'ceased'>('all');
  const [legalUnit, setLegalUnit] = useState<'all' | 'hq'>('all');
  const [legalCategory, setLegalCategory] = useState('');
  const [naf, setNaf] = useState('');
  const [label, setLabel] = useState('');
  const [location, setLocation] = useState('');
  const [creationDate, setCreationDate] = useState({ from: '', to: '' });
  const [updateDate, setUpdateDate] = useState({ from: '', to: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EFFECTIF_STEPS = [
    { value: 0, label: '0 salarié', code: '00' },
    { value: 1, label: '1 ou 2 salariés', code: '01' },
    { value: 2, label: '3 à 5 salariés', code: '02' },
    { value: 3, label: '6 à 9 salariés', code: '03' },
    { value: 4, label: '10 à 19 salariés', code: '11' },
    { value: 5, label: '20 à 49 salariés', code: '12' },
    { value: 6, label: '50 à 99 salariés', code: '21' },
    { value: 7, label: '100 à 199 salariés', code: '22' },
    { value: 8, label: '200 à 249 salariés', code: '31' },
    { value: 9, label: '250 à 499 salariés', code: '32' },
    { value: 10, label: '500 à 999 salariés', code: '41' },
    { value: 11, label: '1 000 à 1 999 salariés', code: '42' },
    { value: 12, label: '2 000 à 4 999 salariés', code: '51' },
    { value: 13, label: '5 000 à 9 999 salariés', code: '52' },
    { value: 14, label: '10 000 salariés et plus', code: '53' },
  ];

  const getEffectifLabel = (value: number) => {
    return EFFECTIF_STEPS[value]?.label || '';
  };

  const getEffectifCode = (value: number) => {
    return EFFECTIF_STEPS[value]?.code || '00';
  };

  const buildQuery = (): SireneSearchParams => ({
    size: {
      min: parseInt(getEffectifCode(size.min)),
      max: parseInt(getEffectifCode(size.max)),
    },
    category: category as 'PME' | 'ETI' | 'GE',
    activity,
    legalUnit,
    legalCategory,
    naf,
    label,
    location,
    creationDate,
    updateDate,
  });

  const legalOptions = [
    { value: '', label: 'Sélectionner une option' },
    { value: 'sa', label: 'Société Anonyme' },
    { value: 'sarl', label: 'SARL' },
  ];
  const nafOptions = [
    { value: '', label: 'Sélectionner une option' },
    { value: '6201Z', label: 'Programmation informatique' },
    { value: '7022Z', label: 'Conseil pour les affaires' },
  ];
  const labelOptions = [
    { value: '', label: 'Sélectionner une option' },
    { value: 'label1', label: 'Label 1' },
    { value: 'label2', label: 'Label 2' },
  ];
  const locationOptions = [
    { value: '', label: 'Sélectionner une option' },
    { value: 'paris', label: 'Paris' },
    { value: 'lyon', label: 'Lyon' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const query = buildQuery();
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      // Créer un blob à partir de la réponse
      const blob = await response.blob();

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export-sirene.csv';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TextWrapper>
        <h1>Choisissez vos options pour générer une liste CSV</h1>
      </TextWrapper>
      <form onSubmit={handleSubmit}>
        {/* First row: Situation administrative + Taille */}
        <div className={styles.firstRow}>
          {/* Filtrer par situation administrative */}
          <section className={styles.section}>
            <h2>
              Filtrer par situation administrative <Icon slug="lightbulbFill" />
            </h2>

            {/* Par activité */}
            <h3 className={styles.subsectionTitle}>Par activité</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="activity"
                  value="all"
                  checked={activity === 'all'}
                  onChange={(e) =>
                    setActivity(e.target.value as 'all' | 'active' | 'ceased')
                  }
                />
                Tous
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="activity"
                  value="active"
                  checked={activity === 'active'}
                  onChange={(e) =>
                    setActivity(e.target.value as 'all' | 'active' | 'ceased')
                  }
                />
                Ouvert uniquement
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="activity"
                  value="ceased"
                  checked={activity === 'ceased'}
                  onChange={(e) =>
                    setActivity(e.target.value as 'all' | 'active' | 'ceased')
                  }
                />
                Fermé uniquement
              </label>
            </div>

            {/* Par type d'unité légale */}
            <h3 className={styles.subsectionTitle}>
              Par type d&apos;unité légale
            </h3>
            <div className={styles.radioGroupNormal}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="legalUnit"
                  value="all"
                  checked={legalUnit === 'all'}
                  onChange={(e) => setLegalUnit(e.target.value as 'all' | 'hq')}
                />
                Tous
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="legalUnit"
                  value="hq"
                  checked={legalUnit === 'hq'}
                  onChange={(e) => setLegalUnit(e.target.value as 'all' | 'hq')}
                />
                Siège social uniquement
              </label>
            </div>
          </section>

          {/* Filtrer par taille */}
          <section className={styles.section}>
            <h2>
              Filtrer par taille <Icon slug="groupFill" />
            </h2>
            <div className={styles.sizeSliderContainer}>
              <label>Effectifs</label>
              <DualRangeSlider
                idPrefix="size"
                label="Effectifs"
                min={0}
                max={14}
                step={1}
                value={size}
                onChange={setSize}
                color="#000091"
              />
              <div className={styles.effectifLabels}>
                <span>{getEffectifLabel(size.min)}</span>
                <span>{getEffectifLabel(size.max)}</span>
              </div>
            </div>
            <div>
              <label>Catégorie</label>
              <MultiChoice
                idPrefix="cat"
                name="category"
                values={[
                  {
                    label: 'Petite et Moyenne Entreprise',
                    value: 'PME',
                    onClick: () => setCategory('PME'),
                    checked: category === 'PME',
                  },
                  {
                    label: 'Entreprise de Taille Intermédiaire',
                    value: 'ETI',
                    onClick: () => setCategory('ETI'),
                    checked: category === 'ETI',
                  },
                  {
                    label: 'Grande Entreprise',
                    value: 'GE',
                    onClick: () => setCategory('GE'),
                    checked: category === 'GE',
                  },
                ]}
              />
            </div>
          </section>
        </div>

        {/* Second row: Localisation + Type de structure */}
        <div className={styles.secondRow}>
          <section className={styles.section}>
            <h2>
              Filtrer par localisation <Icon slug="mapPinFill" />
            </h2>
            <Select
              label="Région et département"
              name="region"
              options={locationOptions}
              defaultValue={location}
              onChange={(e) =>
                setLocation((e.target as HTMLInputElement).value)
              }
            />

            <Select
              label="Commune"
              name="commune"
              options={locationOptions}
              defaultValue={location}
              onChange={(e) =>
                setLocation((e.target as HTMLInputElement).value)
              }
            />
          </section>

          <section className={styles.section}>
            <h2>
              Filtrer par type de structure <Icon slug="buildingFill" />
            </h2>
            <div className={styles.structureSelects}>
              <Select
                label="Catégorie juridique"
                name="legalCategory"
                options={legalOptions}
                defaultValue={legalCategory}
                onChange={(e) =>
                  setLegalCategory((e.target as HTMLInputElement).value)
                }
              />
              <Select
                label="Code NAF / APE"
                name="naf"
                options={nafOptions}
                defaultValue={naf}
                onChange={(e) => setNaf((e.target as HTMLInputElement).value)}
              />
              <Select
                label="Label ou certificat"
                name="label"
                options={labelOptions}
                defaultValue={label}
                onChange={(e) => setLabel((e.target as HTMLInputElement).value)}
              />
            </div>
          </section>
        </div>

        {/* Filtres par date */}
        <section className={styles.formSection}>
          <h2>
            Filtrer par date <Icon slug="calendarFill" />
          </h2>
          <div className={styles.dateContainer}>
            <div className={styles.dateColumn}>
              <h3 className={styles.subsectionTitle}>Date de création</h3>
              <div className={styles.dateGroup}>
                <label className={styles.dateLabel}>Depuis le</label>
                <input
                  type="date"
                  className={`fr-input ${styles.dateInput}`}
                  value={creationDate.from}
                  onChange={(e) =>
                    setCreationDate((d) => ({
                      ...d,
                      from: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
              <div>
                <label className={styles.dateLabel}>Jusqu&apos;au</label>
                <input
                  type="date"
                  className={`fr-input ${styles.dateInput}`}
                  value={creationDate.to}
                  onChange={(e) =>
                    setCreationDate((d) => ({
                      ...d,
                      to: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
            </div>
            <div className={styles.dateColumn}>
              <h3 className={styles.subsectionTitle}>Date de mise à jour</h3>
              <div className={styles.dateGroup}>
                <label className={styles.dateLabel}>Depuis le</label>
                <input
                  type="date"
                  className={`fr-input ${styles.dateInput}`}
                  value={updateDate.from}
                  onChange={(e) =>
                    setUpdateDate((d) => ({
                      ...d,
                      from: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
              <div>
                <label className={styles.dateLabel}>Jusqu&apos;au</label>
                <input
                  type="date"
                  className={`fr-input ${styles.dateInput}`}
                  value={updateDate.to}
                  onChange={(e) =>
                    setUpdateDate((d) => ({
                      ...d,
                      to: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bouton d'action */}
        <div className={styles.buttonContainer}>
          <ButtonLink type="submit" disabled={isLoading}>
            {isLoading ? 'Recherche en cours...' : 'Générer le fichier'}
          </ButtonLink>
        </div>

        {/* Affichage des erreurs */}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>
    </div>
  );
}
