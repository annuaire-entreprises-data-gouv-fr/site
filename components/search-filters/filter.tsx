import { PropsWithChildren } from 'react';
import ButtonLink from '#components-ui/button';
import {
  buildSearchQuery,
  IParams,
  ISearchFilter,
} from '#models/search-filter-params';
import { randomId } from '#utils/helpers';
import ActiveFilterLabel from './active-filter-label';

const Filter: React.FC<
  PropsWithChildren<{
    label: string;
    activeFilter: ISearchFilter;
    searchParams: IParams;
    searchTerm: string;
    addSaveClearButton: boolean;
  }>
> = ({
  children,
  label,
  activeFilter,
  searchParams,
  searchTerm,
  addSaveClearButton = false,
}) => {
  const uuid = `toggle-${randomId()}`;

  const clearFilterLink = buildSearchQuery(
    searchTerm,
    searchParams,
    activeFilter.excludeParams
  );

  return (
    <>
      <div className="search-filter-label-container">
        <input type="checkbox" id={uuid} />
        <label htmlFor={uuid} className="overlay" />
        <label htmlFor={uuid}>
          {activeFilter.label ? (
            <ActiveFilterLabel
              icon={activeFilter.icon}
              label={activeFilter.label}
              query={clearFilterLink}
            />
          ) : (
            <span className="search-filter-label">
              {activeFilter.icon}&nbsp;{label}&nbsp;&nbsp;▾
            </span>
          )}
        </label>
        <label htmlFor={uuid} className="close-container">
          Fermer ✕
        </label>
        <div className="container">
          <div className="filter-container">{children}</div>
          {addSaveClearButton && (
            <>
              <br />
              <div className="layout-space-between">
                <a className="fr-link" href={clearFilterLink}>
                  Effacer
                </a>
                <ButtonLink type="submit" alt small>
                  Appliquer
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx>
        {`
          div.search-filter-label-container {
            position: relative;
            margin: 0;
            user-select: none;
            margin-right: 8px;
            padding: 8px 0;
          }

          span.search-filter-label {
            color: #555;
            user-select: none;
            display: flex;
            align-items: center;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 5px 10px;
          }
          span.search-filter-label:hover {
            border-color: #0a76f6;
            background-color: #fefefe;
          }

          input[type='checkbox'] {
            display: none;
          }
          input[type='checkbox']:checked ~ .overlay {
            display: block;
          }
          input[type='checkbox']:checked ~ .container {
            display: block;
          }

          label.overlay {
            width: 90vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            display: none;
            z-index: 9999;
          }

          label.close-container {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            content: 'Fermer ✕';
            cursor: pointer;
            z-index: 10001;
          }

          .container {
            box-shadow: 0 0 15px -5px rgba(0, 0, 0, 0.3);
            top: 100%;
            left: 0;
            display: none;
            position: absolute;
            padding: 15px;
            margin-top: 5px;
            background-color: #fff;
            border-radius: 3px;
            width: 450px;
            z-index: 10000;
          }
          .container:before {
            content: ' ';
            position: absolute;
            bottom: 100%; /* At the bottom of the tooltip */
            left: 10%;
            margin-left: 0;
            border-width: 10px;
            border-style: solid;
            border-color: transparent transparent white transparent;
          }

          .container > .filter-container {
            max-height: 350px;
            overflow-y: auto;
          }

          @media only screen and (min-width: 1px) and (max-width: 991px) {
            .container {
              position: fixed;
              top: 0;
              left: 0;
              padding-top: 50px;
              width: 100vw;
              height: 100vh;
              margin-top: 0;
            }
            input[type='checkbox']:checked ~ .overlay {
              display: none;
            }
            input[type='checkbox']:checked ~ .close-container {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
};

export default Filter;
