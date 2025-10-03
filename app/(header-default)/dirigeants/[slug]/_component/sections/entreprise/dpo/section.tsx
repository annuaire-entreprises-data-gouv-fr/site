"use client";

import { CNIL } from "#components/administrations";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { TwoColumnTable } from "#components/table/simple";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { formatIntFr, uniteLegaleLabel } from "#utils/helpers";
import { useFetchDPO } from "hooks/fetch/dpo";

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const DPONotFound = () => <p>Aucun DPO trouvé pour cette structure.</p>;

/**
 * DPO section
 */
export default function DPOSection({ uniteLegale }: IProps) {
  const dpo = useFetchDPO(uniteLegale);

  //www.data.gouv.fr/fr/datasets/organismes-ayant-designe-un-e-delegue-e-a-la-protection-des-donnees-dpd-dpo/
  return (
    <AsyncDataSectionClient
      id="dpo-section"
      title="Délégué à la Protection des Données (DPO)"
      sources={[EAdministration.CNIL]}
      isProtected={false}
      data={dpo}
      notFoundInfo={<DPONotFound />}
    >
      {(dpo) => {
        return (
          <>
            <p className="mt-4">
              Cette {uniteLegaleLabel(uniteLegale)} a déclaré un Délégué à la
              Protection des Données (DPO) auprès de la <CNIL />.
            </p>
            <p>
              Le DPO est le point de contact privilégié pour toute question
              relative à la protection des données personnelles. Vous trouverez
              ci-dessous les coordonnées du DPO désigné par cette entreprise.
            </p>
            <TwoColumnTable
              body={[
                ...(dpo?.organismeDesigne.siren
                  ? [
                      [
                        "SIREN",
                        <a href={`/entreprise/${dpo.organismeDesigne.siren}`}>
                          {formatIntFr(dpo.organismeDesigne.siren)}
                        </a>,
                      ],
                    ]
                  : []),
                ...(dpo?.organismeDesigne.adressePostale
                  ? [
                      [
                        "Adresse complète",
                        [
                          dpo.organismeDesigne.adressePostale,
                          dpo.organismeDesigne.codePostal,
                          dpo.organismeDesigne.ville,
                          dpo.organismeDesigne.pays,
                        ]
                          .filter(Boolean)
                          .join(", "),
                      ],
                    ]
                  : []),
                ...(dpo.contact.email
                  ? [
                      [
                        "Email",
                        <a href={`mailto:${dpo.contact.email}`}>
                          {dpo.contact.email}
                        </a>,
                      ],
                    ]
                  : []),
                ...(dpo.contact.url
                  ? [
                      [
                        "Site web",
                        <a href={dpo.contact.url}>{dpo.contact.url}</a>,
                      ],
                    ]
                  : []),
                ...(dpo.contact.telephone
                  ? [
                      [
                        "Téléphone",
                        <a href={`tel:${dpo.contact.telephone}`}>
                          {dpo.contact.telephone}
                        </a>,
                      ],
                    ]
                  : []),
                ...(dpo.contact.adressePostale
                  ? [
                      [
                        "Adresse complète",
                        [
                          dpo.contact.adressePostale,
                          dpo.contact.codePostal,
                          dpo.contact.ville,
                          dpo.contact.pays,
                        ]
                          .filter(Boolean)
                          .join(", "),
                      ],
                    ]
                  : []),
                ...(dpo.contact.autre ? [["Autre", dpo.contact.autre]] : []),
              ]}
            />
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
