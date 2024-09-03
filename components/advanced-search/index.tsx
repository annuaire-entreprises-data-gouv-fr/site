import SearchFilters from '#components/advanced-search/search-filters';
import { buildSearchQuery, IParams } from '#models/search/search-filter-params';
import MapOrListSwitch from './map-or-list';
import styles from './style.module.css';

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
  <div className={styles['search-filters-container']}>
    <div className="fr-container">
      <div className={styles['filter-container']}>
        <SearchFilters
          searchParams={searchParams}
          searchTerm={currentSearchTerm}
        />
      </div>
      <div className={styles['map-switch']}>
        <MapOrListSwitch
          isMap={isMap}
          query={buildSearchQuery(currentSearchTerm, searchParams)}
        />
      </div>
    </div>
  </div>
);
