"use client";

import { use } from "react";
import { FadeIn } from "#components-ui/animation/fade-in";
import { HeightTransition } from "#components-ui/animation/height-transition";
import {
  type IAPINotRespondingError,
  isAPI404,
} from "#models/api-not-responding";
import {
  hasFetchError,
  isDataLoading,
  isUnauthorized,
} from "#models/data-fetching";
import { type ISectionProps, Section } from "..";
import { DataSectionContent } from "./content";
import DataFetchErrorExplanation from "./error";
import { DataSectionLoader } from "./loader";

export interface IDataSectionServerContentProps<
  T,
  ContentComponentProps extends { data: T },
> extends ISectionProps {
  data: Promise<IAPINotRespondingError | T>;
  notFoundInfo?: NonNullable<React.ReactNode> | null;
  additionalInfoOnError?: React.ReactNode;
  ContentComponent: React.FC<ContentComponentProps>;
  otherContentProps: Omit<ContentComponentProps, "data">;
}

export function AsyncDataSectionServerContent<
  T,
  ContentComponentProps extends { data: T },
>({
  data,
  ContentComponent,
  ...props
}: IDataSectionServerContentProps<T, ContentComponentProps>) {
  const awaitedData = use(data);

  if (isUnauthorized(awaitedData)) {
    return null;
  }

  if (isDataLoading(awaitedData)) {
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
  if (hasFetchError(awaitedData)) {
    return (
      <Section {...props}>
        <DataFetchErrorExplanation fetchErrorType={awaitedData} />
      </Section>
    );
  }
  if (props.notFoundInfo === null && isAPI404(awaitedData)) {
    return null;
  }
  //@ts-expect-error
  const lastModified = awaitedData?.lastModified || null;

  return (
    <Section {...props} lastModified={lastModified}>
      <HeightTransition>
        <FadeIn key={lastModified}>
          <DataSectionContent
            additionalInfoOnError={props.additionalInfoOnError}
            data={awaitedData}
            notFoundInfo={props.notFoundInfo}
          >
            {(contentData) => {
              const contentProps = {
                ...props.otherContentProps,
                data: contentData,
              } as ContentComponentProps;
              return <ContentComponent {...contentProps} />;
            }}
          </DataSectionContent>
        </FadeIn>
      </HeightTransition>
    </Section>
  );
}
