import clsx from "clsx";
import {
  type KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { IGeoElement } from "#/clients/geo";
import { Info, Warning } from "#/components-ui/alerts";
import FloatingModal from "#/components-ui/floating-modal";
import { Loader } from "#/components-ui/loader";
import { useStorage } from "#/hooks";
import { isAPI404, isAPINotResponding } from "#/models/api-not-responding";
import { searchGeoElementByText } from "#/models/geo";
import {
  buildSearchQuery,
  type IParams,
} from "#/models/search/search-filter-params";
import { debounce } from "#/utils/helpers/debounce";
import styles from "./style.module.css";

const Issue = {
  NONE: 2,
  NORESULT: 0,
  ERROR: 1,
} as const;
type Issue = (typeof Issue)[keyof typeof Issue];

export const FilterGeoVariationA: React.FC<{
  searchParams: IParams;
  searchTerm: string;
  cp_dep?: string;
  cp_dep_label?: string;
  cp_dep_type?: string;
}> = ({
  searchParams,
  searchTerm: pageSearchTerm,
  cp_dep = "",
  cp_dep_label = "",
  cp_dep_type = "",
}) => {
  const clearFilterLink = buildSearchQuery(pageSearchTerm, searchParams, [
    "cp_dep",
    "cp_dep_label",
    "cp_dep_type",
  ]);

  const [labelDep, setLabelDep] = useState(cp_dep_label);
  const [dep, setDep] = useState(cp_dep);
  const [typeDep, setTypeDep] = useState(cp_dep_type);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [issue, setIssue] = useState<Issue>(Issue.NONE);
  const [searchTerm, setSearchTerm] = useState(cp_dep_label);
  const [isLoading, setLoading] = useState(false);
  const [geoSuggests, setGeoSuggests] = useState<IGeoElement[]>([]);

  const [suggestsHistory, setSuggestsHistory] = useStorage(
    "local",
    "geo-search-history-4",
    []
  );
  const [showSuggestsHistory, setShowSuggestsHistory] = useState(false);

  const search = useCallback(
    debounce(async (term: string) => {
      setLoading(true);
      try {
        const result = await searchGeoElementByText(term);

        if (isAPI404(result)) {
          setIssue(Issue.NORESULT);
        } else if (isAPINotResponding(result)) {
          setIssue(Issue.ERROR);
        } else {
          setGeoSuggests(result);
          if (result.length === 0) {
            setIssue(Issue.NORESULT);
          }
        }
      } catch (e: any) {
        setIssue(e?.status === 404 ? Issue.NORESULT : Issue.ERROR);
      } finally {
        setLoading(false);
      }
    }),
    []
  );

  const selectDep = ({ label, value, type }: IGeoElement) => {
    setDep(value);
    setLabelDep(label);
    setTypeDep(type);
    setGeoSuggests([]);
    setSearchTerm(label);
    saveSuggestsHistory({ label, value, type });
    setOpen(false);
  };

  const saveSuggestsHistory = ({ label, value, type }: IGeoElement) => {
    try {
      const newSuggestHistory = [
        { label, value, type },
        ...suggestsHistory.filter((s: IGeoElement) => s.value !== value),
      ];

      setSuggestsHistory(newSuggestHistory.slice(0, 4));
    } catch {
      // Suggest history is optional and should not block geo search.
    }
  };

  const onChange = (inputElement: any) => {
    console.log("onChange", inputElement.target.value);
    setSearchTerm(inputElement.target.value);
  };

  const onKeyDown: KeyboardEventHandler = (event) => {
    // select first entry and submit
    if (event.keyCode === 13) {
      if (searchTerm === labelDep) {
        return;
      }

      event.preventDefault();

      if (geoSuggests && geoSuggests.length > 0) {
        selectDep(geoSuggests[0]);
      } else if (
        showSuggestsHistory &&
        suggestsHistory &&
        suggestsHistory.length > 0
      ) {
        selectDep(suggestsHistory[0]);
      }
    }
  };

  useEffect(() => {
    setIssue(Issue.NONE);
    if (!searchTerm || searchTerm === labelDep) {
      setGeoSuggests([]);
      // in case of remaining pending requests
      setLoading(false);

      if (!searchTerm) {
        setDep("");
        setLabelDep("");
        setTypeDep("");
      }
      return;
    }
    search(searchTerm);
  }, [searchTerm, labelDep, search]);

  // only show suggest history on browser to avoid rehydration conflict with server rendered html
  useEffect(() => setShowSuggestsHistory(true), []);

  // close the modal only when clicking outside of the input + modal group
  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className={styles.filterGeoVariationAContainer} ref={containerRef}>
      <div className="fr-search-bar">
        <input
          autoComplete="off"
          className={styles.filterGeoVariationAInput}
          id="geo-search-input"
          onChange={onChange}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Ville, département ou région"
          value={searchTerm}
        />
        <button
          className={clsx("fr-btn", styles.filterGeoVariationASearchButton)}
          title="Rechercher"
          type="submit"
          value="submit"
        />
      </div>
      <input name="cp_dep_label" readOnly type="hidden" value={labelDep} />
      <input name="cp_dep_type" readOnly type="hidden" value={typeDep} />
      <input name="cp_dep" readOnly type="hidden" value={dep} />
      <FloatingModal
        aria-label="Sélection de la localisation"
        aria-modal={false}
        className={styles.filterGeoVariationAModalContainer}
        style={{ display: open ? "block" : "none" }}
      >
        {issue === Issue.NONE ? (
          <>
            {geoSuggests.length === 0 && !!searchTerm && (
              <a
                className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
                href={clearFilterLink}
              >
                Effacer la recherche
              </a>
            )}
            {showSuggestsHistory &&
              !searchTerm &&
              geoSuggests.length === 0 &&
              suggestsHistory.length > 0 && (
                <div className="drop-down">
                  <strong>Localisations récentes :</strong>
                  {suggestsHistory.map((suggest: IGeoElement) => (
                    <button
                      className="suggest cursor-pointer"
                      key={`suggest-history-${suggest.label}`}
                      onClick={() => selectDep(suggest)}
                      type="button"
                    >
                      {suggest.label}
                    </button>
                  ))}
                </div>
              )}
            <div className="drop-down">
              {isLoading ? (
                <div className="layout-center">
                  <Loader />
                </div>
              ) : (
                geoSuggests.map((suggest: IGeoElement) => (
                  <button
                    className="suggest cursor-pointer"
                    key={suggest.label}
                    onClick={() => selectDep(suggest)}
                    type="button"
                  >
                    {suggest.label}
                  </button>
                ))
              )}
            </div>
          </>
        ) : issue === Issue.NORESULT ? (
          <Info>Aucun résultat ne correspond à votre recherche.</Info>
        ) : (
          <Warning>
            La recherche géographique est momentanément indisponible et devrait
            fonctionner de nouveau dans quelques instants.
          </Warning>
        )}
      </FloatingModal>

      <style>{`
        div.drop-down {
          overflow: auto;
          max-height: 250px;
          margin-top: 10px;
        }
        .suggest {
          padding: 8px 4px;
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
        }
        .suggest:hover {
          background: #eee;
        }
      `}</style>
    </div>
  );
};
