import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import SearchFilters from '#components/advanced-search/search-filters';
import { IParams } from '#models/search/search-filter-params';
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
      <ButtonLink
        to="/export-sirene"
        small
        ariaLabel="Configurer un export Sirene"
      >
        <Icon slug="settingsFill">Configurer un export Sirene </Icon>
      </ButtonLink>
    </div>
  </div>
);
