"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import InpiPartiallyDownWarning from "#components-ui/alerts-with-explanations/inpi-partially-down";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";

export const ObservationsRNE: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const observations = useAPIRouteData(
    APIRoutesPaths.Observations,
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionClient
      data={observations}
      id="observations-rne"
      notFoundInfo={
        <>
          Cette structure ne possède pas de fiche d’immatriculation au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>.
        </>
      }
      sources={[EAdministration.INPI]}
      title="Observations au RNE"
    >
      {({ data, metadata }) =>
        data.length > 0 ? (
          <>
            {metadata.isFallback && <InpiPartiallyDownWarning />}
            <p>
              Cette structure possède {data.length} observation(s) au{" "}
              <strong>RNE</strong>
              &nbsp;:
            </p>
            <FullTable
              body={data.map((o) => [
                o.dateAjout,
                o.numObservation ? <Tag>{o.numObservation}</Tag> : "",
                o.description,
              ])}
              head={["Date d’ajout", "Numéro d’observation", "Description"]}
            />
          </>
        ) : (
          <>
            Cette structure ne possède pas d’observations au{" "}
            <strong>Registre National des Entreprises (RNE)</strong>.
          </>
        )
      }
    </AsyncDataSectionClient>
  );
};
