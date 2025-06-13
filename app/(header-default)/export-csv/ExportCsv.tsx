'use client';

import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { formatDate } from '#utils/helpers';
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
    filters: any;
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
          'Une erreur est survenue, veuillez réessayer plus tard'
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

      const body = await response.json();

      if (body.error) {
        throw new Error(
          'Une erreur est survenue, veuillez réessayer plus tard'
        );
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
        <ButtonLink type="button" alt={true} onClick={resetFilters}>
          Annuler
        </ButtonLink>
        <ButtonLink
          type="button"
          alt={true}
          onClick={() => setShowResults(false)}
        >
          Modifier votre recherche
        </ButtonLink>
      </div>
    </div>
  );
}
