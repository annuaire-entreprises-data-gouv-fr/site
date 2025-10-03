"use client";

import { useFetchServicePublic } from "hooks/fetch/service-public";
import type { ReactNode } from "react";
import NonRenseigne from "#components/non-renseigne";
import { DataSectionClient } from "#components/section/data-section";
import { TwoColumnTable } from "#components/table/simple";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IEtablissement, IUniteLegale } from "#models/core/types";
import type { IServicePublic } from "#models/service-public";

type IProps = {
  uniteLegale: IUniteLegale;
  etablissement?: IEtablissement;
};

export default function ServicePublicSection({
  uniteLegale,
  etablissement,
}: IProps) {
  const servicePublic = useFetchServicePublic(uniteLegale, etablissement);

  return (
    <>
      <DataSectionClient
        data={servicePublic}
        notFoundInfo={
          <p>
            Cette administration n’a pas été retrouvé dans l’
            <a
              aria-label="Voir l’Annuaire du service public, nouvelle fenêtre"
              href="https://lannuaire.service-public.fr/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Annuaire du service public
            </a>
            .
          </p>
        }
        sources={[EAdministration.DILA]}
        title={"Annuaire du service public"}
      >
        {(servicePublic) => (
          <>
            {servicePublic.mission && <p>{servicePublic.mission}</p>}
            <TwoColumnTable body={getTableData(servicePublic, uniteLegale)} />
            {servicePublic.liens.annuaireServicePublic && (
              <p>
                Retrouvez plus d&apos;informations sur la{" "}
                <a
                  aria-label="Voir la page de cette administration sur l’Annuaire du service public, nouvelle fenêtre"
                  href={servicePublic.liens.annuaireServicePublic.valeur}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  fiche de l’Annuaire du service public
                </a>
                .
              </p>
            )}
          </>
        )}
      </DataSectionClient>
    </>
  );
}

const getTableData = (
  servicePublic: IServicePublic,
  uniteLegale: IUniteLegale
) =>
  (
    [
      ["Nom", servicePublic.nom],
      servicePublic.typeOrganisme && [
        "Type organisme",
        servicePublic.typeOrganisme,
      ],
      servicePublic.affectationPersonne && [
        "Dirigeants",
        <a
          href={`/dirigeants/${uniteLegale.siren}#responsables-service-public`}
        >
          → voir les {servicePublic.affectationPersonne.length} dirigeant(es)
        </a>,
      ],
      ["Adresse postale", servicePublic.adressePostale],
      [
        "Téléphone",
        servicePublic.telephone && (
          <a href={`tel:${servicePublic.telephone}`}>
            {servicePublic.telephone}
          </a>
        ),
      ],
      [
        "Email",
        servicePublic.adresseCourriel && (
          <a href={`mailto:${servicePublic.adresseCourriel}`}>
            {servicePublic.adresseCourriel}
          </a>
        ),
      ],
      [
        "Formulaire de contact",
        servicePublic.liens.formulaireContact && (
          <a
            aria-label={`ouvrir ${servicePublic.liens.formulaireContact.libelle}, nouvelle fenêtre`}
            href={servicePublic.liens.formulaireContact.valeur}
            rel="noopener noreferrer"
            target="_blank"
          >
            {servicePublic.liens.formulaireContact.libelle}
          </a>
        ),
      ],

      [
        "Site internet",
        servicePublic.liens.sitesInternet.length === 0 ? null : servicePublic
            .liens.sitesInternet.length === 1 ? (
          <Lien
            libelle={servicePublic.liens.sitesInternet[0].libelle}
            valeur={servicePublic.liens.sitesInternet[0].valeur}
          />
        ) : (
          <ul>
            {servicePublic.liens.sitesInternet.map((lien) => (
              <li key={lien.valeur}>
                <Lien libelle={lien.libelle} valeur={lien.valeur} />
              </li>
            ))}
          </ul>
        ),
      ],
    ].filter(Boolean) as [string, ReactNode][]
  ).map(([label, value]) => [label, value ?? <NonRenseigne />]);

function Lien({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <a
      aria-label={`ouvrir ${libelle}, nouvelle fenêtre`}
      href={valeur}
      rel="noopener noreferrer"
      target="_blank"
    >
      {libelle}
    </a>
  );
}
