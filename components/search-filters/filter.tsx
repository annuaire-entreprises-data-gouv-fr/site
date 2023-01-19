import { ReactElement, useState } from 'react';
import ButtonLink from '#components-ui/button';
import {
  buildSearchQuery,
  IParams,
  ISearchFilter,
} from '#models/search-filter-params';
import { useOutsideClick } from 'frontend/src/hooks/useOutsideClick';
import ActiveFilterLabel from './active-filter-label';

type FilterProps = {
  children: ReactElement[];
  label: string;
  activeFilter: ISearchFilter;
  searchParams: IParams;
  searchTerm: string;
  addSaveClearButton: boolean;
};

const Filter = ({
  children,
  label,
  activeFilter,
  searchParams,
  searchTerm,
  addSaveClearButton = false,
}: FilterProps) => {
  const clearFilterLink = buildSearchQuery(
    searchTerm,
    searchParams,
    activeFilter.excludeParams
  );

  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => setOpen(false));

  const handleHeaderClick = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <div
        className="search-filter-label-container"
        onClick={handleHeaderClick}
      >
        <div onClick={() => setOpen(true)}>
          <label>
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
        </div>
        <label className="close-container">Fermer ✕</label>
        {open && (
          <div className="container">
            <div className="filter-container" ref={ref}>
              {children}
            </div>
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
        )}
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

          label.overlay {
            width: 90vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
          }

          label.close-container {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            content: 'Fermer ✕';
            cursor: pointer;
          }

          .container {
            box-shadow: 0 0 15px -5px rgba(0, 0, 0, 0.3);
            top: 100%;
            left: 0;
            position: absolute;
            padding: 15px;
            margin-top: 5px;
            background-color: #fff;
            border-radius: 3px;
            width: 450px;
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
            z-index: 100px;
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
          }
        `}
      </style>
    </>
  );
};

export default Filter;
