import Logo from '#components-ui/logo';
import { administrationsMetaData } from '#models/administrations';
import styles from './style.module.css';
const AdministrationDescription: React.FC<{
  slug: string; // EAdministration
  titleLevel?: 'h2' | 'h3';
}> = ({ slug, titleLevel = 'h2' }) => {
  if (!administrationsMetaData[slug]) {
    throw new Error(`Administration ${slug} does not exist`);
  }

  const {
    description,
    contact,
    long,
    dataSources,
    logoType,
    estServicePublic,
  } = administrationsMetaData[slug];

  return (
    <div className={styles['administration-wrapper']} id={slug}>
      <div>
        <Logo
          title={long}
          slug={logoType ? slug : 'rf'}
          width={80}
          height={80}
        />
      </div>
      <div>
        {titleLevel === 'h2' ? <h2>{long}</h2> : <h3>{long}</h3>}
        <p>
          {description}
          {dataSources.length > 0 && (
            <div>
              Données transmises :
              <ul>
                {dataSources.map(({ data = [] }) =>
                  data.map(({ label }) => (
                    <li key={label}>
                      <a href={`/donnees/sources#${slug}`}>{label}</a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          {contact && (
            <p>
              <a rel="noreferrer noopener" target="_blank" href={contact}>
                → Contacter cette{' '}
                {estServicePublic ? 'administration' : 'organisation'}
              </a>
            </p>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdministrationDescription;
