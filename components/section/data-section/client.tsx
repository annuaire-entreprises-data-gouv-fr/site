'use client';

import { useEffect, useState } from 'react';
import { Info } from '#components-ui/alerts';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { Loader } from '#components-ui/loader';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationMetaData } from '#models/administrations/types';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { useTimeout } from 'hooks/use-timeout';
import { ISectionProps, Section } from '..';
import { DataSectionServer } from './server';

interface IDataSectionClientProps<T> extends ISectionProps {
  data: IAPINotRespondingError | IAPILoading | T;
  notFoundInfo?: NonNullable<React.ReactNode>;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}
export function DataSectionClient<T>({
  data,
  ...props
}: IDataSectionClientProps<T>) {
  const showLoadingState = useShowLoadingState(data);
  if (isAPILoading(data) && !showLoadingState) {
    return <div style={{ minHeight: '100px' }} />;
  }

  const dataSources = Array.from(new Set(props.sources || [])).map(
    (key) => administrationsMetaData[key]
  );

  if (showLoadingState) {
    return (
      <Section {...props}>
        <HeightTransition>
          <FadeIn>
            <DataSectionLoader dataSources={dataSources} />
          </FadeIn>
        </HeightTransition>
      </Section>
    );
  }
  return <DataSectionServer data={data} {...props} />;
}

/** Contains the logic that prevents flickering of UI */
function useShowLoadingState<T>(data: IAPILoading | T): data is IAPILoading {
  const after100ms = useTimeout(100);
  const before800ms = !useTimeout(800);
  const [dataLoadedBefore100ms, setDataLoadedBefore100ms] = useState(
    !isAPILoading(data)
  );

  useEffect(() => {
    if (!isAPILoading(data) && !after100ms) {
      setDataLoadedBefore100ms(true);
    }
  }, [data, after100ms]);

  if (dataLoadedBefore100ms) {
    return false;
  }
  if (before800ms) {
    // We show the loading state for at least 500ms to avoid flickering
    return true;
  }
  return isAPILoading(data);
}

function DataSectionLoader({
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
