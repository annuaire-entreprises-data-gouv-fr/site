import { GetStaticProps } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Meta from '#components/meta';
import changelog, { IChangelog } from '#models/historique-modifications';
import { NextPageWithLayout } from './_app';

type IProps = {
  changelog: IChangelog[];
};

const Changelog: NextPageWithLayout<IProps> = ({ changelog }) => (
  <>
    <Meta
      title="Rechercher une entreprise"
      canonical="https://annuaire-entreprises.data.gouv.fr/historique-des-modifications"
    />
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
            <ReactMarkdown
              components={{
                p: 'div',
              }}
            >
              {change.title}
            </ReactMarkdown>
            {change.description && (
              <i>
                <ReactMarkdown>{change.description}</ReactMarkdown>
              </i>
            )}
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
  </>
);

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: { changelog },
    revalidate: 24 * 3600, // In seconds - 1 day
  };
};

export default Changelog;
