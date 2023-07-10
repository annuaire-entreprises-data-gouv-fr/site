import AdministrationNotResponding from '#components/administration-not-responding';
import { LineChart } from '#components/chart/line';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { IFinances } from '#models/donnees-financieres';
import { formatDateYear, formatCurrency } from '#utils/helpers';

export const AgregatsComptableCollectivite: React.FC<IFinances> = ({
  uniteLegale,
  financesCollectivite,
}) => {
  const title = 'Agrégats comptables';
  if (isAPINotResponding(financesCollectivite)) {
    const isNotFound = financesCollectivite.errorType === 404;
    if (isNotFound) {
      return (
        <Section title={title} sources={[EAdministration.MEF]}>
          <p>
            Aucun agrégats comptables n’a été retrouvé pour cette collectivité
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={financesCollectivite.administration}
        errorType={financesCollectivite.errorType}
        title={title}
      />
    );
  }

  const colorResultat = '#009FFD';
  const colorCA = '#FCA311';
  const agc = financesCollectivite || [];

  const body = [
    [
      'Actif immobilisé',
      ...agc.map((a) => formatCurrency(a.agregatsComptable.actifImmobilise)),
    ],
    [
      'Immobilisations incorporelles',
      ...agc.map((a) =>
        formatCurrency(a.agregatsComptable.immobilisationsIncorporelles)
      ),
    ],
    [
      'Subventions versées',
      ...agc.map((a) => formatCurrency(a.agregatsComptable.subventionsVersees)),
    ],
    [
      'Immobilisations incorporelles cours',
      ...agc.map((a) =>
        formatCurrency(a.agregatsComptable.immobilisationsIncorporellesCours)
      ),
    ],
    [
      'Immobilisations corporelles',
      ...agc.map((a) =>
        formatCurrency(a.agregatsComptable.immobilisationsCorporelles)
      ),
    ],
    [
      'Capitaux propres',
      ...agc.map((a) => formatCurrency(a.agregatsComptable.capitauxPropres)),
    ],
    [
      'Resultat',
      ...agc.map((a) => formatCurrency(a.agregatsComptable.resultat)),
    ],
    [
      'Subventions transferables',
      ...agc.map((a) =>
        formatCurrency(a.agregatsComptable.subventionsTransferables)
      ),
    ],
    ['Dettes', ...agc.map((a) => formatCurrency(a.agregatsComptable.dettes))],
  ];

  return (
    <Section title={title} sources={[EAdministration.MEF]}>
      <br />
      <LineChart
        height={250}
        data={{
          labels: agc.map((a) => formatDateYear(a.year)),
          datasets: [
            {
              label: 'Actif immobilisé',
              tension: 0.3,
              data: agc.map((a) => a.agregatsComptable.actifImmobilise ?? 0),
              borderColor: colorCA,
              backgroundColor: colorCA,
            },
            {
              label: 'Subventions versées',
              tension: 0.3,
              data: agc.map((a) => a.agregatsComptable.subventionsVersees ?? 0),
              borderColor: colorResultat,
              backgroundColor: colorResultat,
            },
          ],
        }}
      />
      <br />
      <FullTable
        head={[
          'Indicateurs',
          ...(financesCollectivite?.map((a) => a.year) || []),
        ]}
        body={body}
      />
    </Section>
  );
};
