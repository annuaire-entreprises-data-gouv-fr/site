import type React from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteFiscale } from "#models/espace-agent/conformite";
import APINotRespongingElement from "./conformite-not-responding";

const administration = "DGFiP";

const ConformiteFiscale: React.FC<{
  data: IConformiteFiscale | IAPINotRespondingError;
}> = ({ data }) => {
  if (isAPINotResponding(data)) {
    if (isAPI404(data)) {
      return <Icon slug="closed">{administration} : non-conforme.</Icon>;
    }
    return (
      <APINotRespongingElement administration={administration} data={data} />
    );
  }

  return (
    <div className="layout-space-between">
      <Icon className="fr-mr-1v" slug="open">
        {administration} :
      </Icon>
      {data.url && (
        <a href={data.url}>
          <Icon slug="download">{data.label || "télécharger"}</Icon>
        </a>
      )}
    </div>
  );
};

export default ConformiteFiscale;
