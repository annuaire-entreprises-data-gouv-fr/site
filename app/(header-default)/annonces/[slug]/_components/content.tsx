"use client";

import { FullTable } from "#components/table/full";
import InpiPartiallyDownWarning from "#components-ui/alerts-with-explanations/inpi-partially-down";
import { Tag } from "#components-ui/tag";
import type { IObservationsWithMetadata } from "#models/rne/types";

type ObservationsRNEContentProps = {
  data: IObservationsWithMetadata;
};

export function ObservationsRNEContent({ data }: ObservationsRNEContentProps) {
  const { data: observations, metadata } = data;

  return observations.length > 0 ? (
    <>
      {metadata.isFallback && <InpiPartiallyDownWarning />}
      <p>
        Cette structure possède {observations.length} observation(s) au{" "}
        <strong>RNE</strong>
        &nbsp;:
      </p>
      <FullTable
        body={observations.map((o) => [
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
  );
}
