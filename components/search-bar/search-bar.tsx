import React from 'react';
import SearchField from './search-field';

const SearchBar: React.FC<{
  placeholder?: string;
  autoFocus?: boolean;
  url?: string;
  currentSearchTerm?: string;
}> = ({
  placeholder = 'Nom, adresse, n° SIRET/SIREN...',
  currentSearchTerm = '',
  url = '/rechercher',
  autoFocus = false,
}) => {
  return (
    <form id="search-bar-form" action={url} method="get">
      <SearchField
        placeholder={placeholder}
        defaultValue={currentSearchTerm}
        autoFocus={autoFocus}
      />

      <style jsx>{`
        form {
          width: 100%;
          max-width: 450px;
        }

        @media only screen and (min-width: 1px) and (max-width: 991px) {
          form {
            max-width: 100%;
          }
        }
      `}</style>
    </form>
  );
};

export default SearchBar;
