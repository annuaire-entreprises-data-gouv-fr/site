/* eslint-disable react/jsx-props-no-spreading */

import { IAPILoading } from '#models/api-loading';
import { isAPI404 } from '#models/api-not-responding';
import { ISectionProps, Section } from '..';
import { DataSectionContent, IDataSectionContentProps } from './content';

interface IDataSectionProps<T>
  extends ISectionProps,
    IDataSectionContentProps<T> {}

/**
 * Uses data's type to handle transitions, display loader, error or formatted data
 * @param param0
 * @returns
 */
export function DataSection<T extends Exclude<unknown, IAPILoading>>({
  data,
  notFoundInfo,
  children,
  additionalInfoOnError,
  ...props
}: IDataSectionProps<T>) {
  //@ts-ignore
  if (notFoundInfo === null && isAPI404(data)) {
    return null;
  }
  //@ts-ignore
  const lastModified = data?.lastModified || null;

  return (
    <Section {...props} lastModified={lastModified}>
      <DataSectionContent
        data={data}
        notFoundInfo={notFoundInfo}
        children={children}
        additionalInfoOnError={additionalInfoOnError}
      />
    </Section>
  );
}
/* eslint-enable react/jsx-props-no-spreading */

export { AsyncDataSectionClient as DataSectionClient } from './client';
export { AsyncDataSectionServer as DataSectionServer } from './server';
