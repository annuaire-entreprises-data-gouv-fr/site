import { AsyncDataSectionServer } from "#components/section/data-section/server";
import BreakPageForPrint from "#components-ui/print-break-page";
import { EAdministration } from "#models/administrations/EAdministration";
import { getAssociationFromSlug } from "#models/association";
import type { ISession } from "#models/authentication/user/session";
import type { IAssociation } from "#models/core/types";
import { withErrorHandler } from "#utils/server-side-helper/with-error-handler";
import { AssociationNotFound } from "./association-not-found";
import { AssociationSectionContent } from "./content";

const AssociationSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) => {
  const association = withErrorHandler(() =>
    getAssociationFromSlug(uniteLegale.siren)
  );

  return (
    <>
      <AsyncDataSectionServer
        ContentComponent={AssociationSectionContent}
        data={association}
        id="association-section"
        notFoundInfo={<AssociationNotFound uniteLegale={uniteLegale} />}
        otherContentProps={{
          uniteLegale,
          session,
        }}
        sources={[EAdministration.MI, EAdministration.DJEPVA]}
        title="Répertoire National des Associations"
      />
      <BreakPageForPrint />
    </>
  );
};

export default AssociationSection;
