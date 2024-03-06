/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import AdministrationNotRespondingMessage from '#components/administration-not-responding/message';
import { administrationsMetaData } from '#models/administrations';
import { IAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { ISectionProps, Section } from '..';

interface IDataSectionServerProps<T> extends ISectionProps {
  data: IAPINotRespondingError | T;
  notFoundInfo?: React.ReactNode;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

/**
 * Uses data's type to handle transitions, display loader, error or formatted data
 * @param param0
 * @returns
 */
export function DataSectionServer<T extends Exclude<unknown, IAPILoading>>({
  data,
  notFoundInfo,
  additionalInfoOnError,
  ...props
}: IDataSectionServerProps<T>) {
  //@ts-ignore
  const lastModified = data?.lastModified || null;

  if (isAPINotResponding(data)) {
    if (data.errorType === 404 && notFoundInfo === null) {
      return null;
    }

    if (data.errorType === 404 && notFoundInfo) {
      return (
        <Section {...props} lastModified={lastModified}>
          {notFoundInfo}
        </Section>
      );
    }

    const administrationMetaData =
      administrationsMetaData[data.administration] || {};
    return (
      <Section {...props} lastModified={lastModified}>
        <AdministrationNotRespondingMessage
          administrationMetaData={administrationMetaData}
        />
        {additionalInfoOnError ?? null}
      </Section>
    );
  }

  return (
    <Section {...props} lastModified={lastModified}>
      {props.children(data)}
    </Section>
  );
}
/* eslint-enable react/jsx-props-no-spreading */
