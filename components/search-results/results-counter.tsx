import React from 'react';

const ResultsCounter: React.FC<{
  resultCount?: number;
  currentPage?: number;
}> = ({ resultCount = 0, currentPage = 1 }) => {
  return (
    <>
      {resultCount ? (
        <div className="results-counter">
          <span>
            {currentPage > 1 && `Page ${currentPage} de `}
            {resultCount} résultats trouvés.
          </span>
        </div>
      ) : (
        <div className="no-results">
          <div className="results-counter">
            <span>Aucune entité n’a été trouvée.</span>
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
        }
      `}</style>
    </>
  );
};

export default ResultsCounter;
