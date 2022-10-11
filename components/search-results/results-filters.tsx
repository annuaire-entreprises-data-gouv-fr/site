import {
  buildSearchQuery,
  extractFilters,
  IParams,
} from '../../models/search-filter-params';
import OpenAdvancedSearchLink from './open-advanced-search-link';

const Filter: React.FC<{
  label?: string;
  icon?: JSX.Element;
  query: string;
}> = ({ label, icon = null, query }) => (
  <div className="selected-filter-container">
    {icon}
    <OpenAdvancedSearchLink label={`&nbsp;${label}&nbsp;`} />
    <a className="no-style-link" href={query}>
      <b>✕</b>
    </a>
    <style jsx>{`
      .selected-filter-container {
        display: flex;
        align-items: center;
        padding: 3px 5px;
        color: #000091;
        background-color: #dfdff1;
        border-radius: 5px;
      }
      .selected-filter-container b {
        margin: 0 5px;
      }
    `}</style>
  </div>
);

const SelectedFilters: React.FC<{
  searchFilterParams: IParams;
  searchTerm: string;
}> = ({ searchFilterParams, searchTerm }) => {
  return (
    <div>
      {extractFilters(searchFilterParams).map(
        ({ icon, label, excludeParams }) => (
          <Filter
            icon={icon}
            label={label}
            query={buildSearchQuery(
              searchTerm,
              searchFilterParams,
              excludeParams
            )}
          />
        )
      )}
      <style jsx>{`
        div {
          margin-left: 5px;
          flex-grow: 1;
          display: flex;
          align-items: start;
          flex-wrap: wrap;
          gap: 5px;
        }
      `}</style>
    </div>
  );
};

export default SelectedFilters;
