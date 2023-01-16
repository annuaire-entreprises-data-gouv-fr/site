import { useRouter } from 'next/router';
import MapOrListSwitch from '#components/advanced-search/map-or-list';
import SearchFilters from '#components/search-filters';
import SearchFilterParams, {
  buildSearchQuery,
  IParams,
} from '#models/search-filter-params';

interface IProps {
  isMap?: boolean;
}

const AdvancedSearch: React.FC<IProps> = ({ isMap = false }) => {
  const router = useRouter();
  const currentSearchTerm = (router.query.terme || '') as string;
  const searchParams = new SearchFilterParams(router.query) as IParams;
  return (
    <div className="fr-container">
      <SearchFilters
        searchParams={searchParams}
        searchTerm={currentSearchTerm}
      />
      <div className="map-switch">
        <MapOrListSwitch
          isMap={isMap}
          query={buildSearchQuery(currentSearchTerm, searchParams)}
        />
      </div>
      <style jsx>{`
        .fr-container {
          background-color: #f6f6f6;
          display: flex;
          justify-content: start;
          align-items: center;
          flex-wrap: wrap;
        }

        .map-switch {
          flex-grow: 1;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default AdvancedSearch;
