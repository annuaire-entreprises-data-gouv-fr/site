'use client';

import { useEffect, useState } from 'react';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { administrationsMetaData } from '#models/administrations';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { useTimeout } from 'hooks/use-timeout';
import { ISectionProps, Section } from '.';
import DataSectionLoader from './data-section-loader';
import { ServerDataSection } from './server-data-section';

interface IClientDataSectionProps<T> extends ISectionProps {
  data: IAPINotRespondingError | IAPILoading | T;
  notFoundInfo?: NonNullable<React.ReactNode>;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}
export function ClientDataSection<T>({
  data,
  ...props
}: IClientDataSectionProps<T>) {
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
  return <ServerDataSection data={data} {...props} />;
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
