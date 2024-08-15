import { INPI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { formatDate } from '#utils/helpers';

export const UniteLegaleImmatriculationSection = ({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) => {
  const immatriculation = uniteLegale.immatriculation;
  return (
    <DataSection
      title="Immatricuation au RNE"
      id="immatriculation-rne"
      sources={[EAdministration.INPI]}
      data={immatriculation}
      notFoundInfo={null}
    >
      {(immatriculation) => (
        <>
          <p>
            Cette structure est une entreprise immatriculée au{' '}
            <strong>Registre National des Entreprises (RNE)</strong>. Ce
            registre liste les entreprises de France. Il est tenu par l’
            <INPI />.
          </p>
          <TwoColumnTable
            body={[
              ...(immatriculation
                ? [
                    [
                      'Date d’immatriculation',
                      formatDate(immatriculation?.dateImmatriculation),
                    ],
                    [
                      'Date de début d’activité',
                      formatDate(immatriculation?.dateDebutActivite),
                    ],
                    [
                      'Nature de l’entreprise',
                      immatriculation?.natureEntreprise,
                    ],
                    ...(immatriculation?.isPersonneMorale
                      ? [
                          ['Capital social', immatriculation?.capital],
                          [
                            'Clôture de l’exercice comptable',
                            immatriculation?.dateCloture,
                          ],
                          [
                            'Durée de la personne morale',
                            immatriculation?.duree,
                          ],
                        ]
                      : []),
                    ...(immatriculation?.dateRadiation
                      ? [
                          [
                            'Date de radiation',
                            formatDate(immatriculation?.dateRadiation),
                          ],
                        ]
                      : []),
                  ]
                : []),
            ]}
          />
        </>
      )}
    </DataSection>
  );
};
