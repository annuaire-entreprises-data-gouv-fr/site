import type React from "react";
import { useMemo } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteMSA } from "#models/espace-agent/conformite";
import APINotRespongingElement from "./conformite-not-responding";

const administration = "MSA";

const ConformiteMSA: React.FC<{
  data: IConformiteMSA | IAPINotRespondingError;
}> = ({ data }) => {
  const content = useMemo(() => {
    if (isAPINotResponding(data)) {
      return null;
    }

    if (data.status === "a_jour") {
      return "conforme";
    }

    if (data.status === "sous_investigation") {
      return "cette entreprise est en cours d'analyse par un agent de la MSA";
    }

    return "cette entreprise n'est pas à jour de ses cotisations";
  }, [data]);

  if (isAPINotResponding(data)) {
    return isAPI404(data) ? (
      <Icon slug="closed">
        {administration} : aucune donnée n'est disponible pour cette entreprise
      </Icon>
    ) : (
      <APINotRespongingElement administration={administration} data={data} />
    );
  }

  return (
    <div className="layout-space-between">
      <Icon slug={data.status === "a_jour" ? "open" : "closed"}>
        {administration} : {content}
      </Icon>
    </div>
  );
};

export default ConformiteMSA;
