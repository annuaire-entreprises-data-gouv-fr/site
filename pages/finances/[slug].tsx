import { GetServerSideProps } from 'next';
import React from 'react';
import { FinanceChart } from '#components/charts/finances';
import Meta from '#components/meta';
import { Section } from '#components/section';
import Title, { FICHE } from '#components/title-section';
import { EAdministration } from '#models/administrations';
import { getFinancesFromSlug, IFinancesFromSlug } from '#models/finances';
import {
  formatDateYear,
  formatNumber,
  formatPercentage,
  safeParse,
} from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, IFinancesFromSlug {}

type FormatedData = {
  [key: string]: {
    title: string;
    values: string[];
    formatter?: (value: string) => string;
    valueStyle?: React.CSSProperties | undefined;
    rowStyle?: React.CSSProperties | undefined;
  };
};

const FinancePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  finances,
  metadata: { session },
}) => {
  const sortedFinances = finances.sort(
    (a, b) =>
      new Date(a.dateClotureExercice).getTime() -
      new Date(b.dateClotureExercice).getTime()
  );

  const formatedData: FormatedData = {
    dateClotureExercice: {
      title: 'Période Fiscale',
      values: [],
      formatter: formatDateYear,
      valueStyle: { fontWeight: 'bold' },
      rowStyle: { backgroundColor: '#efeffb !important' },
    },
    chiffreDAffaires: {
      title: "Chiffre d'affaires",
      values: [],
      formatter: formatNumber,
    },
    margeBrute: { title: 'Marge brut', values: [], formatter: formatNumber },
    ebitda: {
      title: "Résultat d'exploitation",
      values: [],
      formatter: formatNumber,
    },
    resultatNet: { title: 'Resultat net', values: [], formatter: formatNumber },
    ratioDeVetuste: {
      title: 'Ratio de vétusté',
      values: [],
      formatter: formatPercentage,
    },
    rotationDesStocksJours: {
      title: 'Ratio de rotation des stocks (Jours)',
      values: [],
    },
    margeEbe: { title: 'Marge EBE', values: [], formatter: formatPercentage },
    couvertureDesInterets: {
      title: 'couverture des interets',
      values: [],
      formatter: formatPercentage,
    },
    poidsBfrExploitationSurCaJours: {
      title: 'Poids BFR exploitation sur ca (jours)',
      values: [],
      formatter: safeParse,
    },
    creditClientsJours: {
      title: 'Credit clients (jours)',
      values: [],
      formatter: safeParse,
    },
    ebit: { title: 'EBIT', values: [], formatter: formatNumber },
    poidsBfrExploitationSurCa: {
      title: 'Poids BFR exploitation sur CA',
      values: [],
      formatter: formatPercentage,
    },
    autonomieFinanciere: {
      title: 'Autonomie financiere',
      values: [],
      formatter: formatPercentage,
    },
    capaciteDeRemboursement: {
      title: 'Capacite de remboursement',
      values: [],
      formatter: formatPercentage,
    },
    ratioDeLiquidite: {
      title: 'Ratio de liquidite',
      values: [],
      formatter: formatPercentage,
    },
    tauxDEndettement: {
      title: "Taux d'endettement",
      values: [],
      formatter: formatPercentage,
    },
  };

  sortedFinances.forEach((finance) => {
    for (const [key, value] of Object.entries(finance)) {
      if (formatedData[key]) {
        let v = (value ?? '-').toString();
        const formatter = formatedData[key].formatter;
        if (formatter) {
          formatedData[key].values.push(formatter(v));
        } else {
          formatedData[key].values.push(v);
        }
      }
    }
  });
  return (
    <>
      <Meta
        title={`Données financières - ${uniteLegale.nomComplet}`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.FINANCES}
          uniteLegale={uniteLegale}
          session={session}
        />
        <Section title={`Données financières`} sources={[EAdministration.MEF]}>
          <p>
            Les données financières des établissements nous sont fournies par le
            Ministère de l&apos;économie et des finances :
          </p>
          <table style={{ width: '100%' }}>
            {Object.keys(formatedData).map((key) => {
              const data = formatedData[key];
              return (
                <tr key={data.title} style={data.rowStyle} className="row">
                  <th className="title">
                    <b>{data.title}</b>
                  </th>
                  {data.values.map((value) => (
                    <td className="data" style={data.valueStyle}>
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </table>
          <h2>Représentation graphique</h2>
          <FinanceChart
            data={{
              labels: sortedFinances.map((finance) =>
                formatDateYear(finance.dateClotureExercice)
              ),
              datasets: [
                {
                  label: "Chiffre d'affaires",
                  tension: 0.3,
                  data: sortedFinances.map(
                    (finance) => finance.chiffreDAffaires ?? 0
                  ),
                  borderColor: 'red',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                  label: 'Resultat net',
                  tension: 0.3,
                  data: sortedFinances.map(
                    (finance) => finance.resultatNet ?? 0
                  ),
                  borderColor: 'blue',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                  label: 'EBIT',
                  tension: 0.3,
                  data: sortedFinances.map((finance) => finance.ebit ?? 0),
                  borderColor: 'green',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            }}
          />
        </Section>
      </div>
      <style jsx>{`
        th.title {
          width: 50%;
          text-align: left;
        }
        .row:hover {
          background-color: #fce552;
        }
      `}</style>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, finances } = await getFinancesFromSlug(slug);

    return {
      props: {
        uniteLegale,
        finances,
        metadata: { useReact: true },
      },
    };
  }
);

export default FinancePage;
