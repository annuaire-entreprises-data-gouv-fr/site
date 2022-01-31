import React from 'react';

import { GetServerSideProps, GetStaticProps } from 'next';
import Page from '../layouts';
import { getMatomoStats } from '../clients/matomo';

interface IProps {}

const StatsPage: React.FC<IProps> = ({}) => (
  <Page
    small={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
  >
    <canvas id="myChart" width="400" height="400"></canvas>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"
      integrity="sha512-TW5s0IT/IppJtu76UbysrBH9Hy/5X41OTAbQuffZFU6lQ1rdcLHzpU5BzVvr/YFykoiMYZVWlr/PX1mDcfM9Qg=="
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    ></script>
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Utils.months({count: 12}),
                datasets: [{
                    label: '# of Votes',
                    data: [0,0,0,12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        </script>
    `,
      }}
    />
    <style jsx>{``}</style>
  </Page>
);

export const getStaticProps: GetStaticProps = async (context) => {
  // get params from query string

  await getMatomoStats();

  return {
    props: {},
    revalidate: 3600, // In seconds - 1h - which is matomo refresh time
  };
};

export default StatsPage;
