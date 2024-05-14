'use client';
import { Info } from '#components-ui/alerts';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { Loader } from '#components-ui/loader';
import { administrationsMetaData } from '#models/administrations';
import { useTimeout } from 'hooks/use-timeout';
import { ISectionProps } from '..';
import style from './style.module.css';

export function DataSectionLoader({
  sources,
}: {
  sources: ISectionProps['sources'];
}) {
  const after5s = useTimeout(5000);

  const dataSources = Array.from(new Set(sources || [])).map(
    (key) => administrationsMetaData[key]
  );
  return (
    <div className={style.loader}>
      {after5s && (
        <HeightTransition animateAppear>
          <FadeIn>
            <Info full>
              Le téléservice qui renvoie la donnée{' '}
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
          <p>Nous récupérons les informations dans les bases de données :</p>
          <ul>
            {dataSources.map((d) => (
              <li key={d.slug}>{d.long}</li>
            ))}
          </ul>
          <Loader />
        </>
      )}
    </div>
  );
}
