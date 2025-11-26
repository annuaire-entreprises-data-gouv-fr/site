import { getAgentRNEDocumentsFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { Info } from "#components-ui/alerts";
import { EAdministration } from "#models/administrations/EAdministration";
import { type IUniteLegale, isServicePublic } from "#models/core/types";
import RNEContent from "./rne-content";

export const AgentActesRNE: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documentsRne = getAgentRNEDocumentsFetcher(uniteLegale.siren);

  return (
    <AsyncDataSectionServer
      ContentComponent={RNEContent}
      data={documentsRne}
      id="actes"
      isProtected
      notFoundInfo={
        isServicePublic(uniteLegale) ? (
          <Info full>
            Les services publics ne sont pas immatriculés au RNE.
          </Info>
        ) : (
          <>Cette structure n’est pas immatriculée au RNE.</>
        )
      }
      otherContentProps={{}}
      sources={[EAdministration.INPI]}
      title="Actes et statuts"
    />
  );
};
