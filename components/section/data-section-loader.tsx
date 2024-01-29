import Info from '#components-ui/alerts/info';
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
      {/* {after5s && ( */}
      {true && (
        <HeightTransition animateAppear>
          <FadeIn>
            <Info full>
              Ce téléservice{' '}
              {dataSources && `(${dataSources.map((d) => d.short).join(', ')})`}{' '}
              semble occupé en ce moment. Le téléchargement des informations
              peut prendre du temps (10s à 20s).
            </Info>
          </FadeIn>
        </HeightTransition>
      )}
      {!dataSources || dataSources.length === 0 ? (
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
