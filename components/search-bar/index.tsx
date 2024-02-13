'use client';

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
      style={{
        width: '100%',
        fontFamily: "'Marianne', sans-serif",
      }}
    />
    <button
      className="fr-btn"
      title="Rechercher"
      value="submit"
      type="submit"
    />
  </div>
);

export default SearchBar;
