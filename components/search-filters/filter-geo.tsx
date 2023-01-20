import axios from 'axios';
import { useRef, useState } from 'react';
import { Loader } from '#components-ui/loader';
import { debounce } from '#utils/helpers/debounce';

interface IGeoSuggest {
  label: string;
  value: string;
}

export const FilterGeo: React.FC<{ cp_dep?: string; cp_dep_label?: string }> =
  ({ cp_dep, cp_dep_label }) => {
    const [labelDep, setLabelDep] = useState(cp_dep_label);
    const [dep, setDep] = useState(cp_dep);
    const [isLoading, setLoading] = useState(false);
    const [geoSuggests, setGeoSuggests] = useState([]);

    const geoSearchRef = useRef<HTMLInputElement | null>(null);

    const search = debounce(async (inputElement: any) => {
      const term = inputElement.target.value;
      if (!term) {
        setGeoSuggests([]);
        return;
      }
      setLoading(true);
      axios.get(`/api/geo/${term}`).then((response) => {
        setGeoSuggests(response.data);
        setLoading(false);
      });
    });

    const selectDep = ({ label, value }: IGeoSuggest) => {
      setDep(value);
      setLabelDep(label);
      setGeoSuggests([]);
      //@ts-ignore
      geoSearchRef.current.value = label;
    };

    return (
      <>
        <input
          ref={geoSearchRef}
          className="fr-input"
          onChange={search}
          name="cp_dep_label"
          defaultValue={labelDep}
          placeholder="ex : Rennes"
          autoComplete="off"
          type="search"
        />
        <input
          name="cp_dep"
          value={dep}
          style={{ display: 'none' }}
          onChange={() => {}}
        />
        <div className="drop-down">
          {isLoading ? (
            <div className="layout-center">
              <Loader />
            </div>
          ) : (
            geoSuggests.map((suggest: IGeoSuggest) => (
              <div
                className="suggest cursor-pointer"
                onClick={() => selectDep(suggest)}
              >
                {suggest.label}
              </div>
            ))
          )}
        </div>
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
