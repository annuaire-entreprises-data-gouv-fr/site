import { getDirigeantsProtectedFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
} from "#models/core/types";
import DirigeantsContentProtected from "./content";

type IProps = {
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants section protected
 */
export default function DirigeantsSectionProtected({ uniteLegale }: IProps) {
  const isEI = isEntrepreneurIndividuel(uniteLegale);
  const dirigeants = getDirigeantsProtectedFetcher(uniteLegale.siren, isEI);

  return (
    <AsyncDataSectionServer
      ContentComponent={DirigeantsContentProtected}
      data={dirigeants}
      id="dirigeants-section-protected"
      isProtected
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
      otherContentProps={{
        uniteLegale,
      }}
      sources={[EAdministration.INPI, EAdministration.INFOGREFFE]}
      title="Dirigeant(s)"
    />
  );
}
