import React from 'react';
import { IParams } from '../../models/search-filter-params';
import OpenAdvancedSearchLink from '../search-results/open-advanced-search-link';
import AdvancedSearchFields from './advanced-search-form';
import SearchField from './search-field';

const SearchBar: React.FC<{
  placeholder?: string;
  autoFocus?: boolean;
  url?: string;
  currentSearchTerm?: string;
  searchFilterParams?: IParams;
  useAdvancedSearch: boolean;
}> = ({
  placeholder = 'Nom, adresse, n° SIRET/SIREN...',
  currentSearchTerm = '',
  url = '/rechercher',
  autoFocus = false,
  searchFilterParams,
  useAdvancedSearch = true,
}) => {
  return (
    <form id="search-bar-form" action={url} method="get">
      <SearchField
        placeholder={placeholder}
        defaultValue={currentSearchTerm}
        autoFocus={autoFocus}
      />
      {useAdvancedSearch ? (
        <>
          <input
            className="toggle-advanced-search"
            id="toggle-advanced-search"
            type="checkbox"
          />
          <div id="advanced-search-container">
            <AdvancedSearchFields searchFilterParams={searchFilterParams} />
          </div>
        </>
      ) : null}

      <div className="advanced-search-link-wrapper">
        <OpenAdvancedSearchLink label={'Afficher les options de recherche'} />
      </div>

      <style jsx>{`
        form {
          width: 100%;
          max-width: 450px;
        }

        .toggle-advanced-search {
          display: none;
        }

        #advanced-search-container {
          position: relative;
          padding: 0;
          display: none;
        }
        .advanced-search-link-wrapper {
          cursor: pointer;
          text-decoration: underline;
          margin-top: 3px;
          font-size: 0.9rem;
        }

        .toggle-advanced-search:checked ~ #advanced-search-container {
          display: block;
          height: 0;
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
