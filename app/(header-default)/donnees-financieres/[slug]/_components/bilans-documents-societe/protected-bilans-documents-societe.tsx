import { getAgentRNEDocumentsFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { Warning } from "#components-ui/alerts";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  type IUniteLegale,
  isAssociation,
  isServicePublic,
} from "#models/core/types";
import BilansDocumentsSocieteContent, { NoBilans } from "./content";

export default function BilansDocumentsSocieteProtected({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const documents = getAgentRNEDocumentsFetcher(uniteLegale.siren);

  return (
    <AsyncDataSectionServer
      ContentComponent={BilansDocumentsSocieteContent}
      data={documents}
      id="bilans-pdf"
      isProtected
      notFoundInfo={
        <>
          {(isAssociation(uniteLegale) || isServicePublic(uniteLegale)) && (
            <>
              <Warning full>
                Les associations et les services publics ne sont pas
                immatriculés au RNE.
              </Warning>
              <br />
            </>
          )}
          <NoBilans />
        </>
      }
      otherContentProps={{}}
      sources={[EAdministration.INPI]}
      title="Bilans au format PDF"
    />
  );
}
