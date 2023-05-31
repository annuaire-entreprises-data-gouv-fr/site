import SearchFilters from '#components/advanced-search/search-filters';
import { buildSearchQuery, IParams } from '#models/search-filter-params';
import MapOrListSwitch from './map-or-list';
import styles from './styles.module.scss';

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
  <div
    id="search-filters-container"
    className={styles['search-filters-container']}
  >
    <div className={`fr-container ${styles['search-filer-container']}`}>
      <SearchFilters
        searchParams={searchParams}
        searchTerm={currentSearchTerm}
      />
      <div className={styles['map-switch']}>
        <MapOrListSwitch
          isMap={isMap}
          query={buildSearchQuery(currentSearchTerm, searchParams)}
        />
      </div>
    </div>
  </div>
);
