'use client';

import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr } from '#utils/helpers';
import { useFetchDPO } from 'hooks/fetch/dpo';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const DPONotFound = () => (
  <>
    <p>Aucun DPO trouvé pour cette structure.</p>
  </>
);

/**
 * DPO section
 */
export default function DPOSection({ uniteLegale }: IProps) {
  const dpo = useFetchDPO(uniteLegale);

  return (
    <AsyncDataSectionClient
      id="dpo-section"
      title="Data Protection Officer (DPO)"
      sources={[EAdministration.CNIL]}
      isProtected={false}
      data={dpo}
      notFoundInfo={<DPONotFound />}
    >
      {(dpo) => (
        <>
          <p className="mt-4">
            Le Data Protection Officer (DPO) est le point de contact privilégié
            pour toute question relative à la protection des données
            personnelles. Vous trouverez ci-dessous les coordonnées du DPO
            désigné par cette entreprise.
          </p>
          <TwoColumnTable
            body={[
              ['Type de DPO', dpo.typeDPO],
              ...(dpo.typeDPO === 'Personne morale' &&
              dpo.organismeDesigne.siren
                ? [
                    [
                      'SIREN',
                      <a href={`/entreprise/${dpo.organismeDesigne.siren}`}>
                        {formatIntFr(dpo.organismeDesigne.siren)}
                      </a>,
                    ],
                  ]
                : []),
              ...(dpo.typeDPO === 'Personne morale' &&
              dpo.organismeDesigne.adressePostale
                ? [
                    [
                      'Adresse complète',
                      [
                        dpo.organismeDesigne.adressePostale,
                        dpo.organismeDesigne.codePostal,
                        dpo.organismeDesigne.ville,
                        dpo.organismeDesigne.pays,
                      ]
                        .filter(Boolean)
                        .join(', '),
                    ],
                  ]
                : []),
              ...(dpo.contact.email
                ? [
                    [
                      'Email',
                      <a href={`mailto:${dpo.contact.email}`}>
                        {dpo.contact.email}
                      </a>,
                    ],
                  ]
                : []),
              ...(dpo.contact.url
                ? [
                    [
                      'Site web',
                      <a href={dpo.contact.url}>{dpo.contact.url}</a>,
                    ],
                  ]
                : []),
              ...(dpo.contact.telephone
                ? [
                    [
                      'Téléphone',
                      <a href={`tel:${dpo.contact.telephone}`}>
                        {dpo.contact.telephone}
                      </a>,
                    ],
                  ]
                : []),
              ...(dpo.contact.adressePostale
                ? [
                    [
                      'Adresse complète',
                      [
                        dpo.contact.adressePostale,
                        dpo.contact.codePostal,
                        dpo.contact.ville,
                        dpo.contact.pays,
                      ]
                        .filter(Boolean)
                        .join(', '),
                    ],
                  ]
                : []),
              ...(dpo.contact.autre ? [['Autre', dpo.contact.autre]] : []),
            ]}
          />
        </>
      )}
    </AsyncDataSectionClient>
  );
}
