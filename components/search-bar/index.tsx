import React from 'react';

const SearchBar = ({
  placeholder = 'Rechercher un nom, un SIRET ou un SIREN',
  defaultValue = '',
  url = '/rechercher',
  autoFocus = false,
}) => {
  return (
    <>
      <form action={url} id="search-wrapper" method="get">
        <div className="rf-search-bar" id="search-input--lg">
          <label className="rf-label" htmlFor="search-input-input">
            Rechercher une entreprise
          </label>
          <input
            className="rf-input"
            placeholder={placeholder}
            defaultValue={defaultValue}
            type="search"
            id="search-input-input"
            name="terme"
            required
            autoComplete="off"
            autoFocus={autoFocus}
          />
          <button
            className="rf-btn"
            title="Rechercher"
            value="submit"
            type="submit"
          >
            <span>Lancer la recherche</span>
          </button>
        </div>
      </form>
      <style jsx>{`
        form {
          max-width: 450px;
          width: 100%;
        }
        input[type='search'] {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default SearchBar;
