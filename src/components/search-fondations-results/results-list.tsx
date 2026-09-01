import type React from "react";
import { Link } from "#/components/link";
import { Icon } from "#/components-ui/icon/wrapper";
import type { IFondation } from "#/models/core/fondations.types";
import styles from "../search-results/style.module.css";

interface IProps {
  results: IFondation[];
  searchTerm?: string;
  shouldColorZipCode?: boolean;
}

const AddressWithColouredZip = ({ adress = "", zip = "" }) => {
  try {
    if (!zip) {
      return <>{adress}</>;
    }

    const [beginning, commune] = adress.split(zip);

    return (
      <>
        {beginning} <mark>{zip}</mark> {commune}
      </>
    );
  } catch {
    return <>{adress}</>;
  }
};

const ResultItem: React.FC<{
  result: IFondation;
  shouldColorZipCode: boolean;
}> = ({ result, shouldColorZipCode }) => (
  <div className={styles["result-item"]}>
    <Link
      className="result-link no-style-link"
      data-id-rnf={result.id}
      key={result.id}
      params={{ slug: result.id }}
      search={{ from: "fondation" }}
      to="/fondation/$slug"
    >
      <div className={styles.title}>
        <span>{`${result.title}`}</span>
      </div>
      <div>
        <Icon slug="mapPin">
          <span className={styles.adress}>
            <AddressWithColouredZip
              adress={result.address ?? undefined}
              zip={(shouldColorZipCode && result.postalCode) || ""}
            />
          </span>
        </Icon>
      </div>
    </Link>
  </div>
);

const ResultsList: React.FC<IProps> = ({
  results,
  shouldColorZipCode = false,
}) => (
  <>
    <div className="results-list">
      {results.map((result) => (
        <ResultItem
          key={result.id}
          result={result}
          shouldColorZipCode={shouldColorZipCode}
        />
      ))}
    </div>
  </>
);

export default ResultsList;
