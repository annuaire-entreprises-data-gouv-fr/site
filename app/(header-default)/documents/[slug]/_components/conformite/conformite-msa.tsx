import type React from "react";
import { useMemo } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteMSA } from "#models/espace-agent/conformite";

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
