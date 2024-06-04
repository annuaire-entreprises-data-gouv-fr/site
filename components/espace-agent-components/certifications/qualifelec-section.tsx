'use client';

import ButtonLink from '#components-ui/button';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { formatDate, formatDateLong } from '#utils/helpers';
import { useFetchQualifelec } from 'hooks/fetch/espace-agent/qualifelec';

export function QualifelecSection({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const qualifelec = useFetchQualifelec(uniteLegale);
  return (
    <DataSectionClient
      title="Certificats Qualifelec"
      id="qualifelec"
      isProtected
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer"
            aria-label="En savoir plus sur les certificats Qualifelec, nouvelle fenêtre"
            href="https://www.qualifelec.fr/pourquoi-choisir-une-entreprise-qualifelec/le-certificat-qualifelec-la-meilleure-des-recommandations/"
          >
            certificat Qualifelec
          </a>
          .
        </>
      }
      sources={[EAdministration.DINUM]}
      data={qualifelec}
    >
      {(qualifelec) => (
        <>
          <p>
            Cette entreprise possède un ou plusieurs{' '}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats Qualifelec, nouvelle fenêtre"
              href="https://www.qualifelec.fr/pourquoi-choisir-une-entreprise-qualifelec/le-certificat-qualifelec-la-meilleure-des-recommandations/"
            >
              certificats Qualifelec
            </a>{' '}
            valides.
          </p>
          <FullTable
            verticalAlign="top"
            head={[
              'N°',
              'Qualification',
              'Validité',
              'Assurances',
              'Certificat',
            ]}
            body={qualifelec.map((c) => [
              c.numero,
              c.qualification.label,
              `Du ${formatDate(c.dateDebut)} au ${formatDate(c.dateFin)}`,
              <ul>
                <li>
                  Assurance civile : {c.assuranceCivile.nom} (du{' '}
                  {formatDateLong(c.assuranceCivile.dateDebut)} au{' '}
                  {formatDateLong(c.assuranceCivile.dateFin)})
                </li>
                <li>
                  Assurance décennale : {c.assuranceDecennale.nom} (du{' '}
                  {formatDateLong(c.assuranceDecennale.dateDebut)} au{' '}
                  {formatDateLong(c.assuranceDecennale.dateFin)})
                </li>
              </ul>,

              <ButtonLink
                target="_blank"
                alt
                small
                to={c.documentUrl}
                ariaLabel="Télécharger le certificat Qualifelec, nouvelle fenêtre"
              >
                Télécharger
              </ButtonLink>,
            ])}
          />
        </>
      )}
    </DataSectionClient>
  );
}
