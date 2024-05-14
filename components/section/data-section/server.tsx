/* eslint-disable react/jsx-props-no-spreading */

import { administrationsMetaData } from '#models/administrations';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { Suspense } from 'react';
import { DataSection } from '.';
import { ISectionProps, Section } from '..';
import { DataSectionLoader } from './loader';

interface IDataSectionServerProps<T> extends ISectionProps {
  data: Promise<IAPINotRespondingError | T>;
  notFoundInfo?: NonNullable<React.ReactNode>;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}
export function AsyncDataSectionServer<T>({
  data,
  ...props
}: IDataSectionServerProps<T>) {
  const dataSources = Array.from(new Set(props.sources || [])).map(
    (key) => administrationsMetaData[key]
  );

  return (
    <Suspense
      fallback={
        <Section {...props}>
          <DataSectionLoader dataSources={dataSources} />
        </Section>
      }
    >
      <DataSectionServerAsync data={data} {...props} />
    </Suspense>
  );
}

async function DataSectionServerAsync<T>({
  data: promiseData,
  ...props
}: IDataSectionServerProps<T>) {
  const data = await promiseData;
  return <DataSection data={data} {...props} />;
}

/* eslint-enable react/jsx-props-no-spreading */
