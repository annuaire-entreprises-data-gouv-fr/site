import Warning from '#components-ui/alerts/warning';
import FadeIn from '#components-ui/animation/fade-in';
import { Loader } from '#components-ui/loader';
import { IAdministrationMetaData } from '#models/administrations/types';
import { useTimeout } from 'hooks/use-timeout';

export default function DataSectionLoader({
  dataSources,
}: {
  dataSources: IAdministrationMetaData[];
}) {
  const after5s = useTimeout(5000);

  return (
    <>
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
      {after5s && (
        <FadeIn>
          <Warning>
            Le service semble particulièrement occupé en ce moment, cela peut
            prendre encore un peu de temps (10s à 20s).
          </Warning>
        </FadeIn>
      )}
    </>
  );
}
