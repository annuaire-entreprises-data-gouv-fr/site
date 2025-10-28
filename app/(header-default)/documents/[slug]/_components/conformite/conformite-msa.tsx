import type React from "react";
import { useMemo } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
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
      return <span>conforme</span>;
    }

    if (data.status === "sous_investigation") {
      return (
        <span>l'entreprise est en cours d'analyse par un agent de la MSA</span>
      );
    }

    return <span>non-conforme</span>;
  }, [data]);

  if (isAPINotResponding(data)) {
    return (
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
