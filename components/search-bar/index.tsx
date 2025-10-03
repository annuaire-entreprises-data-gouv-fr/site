const SearchBar = ({
  placeholder = "Nom, adresse, n° SIRET/SIREN...",
  defaultValue = "",
  autoFocus = false,
}) => (
  <div className="fr-search-bar" id="search-input--lg">
    <label className="fr-label" htmlFor="search-input-input">
      Rechercher une entreprise
    </label>
    <input
      autoComplete="off"
      autoFocus={autoFocus}
      className="fr-input"
      defaultValue={defaultValue}
      id="search-input-input"
      name="terme"
      placeholder={placeholder}
      style={{
        width: "100%",
      }}
      type="search"
    />
    <button
      className="fr-btn"
      title="Rechercher"
      type="submit"
      value="submit"
    />
  </div>
);

export default SearchBar;
