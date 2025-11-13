import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import { getAssociationFromSlug } from "#models/association";
import type { IAssociation } from "#models/core/types";
import { withErrorHandler } from "#utils/server-side-helper/with-error-handler";
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
  const data = withErrorHandler(() =>
    getAssociationFromSlug(uniteLegale.siren)
  );

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
