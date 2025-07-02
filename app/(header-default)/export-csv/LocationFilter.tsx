'use client';

import { IGeoElement } from '#clients/geo';
import { Info, Warning } from '#components-ui/alerts';
import FloatingModal from '#components-ui/floating-modal';
import { Loader } from '#components-ui/loader';
import { isAPI404, isAPINotResponding } from '#models/api-not-responding';
import { searchGeoElementByText } from '#models/geo';
import { debounce } from '#utils/helpers/debounce';
import { useOutsideClick } from 'hooks';
import { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import styles from './styles.module.css';

enum Issue {
  NONE = 2,
  NORESULT = 0,
  ERROR = 1,
}

export const LocationFilter: React.FC<{
  onSelect: (type: 'cp' | 'dep' | 'reg', value: string, label: string) => void;
}> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  const [issue, setIssue] = useState(Issue.NONE);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [geoSuggests, setGeoSuggests] = useState<IGeoElement[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce(async (term: string) => {
      setLoading(true);
      try {
        const result = await searchGeoElementByText(term, { noEpcis: true });

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
    setGeoSuggests([]);
    setSearchTerm(label);
    onSelect(type as 'cp' | 'dep' | 'reg', value, label);
    setSearchTerm('');
  };

  const onChange = (inputElement: any) => {
    setSearchTerm(inputElement.target.value);
  };

  const onKeyDown: KeyboardEventHandler = (event) => {
    // select first entry and submit
    if (event.keyCode === 13) {
      event.preventDefault();

      if (geoSuggests && geoSuggests.length > 0) {
        selectDep(geoSuggests[0]);
      }
    }
  };

  useEffect(() => {
    setIssue(Issue.NONE);
    if (!searchTerm) {
      setGeoSuggests([]);
      // in case of remaining pending requests
      setLoading(false);
      setOpen(false);
      return;
    } else {
      search(searchTerm);
      setOpen(true);
    }
  }, [searchTerm, setGeoSuggests, setIssue, search]);

  return (
    <div ref={ref} className={styles['location-filter-container']}>
      <input
        id="geo-search-input"
        className="fr-input"
        onChange={onChange}
        onFocus={() => {
          if (geoSuggests.length > 0) {
            setOpen(true);
          }
        }}
        onKeyDown={onKeyDown}
        placeholder="ex : Rennes"
        autoComplete="off"
        type="search"
        value={searchTerm}
      />
      <FloatingModal
        className={styles['location-filter-modal-container']}
        style={{ display: open ? 'block' : 'none' }}
        aria-label={'Les filtres de localisation'}
        aria-modal={false}
      >
        {issue !== Issue.NONE ? (
          issue === Issue.NORESULT ? (
            <Info>Aucun résultat ne correspond à votre recherche.</Info>
          ) : (
            <Warning>
              La recherche géographique est momentanément indisponible et
              devrait fonctionner de nouveau dans quelques instants.
            </Warning>
          )
        ) : (
          <div className="drop-down">
            {isLoading ? (
              <div className="layout-center">
                <Loader />
              </div>
            ) : (
              geoSuggests.map((suggest: IGeoElement) => (
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
        )}
      </FloatingModal>

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
    </div>
  );
};
