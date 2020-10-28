import React, { useRef } from 'react';

import ButtonLink from '../button';


const SearchBar = ({
  placeholder = 'Rechercher un nom, un SIRET ou un SIREN',
  defaultValue = '',
  small = false,
  url = '/rechercher',
}) => {
  return (
    <>
      <form action={url} id="search-wrapper" method="get">
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
          <span className="magnifying-glass">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <span className="button-label">Lancer la recherche</span>
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
        span.magnifying-glass {
          display: none;
        }
        span.button-label {
          display: initial;
        }

        @media only screen and (min-width: 1px) and (max-width: 900px) {
          span.button-label {
            display: none;
          }
          span.magnifying-glass {
            display: initial;
            width: 20px;
            height: 20px;
          }
          span.magnifying-glass > svg {
            width: 100%;
            height: 100%;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
};

export default SearchBar;
