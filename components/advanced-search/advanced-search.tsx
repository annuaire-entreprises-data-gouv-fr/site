import SearchFilters from '#components/advanced-search/search-filters';
import { buildSearchQuery, IParams } from '#models/search-filter-params';
import MapOrListSwitch from './map-or-list';

type IProps = {
  searchParams: IParams;
  currentSearchTerm: string;
  isMap: boolean;
};

export const AdvancedSearch: React.FC<IProps> = ({
  searchParams = {},
  currentSearchTerm = '',
  isMap = false,
}) => (
  <div id="search-filters-container">
    <div className="fr-container">
      <div className="filter-container">
        <SearchFilters
          searchParams={searchParams}
          searchTerm={currentSearchTerm}
        />
      </div>
      <div className="map-switch">
        <MapOrListSwitch
          isMap={isMap}
          query={buildSearchQuery(currentSearchTerm, searchParams)}
        />
      </div>
    </div>
    <style jsx>{`
      #search-filters-container {
        background-color: #f6f6f6;
      }

      #search-filters-container > .fr-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        padding-top: 4px;
        padding-bottom: 4px;
      }

      #search-filters-container > .fr-container > .filter-container {
        display: flex;
        max-width: calc(100% - 200px);
        flex-wrap: wrap;
      }

      .map-switch {
        flex-grow: 1;
        text-align: right;
        max-width: 200px;
      }

      @media only screen and (min-width: 1px) and (max-width: 768px) {
        #search-filters-container > .fr-container > .filter-container,
        .map-switch {
          width: 100%;
          max-width: 100%;
        }
      }
    `}</style>
  </div>
);
