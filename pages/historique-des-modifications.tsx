import React from 'react';

import { GetStaticProps } from 'next';
import Page from '../layouts';
import changelog, { IChangelog } from '../models/historique-modifications';

interface IProps {
  changelog: IChangelog[];
}

const Changelog: React.FC<IProps> = ({ changelog }) => (
  <Page
    small={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
  >
    <h1>Nouveautés</h1>
    <p>
      Découvrez les dernières fonctionnalités ajoutées au site internet&nbsp;:
    </p>
    <ul>
      {changelog.map((change) => (
        <li key={change.title}>
          <div className="date">
            <b>{change.date}</b>
          </div>
          <div>
            <div>{change.title}</div>
            {change.description && <i>{change.description}</i>}
          </div>
        </li>
      ))}
    </ul>
    <style jsx>{`
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      ul > li {
        display: flex;
        margin-bottom: 10px;
      }
      .date {
        margin-right: 20px;
        flex-shrink: 0;
      }
    `}</style>
  </Page>
);

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: { changelog },
    revalidate: 24 * 3600, // In seconds - 1 day
  };
};

export default Changelog;
