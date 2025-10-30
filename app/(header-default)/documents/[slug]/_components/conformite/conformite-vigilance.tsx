import type React from "react";
import { useMemo } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteVigilance } from "#models/espace-agent/conformite";
import { ConformiteDocument } from "./conformite-document";
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
      return data.url ? "conforme" : "conforme (document indisponible)";
    }

    return "l'entreprise n'est pas à jour de ses cotisations";
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
        {administration} : {content}
      </Icon>
      {data.url && (
        <ConformiteDocument
          dateDelivrance={data.dateDelivrance}
          label={data.label}
          url={data.url}
        />
      )}
    </div>
  );
};

export default ConformiteVigilance;
