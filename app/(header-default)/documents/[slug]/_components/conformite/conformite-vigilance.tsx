import type React from "react";
import { useMemo } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteVigilance } from "#models/espace-agent/conformite";
import APINotRespongingElement from "./conformite-not-responding";

const administration = "URSSAF";

const ConformiteVigilance: React.FC<{
  data: IConformiteVigilance | IAPINotRespondingError;
}> = ({ data }) => {
  const content = useMemo(() => {
    if (isAPINotResponding(data)) {
      return null;
    }

    if (data.status === "a_jour") {
      return data.url ? (
        <a href={data.url}>
          <Icon slug="download">{data.label || "télécharger"}</Icon>
        </a>
      ) : (
        <span className="fr-col">conforme (document indisponible)</span>
      );
    }

    return <span className="fr-col">non-conforme</span>;
  }, [data]);

  if (isAPINotResponding(data)) {
    return (
      <APINotRespongingElement administration={administration} data={data} />
    );
  }

  return (
    <div className="layout-space-between">
      <Icon
        className="fr-mr-1v"
        slug={data.status === "a_jour" ? "open" : "closed"}
      >
        {administration} :
      </Icon>
      {content}
    </div>
  );
};

export default ConformiteVigilance;
