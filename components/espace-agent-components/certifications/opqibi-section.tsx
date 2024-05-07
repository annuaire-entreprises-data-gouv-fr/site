'use client';

import FAQLink from '#components-ui/faq-link';
import { DataSectionServer } from '#components/section/data-section/server';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IOpqibi } from '#models/espace-agent/certificats/opqibi';
import { formatDateLong } from '#utils/helpers';

export const OpqibiSection: React.FC<{
  opqibi: IOpqibi | IAPINotRespondingError;
}> = ({ opqibi }) => {
  return (
    <DataSectionServer
      title="Certificat OPQIBI"
      id="opqibi"
      isProtected
      notFoundInfo={null}
      sources={[EAdministration.DINUM]}
      data={opqibi}
    >
      {(opqibi) => (
        <>
          <p>
            Cette entreprise possède un{' '}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats Opqibi, nouvelle fenêtre"
              href="https://www.opqibi.com/page/la-qualification-opqibi"
            >
              certificat Opqibi
            </a>{' '}
            valide.
          </p>
          <TwoColumnTable
            body={[
              [
                'Date de délivrance',
                formatDateLong(opqibi.dateDelivranceCertificat),
              ],
              ['Durée de validité', opqibi.dureeValiditeCertificat],
              ['Assurances', opqibi.assurances],
              [
                'Certificat',
                <a
                  target="_blank"
                  href={opqibi.url}
                  aria-label="Voir au certificat sur le site OPQIBI, nouvelle fenêtre"
                >
                  Voir le certificat
                </a>,
              ],
            ]}
          />
          {opqibi.qualifications.length && (
            <>
              <h4>Qualifications</h4>
              <TwoColumnTable
                body={[
                  [
                    'Labels',
                    <Qualification qualifications={opqibi.qualifications} />,
                  ],
                  [
                    'Date de validité',
                    formatDateLong(opqibi.dateValiditeQualifications),
                  ],
                ]}
              />
            </>
          )}
          {opqibi.qualificationsProbatoires.length && (
            <>
              <h4>
                <FAQLink tooltipLabel="Qualifications probatoires">
                  Un certificat de qualification probatoire atteste qu’une
                  structure possède l’aptitude à réaliser les prestations pour
                  lesquelles elle est qualifiée, mais qu’elle ne les a pas
                  encore ou pas suffisamment réalisées
                </FAQLink>
              </h4>
              <p></p>
              <TwoColumnTable
                body={[
                  [
                    'Labels',
                    <Qualification
                      qualifications={opqibi.qualificationsProbatoires}
                    />,
                  ],
                  [
                    'Date de validité',
                    formatDateLong(
                      opqibi.dateValiditeQualificationsProbatoires
                    ),
                  ],
                ]}
              />
            </>
          )}
        </>
      )}
    </DataSectionServer>
  );
};

function Qualification({
  qualifications,
}: {
  qualifications: IOpqibi['qualifications'];
}) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {qualifications.map((qualification) => (
        <li key={qualification.codeQualification}>
          <FAQLink
            tooltipLabel={`${qualification.codeQualification} : ${
              qualification.nom
            }${qualification.rge ? ' - RGE' : ''}`}
          >
            {qualification.definition}
          </FAQLink>
        </li>
      ))}
    </ul>
  );
}
