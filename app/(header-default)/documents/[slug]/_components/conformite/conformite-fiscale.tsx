import type React from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteFiscale } from "#models/espace-agent/conformite";

const APINotRespongingElement: React.FC<{
  data: IAPINotRespondingError;
  administration: string;
}> = ({ data, administration }) => (
  <>
    {(data?.errorType === 408 && (
      <>
        <i>
          <Icon color="orange" slug="alertFill">
            La récupération du document auprès des services {administration} a
            pris trop de temps.
          </Icon>
        </i>
        <br />
        <a href="">Rechargez la page</a> ou ré-essayez plus-tard.
        <br />
        <br />
      </>
    )) || (
      <>
        <i>
          <Icon color="#df0a00" slug="errorFill">
            La récupération du document auprès des services {administration} a
            échoué.
          </Icon>
        </i>
        <br />
        Ré-essayez plus tard ou rapprochez-vous de l’entreprise pour lui
        demander la pièce directement.
        <br />
        <br />
      </>
    )}
  </>
);

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
