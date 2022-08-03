import React from 'react';
import SearchField from './search-field';

const SearchBar = ({
  placeholder = 'Nom, adresse, n° SIRET/SIREN...',
  defaultValue = '',
  url = '/rechercher',
  autoFocus = false,
}) => {
  return (
    <form action={url} method="get">
      <SearchField
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
      />
      <style jsx>{`
        form {
          width: 100%;
          max-width: 450px;
        }
      `}</style>
    </form>
  );
};

export { SearchField };

export default SearchBar;
