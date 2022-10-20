import { PropsWithChildren } from 'react';
import {
  buildSearchQuery,
  IParams,
  ISearchFilter,
} from '../../models/search-filter-params';
import ActiveFilter from './active-filters';

const FieldGroup: React.FC<
  PropsWithChildren<{
    label: string;
    activeFilter: ISearchFilter;
    searchParams: IParams;
    searchTerm: string;
  }>
> = ({ children, label, activeFilter, searchParams, searchTerm }) => {
  return (
    <>
      <div className="label">
        {activeFilter.label ? (
          <ActiveFilter
            icon={activeFilter.icon}
            label={activeFilter.label}
            query={buildSearchQuery(
              searchTerm,
              searchParams,
              activeFilter.excludeParams
            )}
          />
        ) : (
          <>
            {activeFilter.icon}&nbsp;{label}
          </>
        )}
        <div className="wrapper">
          <div className="container">{children}</div>
        </div>
      </div>
      <style jsx>
        {`
          div.label {
            color: #555;
            position: relative;
            padding: 10px;
            margin: 0;
            user-select: none;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding-right: 20px;
            margin-right: 20px;
          }

          div.label::after {
            content: '▾';
            color: inherit;
            font-weight: bold;
            font-size: 1.2rem;
            position: absolute;
            right: 0;
            top: 10px;
          }

          .wrapper {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
          }

          .container {
            display: block;
            position: relative;
            padding: 15px;
            margin-top: 5px;
            background-color: #fff;
            border-radius: 3px;
            width: 350px;
          }
          .container:before {
            content: ' ';
            position: absolute;
            bottom: 100%; /* At the bottom of the tooltip */
            left: 25%;
            margin-left: 0;
            border-width: 10px;
            border-style: solid;
            border-color: transparent transparent white transparent;
          }

          div.label:hover > .wrapper {
            display: block;
          }
        `}
      </style>
    </>
  );
};

export default FieldGroup;
