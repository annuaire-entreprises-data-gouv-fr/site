"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import routes from "#clients/routes";
import { DJEPVA } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import { FullTable } from "#components/table/full";
import FAQLink from "#components-ui/faq-link";
import { Select } from "#components-ui/select";
import { Tag } from "#components-ui/tag";
import type { IAssociation } from "#models/core/types";
import { isDataSuccess } from "#models/data-fetching";
import type { ISubventions } from "#models/subventions/association";
import { formatCurrency, type Siren } from "#utils/helpers";

const DataSubventionLink = () => (
  <FAQLink
    to="https://datasubvention.beta.gouv.fr/"
    tooltipLabel="data.subvention"
  >
    Data.subvention est un outil développé par la <DJEPVA />. Il recense les
    subventions demandées et reçues par une association.
    <br />
    Les données sont issues de Chorus et du Fonjep (Fonds de coopération de la
    jeunesse et de l’éducation populaire).
  </FAQLink>
);

const SubventionDetails: React.FC<{
  subventions: ISubventions;
  siren: Siren;
}> = ({ subventions, siren }) => {
  const subventionStats = useMemo(() => {
    const totalSubventions = subventions.length;
    const mostRecentYear = subventions[totalSubventions - 1]?.year;
    const approvedSubventions = subventions.filter(
      (subvention) => subvention.label === "Accordé"
    );
    const totalApproved = approvedSubventions.length;
    const totalAmount = approvedSubventions.reduce(
      (acc, subvention) => acc + (subvention?.amount || 0),
      0
    );

    return {
      totalSubventions,
      mostRecentYear,
      totalApproved,
      totalAmount,
    };
  }, [subventions]);

  return (
    <>
      Depuis {subventionStats.mostRecentYear}, cette association compte{" "}
      {subventionStats.totalSubventions} demandes de subventions référencées
      dans <DataSubventionLink />.
      <p>
        Parmi ces subventions :{" "}
        <b>{subventionStats.totalApproved} ont été accordées</b> pour un total
        de <b>{formatCurrency(subventionStats.totalAmount)}</b>. Le reste a été
        refusé, est en cours d’instruction ou se situe dans un état inconnu.
      </p>
      <p>
        Pour en savoir plus, vous pouvez consulter{" "}
        <a
          aria-label={
            "Voir la page de l’association sur le site de data.subvention"
          }
          href={routes.dataSubvention.pageBySirenOrIdRna(siren)}
          rel="noreferrer noopener"
          target="_blank"
        >
          la page de l’association sur le site de data.subvention
        </a>
        .
      </p>
    </>
  );
};

export default function SubventionsAssociationContent({
  data: subventions,
  uniteLegale,
}: {
  data: ISubventions;
  uniteLegale: IAssociation;
}) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const allYears = useMemo(() => {
    if (!isDataSuccess(subventions)) {
      return [];
    }
    return [
      ...new Set(
        subventions
          .filter((s) => (selectedStatus ? s.label === selectedStatus : true))
          .map((s) => s.year)
      ),
    ].map((y) => ({
      value: y.toString(),
      label: y.toString(),
    }));
  }, [subventions, selectedStatus]);

  const allStatuses = useMemo(() => {
    if (!isDataSuccess(subventions)) {
      return [];
    }
    return [
      ...new Set(
        subventions
          .filter(
            (s) =>
              (selectedYear ? s.year === selectedYear : true) && s.label !== ""
          )
          .map((s) => s.label)
      ),
    ].map((y) => ({
      value: y,
      label: y,
    }));
  }, [subventions, selectedYear]);

  const filteredSubventions = useMemo(() => {
    if (selectedYear === null && selectedStatus === "") {
      return subventions;
    }
    return subventions.filter(
      (s) =>
        (selectedYear ? s.year === selectedYear : true) &&
        (selectedStatus ? s.label === selectedStatus : true)
    );
  }, [subventions, selectedYear, selectedStatus]);

  return !subventions || subventions?.length === 0 ? (
    <>
      Aucune demande de subvention n’a été trouvée pour cette association dans{" "}
      <DataSubventionLink />.
    </>
  ) : (
    <>
      <SubventionDetails siren={uniteLegale.siren} subventions={subventions} />
      <div className="layout-right" style={{ marginBottom: "20px" }}>
        <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--center">
          <li style={{ marginRight: "10px" }}>
            <Select
              defaultValue={""}
              name="Filtrer par année"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedYear(Number.parseInt(e.target.value, 10));
              }}
              options={allYears}
              placeholder="Toutes les années"
            />
          </li>
          <li>
            <Select
              defaultValue={""}
              name="Filtrer par état"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedStatus(e.target.value);
              }}
              options={allStatuses}
              placeholder="Tous les états"
            />
          </li>
        </ul>
      </div>

      <FullTable
        body={filteredSubventions.map((subvention) => [
          <strong>{subvention.year}</strong>,
          subvention.description ? (
            <strong>{subvention.description}</strong>
          ) : (
            <NonRenseigne />
          ),
          typeof subvention.amount === "undefined" ? (
            <NonRenseigne />
          ) : (
            formatCurrency(subvention.amount)
          ),
          subvention.label ? (
            <Tag
              color={
                subvention.label === "Accordé"
                  ? "success"
                  : subvention.label === "Refusé"
                    ? "error"
                    : "new"
              }
            >
              {subvention.label}
            </Tag>
          ) : (
            <Tag color="default">Inconnu</Tag>
          ),
        ])}
        head={["Année", "Dispositif", "Montant", "État"]}
      />
    </>
  );
}
