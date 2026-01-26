import { after } from "next/server";
import { getAssociationFromSlugFetcher } from "server-fetch/public";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IAssociation } from "#models/core/types";
import { FinancesAssociationSectionContent } from "./finances-association-content";

/**
 * We use to have finances for association but data disappeared from open data API.
 *
 * @param param0
 * @returns
 */
export default function FinancesAssociationSection({
  uniteLegale,
}: {
  uniteLegale: IAssociation;
}) {
  const controller = new AbortController();
  const data = getAssociationFromSlugFetcher(uniteLegale.siren, controller);

  after(() => {
    controller.abort();
  });

  return (
    <AsyncDataSectionServer
      ContentComponent={FinancesAssociationSectionContent}
      data={data}
      id="finances-association"
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette association."
      otherContentProps={{}}
      sources={[EAdministration.DJEPVA]}
      title="Indicateurs financiers"
    />
  );
}
