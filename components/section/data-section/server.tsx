/* eslint-disable react/jsx-props-no-spreading */

import { Suspense } from 'react';
import FadeIn from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ISectionProps, Section } from '..';
import { DataSectionContent } from './content';
import { DataSectionLoader } from './loader';

interface IDataSectionServerProps<T> extends ISectionProps {
  data: Promise<IAPINotRespondingError | T>;
  notFoundInfo?: NonNullable<React.ReactNode>;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

export function AsyncDataSectionServer<T>(props: IDataSectionServerProps<T>) {
  if (props.notFoundInfo === null) {
    return (
      <Suspense>
        <HeightTransition animateAppear>
          <DataSectionContentServerAsync {...props} />
        </HeightTransition>
      </Suspense>
    );
  }

  return (
    <Section {...props}>
      <HeightTransition>
        <Suspense fallback={<DataSectionLoader sources={props.sources} />}>
          <FadeIn>
            <DataSectionContentServerAsync {...props} />
          </FadeIn>
        </Suspense>
      </HeightTransition>
    </Section>
  );
}

async function DataSectionContentServerAsync<T>({
  data: promiseData,
  ...props
}: IDataSectionServerProps<T>) {
  const data = await promiseData;
  return <DataSectionContent data={data} {...props} />;
}

/* eslint-enable react/jsx-props-no-spreading */
