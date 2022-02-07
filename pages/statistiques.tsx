import React from 'react';

import { GetStaticProps } from 'next';
import Page from '../layouts';
import { getMatomoStats, IMatomoStat } from '../clients/matomo';
import BasicChart from '../components/chart/basic';

interface IProps {
  stats: IMatomoStat[];
}

const StatsPage: React.FC<IProps> = ({ stats }) => (
  <Page
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
  >
    <h1>Statistiques d’utilisation</h1>
    <p>
      Découvrez nos statistiques d’utilisation mises à jour quotidiennement.
      Toutes les données recueillies sont <a href="vie-privee">anonymisées</a>.
    </p>
    <h2>Visites mensuelles</h2>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"
      integrity="sha512-TW5s0IT/IppJtu76UbysrBH9Hy/5X41OTAbQuffZFU6lQ1rdcLHzpU5BzVvr/YFykoiMYZVWlr/PX1mDcfM9Qg=="
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    ></script>
    <BasicChart
      data={stats.map((stat) => {
        return {
          y: stat.visits,
          x: stat.label,
        };
      })}
      yLabel="Nombre de visites"
      yRange={[0, Math.max(...stats.map((el) => el.visits))]}
      type="line"
      tooltipLabel="Visites mensuelles"
      color="#0078f3"
    />
    <h2>Satisfaction des utilisateurs</h2>
    <BasicChart
      data={stats.map((stat) => {
        return {
          y: stat.nps,
          x: stat.label,
        };
      })}
      yLabel="Note moyenne"
      type="line"
      tooltipLabel="Satisfaction"
      yRange={[0, 100]}
      color="#68A532"
    />
  </Page>
);

export const getStaticProps: GetStaticProps = async (context) => {
  const stats = await getMatomoStats();

  return {
    props: { stats },
    revalidate: 24 * 3600, // In seconds - 1 day
  };
};

export default StatsPage;
