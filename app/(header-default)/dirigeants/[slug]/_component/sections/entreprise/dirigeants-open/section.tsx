import { after } from "next/server";
import { getDirigeantsRNEFetcher } from "server-fetch/public";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import DirigeantsContent from "./content";

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

/**
 * Dirigeants section
 */
export default function DirigeantsSection({ uniteLegale }: IProps) {
  const controller = new AbortController();
  const dirigeants = getDirigeantsRNEFetcher(uniteLegale.siren, controller);

  after(() => {
    controller.abort();
  });

  return (
    <AsyncDataSectionServer
      ContentComponent={DirigeantsContent}
      data={dirigeants}
      id="dirigeants-section"
      isProtected={false}
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
      otherContentProps={{
        uniteLegale,
      }}
      sources={[EAdministration.INPI]}
      title="Dirigeant(s)"
    />
  );
}
