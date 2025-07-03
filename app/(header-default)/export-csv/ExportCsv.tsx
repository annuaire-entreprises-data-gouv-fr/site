'use client';

import ButtonLink from '#components-ui/button';
import { formatDate, formatNumber } from '#utils/helpers';
import { ExportCsvInput } from 'app/api/export-csv/input-validation';
import { useState } from 'react';
import { getEffectifCode } from './constants';
import Filters from './Filters';
import FiltersSummary from './FiltersSummary';
import styles from './styles.module.css';

export interface ExtendedExportCsvInput extends ExportCsvInput {
  headcount: { min: number; max: number };
  categories: ('PME' | 'ETI' | 'GE')[];
  headcountEnabled: boolean;
  locations: Array<{
    type: 'cp' | 'dep' | 'reg' | 'insee';
    value: string;
    label: string;
  }>;
}

const getFileSize = (count: number) => {
  return Math.ceil((count * 300) / 1000);
};

const defaultFilters: ExtendedExportCsvInput = {
  headcount: { min: 0, max: 14 },
  headcountEnabled: false,
  categories: [],
  activity: 'active',
  legalUnit: 'all',
  locations: [],
  creationDate: { from: undefined, to: undefined },
  updateDate: { from: undefined, to: undefined },
};

export default function ExportCsv() {
  const [filters, setFilters] =
    useState<ExtendedExportCsvInput>(defaultFilters);
  const [filename, setFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countResult, setCountResult] = useState<{
    count: number;
    filters: ExportCsvInput;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setShowResults(false);
    setCountResult(null);
    setError(null);
    setIsLoading(false);
    setIsCountLoading(false);
  };

  const modifyFilters = () => {
    setShowResults(false);
    setCountResult(null);
    setError(null);
    setIsLoading(false);
    setIsCountLoading(false);
  };

  const buildQuery = (): ExportCsvInput => ({
    ...(filters.headcountEnabled && {
      headcount: {
        min: parseInt(getEffectifCode(filters.headcount.min)),
        max: parseInt(getEffectifCode(filters.headcount.max)),
      },
    }),
    categories: filters.categories as ('PME' | 'ETI' | 'GE')[],
    activity: filters.activity,
    legalUnit: filters.legalUnit,
    location: {
      codesPostaux: filters.locations
        .filter((loc) => loc.type === 'cp')
        .map((loc) => loc.value),
      codesInsee: filters.locations
        .filter((loc) => loc.type === 'insee')
        .map((loc) => loc.value),
      departments: filters.locations
        .filter((loc) => loc.type === 'dep')
        .map((loc) => loc.value),
      regions: filters.locations
        .filter((loc) => loc.type === 'reg')
        .map((loc) => loc.value),
    },
    creationDate: {
      from: filters.creationDate?.from || undefined,
      to: filters.creationDate?.to || undefined,
    },
    updateDate: {
      from: filters.updateDate?.from || undefined,
      to: filters.updateDate?.to || undefined,
    },
  });

  const handleCountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCountLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const query = buildQuery();
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...query, count: true }),
      });

      const body = await response.json();

      if (body.error) {
        throw new Error(
          body.error || 'Une erreur est survenue, veuillez réessayer plus tard'
        );
      }

      setCountResult({ count: body.count, filters: query });
      setFilename(
        `annuaire-des-entreprises-etablissements-${formatDate(new Date())}.csv`
      );
      setShowResults(true);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue, veuillez réessayer plus tard'
      );
    } finally {
      setIsCountLoading(false);
    }
  };

  const handleCsvExport = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!countResult || !filename) return;

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

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const body = await response.json();
        if (body.error) {
          throw new Error(
            body.error ||
              'Une erreur est survenue, veuillez réessayer plus tard'
          );
        }
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue, veuillez réessayer plus tard'
      );
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
          La recherche par raison sociale ou par nom de dirigeant n‘est pas
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
      </form>
      {error && <div className={styles.errorMessage}>{error}</div>}
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
          Le nombre de résultats ({formatNumber(countResult.count)}) dépasse la
          limite autorisée de 200 000. Veuillez affiner vos critères de
          recherche pour réduire le nombre de résultats.
        </div>
      ) : countResult.count === 0 ? (
        <div className={styles.fileDownloadSection}>
          Vos critères de recherche ne correspondent à aucun établissement.
          Veuillez élargir vos critères de recherche pour obtenir un résultat.
        </div>
      ) : (
        <div className={styles.fileDownloadSection}>
          <div>
            {isLoading ? (
              'Export en cours...'
            ) : (
              <a
                className="fr-link fr-link--download"
                href="#"
                onClick={handleCsvExport}
              >
                {filename}
                <span className="fr-link__detail">
                  CSV - Environ {formatNumber(getFileSize(countResult.count))}{' '}
                  Ko
                </span>
              </a>
            )}
          </div>
        </div>
      )}

      <div className={styles.exportActions}>
        <ButtonLink type="button" alt={true} onClick={resetFilters}>
          Réinitialiser
        </ButtonLink>
        <ButtonLink type="button" alt={true} onClick={modifyFilters}>
          Modifier votre recherche
        </ButtonLink>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
