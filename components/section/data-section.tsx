import React, { useEffect, useState } from 'react';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import AdministrationNotRespondingMessage from '#components/administration-not-responding/message';
import { administrationsMetaData } from '#models/administrations';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { useTimeout } from 'hooks/use-timeout';
import { ISectionProps, Section } from '.';
import DataSectionLoader from './data-section-loader';

interface IDataSectionProps<T> extends ISectionProps {
  data: IAPINotRespondingError | IAPILoading | T;
  notFoundInfo?: React.ReactNode;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

function SectionStateMachine<T extends {}>({
  data,
  notFoundInfo,
  additionalInfoOnError,
  ...props
}: IDataSectionProps<T>) {
  const showLoadingState = useShowLoadingState(data);
  if (showLoadingState) {
    const dataSources = Array.from(new Set(props.sources || [])).map(
      (key) => administrationsMetaData[key]
    );
    return (
      <HeightTransition>
        <FadeIn>
          <DataSectionLoader dataSources={dataSources} />
        </FadeIn>
      </HeightTransition>
    );
  }
  if (isAPILoading(data)) {
    return <div style={{ minHeight: '100px' }} />;
  }
  if (isAPINotResponding(data)) {
    const administrationMetaData =
      administrationsMetaData[data.administration] || {};

    return (
      <FadeIn key={'' + showLoadingState}>
        {data.errorType === 404 && notFoundInfo ? (
          notFoundInfo
        ) : (
          <>
            <AdministrationNotRespondingMessage
              administrationMetaData={administrationMetaData}
            />
            {additionalInfoOnError ?? null}
          </>
        )}
      </FadeIn>
    );
  }
  return <FadeIn key={'' + showLoadingState}>{props.children(data)}</FadeIn>;
}

/**
 * Uses data's type to handle transitions, display loader, error or formatted data
 * @param param0
 * @returns
 */
export function DataSection<T extends {}>({ ...props }: IDataSectionProps<T>) {
  const { data } = props;
  //@ts-ignore
  const lastModified = data?.lastModified || null;

  if (
    isAPINotResponding(data) &&
    data.errorType === 404 &&
    props.notFoundInfo === null
  ) {
    return null;
  }

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Section {...props} lastModified={lastModified}>
      <SectionStateMachine {...props} />
    </Section>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

/** Contains the logic that prevents flickering of UI */
function useShowLoadingState<T>(data: IAPILoading | T): boolean {
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
