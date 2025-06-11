'use client';

import { SireneSearchParams } from '#clients/sirene-insee/export-csv';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { formatDate } from '#utils/helpers';
import { useState } from 'react';
import { getEffectifCode } from './constants';
import Filters from './Filters';
import FiltersSummary from './FiltersSummary';
import styles from './styles.module.css';

export interface ExtendedSireneSearchParams extends SireneSearchParams {
  headcount: { min: number; max: number };
  categories: ('PME' | 'ETI' | 'GE')[];
  headcountEnabled: boolean;
  categoriesEnabled: boolean;
}

const getFileSize = (count: number) => {
  return Math.ceil((count * 300) / 1000);
};

export default function ExportCsv() {
  const [filters, setFilters] = useState<ExtendedSireneSearchParams>({
    headcount: { min: 0, max: 14 },
    headcountEnabled: false,
    categories: ['PME', 'ETI', 'GE'],
    categoriesEnabled: false,
    activity: 'active',
    legalUnit: 'all',
    creationDate: { from: '', to: '' },
    updateDate: { from: '', to: '' },
  });
  const [filename, setFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countResult, setCountResult] = useState<{
    count: number;
    filters: any;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);

  const resetFilters = () => {
    setFilters({
      headcount: { min: 0, max: 14 },
      headcountEnabled: false,
      categories: [],
      categoriesEnabled: false,
      activity: 'active',
      legalUnit: 'all',
      creationDate: { from: '', to: '' },
      updateDate: { from: '', to: '' },
    });
    setShowResults(false);
    setCountResult(null);
    setError(null);
    setIsLoading(false);
    setIsCountLoading(false);
  };

  const buildQuery = (): SireneSearchParams => ({
    ...(filters.headcountEnabled && {
      headcount: {
        min: parseInt(getEffectifCode(filters.headcount.min)),
        max: parseInt(getEffectifCode(filters.headcount.max)),
      },
    }),
    ...(filters.categoriesEnabled && {
      categories: filters.categories as ('PME' | 'ETI' | 'GE')[],
    }),
    activity: filters.activity,
    legalUnit: filters.legalUnit,
    legalCategory: filters.legalCategory,
    naf: filters.naf,
    label: filters.label,
    location: filters.location,
    creationDate: filters.creationDate,
    updateDate: filters.updateDate,
  });

  const handleCountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCountLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const query = buildQuery();
      const response = await fetch('/api/export-csv-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      const result = await response.json();

      if (result.errorType) {
        throw new Error('Erreur lors du calcul');
      }

      setCountResult({ count: result.count, filters: query });
      setFilename(
        `annuaire-des-entreprises-etablissements-${formatDate(new Date())}.csv`
      );
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsCountLoading(false);
    }
  };

  const handleCsvExport = async () => {
    if (!countResult || !filename) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countResult.filters),
      });

      const result = await response.json();

      if (result.errorType) {
        throw new Error('Erreur lors de l‘export');
      }

      // Créer un blob à partir de la réponse
      const blob = await response.blob();

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
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

  return !showResults || !countResult ? (
    <div>
      <h1 className={styles.title}>
        Choisissez vos options pour générer une liste CSV
      </h1>
      <div className={styles.infoSection}>
        <div>
          💡 Utilisez plusieurs filtres pour affiner votre recherche et générer
          une liste personnalisée. Vous pourrez ensuite exporter les résultats
          au format CSV.
        </div>
        <div>
          La recherche par raison sociale ou par nom de dirigeant n&apos;est pas
          disponible.
        </div>
      </div>
      <form onSubmit={handleCountSubmit}>
        <Filters filters={filters} setFilters={setFilters} />
        <div className={styles.buttonContainer}>
          <ButtonLink type="submit" disabled={isCountLoading}>
            {isCountLoading ? 'Calcul en cours...' : 'Calculer les résultats'}
          </ButtonLink>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>
    </div>
  ) : (
    <div>
      <h1 className={styles.title}>Résultats de votre recherche</h1>
      <p>
        Votre recherche donne{' '}
        {Intl.NumberFormat('fr-FR').format(countResult.count)} résultats
      </p>
      <FiltersSummary filters={filters} />

      {countResult.count >= 200000 ? (
        <div className={styles.fileDownloadSection}>
          Le nombre de résultats (
          {Intl.NumberFormat('fr-FR').format(countResult.count)}) dépasse la
          limite autorisée de 200 000. Veuillez affiner vos critères de
          recherche pour réduire le nombre de résultats.
        </div>
      ) : (
        <div className={styles.fileDownloadSection}>
          <div className={styles.fileInfo}>
            {isLoading ? (
              'Export en cours...'
            ) : (
              <div className={styles.fileName} onClick={handleCsvExport}>
                <span>{filename}</span>
                <Icon slug="download" />
              </div>
            )}
            <div className={styles.fileSize}>
              CSV - Environ{' '}
              {Intl.NumberFormat('fr-FR').format(
                getFileSize(countResult.count)
              )}{' '}
              Ko
            </div>
          </div>
        </div>
      )}

      <div className={styles.exportActions}>
        <ButtonLink alt={true} onClick={resetFilters}>
          Annuler
        </ButtonLink>
        <ButtonLink alt={true} onClick={() => setShowResults(false)}>
          Modifier votre recherche
        </ButtonLink>
      </div>
    </div>
  );
}
