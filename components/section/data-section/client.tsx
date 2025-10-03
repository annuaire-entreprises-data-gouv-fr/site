"use client";
/* eslint-disable react/jsx-props-no-spreading */

import { FadeIn } from "#components-ui/animation/fade-in";
import { HeightTransition } from "#components-ui/animation/height-transition";
import { type IAPINotRespondingError, isAPI404 } from "#models/api-not-responding";
import {
  IDataFetchingState,
  hasFetchError,
  isDataLoading,
  isDataSuccess,
  isUnauthorized,
} from "#models/data-fetching";
import { useTimeout } from "hooks/use-timeout";
import { useEffect, useState } from "react";
import { type ISectionProps, Section } from "..";
import { DataSectionContent } from "./content";
import DataFetchErrorExplanation from "./error";
import { DataSectionLoader } from "./loader";

interface IDataSectionClientProps<T> extends ISectionProps {
  data: IAPINotRespondingError | IDataFetchingState | T;
  notFoundInfo?: NonNullable<React.ReactNode> | null;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => React.JSX.Element;
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
    return <div style={{ minHeight: "80px" }} />;
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
        <DataFetchErrorExplanation fetchErrorType={data} />
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

/**
 * Merges two data sources of the same type, prioritizing errors and loading states
 * @param data1 First data source
 * @param data2 Second data source
 * @param mergeFunction Function to merge the two data sources
 * @returns Merged data that can be passed to AsyncDataSectionClient
 */
export function mergeDataSources<T, U, V>(
  data1: IAPINotRespondingError | IDataFetchingState | T,
  data2: IAPINotRespondingError | IDataFetchingState | U,
  mergeFunction: (
    data1: T | null,
    data2: U | null
  ) => IAPINotRespondingError | V
): IAPINotRespondingError | IDataFetchingState | V {
  if (isUnauthorized(data1) || isUnauthorized(data2)) {
    return IDataFetchingState.UNAUTHORIZED;
  }

  if (isDataLoading(data1) || isDataLoading(data2)) {
    return IDataFetchingState.LOADING;
  }

  if (hasFetchError(data1)) {
    return data1;
  }
  if (hasFetchError(data2)) {
    return data2;
  }

  if (isDataSuccess(data1) && isDataSuccess(data2)) {
    return mergeFunction(data1, data2);
  }

  if (isDataSuccess(data1) && isAPI404(data2)) {
    return mergeFunction(data1, null);
  }
  if (isDataSuccess(data2) && isAPI404(data1)) {
    return mergeFunction(null, data2);
  }

  return data1 as IAPINotRespondingError;
}
