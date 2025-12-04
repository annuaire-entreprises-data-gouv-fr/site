"use client";

import { useFetchServicePublic } from "hooks/fetch/service-public";
import { DILA } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import { DataSectionClient } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import SubServicesSection from "./subservices";

export default function ResponsablesServicePublicSection({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const servicePublic = useFetchServicePublic(uniteLegale);

  return (
    <>
      <DataSectionClient
        data={servicePublic}
        id="responsables-service-public"
        notFoundInfo={<NotFoundInfo />}
        sources={[EAdministration.DILA]}
        title={"Responsable(s)"}
      >
        {(servicePublic) => (
          <>
            {servicePublic.affectationPersonne ? (
              <>
                <p>
                  Cette administration possède{" "}
                  {servicePublic.affectationPersonne.length} responsable(s)
                  enregistré(s) auprès de la <DILA />
                  {servicePublic.liens.annuaireServicePublic && (
                    <>
                      {" "}
                      sur{" "}
                      <a
                        aria-label="Voir la page de l’Annuaire du service public, Nouvelle fenêtre"
                        href={servicePublic.liens.annuaireServicePublic.valeur}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        l’Annuaire du service public
                      </a>
                    </>
                  )}
                  {servicePublic.liens.organigramme && (
                    <>
                      {" "}
                      et publie un{" "}
                      <a
                        aria-label={`Voir ${servicePublic.liens.organigramme.libelle}, nouvelle fenêtre`}
                        href={servicePublic.liens.organigramme.valeur}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        organigramme
                      </a>
                    </>
                  )}
                  .
                </p>

                <FullTable
                  body={servicePublic.affectationPersonne.map((personne) => [
                    personne.fonction,
                    personne.nom ?? <NonRenseigne />,
                    personne.lienTexteAffectation ? (
                      <a
                        aria-label={`${
                          personne.lienTexteAffectation.libelle ||
                          "Voir la nomination"
                        }, nouvelle fenêtre`}
                        href={personne.lienTexteAffectation.valeur}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {personne.lienTexteAffectation.libelle ||
                          "Voir la nomination"}
                      </a>
                    ) : (
                      <NonRenseigne />
                    ),
                  ])}
                  head={["Role", "Nom", "Nomination"]}
                />
              </>
            ) : (
              <p>
                Cette administration n’a pas de responsable enregistré dans l’
                <a
                  aria-label="Voir l’Annuaire de l’administration, nouvelle fenêtre"
                  href="https://lannuaire.service-public.gouv.fr/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Annuaire de l’administration
                </a>
                .
              </p>
            )}
          </>
        )}
      </DataSectionClient>

      <SubServicesSection
        servicePublic={servicePublic}
        uniteLegale={uniteLegale}
      />
    </>
  );
}

const NotFoundInfo = () => (
  <p>
    Cette administration n’a pas été retrouvé dans l’
    <a
      aria-label="Voir l’Annuaire de l’administration, nouvelle fenêtre"
      href="https://lannuaire.service-public.gouv.fr/"
      rel="noopener noreferrer"
      target="_blank"
    >
      Annuaire de l’administration
    </a>
    .
  </p>
);
