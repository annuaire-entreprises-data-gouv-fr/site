import Logo from '#components-ui/logo';
import { administrationsMetaData } from '#models/administrations';

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
    <div className="administration-wrapper" id={slug}>
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
      <style jsx>{`
        .administration-wrapper {
          display: flex;
          align-items: center;
        }

        .administration-wrapper > div:first-of-type {
          flex-shrink: 0;
          flex-grow: 0;
          display: flex;
          justify-content: left;
          align-items: center;
          width: 120px;
        }

        @media only screen and (min-width: 1px) and (max-width: 576px) {
          .administration-wrapper {
            flex-direction: column;
            margin-top: 30px;
          }
          .administration-wrapper > div:first-of-type {
            width: 70px;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdministrationDescription;
