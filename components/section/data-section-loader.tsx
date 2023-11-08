import Warning from '#components-ui/alerts/warning';
import FadeIn from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
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
      {after5s && (
        <HeightTransition animateAppear>
          <FadeIn>
            <Warning>
              Le service semble particulièrement occupé en ce moment, cela peut
              prendre encore un peu de temps (10s à 20s).
            </Warning>
          </FadeIn>
        </HeightTransition>
      )}
      {!dataSources ? (
        <p>
          Nous récupérons les informations <Loader />
        </p>
      ) : dataSources.length === 1 ? (
        <p>
          Nous récupérons les informations dans la base de données «{' '}
          {dataSources[0].long} » <Loader />
        </p>
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
    </>
  );
}
