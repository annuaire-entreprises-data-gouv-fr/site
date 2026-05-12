import SearchFilters from "#/components/advanced-search/search-filters";
import type { IParams } from "#/models/search/search-filter-params";
import styles from "./style.module.css";

interface IProps {
  currentSearchTerm: string;
  isMap: boolean;
  searchParams: IParams;
}

export const AdvancedSearch: React.FC<IProps> = ({
  searchParams = {},
  currentSearchTerm = "",
}) => (
  <div className={styles["search-filters-container"]}>
    <div className="fr-container">
      <div className={styles["filter-container"]}>
        <SearchFilters
          searchParams={searchParams}
          searchTerm={currentSearchTerm}
        />
      </div>
    </div>
  </div>
);
