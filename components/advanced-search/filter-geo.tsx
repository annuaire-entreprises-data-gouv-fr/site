"use client";

import { useStorage } from "hooks";
import {
  type KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { IGeoElement } from "#clients/geo";
import { Info, Warning } from "#components-ui/alerts";
import { Loader } from "#components-ui/loader";
import { isAPI404, isAPINotResponding } from "#models/api-not-responding";
import { searchGeoElementByText } from "#models/geo";
import { debounce } from "#utils/helpers/debounce";

enum Issue {
  NONE = 2,
  NORESULT = 0,
  ERROR = 1,
}

export const FilterGeo: React.FC<{
  cp_dep?: string;
  cp_dep_label?: string;
  cp_dep_type?: string;
}> = ({ cp_dep = "", cp_dep_label = "", cp_dep_type = "" }) => {
  const [labelDep, setLabelDep] = useState(cp_dep_label);
  const [dep, setDep] = useState(cp_dep);
  const [typeDep, setTypeDep] = useState(cp_dep_type);

  const [issue, setIssue] = useState(Issue.NONE);
  const [searchTerm, setSearchTerm] = useState(cp_dep_label);
  const [isLoading, setLoading] = useState(false);
  const [geoSuggests, setGeoSuggests] = useState<IGeoElement[]>([]);

  const [suggestsHistory, setSuggestsHistory] = useStorage(
    "local",
    "geo-search-history-4",
    []
  );
  const [showSuggestsHistory, setShowSuggestsHistory] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };

  const saveSuggestsHistory = ({ label, value, type }: IGeoElement) => {
    try {
      const newSuggestHistory = [
        { label, value, type },
        ...suggestsHistory.filter((s: IGeoElement) => s.value !== value),
      ];

      setSuggestsHistory(newSuggestHistory.slice(0, 4));
    } catch {}
  };

  const onChange = (inputElement: any) => {
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
      return;
    }
    search(searchTerm);
  }, [searchTerm, setGeoSuggests, setIssue, labelDep, search]);

  // only show suggest history on browser to avoid rehydration conflict with server rendered html
  useEffect(() => setShowSuggestsHistory(true), []);

  return (
    <>
      <input
        autoComplete="off"
        className="fr-input"
        id="geo-search-input"
        onChange={onChange}
        onFocus={() => setSearchTerm("")}
        onKeyDown={onKeyDown}
        placeholder="ex : Rennes"
        type="search"
        value={searchTerm}
      />
      <input
        name="cp_dep_label"
        onChange={() => {}}
        type="hidden"
        value={labelDep}
      />
      <input
        name="cp_dep_type"
        onChange={() => {}}
        type="hidden"
        value={typeDep}
      />
      <input name="cp_dep" onChange={() => {}} type="hidden" value={dep} />
      {issue !== Issue.NONE ? (
        issue === Issue.NORESULT ? (
          <Info>Aucun résultat ne correspond à votre recherche.</Info>
        ) : (
          <Warning>
            La recherche géographique est momentanément indisponible et devrait
            fonctionner de nouveau dans quelques instants.
          </Warning>
        )
      ) : (
        <>
          {showSuggestsHistory &&
            !searchTerm &&
            geoSuggests.length === 0 &&
            suggestsHistory.length > 0 && (
              <div className="drop-down">
                <strong>Localisations récentes :</strong>
                {suggestsHistory.map((suggest: IGeoElement) => (
                  <div
                    className="suggest cursor-pointer"
                    key={"suggest-history-" + suggest.label}
                    onClick={() => selectDep(suggest)}
                  >
                    {suggest.label}
                  </div>
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
                <div
                  className="suggest cursor-pointer"
                  key={suggest.label}
                  onClick={() => selectDep(suggest)}
                >
                  {suggest.label}
                </div>
              ))
            )}
          </div>
        </>
      )}

      <style jsx>{`
        div.drop-down {
          overflow: auto;
          max-height: 250px;
          margin-top: 10px;
        }
        div.suggest {
          padding: 8px 4px;
        }
        div.suggest:hover {
          background: #eee;
        }
      `}</style>
    </>
  );
};
