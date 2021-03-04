import React from 'react';

import { pin } from '../icon';

const MapOrListSwitch = ({ isMap = false, searchTerm = '' }) => (
  <>
    {isMap ? (
      <a href={`/rechercher/?terme=${searchTerm}`}>
        Afficher les résultats sous forme de liste
      </a>
    ) : (
      <a href={`/rechercher/carte?terme=${searchTerm}`}>
        {pin} Afficher les résultats sur la carte
      </a>
    )}
  </>
);

const ResultsHeader = ({
  resultCount = 0,
  currentPage = 0,
  searchTerm = '',
  isMap = false,
}) => (
  <>
    {resultCount ? (
      <div className="results-counter">
        {currentPage > 1 && `Page ${currentPage} de `}
        {resultCount} résultats trouvés pour “<b>{searchTerm}</b>”.
        <MapOrListSwitch isMap={isMap} searchTerm={searchTerm} />
      </div>
    ) : (
      <div className="results-counter">
        Aucune entité n’a été trouvée pour “<b>{searchTerm}</b>”
        <p>
          Nous vous suggérons de vérifier l’orthographe du nom, du SIRET, ou de
          l'adresse que vous avez utilisé.
        </p>
      </div>
    )}
    <style jsx>{`
      .results-counter {
        margin-top: 20px;
        color: rgb(112, 117, 122);
      }
    `}</style>
  </>
);

export default ResultsHeader;
