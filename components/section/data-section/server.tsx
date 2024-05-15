/* eslint-disable react/jsx-props-no-spreading */

import { Suspense } from 'react';
import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { IAPINotRespondingError, isAPI404 } from '#models/api-not-responding';
import { DataSection } from '.';
import { ISectionProps, Section } from '..';
import { DataSectionContent } from './content';
import { DataSectionLoader } from './loader';

interface IDataSectionServerProps<T> extends ISectionProps {
  data: Promise<IAPINotRespondingError | T>;
  notFoundInfo?: React.ReactNode;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

export function AsyncDataSectionServer<T>(props: IDataSectionServerProps<T>) {
  if (props.notFoundInfo === null) {
    return (
      <Suspense>
        <DataSectionServerAsync {...props} />
      </Suspense>
    );
  }

  return (
    <Section {...props}>
      <HeightTransition>
        <Suspense fallback={<DataSectionLoader sources={props.sources} />}>
          <DataSectionContentServerAsync {...props} />
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
  return (
    <FadeIn>
      <DataSectionContent data={data} {...props} />{' '}
    </FadeIn>
  );
}

/* eslint-enable react/jsx-props-no-spreading */

async function DataSectionServerAsync<T>({
  data: promiseData,
  ...props
}: IDataSectionServerProps<T>) {
  const data = await promiseData;

  if (isAPI404(data as IAPINotRespondingError)) {
    return null;
  }
  return (
    <HeightTransition>
      <FadeIn>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <DataSection data={data} {...props} />
      </FadeIn>
    </HeightTransition>
  );
}
