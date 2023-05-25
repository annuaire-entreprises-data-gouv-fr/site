'use client';
import axios from 'axios';
import { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import Info from '#components-ui/alerts/info';
import Warning from '#components-ui/alerts/warning';
import { Loader } from '#components-ui/loader';
import constants from '#models/constants';
import { debounce } from '#utils/helpers/debounce';
import { useLocalStorage } from 'hooks';

type IGeoSuggest = {
  label: string;
  value: string;
  type: 'insee' | 'cp' | 'dep';
};

enum Issue {
  NONE = 2,
  NORESULT = 0,
  ERROR = 1,
}

export const FilterGeo: React.FC<{
  cp_dep?: string;
  cp_dep_label?: string;
  cp_dep_type?: string;
}> = ({ cp_dep = '', cp_dep_label = '', cp_dep_type = '' }) => {
  const [labelDep, setLabelDep] = useState(cp_dep_label);
  const [dep, setDep] = useState(cp_dep);
  const [typeDep, setTypeDep] = useState(cp_dep_type);

  const [issue, setIssue] = useState(Issue.NONE);
  const [searchTerm, setSearchTerm] = useState(cp_dep_label);
  const [isLoading, setLoading] = useState(false);
  const [geoSuggests, setGeoSuggests] = useState([]);

  const [suggestsHistory, setSuggestsHistory] = useLocalStorage(
    'geo-search-history-3',
    []
  );
  const [showSuggestsHistory, setShowSuggestsHistory] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce((term: string) => {
      setLoading(true);
      axios
        .get(`/api/geo/${term}`, { timeout: constants.timeout.L })
        .then((response) => {
          setGeoSuggests(response.data);
          if (response.data.length === 0) {
            setIssue(Issue.NORESULT);
          }
          setLoading(false);
        })
        .catch((e) => {
          setIssue(e?.request?.status === 404 ? Issue.NORESULT : Issue.ERROR);
        });
    }),
    []
  );

  const selectDep = ({ label, value, type }: IGeoSuggest) => {
    setDep(value);
    setLabelDep(label);
    setTypeDep(type);
    setGeoSuggests([]);
    setSearchTerm(label);
    saveSuggestsHistory({ label, value, type });
  };

  const saveSuggestsHistory = ({ label, value, type }: IGeoSuggest) => {
    try {
      const newSuggestHistory = [
        { label, value, type },
        ...suggestsHistory.filter((s: IGeoSuggest) => s.value !== value),
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
    } else {
      search(searchTerm);
    }
  }, [searchTerm, setGeoSuggests, setIssue, labelDep, search]);

  // only show suggest history on browser to avoid rehydration conflict with server rendered html
  useEffect(() => setShowSuggestsHistory(true), []);

  return (
    <>
      <input
        id="geo-search-input"
        className="fr-input"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setSearchTerm('')}
        placeholder="ex : Rennes"
        autoComplete="off"
        type="search"
        value={searchTerm}
      />
      <input
        name="cp_dep_label"
        value={labelDep}
        type="hidden"
        onChange={() => {}}
      />
      <input
        name="cp_dep_type"
        value={typeDep}
        type="hidden"
        onChange={() => {}}
      />
      <input name="cp_dep" value={dep} type="hidden" onChange={() => {}} />
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
                <b>Localisations récentes :</b>
                {suggestsHistory.map((suggest: IGeoSuggest) => (
                  <div
                    key={'suggest-history-' + suggest.label}
                    className="suggest cursor-pointer"
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
              geoSuggests.map((suggest: IGeoSuggest) => (
                <div
                  key={suggest.label}
                  className="suggest cursor-pointer"
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
