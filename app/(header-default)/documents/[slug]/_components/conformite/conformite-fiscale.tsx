import type React from "react";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IConformiteFiscale } from "#models/espace-agent/conformite";
import { ConformiteDocument } from "./conformite-document";
import APINotRespongingElement from "./conformite-not-responding";

const administration = "DGFiP";

const ConformiteFiscale: React.FC<{
  data: IConformiteFiscale | IAPINotRespondingError;
}> = ({ data }) => {
  if (isAPINotResponding(data)) {
    if (isAPI404(data)) {
      return (
        <Icon slug="closed">
          {administration} :{" "}
          <FAQLink tooltipLabel="Attestation fiscale non disponible">
            Dans certains cas, l’attestation fiscale ne peut pas être récupérée
            automatiquement.
            <br />
            Cela ne signifie pas nécessairement que l’entreprise/association
            n’est pas à jour de ses obligations fiscales.
            <br />
            Vous pouvez vous rapprocher de l’unité légale pour lui demander la
            pièce directement.
          </FAQLink>
        </Icon>
      );
    }
    return (
      <APINotRespongingElement administration={administration} data={data} />
    );
  }

  return (
    <div className="layout-space-between">
      <Icon className="fr-mr-1v" slug="open">
        {administration} : conforme
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

export default ConformiteFiscale;
