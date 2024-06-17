'use client';
/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useState } from 'react';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { IAPINotRespondingError, isAPI404 } from '#models/api-not-responding';
import {
  IDataFetchingState,
  hasFetchError,
  isDataLoading,
  isUnauthorized,
} from '#models/data-fetching';
import { useTimeout } from 'hooks/use-timeout';
import { ISectionProps, Section } from '..';
import { DataSectionContent } from './content';
import DataFetchErrorExplanation from './error';
import { DataSectionLoader } from './loader';

interface IDataSectionClientProps<T> extends ISectionProps {
  data: IAPINotRespondingError | IDataFetchingState | T;
  notFoundInfo?: NonNullable<React.ReactNode>;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}
export function AsyncDataSectionClient<T>({
  data,
  ...props
}: IDataSectionClientProps<T>) {
  const showLoadingState = useShowLoadingState(data);

  if (isUnauthorized(data)) {
    return null;
  }

  if (isDataLoading(data) && !showLoadingState) {
    return <div style={{ minHeight: '80px' }} />;
  }

  if (showLoadingState) {
    return (
      <Section {...props}>
        <HeightTransition>
          <FadeIn>
            <DataSectionLoader sources={props.sources} />
          </FadeIn>
        </HeightTransition>
      </Section>
    );
  }
  if (hasFetchError(data)) {
    return (
      <Section {...props}>
        <DataFetchErrorExplanation />
      </Section>
    );
  }
  if (props.notFoundInfo === null && isAPI404(data)) {
    return null;
  }
  //@ts-ignore
  const lastModified = data?.lastModified || null;

  return (
    <Section {...props} lastModified={lastModified}>
      <HeightTransition>
        <FadeIn key={lastModified}>
          <DataSectionContent
            data={data}
            notFoundInfo={props.notFoundInfo}
            children={props.children}
            additionalInfoOnError={props.additionalInfoOnError}
          />
        </FadeIn>
      </HeightTransition>
    </Section>
  );
}

/** Contains the logic that prevents flickering of UI */
function useShowLoadingState<T>(
  data: IDataFetchingState.LOADING | T
): data is IDataFetchingState.LOADING {
  const before100ms = !useTimeout(100);
  const before800ms = !useTimeout(800);
  const [dataLoadedBefore100ms, setDataLoadedBefore100ms] = useState(
    before100ms && !isDataLoading(data)
  );

  useEffect(() => {
    if (!isDataLoading(data) && before100ms) {
      setDataLoadedBefore100ms(true);
    }
  }, [data]);

  if (before100ms || dataLoadedBefore100ms) {
    return false;
  }
  if (before800ms) {
    // We show the loading state for at least 500ms to avoid flickering
    return true;
  }
  return isDataLoading(data);
}
