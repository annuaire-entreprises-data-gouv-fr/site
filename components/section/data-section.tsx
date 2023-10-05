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
  notFoundInformation?: React.ReactNode;
  additionalInformationOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

function SectionStateMachine<T extends {}>({
  data,
  notFoundInformation,
  additionalInformationOnError,
  ...props
}: IDataSectionProps<T>) {
  const showLoadingState = useShowLoadingState(data);
  if (showLoadingState) {
    const dataSources = Array.from(new Set(props.sources || [])).map(
      (key) => administrationsMetaData[key]
    );
    return (
      <FadeIn delay={100}>
        <DataSectionLoader dataSources={dataSources} />
      </FadeIn>
    );
  } else {
    if (isAPINotResponding(data)) {
      const administrationMetaData =
        administrationsMetaData[data.administration] || {};

      return (
        <FadeIn>
          {data.errorType === 404 && notFoundInformation ? (
            notFoundInformation
          ) : (
            <>
              <AdministrationNotRespondingMessage
                administrationMetaData={administrationMetaData}
              />
              {additionalInformationOnError ?? null}
            </>
          )}
        </FadeIn>
      );
    } else {
      return <FadeIn>{props.children(data)};</FadeIn>;
    }
  }
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
    props.notFoundInformation === null
  ) {
    return null;
  }

  return (
    <Section {...props}>
      <HeightTransition>
        <SectionStateMachine {...props} lastModified={lastModified} />
      </HeightTransition>
    </Section>
  );
}

/** Contains the logic that prevents flickering of UI */
function useShowLoadingState<T>(data: IAPILoading | T): data is IAPILoading {
  const after100ms = useTimeout(100);
  const before800ms = !useTimeout(800);
  const [dataLoadedBefore100ms, setDataLoadedBefore100ms] = useState(false);
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
