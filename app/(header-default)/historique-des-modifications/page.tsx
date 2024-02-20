import { Metadata } from 'next';
import { RenderMarkdownServerOnly } from '#components/markdown';
import data from '#models/historique-modifications';

export const metadata: Metadata = {
  title: 'Historique des changements',
  robots: 'noindex, nofollow',
  alternates: {
    canonical:
      'https://annuaire-entreprises.data.gouv.fr/historique-des-modifications',
  },
};

export default async function Changelog() {
  const changelog = data;
  return (
    <>
      <h1>Nouveautés</h1>
      <p>
        Découvrez les dernières fonctionnalités ajoutées au site internet&nbsp;:
      </p>
      <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
        {changelog.map((change, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              marginBottom: '10px',
            }}
          >
            <div style={{ marginRight: '20px', flexShrink: '0' }}>
              <strong>{change.date}</strong>
            </div>
            <div>
              <RenderMarkdownServerOnly>
                {change.title}
              </RenderMarkdownServerOnly>
              {change.description && (
                <em>
                  <RenderMarkdownServerOnly>
                    {change.description}
                  </RenderMarkdownServerOnly>
                </em>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
