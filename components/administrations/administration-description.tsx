import Logo from '../../components-ui/logo';
import { administrationsMetaData } from '../../models/administrations';

const AdministrationDescription: React.FC<{
  slug: string; // EAdministration
}> = ({ slug }) => {
  const { description, contact, long, apiMonitors, logoType } =
    administrationsMetaData[slug];
  return (
    <div className="administration-wrapper">
      <div>
        {logoType && <Logo title={long} slug={slug} width={80} height={80} />}
      </div>
      <div>
        <h2>{long}</h2>
        <p>
          {description}
          <br />
          {contact && (
            <a rel="noreferrer noopener" target="_blank" href={contact}>
              → Contacter cette administration
            </a>
          )}
          <br />
          {(apiMonitors?.length || 0) > 0 && (
            <a href={`/sources-de-donnees/${slug}`}>
              → Accéder aux données de cette administration
            </a>
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

        @media only screen and (min-width: 1px) and (max-width: 600px) {
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
