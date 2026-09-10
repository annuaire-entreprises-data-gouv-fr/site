import type React from "react";
import { Link } from "#/components/link";
import type { IAdministrationMetaData } from "#/models/administrations/types";
import style from "./style.module.css";

const DataSourcesTooltip: React.FC<{
  dataSources: IAdministrationMetaData[];
  lastUpdatedAt?: string;
  link: string;
  orientation?: "center" | "left" | "right";
}> = ({ dataSources, lastUpdatedAt }) => (
  <>
    {lastUpdatedAt ? (
      <>
        <span className={style["updated-at"]}>
          Mise à jour le {lastUpdatedAt}
        </span>
        <br />
      </>
    ) : (
      ""
    )}
    <ul
      aria-label="Sources des données"
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {dataSources.map((source) => (
        <li key={source.slug}>
          <Link
            aria-label={`Source : ${source.long}`}
            params={{ slug: source.slug }}
            to="/administration/$slug"
          >
            Source : {source.short}
          </Link>
        </li>
      ))}
    </ul>
  </>
);

export default DataSourcesTooltip;
