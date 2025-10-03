"use client";

import type { ExportCsvInput } from "app/api/export-sirene/input-validation";
import { useState } from "react";
import ButtonLink from "#components-ui/button";
import { formatDate, formatNumber } from "#utils/helpers";
import { getEffectifCode } from "./constants";
import Filters from "./filters";
import FiltersSummary from "./filters-summary";
import InfoSection from "./info-section";
import styles from "./styles.module.css";

export interface ExtendedExportCsvInput extends ExportCsvInput {
  headcount: { min: number; max: number };
  categories: ("PME" | "ETI" | "GE")[];
  headcountEnabled: boolean;
  locations: Array<{
    type: "cp" | "dep" | "reg" | "insee";
    value: string;
    label: string;
  }>;
  legalCategoriesNiveau1: string[];
  legalCategoriesNiveau2: string[];
  legalCategoriesNiveau3: string[];
}

const getFileSize = (count: number) => Math.ceil((count * 300) / 1000);

const defaultFilters: ExtendedExportCsvInput = {
  headcount: { min: 0, max: 14 },
  headcountEnabled: false,
  categories: [],
  activity: "active",
  legalUnit: "all",
  locations: [],
  creationDate: { from: undefined, to: undefined },
  updateDate: { from: undefined, to: undefined },
  legalCategoriesNiveau1: [],
  legalCategoriesNiveau2: [],
  legalCategoriesNiveau3: [],
  ess: {
    inclure: true,
    inclureNo: true,
    inclureNonRenseigne: true,
  },
  mission: {
    inclure: true,
    inclureNo: true,
    inclureNonRenseigne: true,
  },
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
        min: Number.parseInt(getEffectifCode(filters.headcount.min)),
        max: Number.parseInt(getEffectifCode(filters.headcount.max)),
      },
    }),
    categories: filters.categories as ("PME" | "ETI" | "GE")[],
    activity: filters.activity,
    legalUnit: filters.legalUnit,
    legalCategories: [
      ...filters.legalCategoriesNiveau1.map((cat) => cat + "*"),
      ...filters.legalCategoriesNiveau2.map((cat) => cat + "*"),
      ...filters.legalCategoriesNiveau3,
    ],
    siretsAndSirens: filters.siretsAndSirens,
    location: {
      codesPostaux: filters.locations
        .filter((loc) => loc.type === "cp")
        .map((loc) => loc.value),
      codesInsee: filters.locations
        .filter((loc) => loc.type === "insee")
        .map((loc) => loc.value),
      departments: filters.locations
        .filter((loc) => loc.type === "dep")
        .map((loc) => loc.value),
      regions: filters.locations
        .filter((loc) => loc.type === "reg")
        .map((loc) => loc.value),
    },
    naf: filters.naf,
    sap: filters.sap,
    ess: filters.ess,
    mission: filters.mission,
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
      const response = await fetch("/api/export-sirene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...query, count: true }),
      });

      const body = await response.json();

      if (body.error) {
        throw new Error(
          body.error || "Une erreur est survenue, veuillez réessayer plus tard"
        );
      }

      setCountResult({ count: body.count, filters: query });
      setFilename(
        `annuaire-des-entreprises-etablissements-${formatDate(new Date())}.csv`
      );
      setShowResults(true);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue, veuillez réessayer plus tard"
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
      const response = await fetch("/api/export-sirene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });

      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        const body = await response.json();
        if (body.error) {
          throw new Error(
            body.error ||
              "Une erreur est survenue, veuillez réessayer plus tard"
          );
        }
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
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
          : "Une erreur est survenue, veuillez réessayer plus tard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return !showResults || !countResult ? (
    <div className={styles.exportCsv}>
      <h1>
        Générez une liste d’établissements au format CSV à partir des données du
        répertoire Sirene
      </h1>
      <InfoSection />
      <form onSubmit={handleCountSubmit}>
        <Filters filters={filters} setFilters={setFilters} />
        <div className={styles.buttonContainer}>
          <ButtonLink alt={true} onClick={resetFilters} type="button">
            Réinitialiser les critères
          </ButtonLink>
          <ButtonLink disabled={isCountLoading} type="submit">
            {isCountLoading ? "Calcul en cours..." : "Calculer les résultats"}
          </ButtonLink>
        </div>
      </form>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  ) : (
    <div>
      <h1 className={styles.title}>Résultats de votre recherche</h1>
      <p>
        Votre recherche donne{" "}
        {Intl.NumberFormat("fr-FR").format(countResult.count)} résultats
      </p>
      <FiltersSummary filters={filters} />

      {countResult.count >= 200_000 ? (
        <div className={styles.fileDownloadSection}>
          Le nombre de résultats ({formatNumber(countResult.count)}) dépasse la
          limite autorisée de 200 000. Veuillez affiner vos critères de
          recherche pour réduire le nombre de résultats.
          <br />
          <br />
          Vous pouvez aussi directement utiliser{" "}
          <a
            href="https://www.data.gouv.fr/dataservices/api-sirene-open-data/"
            rel="noopener"
            target="_blank"
          >
            l‘API Sirene
          </a>{" "}
          ou télécharger la base complète sur{" "}
          <a
            href="https://www.data.gouv.fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/"
            rel="noopener"
            target="_blank"
          >
            data.gouv.fr
          </a>
          .
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
              "Export en cours..."
            ) : (
              <a
                className="fr-link fr-link--download"
                href="#"
                onClick={handleCsvExport}
              >
                {filename}
                <span className="fr-link__detail">
                  CSV - Environ {formatNumber(getFileSize(countResult.count))}{" "}
                  Ko
                </span>
              </a>
            )}
          </div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <ButtonLink alt={true} onClick={resetFilters} type="button">
          Réinitialiser les critères
        </ButtonLink>
        <ButtonLink
          alt={countResult.count < 200_000 && countResult.count !== 0}
          onClick={modifyFilters}
          type="button"
        >
          Modifier votre recherche
        </ButtonLink>
        {countResult.count < 200_000 && countResult.count !== 0 ? (
          <ButtonLink onClick={handleCsvExport} type="button">
            Télécharger le fichier
          </ButtonLink>
        ) : null}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
