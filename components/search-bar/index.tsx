import React from 'react';

const SearchBar = ({
  placeholder = 'Nom, adresse, n° SIRET/SIREN...',
  defaultValue = '',
  autoFocus = false,
}) => (
  <div className="fr-search-bar" id="search-input--lg">
    <label className="fr-label" htmlFor="search-input-input">
      Rechercher une entreprise
    </label>
    <input
      className="fr-input"
      placeholder={placeholder}
      defaultValue={defaultValue}
      type="search"
      id="search-input-input"
      name="terme"
      autoComplete="off"
      autoFocus={autoFocus}
    />
    <button
      className="fr-btn"
      title="Rechercher"
      value="submit"
      type="submit"
    />
    <style jsx>{`
      .fr-search-bar {
        width: 100%;
      }

      input[type='search'] {
        width: 100%;
        font-family: 'Marianne', sans-serif;
      }
    `}</style>
  </div>
);

export default SearchBar;
