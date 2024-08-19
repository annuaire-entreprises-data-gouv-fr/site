import FAQLink from '#components-ui/faq-link';
import { INPI } from '#components/administrations';
import { DataInpiLinkWithExplanations } from '#components/justificatifs/data-inpi-link';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { formatDate } from '#utils/helpers';

const formatCapitalSocial = (
  immatriculation: IUniteLegale['immatriculation']
) => {
  if (immatriculation?.capital) {
    try {
      return `${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: immatriculation?.deviseCapital ?? 'EUR',
      }).format(immatriculation?.capital)} ${
        immatriculation.estCapitalVariable ? 'variable' : 'fixe'
      }`;
    } catch {
      return `${immatriculation?.capital} ${immatriculation?.deviseCapital} ${
        immatriculation.estCapitalVariable ? 'variable' : 'fixe'
      }`;
    }
  }
  return '';
};

const formatDateCloture = (DDMM: string) => {
  if (DDMM && DDMM.length === 4) {
    return `${DDMM.slice(0, 2)}/${DDMM.slice(2)}`;
  }
  return DDMM;
};

export const UniteLegaleImmatriculationSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
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
                      (immatriculation?.natureEntreprise || []).join(', '),
                    ],
                    ...(immatriculation?.isPersonneMorale
                      ? [
                          [
                            <FAQLink tooltipLabel="Capital social">
                              Le capital social d’une société est constitué des
                              apports (en argent ou en nature) de ses
                              actionnaires.
                              <br />
                              Il peut être fixe ou variable. La modification
                              d’un capital fixe nécessite une modification des
                              statuts tandis que le capital variable peut varier
                              dans certaines limites sans modification des
                              statuts.
                            </FAQLink>,
                            formatCapitalSocial(immatriculation),
                          ],
                          [
                            'Clôture de l’exercice comptable',
                            formatDateCloture(immatriculation?.dateCloture),
                          ],
                        ]
                      : []),
                    ...(immatriculation?.duree
                      ? [
                          [
                            'Durée de la personne morale',
                            `${immatriculation?.duree} ans`,
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
          <DataInpiLinkWithExplanations
            uniteLegale={uniteLegale}
            session={session}
          />
        </>
      )}
    </DataSection>
  );
};
