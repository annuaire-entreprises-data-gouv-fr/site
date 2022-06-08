import React from 'react';
import { pin } from '../../components-ui/icon';

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
}) => {
  return (
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
          color: rgb(112, 117, 122);
        }
      `}</style>
    </>
  );
};

export default ResultsHeader;
