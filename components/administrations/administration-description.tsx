import { administrationsMetaData } from '../../models/administrations';
import { administrationsLogo, marianne } from './logos';

const AdministrationDescription: React.FC<{
  slug: string; // EAdministration
}> = ({ slug }) => {
  const logo = administrationsLogo[slug];

  const { description, contact, long, apiMonitors } =
    administrationsMetaData[slug];
  return (
    <div className="administration-wrapper">
      <div className="logo-wrapper">
        {logo ? <span>{logo}</span> : <span>{marianne}</span>}
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

        .logo-wrapper {
          width: 110px;
          flex-shrink: 0;
          display: flex;
          justify-content: left;
          align-items: center;
        }

        .logo-wrapper > span {
          min-width: 70px;
          max-width: 80px;
          min-height: 40px;
          max-height: 50px;
          justify-content: center;
          align-items: center;
        }
        @media only screen and (min-width: 1px) and (max-width: 600px) {
          .administration-wrapper {
            flex-direction: column;
            margin-top: 30px;
          }
          .logo-wrapper {
            width: 70px;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdministrationDescription;
