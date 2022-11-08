import AdvancedSearchFilters from './advanced-search-filters';

const HomePageSearchFilters = () => (
  <div id="search-filters-container">
    <div className="layout-center">
      <input type="checkbox" id="show-advanced-search-filter" />
      <label className="more" htmlFor="show-advanced-search-filter">
        Afficher les filtres de recherche
      </label>
      <div className="advanced-filter-container">
        <AdvancedSearchFilters />
      </div>
      <label className="less" htmlFor="show-advanced-search-filter">
        Cacher les filtres de recherche
      </label>
      <style jsx>{`
        div.layout-center {
          flex-direction: column;
        }

        div.advanced-filter-container {
          display: none;
          flex-wrap: wrap;
        }

        label {
          text-decoration: underline;
          cursor: pointer;
        }
        label.less {
          display: none;
        }
        input[type='checkbox'] {
          display: none;
        }
        input[type='checkbox']:checked ~ div.advanced-filter-container {
          display: flex;
        }

        input[type='checkbox']:checked ~ label.more {
          display: none;
        }
        input[type='checkbox']:checked ~ label.less {
          display: block;
        }
      `}</style>
    </div>
  </div>
);

export default HomePageSearchFilters;
