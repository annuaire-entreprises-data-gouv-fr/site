import { after } from "next/server";
import { getAssociationFromSlugFetcher } from "server-fetch/public";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import BreakPageForPrint from "#components-ui/print-break-page";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IAssociation } from "#models/core/types";
import { AssociationNotFound } from "./association-not-found";
import { AssociationSectionContent } from "./content";

const AssociationSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) => {
  const controller = new AbortController();
  const association = getAssociationFromSlugFetcher(
    uniteLegale.siren,
    controller
  );

  after(() => {
    controller.abort();
  });

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
