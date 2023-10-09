import { Loader } from '#components-ui/loader';
import { IAdministrationMetaData } from '#models/administrations/types';

export default function DataSectionLoader({
  dataSources,
}: {
  dataSources: IAdministrationMetaData[];
}) {
  return (
    <div className="layout-center">
      {!dataSources ? (
        <span>
          Nous récupérons les informations <Loader />
        </span>
      ) : dataSources.length === 1 ? (
        <span>
          Nous récupérons les informations dans la base de données «{' '}
          {dataSources[0].long} » <Loader />
        </span>
      ) : (
        <>
          <Loader /> Nous récupérons les informations dans les bases de données
          :
          <ul>
            {dataSources.map((d) => (
              <li key={d.slug}>{d.long}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
