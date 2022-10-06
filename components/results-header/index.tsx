import React from 'react';
import { mapPin } from '../../components-ui/icon';
import { IParams } from '../../models/search-filter-params';
import SelectedFilters from './selected-filters';

const MapOrListSwitch = ({ isMap = false, searchTerm = '' }) => (
  <>
    {isMap ? (
      <a href={`/rechercher/?terme=${searchTerm}`}>
        Afficher les résultats sous forme de liste
      </a>
    ) : (
      <a href={`/rechercher/carte?terme=${searchTerm}`}>
        {mapPin} Afficher sur une carte
      </a>
    )}
  </>
);

const ResultsHeader: React.FC<{
  resultCount?: number;
  currentPage?: number;
  searchTerm?: string;
  searchFilterParams: IParams;
  isMap?: boolean;
}> = ({
  resultCount = 0,
  currentPage = 1,
  isMap = false,
  searchTerm = '',
  searchFilterParams,
}) => {
  return (
    <>
      {resultCount ? (
        <div className="results-counter">
          <span>
            {currentPage > 1 && `Page ${currentPage} de `}
            {resultCount} résultats trouvés.
          </span>
          <SelectedFilters searchFilterParams={searchFilterParams} />
          <MapOrListSwitch isMap={isMap} searchTerm={searchTerm} />
        </div>
      ) : (
        <div className="no-results">
          <div className="results-counter">
            <span>Aucune entité n’a été trouvée.</span>
            <SelectedFilters searchFilterParams={searchFilterParams} />
          </div>
          <p>
            Nous vous suggérons de modifier votre recherche :
            <ul>
              <li>vérifiez l’orthographe du nom, ou des mots-clefs utilisés</li>
              <li>
                si vous connaissez votre n° siren ou siret, tapez uniquement
                celui-ci dans la barre de recherche
              </li>
              <li>essayez de réduire le nombre de mots-clefs</li>
            </ul>
          </p>
        </div>
      )}
      <style jsx>{`
        .results-counter {
          margin-top: 20px;
          color: #555;
          display: flex;
          flex-direction: ${isMap ? 'column' : 'row'};
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default ResultsHeader;
