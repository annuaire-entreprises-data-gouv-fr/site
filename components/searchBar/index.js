import React, { useRef } from 'react';

import ButtonLink from '../button';

const SearchBar = ({
  placeholder = 'Rechercher un nom, un SIRET, une adresse',
  defaultValue = '',
  small = false,
}) => {
  return (
    <>
      <form action="/rechercher" id="search-wrapper" method="get">
        <div className="search-bar">
          <input
            placeholder={placeholder}
            type="text"
            name="terme"
            defaultValue={defaultValue}
            required
            autoComplete="off"
          />
        </div>
        <ButtonLink
          className="button"
          value="submit"
          type="submit"
          small={small}
        >
          Lancer la recherche
        </ButtonLink>
      </form>
      <style jsx>{`
        form#search-wrapper {
          max-width: 550px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        input[type='text'] {
          font-size: ${small ? '0.9rem' : '1.1rem'};
          background-color: #fff;
          width: 100%;
          border: 2px solid #dfdff1;
          border-right: none;
          border-radius: 0;
          display: flex;
          transition: border-color 300ms ease-in-out;
          line-height: ${small ? '32px' : '42px'};
          padding: 0 10px;
          margin: 0;
        }

        input[type='text']:focus {
          border-color: #000091;
          outline: none;
        }

        .search-bar {
          flex-grow: 1;
        }

        .button {
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
};

export default SearchBar;
