import { useMemo } from "react";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { FullTable } from "#/components/table/full";
import InpiPartiallyDownWarning from "#/components-ui/alerts-with-explanations/inpi-partially-down";
import { Tag } from "#/components-ui/tag";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IUniteLegale } from "#/models/core/types";
import { getRneObservationsFn } from "#/server-functions/public/data-fetching";
import { formatDate } from "#/utils/helpers";

export const ObservationsRNE: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  const input = useMemo(
    () => ({ siren: uniteLegale.siren }),
    [uniteLegale.siren]
  );
  const observations = useServerFnData(getRneObservationsFn, user, input);

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
                <strong>{formatDate(o.dateAjout)}</strong>,
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
