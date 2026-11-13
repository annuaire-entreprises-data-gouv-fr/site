import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Link } from "#/components/link";
import UniteLegaleBadge from "#/components/unite-legale-badge";
import { Loader } from "#/components-ui/loader";
import { getUniteLegaleFromSirenFn } from "#/server-functions/public/unite-legale";
import { isSiren } from "#/utils/helpers";
import { HidePersonalDataOptions } from "./options";
import styles from "./styles.module.css";

const SIREN_INPUT_ID = "hide-personal-data-siren-input";
const SIREN_MESSAGES_ID = "hide-personal-data-siren-messages";

export function HidePersonalDataModalContent() {
  const [siren, setSiren] = useState("");
  const [submittedSiren, setSubmittedSiren] = useState<string | null>(null);
  const [hasFormatError, setHasFormatError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const getUniteLegaleFromSiren = useServerFn(getUniteLegaleFromSirenFn);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const {
    data: uniteLegale,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["hide-personal-data-unite-legale", submittedSiren],
    queryFn: () =>
      getUniteLegaleFromSiren({ data: { siren: submittedSiren ?? "" } }),
    enabled: !!submittedSiren,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedSiren = siren.replace(/\s/g, "");

    if (!isSiren(cleanedSiren)) {
      setHasFormatError(true);
      setSubmittedSiren(null);
      return;
    }

    setHasFormatError(false);
    if (cleanedSiren === submittedSiren) {
      refetch();
    } else {
      setSubmittedSiren(cleanedSiren);
    }
  };

  let errorMessage: string | null = null;
  if (hasFormatError) {
    errorMessage =
      "Le numéro renseigné n’est pas un SIREN valide. Un numéro SIREN est composé de 9 chiffres.";
  } else if (!isFetching && isError) {
    errorMessage =
      "Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.";
  } else if (!isFetching && uniteLegale === null) {
    errorMessage = "Aucune structure n’a été trouvée pour ce numéro SIREN.";
  }

  return (
    <>
      <h2 className={styles.modalTitle}>
        Je m’oppose au traitement de mes données personnelles
      </h2>
      <form onSubmit={handleSubmit}>
        <div
          className={clsx(
            "fr-input-group",
            errorMessage && "fr-input-group--error"
          )}
        >
          <label className="fr-label" htmlFor={SIREN_INPUT_ID}>
            Entrez le numéro SIREN de votre structure
          </label>
          <div className={clsx("fr-search-bar", styles.searchBar)}>
            <input
              aria-describedby={SIREN_MESSAGES_ID}
              aria-invalid={!!errorMessage}
              autoComplete="off"
              className={clsx("fr-input", errorMessage && "fr-input--error")}
              id={SIREN_INPUT_ID}
              inputMode="numeric"
              name="siren"
              onChange={(event) => setSiren(event.target.value)}
              placeholder="votre numéro de SIREN"
              ref={inputRef}
              type="search"
              value={siren}
            />
            <button
              className="fr-btn"
              disabled={isFetching}
              title="Rechercher"
              type="submit"
            >
              Rechercher
            </button>
          </div>
          <div
            aria-live="polite"
            className="fr-messages-group"
            id={SIREN_MESSAGES_ID}
          >
            {errorMessage && <p className="fr-error-text">{errorMessage}</p>}
          </div>
        </div>
      </form>

      {isFetching && (
        <p className={styles.loading}>
          Recherche en cours <Loader />
        </p>
      )}

      {!isFetching && uniteLegale && (
        <>
          <div className={styles.card}>
            <Link
              className={styles.cardTitle}
              params={{ slug: uniteLegale.chemin }}
              rel="noopener noreferrer"
              target="_blank"
              title={`${uniteLegale.nomComplet} - nouvelle fenêtre`}
              to="/entreprise/$slug"
            >
              {uniteLegale.nomComplet}
            </Link>
            <div className={styles.cardBadges}>
              <UniteLegaleBadge small uniteLegale={uniteLegale} />
            </div>
          </div>
          <HidePersonalDataOptions
            key={uniteLegale.siren}
            uniteLegale={uniteLegale}
          />
        </>
      )}
    </>
  );
}
