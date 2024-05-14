'use client';
import { Info } from '#components-ui/alerts';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { Loader } from '#components-ui/loader';
import { administrationsMetaData } from '#models/administrations';
import { useTimeout } from 'hooks/use-timeout';
import { ISectionProps } from '..';

export function DataSectionLoader({
  sources,
}: {
  sources: ISectionProps['sources'];
}) {
  const before100ms = !useTimeout(100);
  const after5s = useTimeout(5000);

  if (before100ms) {
    return <div style={{ minHeight: '150px' }} />;
  }

  const dataSources = Array.from(new Set(sources || [])).map(
    (key) => administrationsMetaData[key]
  );
  return (
    <>
      {after5s && (
        <HeightTransition animateAppear>
          <FadeIn>
            <Info full>
              Le téléservice qui renvoie la donnée{' '}
              {dataSources && `(${dataSources.map((d) => d.short).join(', ')})`}{' '}
              semble occupé en ce moment. Le téléchargement des informations
              peut prendre du temps (10s à 20s).
            </Info>
            <br />
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
          Nous récupérons les informations dans les bases de données :
          <ul>
            {dataSources.map((d) => (
              <li key={d.slug}>{d.long}</li>
            ))}
          </ul>
          <Loader />
        </>
      )}
    </>
  );
}
