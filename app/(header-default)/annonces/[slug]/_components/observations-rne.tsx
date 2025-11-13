import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { getRNEObservations } from "#models/rne/observations";
import { withErrorHandler } from "#utils/server-side-helper/with-error-handler";
import { ObservationsRNEContent } from "./content";

export const ObservationsRNE: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const observations = withErrorHandler(() =>
    getRNEObservations(uniteLegale.siren)
  );

  return (
    <AsyncDataSectionServer
      ContentComponent={ObservationsRNEContent}
      data={observations}
      id="observations-rne"
      notFoundInfo={
        <>
          Cette structure ne possède pas de fiche d’immatriculation au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>.
        </>
      }
      otherContentProps={{}}
      sources={[EAdministration.INPI]}
      title="Observations au RNE"
    />
  );
};
